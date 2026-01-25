export const ENV = {
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "",
} as const;
