/**
 * Shared API utilities for making authenticated requests
 */

/**
 * Get headers with Authorization token if user is logged in
 */
export function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Make an authenticated GET request
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
        ...getAuthHeaders(),
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers,
    });
}
