import { getAuthHeaders } from "./apiHelper";
import { UserDetailData, LessonProgress } from "../model/UserProgressModel";

const BASE_URL = "http://localhost:8080/api/admin/users";

export const UserProgressAPI = {
    getUserDetailProgress: async (userId: number): Promise<UserDetailData> => {
        // TODO: Replace with actual API call
        // const response = await fetch(`${BASE_URL}/${userId}/progress`, { headers: getAuthHeaders() });
        // return await response.json();

        // MOCK DATA for verification
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    userId: userId,
                    fullName: "Alex Johnson",
                    email: "alex.j@example.com",
                    role: "ROLE_USER",
                    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB66J9jY5ZA4jlbuLUAXHnJdmjRugCpdrfx8djwHpsLtGRWKvWzv2JxMYTx4JxM1org7OaUALXjkXdUybj7CWpShs59D2_YbGcIVu-8WNx4IN9hhHBrCXXdOWsSH0Hk_LL1W3rKu4beRGQLeWxQ2xoirPdRDoTcBXaIkUsiPX8O5FE8keHM9lqGbbxIlFagaRig5A2gYTrZtKHurEeDHAQYbXBJS05L9TMft0baGkJ5FKR-Prqor7_gSksT_Fm5EsBGgsqmh2aWdpA",
                    joinedAt: "2023-01-12T10:00:00",
                    kpi: {
                        totalCourses: 12,
                        completedCourses: 8,
                        inProgressCourses: 4,
                        avgProgress: 76
                    },
                    courses: [
                        {
                            courseId: 101,
                            courseName: "Java Programming Basics",
                            courseCode: "CS-101",
                            totalLessons: 20,
                            completedLessons: 12,
                            progressPercentage: 60,
                            status: 'IN_PROGRESS',
                            icon: 'code',
                            colorClass: 'orange'
                        },
                        {
                            courseId: 102,
                            courseName: "Web Development 101",
                            courseCode: "WD-200",
                            totalLessons: 20,
                            completedLessons: 20,
                            progressPercentage: 100,
                            status: 'COMPLETED',
                            icon: 'html',
                            colorClass: 'blue'
                        },
                        {
                            courseId: 103,
                            courseName: "Data Science Fundamentals",
                            courseCode: "DS-105",
                            totalLessons: 15,
                            completedLessons: 3,
                            progressPercentage: 20,
                            status: 'STARTED',
                            icon: 'analytics',
                            colorClass: 'purple'
                        }
                    ]
                });
            }, 500);
        });
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
