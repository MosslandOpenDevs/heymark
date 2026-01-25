import { API_ROUTES } from "@/shared/config";

interface IFetchOptions {
    userEmail?: string | null;
}

export async function fetchPosts(options: IFetchOptions = {}) {
    const headers: HeadersInit = {};
    if (options.userEmail) {
        headers["x-user-email"] = options.userEmail;
    }

    const response = await fetch(API_ROUTES.POSTS, { headers });
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return await response.json();
}

export async function fetchPost(slug: string, options: IFetchOptions = {}) {
    const headers: HeadersInit = {};
    if (options.userEmail) {
        headers["x-user-email"] = options.userEmail;
    }

    const response = await fetch(API_ROUTES.POST(slug), {
        headers,
    });

    if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
            return null;
        }
        throw new Error("Failed to fetch post");
    }

    return await response.json();
}
