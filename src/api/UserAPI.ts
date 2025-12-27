import React from "react";
import { API_BASE_URL } from "../config/config";
import { UserModel } from "../model/UserModel";
import { getAuthHeaders } from "./apiHelper";

interface ResultInterface {
  result: UserModel[];
  totalPages: number;
  totalElements: number;
}

async function request(url: string) {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Không thể truy cập ${url}`);
  }
  return response;
}

async function getUsers(url: string): Promise<ResultInterface> {
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
      json?.message || `Failed to fetch users (${responseData.status})`
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
      result: json as UserModel[],
      totalPages: 1,
      totalElements: json.length,
    };
  }

  return { result: [], totalPages: 0, totalElements: 0 };
}

export async function getAllUser(
  page: number = 0,
  size: number = 5
): Promise<ResultInterface> {
  const url: string = `${API_BASE_URL}/api/users?page=${page}&size=${size}`;
  return getUsers(url);
}

export async function createUser(userData: Partial<UserModel>) {
  const url = `${API_BASE_URL}/api/users`;

  // build payload explicitly so bạn biết đang gửi gì
  const payload = userData;

  try {
    console.log("→ createUser payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    // log raw response for debugging
    console.log(
      "← createUser response status:",
      response.status,
      "body:",
      text
    );

    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      // response không phải JSON
      console.warn("Response is not JSON:", text);
    }

    if (!response.ok) {
      const err: any = new Error(
        json?.message || `Failed to create user (${response.status})`
      );
      if (json?.fieldErrors) err.fieldErrors = json.fieldErrors;
      // attach raw body for easier debugging
      err.raw = text;
      throw err;
    }

    return json;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id: number, userData: Partial<UserModel>) {
  const url: string = `${API_BASE_URL}/api/users/${id}`;
  const payload = userData;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log(
      "← updateUser response status:",
      response.status,
      "body:",
      text
    );
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      // response không phải JSON
      console.warn("Response is not JSON:", text);
    }
    if (!response.ok) {
      const err: any = new Error(
        json?.message || `Failed to update user(${response.status})`
      );
      if (json?.fieldErrors) err.fieldErrors = json.fieldErrors;
      err.raw = text;
      throw err;
    }
    return json;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/users/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete user: ${response.status} ${text}`);
    }
    console.log(`User with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}


export async function getCurrentUser(): Promise<UserModel> {
  const url = `${API_BASE_URL}/api/users/me`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to get current user: ${response.status}`);
  }

  const data = await response.json();
  return data;
}