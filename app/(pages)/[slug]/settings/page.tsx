"use client";

// @note Private. CSR; requires authentication (admin).

import { useEffect, use } from "react";
import { Settings } from "@/features/admin";
import { useAuthStore } from "@/features/auth";
import { useAdminStore } from "@/features/admin";
import { isAuthenticated, getUserInfo } from "@/features/auth";

export default function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { setUser } = useAuthStore();
    const { loadEmailConfig } = useAdminStore();

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getUserInfo();
            setUser(user);
        }
        loadEmailConfig();
    }, [setUser, loadEmailConfig]);

    return <Settings slug={slug} />;
}
