import type { ITocItem } from "@/shared/lib/types";

export function extractTableOfContents(markdown: string): ITocItem[] {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const toc: ITocItem[] = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = `section-${index}`;

        toc.push({
            level,
            text,
            id,
        });

        index++;
    }

    return toc;
}
