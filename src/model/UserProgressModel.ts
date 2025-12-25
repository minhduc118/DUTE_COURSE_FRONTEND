export interface LessonProgress {
    lessonId: number;
    lessonName: string;
    completedAt: string | null; // ISO Date or null
    isCompleted: boolean;
    isLocked: boolean;
    lastAccessed?: string; // Optional
}

export interface EnrolledCourse {
    courseId: number;
    courseName: string;
    courseCode: string; // e.g. CS-101
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'STARTED'; // Enum
    icon: string; // Material symbol name or image URL
    colorClass: string; // For UI logic (e.g. orange, blue)
}

export interface UserKPIData {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    avgProgress: number;
}

export interface UserDetailData {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    joinedAt: string;
    kpi: UserKPIData;
    courses: EnrolledCourse[];
}
