"use client";

// @note Public list. CSR; SSG+ISR (e.g. revalidate) if moved to RSC.

import { useEffect } from "react";
import { Container } from "@/features/post-list";
import { useAuthStore } from "@/features/auth";
import { useAdminStore } from "@/features/admin";
import { isAuthenticated, getUserInfo } from "@/features/auth";

export default function HomePage() {
    const { setUser } = useAuthStore();
    const { loadEmailConfig } = useAdminStore();

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getUserInfo();
            setUser(user);
        }
        loadEmailConfig();
    }, [setUser, loadEmailConfig]);

    return <Container />;
}
