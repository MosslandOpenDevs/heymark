"use client";

// @note OAuth callback; client-only to read query and persist auth.

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveAuthData, clearAuthReturnPath } from "@/features/auth";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const dataParam = searchParams.get("data");
        const redirectParam = searchParams.get("redirect");

        if (!dataParam) {
            router.push("/");
            return;
        }

        try {
            const authData = JSON.parse(decodeURIComponent(dataParam));
            saveAuthData(authData);
            clearAuthReturnPath();

            const redirectPath = redirectParam || "/";
            router.push(redirectPath);
        } catch (error) {
            console.error("Auth callback error:", error);
            router.push("/");
        }
    }, [searchParams, router]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>인증 중...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <p>인증 중...</p>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
