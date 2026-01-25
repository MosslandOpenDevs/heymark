export function buildPostUrl(slug: string, baseUrl?: string): string {
    const base = baseUrl || "";
    return `${base}/${slug}`;
}

export function buildSettingsUrl(slug: string, baseUrl?: string): string {
    const base = baseUrl || "";
    return `${base}/${slug}/settings`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
}
