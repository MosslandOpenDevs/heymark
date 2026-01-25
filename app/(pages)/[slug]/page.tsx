"use client";

// @note Post view. CSR; public/private access checked in data layer.

import { useEffect, use } from "react";
import { Container } from "@/features/post-view";
import { useAuthStore } from "@/features/auth";
import { useAdminStore } from "@/features/admin";
import { isAuthenticated, getUserInfo } from "@/features/auth";

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { setUser } = useAuthStore();
    const { isAdmin, loadEmailConfig } = useAdminStore();

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getUserInfo();
            setUser(user);
        }
        loadEmailConfig();
    }, [setUser, loadEmailConfig]);

    return <Container slug={slug} isAdmin={isAdmin} />;
}
