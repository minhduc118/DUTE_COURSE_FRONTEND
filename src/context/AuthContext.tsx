import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    login as loginApi,
    register as registerApi,
    loginWithGoogle as loginWithGoogleApi,
    AuthenticationRequest,
    RegisterRequest,
    GoogleLoginRequest
} from "../api/AuthAPI";
import { UserModel } from "../model/UserModel";
import { getCurrentUser } from "../api/UserAPI";

interface AuthContextType {
    user: UserModel | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: AuthenticationRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    loginWithGoogle: (code: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("userInfo");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(new UserModel(parsedUser));
            } catch (e) {
                console.error("Failed to parse stored user info", e);
                localStorage.removeItem("userInfo");
            }
        }

        setLoading(false);
    }, []);

    const login = async (data: AuthenticationRequest) => {
        setLoading(true);
        try {
            const response = await loginApi(data);
            if (response.token) {
                const newToken = response.token;
                localStorage.setItem("authToken", newToken);
                setToken(newToken);

                const userData = await getCurrentUser();
                const newUser = new UserModel(userData);

                localStorage.setItem("userInfo", JSON.stringify(newUser));
                setUser(newUser);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await registerApi(data);
            if (response.token) {
                const newToken = response.token;
                localStorage.setItem("authToken", newToken);
                setToken(newToken);

                const userData = await getCurrentUser();
                const newUser = new UserModel(userData);

                localStorage.setItem("userInfo", JSON.stringify(newUser));
                setUser(newUser);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (code: string) => {
        setLoading(true);
        try {
            const response = await loginWithGoogleApi({ code });
            if (response.token) {
                const newToken = response.token;
                localStorage.setItem("authToken", newToken);
                setToken(newToken);

                const userData = await getCurrentUser();
                const newUser = new UserModel(userData);

                localStorage.setItem("userInfo", JSON.stringify(newUser));
                setUser(newUser);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            register,
            loginWithGoogle,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
