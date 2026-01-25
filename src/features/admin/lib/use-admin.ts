"use client";

import { useState } from "react";
import { updatePostSharedWith, updatePostVisibility, deletePost } from "@/shared/lib/api";
import type { IMarkdownFile } from "@/shared/lib/types";

export function useAdmin(file: IMarkdownFile | null, userEmail: string | null) {
    const [saving, setSaving] = useState(false);

    const handleUpdateSharedWith = async (
        sharedWith: string[],
        visibility?: "public" | "private"
    ) => {
        if (!file || !userEmail) {
            throw new Error("Missing file or user email");
        }

        setSaving(true);
        try {
            await updatePostSharedWith(file.filename, sharedWith, userEmail, visibility);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateVisibility = async (visibility: "public" | "private") => {
        if (!file || !userEmail) {
            throw new Error("Missing file or user email");
        }

        setSaving(true);
        try {
            await updatePostVisibility(file.filename, visibility, userEmail);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePost = async () => {
        if (!file || !userEmail) {
            throw new Error("Missing file or user email");
        }

        setSaving(true);
        try {
            await deletePost(file.filename, userEmail);
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        updateSharedWith: handleUpdateSharedWith,
        updateVisibility: handleUpdateVisibility,
        deletePost: handleDeletePost,
    };
}
