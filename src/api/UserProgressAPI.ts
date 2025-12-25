import { getAuthHeaders } from "./apiHelper";
import { UserDetailData, LessonProgress } from "../model/UserProgressModel";

const BASE_URL = "http://localhost:8080/api/users";

export const UserProgressAPI = {
    getUserDetailProgress: async (userId: number): Promise<UserDetailData> => {
        const response = await fetch(`${BASE_URL}/${userId}/progress`, { headers: getAuthHeaders() });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error fetching user progress: ${response.statusText}`);
        }
        return await response.json();
    },

    getCourseLessonsProgress: async (userId: number, courseId: number): Promise<LessonProgress[]> => {
        // TODO: Replace with actual API call
        // const response = await fetch(`${BASE_URL}/${userId}/courses/${courseId}/lessons`, { headers: getAuthHeaders() });
        // return await response.json();

        // MOCK DATA
        return new Promise((resolve) => {
            setTimeout(() => {
                const lessons: LessonProgress[] = [
                    { lessonId: 1, lessonName: "Introduction to Java", completedAt: "2023-01-14", isCompleted: true, isLocked: false },
                    { lessonId: 2, lessonName: "Setting up the Environment", completedAt: "2023-01-15", isCompleted: true, isLocked: false },
                    { lessonId: 3, lessonName: "Variables and Data Types", completedAt: "2023-01-18", isCompleted: true, isLocked: false },
                    { lessonId: 4, lessonName: "Control Flow Statements", completedAt: null, isCompleted: false, isLocked: false, lastAccessed: "2 hours ago" },
                    { lessonId: 5, lessonName: "Object-Oriented Programming", completedAt: null, isCompleted: false, isLocked: true },
                    { lessonId: 6, lessonName: "Arrays and Collections", completedAt: null, isCompleted: false, isLocked: true },
                ];
                resolve(lessons);
            }, 300);
        });
    }
};
