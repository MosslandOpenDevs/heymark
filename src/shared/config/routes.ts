export const ROUTES = {
    HOME: "/",
    POST: (slug: string) => `/${slug}`,
    SETTINGS: (slug: string) => `/${slug}/settings`,
    AUTH_CALLBACK: "/auth/callback",
} as const;

export const API_ROUTES = {
    POSTS: "/api/posts",
    POST: (slug: string) => `/api/posts/${slug}`,
    ADMIN_EMAILS: "/api/admin/emails",
    ADMIN_VISIBILITY: "/api/admin/posts/visibility",
    ADMIN_SHARE: "/api/admin/posts/share",
    ADMIN_DELETE: "/api/admin/posts/delete",
    AUTH_GOOGLE: "/api/auth/google",
} as const;
