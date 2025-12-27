import { API_BASE_URL } from "../config/config";
import { CodingExerciseRequest, CodingSubmissionRequest } from "../model/CourseModel";
import { getAuthHeaders } from "./apiHelper";

const BASE_URL = `${API_BASE_URL}/api/coding-exercises`;

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

export async function createCodingExercise(lessonId: number, payload: CodingExerciseRequest) {
    const url = `${BASE_URL}/lesson/${lessonId}`;
    console.log(payload);
    const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    return handleJsonResponse(response);
}

export async function getCodingExerciseByLessonId(lessonId: number) {
    const url = `${BASE_URL}/lesson/${lessonId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    if (response.status === 404) {
        return null;
    }
    return handleJsonResponse(response);
}

export async function updateCodingExercise(exerciseId: number, payload: CodingExerciseRequest) {
    const url = `${BASE_URL}/${exerciseId}`;
    console.log(payload);
    const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    return handleJsonResponse(response);
}

export async function deleteCodingExercise(exerciseId: number) {
    const url = `${BASE_URL}/${exerciseId}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to delete exercise (${response.status})`);
    }
}

export async function getCodingExerciseById(exerciseId: number) {
    const url = `${BASE_URL}/${exerciseId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    return handleJsonResponse(response);
}

export async function submitCodingExercise(exerciseId: number, payload: CodingSubmissionRequest) {
    // Assuming the endpoint is POST /api/coding-exercises/{exerciseId}/submit
    const url = `${BASE_URL}/${exerciseId}/submit`;
    const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    return handleJsonResponse(response);
}

