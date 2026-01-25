// @note x-user-email in request; validate input at API boundary; tokens in env (config).

export function getUserEmailFromRequest(headers: Headers): string | undefined {
    return headers.get("x-user-email") || undefined;
}

export function createAuthHeaders(userEmail: string): HeadersInit {
    return {
        "x-user-email": userEmail,
    };
}
