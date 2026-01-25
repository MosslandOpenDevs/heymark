import type { IPostMetadata } from "../markdown/types";
import { fetchGitHubFile } from "../github/client";

// @note Private: admins (email.yaml) + sharedWith; admin checks for privileged ops.

export function hasAccessToPost(
    metadata: IPostMetadata,
    userEmail: string | null | undefined,
    adminEmails: string[] = []
): boolean {
    if (metadata.visibility === "public") {
        return true;
    }

    if (!userEmail) {
        return false;
    }

    if (adminEmails.includes(userEmail)) {
        return true;
    }

    return metadata.sharedWith.includes(userEmail);
}

export async function getAdminEmails(): Promise<string[]> {
    try {
        const emailConfigContent = await fetchGitHubFile("email.yaml");
        const adminMatch = emailConfigContent.match(/admin:\s*\n((?:\s+-\s+[^\n]+\n?)+)/);
        if (!adminMatch) return [];

        return adminMatch[1]
            .split("\n")
            .map((line) => {
                const itemMatch = line.match(/^\s+-\s+(.+)$/);
                return itemMatch ? itemMatch[1].trim() : null;
            })
            .filter((item): item is string => item !== null && item.length > 0);
    } catch (error) {
        console.error("Error fetching admin emails:", error);
        return [];
    }
}

export async function getEmailConfig(): Promise<{ admin: string[]; archive: string[] }> {
    try {
        const emailConfigContent = await fetchGitHubFile("email.yaml");
        const adminMatch = emailConfigContent.match(/admin:\s*\n((?:\s+-\s+[^\n]+\n?)+)/);
        const archiveMatch = emailConfigContent.match(/archive:\s*\n((?:\s+-\s+[^\n]+\n?)+)/);

        const parseYamlArray = (match: RegExpMatchArray | null): string[] => {
            if (!match) return [];
            return match[1]
                .split("\n")
                .map((line) => {
                    const itemMatch = line.match(/^\s+-\s+(.+)$/);
                    return itemMatch ? itemMatch[1].trim() : null;
                })
                .filter((item): item is string => item !== null && item.length > 0);
        };

        return {
            admin: parseYamlArray(adminMatch),
            archive: parseYamlArray(archiveMatch),
        };
    } catch (error) {
        console.error("Error fetching email config:", error);
        return { admin: [], archive: [] };
    }
}

export function isAdmin(userEmail: string | undefined, adminEmails: string[]): boolean {
    if (!userEmail) return false;
    return adminEmails.includes(userEmail);
}
