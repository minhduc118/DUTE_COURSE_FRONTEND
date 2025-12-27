import { API_BASE_URL } from "../config/config";
import { getAuthHeaders } from "./apiHelper";
import { UserDetailData, LessonProgress } from "../model/UserProgressModel";

const BASE_URL = `${API_BASE_URL}/api/users`;

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
        const response = await fetch(`${BASE_URL}/${userId}/courses/${courseId}/lessons`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error fetching course lessons progress: ${response.statusText}`);
        }

        return await response.json();
    }
};
