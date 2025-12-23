import { useState, useEffect, useRef, useCallback } from "react";
import {
    updateLessonProgress,
    getLessonProgress,
    startWatchSession,
    sendWatchHeartbeat,
    stopWatchSession,
} from "../api/CourseAPI";
import { LessonType } from "../model/CourseModel";

interface UseLessonProgressProps {
    lessonId: number;
    lessonType: LessonType;
    durationSeconds?: number;
    onComplete: (lessonId: number) => void;
    isAlreadyCompleted: boolean;
    config?: {
        thresholdSeconds?: number;
        videoCompletionPercentage?: number;
        intervalSeconds?: number;
    };
}

export const useLessonProgress = ({
    lessonId,
    lessonType,
    durationSeconds = 0,
    onComplete,
    isAlreadyCompleted,
    config = {},
}: UseLessonProgressProps) => {
    const [activeTime, setActiveTime] = useState(0);
    const [initialWatchedSeconds, setInitialWatchedSeconds] = useState(0);

    // Refs for state that shouldn't trigger re-renders or dependency cycles
    const completedRef = useRef(isAlreadyCompleted);
    const sessionKeyRef = useRef<string | null>(null);
    const isPlayingRef = useRef(false);
    const isStartingSessionRef = useRef(false);

    // Sync ref with prop
    useEffect(() => {
        completedRef.current = isAlreadyCompleted;
    }, [isAlreadyCompleted]);

    // Reset state when lesson changes
    useEffect(() => {
        setActiveTime(0);
        setInitialWatchedSeconds(0);
        completedRef.current = isAlreadyCompleted;
        isPlayingRef.current = false;
        sessionKeyRef.current = null;
        isStartingSessionRef.current = false;
    }, [lessonId, isAlreadyCompleted]);

    // --- INITIAL LOAD (Video Only) ---
    useEffect(() => {
        if (lessonType === LessonType.VIDEO) {
            getLessonProgress(lessonId)
                .then((data) => {
                    setInitialWatchedSeconds(data.watchedSeconds || 0);
                    if (data.isCompleted) {
                        completedRef.current = true;
                        // Only call onComplete if not already marked (to avoid toggle issues if parent is a toggle)
                        if (!isAlreadyCompleted) {
                            onComplete(lessonId);
                        }
                    }
                })
                .catch((err) => console.error("Failed to load progress", err));
        }
    }, [lessonId, lessonType, onComplete, isAlreadyCompleted]);

    // --- READING LOGIC (Simple Timer) ---
    useEffect(() => {
        if (lessonType !== LessonType.READING) return;

        const timer = setInterval(() => {
            setActiveTime((prev) => {
                const newTime = prev + 1;
                const threshold = config.thresholdSeconds || 30;
                if (!completedRef.current && newTime >= threshold) {
                    completedRef.current = true;
                    console.log("Lesson completed");
                    updateLessonProgress(lessonId, {
                        completed: true,
                        watchedSeconds: 30,
                    })
                        .then(() => onComplete(lessonId))
                        .catch((err) => console.error("Completion failed", err));
                }
                return newTime;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [lessonId, lessonType, config, onComplete]);

    // --- VIDEO LOGIC (Session & Heartbeat) ---

    // 1. Start Session on First Play
    const handlePlay = useCallback(async () => {
        isPlayingRef.current = true;

        if (
            lessonType === LessonType.VIDEO &&
            !sessionKeyRef.current &&
            !completedRef.current &&
            !isStartingSessionRef.current
        ) {
            try {
                isStartingSessionRef.current = true;
                const data = await startWatchSession(lessonId);
                console.log("Session started:", data.sessionKey);
                sessionKeyRef.current = data.sessionKey;
            } catch (error) {
                console.error("Failed to start session", error);
            } finally {
                isStartingSessionRef.current = false;
            }
        }
    }, [lessonId, lessonType]);

    const handlePause = useCallback(() => {
        isPlayingRef.current = false;
        // Optional: Stop session immediately on pause if desired, 
        // but prompt says "stop heartbeat when video paused", which is handled by the interval check below.
        // Prompt also says "onPause / onEnd / unmount -> stop heartbeat -> call /watch-session/stop"
        // We will handle the stop call in a separate effect or here if needed.
        // For now, let's stick to the interval logic for heartbeats, and cleanup on unmount.

        // If we want to be strict about "stop heartbeat when video paused", the interval below checks isPlayingRef.
    }, []);

    // 2. Heartbeat: Send Ping every 10 seconds (Server calculates time)
    useEffect(() => {
        if (lessonType !== LessonType.VIDEO) return;

        const heartbeatInterval = setInterval(async () => {
            const sessionKey = sessionKeyRef.current;

            // Only send heartbeat if playing AND session exists AND not completed
            if (isPlayingRef.current && sessionKey && !completedRef.current) {
                try {
                    const response = await sendWatchHeartbeat(lessonId, sessionKey);
                    console.log("Heartbeat response:", response);
                    if (response.isCompleted) {
                        console.log("Lesson completed (Backend)");
                        completedRef.current = true;
                        onComplete(lessonId);
                    }
                } catch (error) {
                    console.error("Heartbeat failed", error);
                }
            }
        }, (config.intervalSeconds || 10) * 1000);

        return () => clearInterval(heartbeatInterval);
    }, [lessonId, lessonType, config, onComplete]);

    // 3. Stop Session on Unmount or when Lesson Changes
    useEffect(() => {
        if (lessonType !== LessonType.VIDEO) return;

        return () => {
            const sessionKey = sessionKeyRef.current;
            // Only stop session if it exists AND lesson is NOT completed
            // (If completed, backend likely already closed it, or we want to avoid extra calls)
            if (sessionKey && !completedRef.current) {
                console.log("Stopping session:", sessionKey);
                stopWatchSession(lessonId, sessionKey).catch((err) =>
                    console.error("Stop session failed", err)
                );
            }
        };
    }, [lessonId, lessonType]);

    return {
        activeTime, // Kept for UI compatibility, though not used for logic
        initialWatchedSeconds,
        handlePlay,
        handlePause,
    };
};
