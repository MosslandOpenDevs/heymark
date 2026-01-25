import { API_ROUTES } from "@/shared/config";

export async function fetchEmailConfig() {
    const response = await fetch(API_ROUTES.ADMIN_EMAILS);
    if (!response.ok) {
        throw new Error("Failed to fetch email config");
    }
    return await response.json();
}

export async function updatePostSharedWith(
    filename: string,
    sharedWith: string[],
    userEmail: string,
    visibility?: "public" | "private"
) {
    const response = await fetch(API_ROUTES.ADMIN_SHARE, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-user-email": userEmail,
        },
        body: JSON.stringify({ filename, sharedWith, ...(visibility && { visibility }) }),
    });

    if (!response.ok) {
        throw new Error("Failed to update shared emails");
    }

    return await response.json();
}

export async function updatePostVisibility(
    filename: string,
    visibility: "public" | "private",
    userEmail: string
) {
    const response = await fetch(API_ROUTES.ADMIN_VISIBILITY, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-user-email": userEmail,
        },
        body: JSON.stringify({ filename, visibility }),
    });

    if (!response.ok) {
        throw new Error("Failed to update visibility");
    }

    return await response.json();
}

export async function deletePost(filename: string, userEmail: string) {
    const response = await fetch(
        `${API_ROUTES.ADMIN_DELETE}?filename=${encodeURIComponent(filename)}`,
        {
            method: "DELETE",
            headers: {
                "x-user-email": userEmail,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete post");
    }

    return await response.json();
}
