import { CourseModel, SectionModel, LessonModel } from "../model/CourseModel";
import { Student } from "../model/UserModel";
import { getAuthHeaders } from "./apiHelper";

interface ResultInterface {
  result: CourseModel[];
  totalPages: number;
  totalElements: number;
}

async function request(url: string) {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Không thể truy cập ${url} `);
  }
  return response;
}

async function getCourses(url: string): Promise<ResultInterface> {
  const responseData = await request(url);
  console.log("Dữ liệu nhận được:", responseData);
  const text = await responseData.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!responseData.ok) {
    const err: any = new Error(
      json?.message || `Failed to fetch courses(${responseData.status})`
    );
    if (json?.fieldErrors) err.fieldErrors = json.fieldErrors;
    throw err;
  }
  if (json && Array.isArray(json.content)) {
    return {
      result: json.content,
      totalPages: json.totalPages,
      totalElements: json.totalElements,
    };
  }

  if (Array.isArray(json)) {
    return {
      result: json as CourseModel[],
      totalPages: 1,
      totalElements: json.length,
    };
  }

  return { result: [], totalPages: 0, totalElements: 0 };
}

export async function getAllCourses(
  page: number = 0,
  size: number = 10
): Promise<ResultInterface> {
  const url: string = `http://localhost:8080/api/courses?page=${page}&size=${size}`;
  return getCourses(url);
}

export async function createCourse(courseData: Partial<CourseModel>) {
  const url = "http://localhost:8080/api/courses";

  const payload = courseData;

  try {
    console.log("→ createCourse payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log(
      "← createCourse response status:",
      response.status,
      "body:",
      text
    );

    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn("Response is not JSON:", text);
    }

    if (!response.ok) {
      const err: any = new Error(
        json?.message || `Failed to create course (${response.status})`
      );
      if (json?.fieldErrors) err.fieldErrors = json.fieldErrors;
      err.raw = text;
      throw err;
    }

    return json;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

export async function updateCourse(
  id: number,
  courseData: Partial<CourseModel>
) {
  const url: string = `http://localhost:8080/api/courses/${id}`;
  const payload = courseData;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log(
      "← updateCourse response status:",
      response.status,
      "body:",
      text
    );
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn("Response is not JSON:", text);
    }
    if (!response.ok) {
      const err: any = new Error(
        json?.message || `Failed to update course (${response.status})`
      );
      if (json?.fieldErrors) err.fieldErrors = json.fieldErrors;
      err.raw = text;
      throw err;
    }
    return json;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}

export async function deleteCourse(id: number): Promise<void> {
  const url = `http://localhost:8080/api/courses/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete course: ${response.status} ${text}`);
    }
    console.log(`Course with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

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
    err.raw = text;
    console.log("Error response:", err);
    throw err;
  }

  // Only log isOwner if json is not null and has isOwner property
  if (json && "isOwner" in json) {
    console.log("isOwner", json.isOwner);
  }

  return json;
}

export async function getCourseDetail(slug: string): Promise<CourseModel> {
  const url = `http://localhost:8080/api/courses/${slug}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleJsonResponse(response);
}

export async function createSection(slug: string, data: Partial<SectionModel>) {
  const url = `http://localhost:8080/api/sections/${slug}`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleJsonResponse(response);
}

export async function updateSection(
  sectionId: number,
  data: Partial<SectionModel>
) {
  console.log("Updating section:", sectionId, data);
  const url = `http://localhost:8080/api/sections/${sectionId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleJsonResponse(response);
}

export async function deleteSection(sectionId: number) {
  const url = `http://localhost:8080/api/sections/${sectionId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleJsonResponse(response);
}

export async function createLesson(
  sectionId: number,
  data: Partial<LessonModel>
) {
  console.log("Creating lesson in section:", sectionId, data);
  const url = `http://localhost:8080/api/sections/${sectionId}/lessons`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleJsonResponse(response);
}

export async function updateLesson(
  lessonId: number,
  data: Partial<LessonModel>
) {
  const url = `http://localhost:8080/api/lessons/${lessonId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleJsonResponse(response);
}

export async function deleteLesson(lessonId: number) {
  const url = `http://localhost:8080/api/lessons/${lessonId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleJsonResponse(response);
}

export async function getLessonById(lessonId: number): Promise<LessonModel> {
  const url = `http://localhost:8080/api/lessons/locked/${lessonId}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleJsonResponse(response);
}

export async function getStudentsByCourseId(
  courseId: number
): Promise<Student[]> {
  const url = `http://localhost:8080/api/courses/${courseId}/students`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleJsonResponse(response);
}
