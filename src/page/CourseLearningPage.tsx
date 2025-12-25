import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseModel, SectionModel, LessonModel, LessonType } from "../model/CourseModel";
import { getCourseDetail, updateLessonProgress } from "../api/CourseAPI";

// Modular Components
import { LearningHeader, LearningSidebar, ReadingLesson, VideoLesson, QuizLesson, CodingLesson } from "../components/learning";

import "../style/CourseLearningPage.css";

export default function CourseLearningPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonModel | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionModel | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [readingProgress, setReadingProgress] = useState(0);

  const mainContentRef = useRef<HTMLDivElement>(null);

  const allLessonItems = useMemo(() => {
    if (!course) return [];
    const all: Array<{ lesson: LessonModel; section: SectionModel }> = [];
    [...(course.sections || [])]
      .sort((a, b) => a.sectionOrder - b.sectionOrder)
      .forEach((section) => {
        if (section.lessons) {
          [...section.lessons]
            .sort((a, b) => a.lessonOrder - b.lessonOrder)
            .forEach((lesson) => {
              all.push({ lesson, section });
            });
        }
      });
    return all;
  }, [course]);

  useEffect(() => {
    if (slug) {
      loadCourseDetail();
    }
  }, [slug]);

  // Helper to check if a lesson is locked
  const isLessonLocked = (lesson: LessonModel): boolean => {
    if (!course) return true;

    // 1. Guest / Non-Owner: Only Preview lessons allowed
    if (!course.isOwner) {
      return !lesson.isPreview;
    }

    // 2. Owner / Student: Sequential Order
    // Find index of this lesson
    const index = allLessonItems.findIndex(
      (item) => item.lesson.lessonId === lesson.lessonId
    );

    // First lesson is always unlocked
    if (index <= 0) return false;

    // Check previous lesson status
    const prevItem = allLessonItems[index - 1];
    const isPrevCompleted = completedLessons.has(prevItem.lesson.lessonId);

    // Locked if previous is NOT completed
    return !isPrevCompleted;
  };

  useEffect(() => {
    if (course && course.sections && course.sections.length > 0) {
      const firstSection = course.sections[0];
      setExpandedSections(new Set([firstSection.sectionId]));

      // Initialize completed lessons from course data
      const completed = new Set<number>();
      course.sections.forEach(section => {
        section.lessons?.forEach(lesson => {
          if (lesson.isCompleted) {
            completed.add(lesson.lessonId);
          }
        });
      });
      setCompletedLessons(completed);

      // Auto-select first UNLOCKED lesson if none selected
      if (!currentLesson && allLessonItems.length > 0) {
        // We need to use the logic, but 'completedLessons' state might not be set yet inside this effect run immediately 
        // if we rely on the state 'completed' variable we just created, it works.

        let firstUnlocked: { lesson: LessonModel; section: SectionModel } | null = null;

        if (!course.isOwner) {
          // Find first preview lesson
          firstUnlocked = allLessonItems.find(item => item.lesson.isPreview) || null;
        } else {
          // Find first incomplete lesson (resume) OR first lesson
          // Actually, for sequential, we want the "farthest" unlocked lesson? 
          // Or usually just the first one that is NOT completed?
          // Common UX: Go to first incomplete lesson.
          firstUnlocked = allLessonItems.find(item => !completed.has(item.lesson.lessonId)) || allLessonItems[0];
        }

        if (firstUnlocked) {
          setCurrentLesson(firstUnlocked.lesson);
          setCurrentSection(firstUnlocked.section);

          // Also expand the section of the current lesson
          setExpandedSections(prev => {
            const next = new Set(prev);
            next.add(firstUnlocked!.section.sectionId);
            return next;
          });
        }
      }
    }
  }, [course, allLessonItems]); // Added allLessonItems to dependency, might need care to avoid loops, but allLessonItems memo depends on course

  // Handle scroll progress for reading lessons
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current && currentLesson?.lessonType === LessonType.READING) {
        const element = mainContentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const currentScroll = element.scrollTop;
        if (totalHeight > 0) {
          setReadingProgress((currentScroll / totalHeight) * 100);
        }
      }
    };

    const container = mainContentRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentLesson]);

  // Reset progress when switching lessons
  useEffect(() => {
    setReadingProgress(0);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [currentLesson]);

  const loadCourseDetail = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCourseDetail(slug);
      setCourse(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học");
      console.error("Error loading course detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleLessonClick = (lesson: LessonModel, section: SectionModel) => {
    if (isLessonLocked(lesson)) {
      // Optional: Add toast or shake effect here?
      return;
    }
    setCurrentLesson(lesson);
    setCurrentSection(section);
  };

  const toggleComplete = (lessonId: number) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      // If unmarking is supported, we would need an API call here too, but for now just local.
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };



  const getNextLesson = () => {
    if (!currentLesson) return null;
    const currentIndex = allLessonItems.findIndex(
      (item) => item.lesson.lessonId === currentLesson.lessonId
    );
    if (currentIndex < allLessonItems.length - 1) {
      const nextItem = allLessonItems[currentIndex + 1];
      // Important: Next button should NOT allow going to a locked lesson
      if (!isLessonLocked(nextItem.lesson)) {
        return nextItem;
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!currentLesson) return null;
    const currentIndex = allLessonItems.findIndex(
      (item) => item.lesson.lessonId === currentLesson.lessonId
    );
    if (currentIndex > 0) {
      const prevItem = allLessonItems[currentIndex - 1];
      if (!isLessonLocked(prevItem.lesson)) {
        return prevItem;
      }
    }
    return null;
  };

  const getProgressPercentage = () => {
    const total = allLessonItems.length;
    if (total === 0) return 0;
    return Math.round((completedLessons.size / total) * 100);
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPreviousLesson();

  if (loading) {
    return (
      <div className="course-learning-page d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-learning-page d-flex align-items-center justify-content-center p-4">
        <div className="alert alert-danger" role="alert">
          {error || "Không tìm thấy khóa học"}
        </div>
      </div>
    );
  }

  return (
    <div className="course-learning-page">
      <LearningHeader
        courseTitle={course.title}
        progressPercentage={getProgressPercentage()}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        onLessonClick={handleLessonClick}
        onBack={() => navigate(`/courses/${slug}`)}
      />

      <div className="learning-layout">
        <LearningSidebar
          sections={course.sections || []}
          currentLessonId={currentLesson?.lessonId}
          completedLessons={completedLessons}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onLessonClick={handleLessonClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLessonLocked={isLessonLocked}
        />

        <main className="learning-main" ref={mainContentRef}>
          {currentLesson?.lessonType === LessonType.READING ? (
            <ReadingLesson
              currentLesson={currentLesson}
              course={course}
              currentSection={currentSection}
              completedLessons={completedLessons}
              onToggleComplete={toggleComplete}
              readingProgress={readingProgress}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onLessonClick={handleLessonClick}
            />
          ) : currentLesson?.lessonType === LessonType.QUIZ ? (
            <QuizLesson
              currentLesson={currentLesson}
              course={course}
              currentSection={currentSection}
              onToggleComplete={toggleComplete}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onLessonClick={handleLessonClick}
            />
          ) : (
            currentLesson && (
              currentLesson.lessonType === LessonType.CODING ? (
                <CodingLesson
                  currentLesson={currentLesson}
                  course={course}
                  currentSection={currentSection}
                  onToggleComplete={toggleComplete}
                  prevLesson={prevLesson}
                  nextLesson={nextLesson}
                  onLessonClick={handleLessonClick}
                />
              ) : (
                <VideoLesson
                  currentLesson={currentLesson}
                  currentSection={currentSection}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  nextLesson={nextLesson}
                  onLessonClick={handleLessonClick}
                  onToggleComplete={toggleComplete}
                  completedLessons={completedLessons}
                />
              )
            )
          )}
        </main>
      </div>
    </div>
  );
}
