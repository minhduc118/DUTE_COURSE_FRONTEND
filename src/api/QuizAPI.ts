import { QuizRequest } from "../model/CourseModel";
import { getAuthHeaders } from "./apiHelper";

const BASE_URL = "http://localhost:8080/api/quizzes";

async function handleJsonResponse(response: Response) {
    const text = await response.text();
    let json: any = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        json = null;
    }

    if (!response.ok) {
        const err: any = new Error(
            json?.message || `Request failed (${response.status})`
        );
        if (json?.fieldErrors) err.fieldErrors = json.fieldErrors;
        throw err;
    }
    return json;
}

export async function createQuiz(lessonId: number, payload: QuizRequest) {
    const url = `${BASE_URL}/lesson/${lessonId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    return handleJsonResponse(response);
}

export async function getQuizByLessonId(lessonId: number) {
    const url = `${BASE_URL}/lesson/${lessonId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    // Handle 404 gracefully (no quiz yet)
    if (response.status === 404) {
        return null;
    }
    return handleJsonResponse(response);
}
