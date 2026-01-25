"use client";

import { useState, useEffect } from "react";
import { fetchPost } from "@/shared/lib/api";
import type { IMarkdownFile } from "@/shared/lib/types";

export function usePost(slug: string, userEmail: string | null = null) {
    const [post, setPost] = useState<IMarkdownFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const data = await fetchPost(slug, { userEmail });

                if (!data) {
                    setError("Access denied or post not found");
                    setPost(null);
                } else {
                    setPost(data);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load post");
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug, userEmail]);

    return { post, loading, error };
}
