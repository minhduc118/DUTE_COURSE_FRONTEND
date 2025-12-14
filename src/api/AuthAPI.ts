import { API_BASE_URL, AUTH_ENDPOINTS } from "../config/config";
import { UserModel } from "../model/UserModel";

export interface RegisterRequest {
    fullName?: string;
    email?: string;
    password?: string;
    otpCode?: string;
}

export interface AuthenticationRequest {
    email?: string;
    password?: string;
}

export interface GoogleLoginRequest {
    idToken?: string;
    code?: string;
}

export interface AuthenticationResponse {
    token?: string;
    refreshToken?: string;
    user?: UserModel;
}

export async function register(data: RegisterRequest): Promise<AuthenticationResponse> {
    const url = `${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || "Đăng ký thất bại");
        (error as any).fieldErrors = errorData.fieldErrors;
        throw error;
    }

    return response.json();
}

export async function login(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    const url = `${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.fieldErrors || "Đăng nhập thất bại");
    }

    return response.json();
}

export async function loginWithGoogle(data: GoogleLoginRequest): Promise<AuthenticationResponse> {
    const url = `${API_BASE_URL}${AUTH_ENDPOINTS.GOOGLE}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Đăng nhập Google thất bại");
    }

    return response.json();
}

export async function sendOtp(email: string): Promise<any> {
    const url = `${API_BASE_URL}${AUTH_ENDPOINTS.SEND_OTP}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gửi mã OTP thất bại");
    }

    return response.json();
}
