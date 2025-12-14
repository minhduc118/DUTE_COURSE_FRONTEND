import { getAuthHeaders } from "./apiHelper";

export interface CourseReviewResponse {
    authorName: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface CourseReviewRequest {
    courseReviewId?: number;
    courseId: number;
    rating: number;
    comment: string;
}

export interface CourseReviewExists {
    review: boolean;
    rating: number;
    comment: string;
}

export const getCourseReviewExists = async (courseId: number): Promise<CourseReviewExists> => {
    const url = `http://localhost:8080/api/course-review/${courseId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to check course review exists (${response.status})`);
    }

    return response.json();
};

export const getCourseReviews = async (courseId: number, page: number = 0, size: number = 5): Promise<Page<CourseReviewResponse>> => {
    const url = `http://localhost:8080/api/course-review?courseId=${courseId}&page=${page}&size=${size}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch course reviews (${response.status})`);
    }

    return response.json();
};

export const addCourseReview = async (courseReview: CourseReviewRequest): Promise<CourseReviewResponse> => {
    const url = `http://localhost:8080/api/course-review`;
    const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(courseReview),
    });

    if (!response.ok) {
        throw new Error(`Failed to add course review (${response.status})`);
    }

    return response.json();
};

export const updateCourseReview = async (courseReview: CourseReviewRequest): Promise<CourseReviewResponse> => {
    const url = `http://localhost:8080/api/course-review`;
    const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(courseReview),
    });

    if (!response.ok) {
        throw new Error(`Failed to update course review (${response.status})`);
    }

    return response.json();
};