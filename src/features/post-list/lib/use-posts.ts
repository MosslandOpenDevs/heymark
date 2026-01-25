"use client";

import { useState, useEffect } from "react";
import { fetchPosts } from "@/shared/lib/api";
import type { IMarkdownFile } from "@/shared/lib/types";

export function usePosts(userEmail: string | null = null) {
    const [posts, setPosts] = useState<IMarkdownFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchPosts({ userEmail });
                const files: IMarkdownFile[] = (data.posts || []).map((post: any) => ({
                    filename: post.filename,
                    title: post.title,
                    content: "",
                    path: post.path,
                    metadata: post.metadata,
                }));

                const sorted = files.sort((a, b) => {
                    const dateA = a.metadata.createdAt;
                    const dateB = b.metadata.createdAt;

                    if (!dateA && !dateB) {
                        return a.filename.localeCompare(b.filename);
                    }
                    if (!dateA) return 1;
                    if (!dateB) return -1;

                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                });

                setPosts(sorted);
                setError(null);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load posts");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [userEmail]);

    return { posts, loading, error };
}
