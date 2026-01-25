import type { IPostMetadata } from "./types";

export function validatePostMetadata(metadata: IPostMetadata): boolean {
    if (!metadata.visibility || !["public", "private"].includes(metadata.visibility)) {
        return false;
    }

    if (!Array.isArray(metadata.sharedWith)) {
        return false;
    }

    return true;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
