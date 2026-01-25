"use client";

import { useEffect } from "react";
import { useAuthStore } from "../lib/store";
import { isAuthenticated, getUserInfo } from "../lib/client";

interface GuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Guard({ children, fallback }: GuardProps) {
    const { isAuthenticated: authenticated, setUser } = useAuthStore();

    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated()) {
                const user = getUserInfo();
                setUser(user);
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener("focus", checkAuth);

        return () => {
            window.removeEventListener("focus", checkAuth);
        };
    }, [setUser]);

    if (!authenticated && fallback) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
