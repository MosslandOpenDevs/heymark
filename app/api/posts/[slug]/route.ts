import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubFile } from "@server/github/client";
import { parseFrontmatter } from "@server/markdown/parse";
import { getUserEmailFromRequest } from "@server/auth/session";
import { hasAccessToPost, getAdminEmails } from "@server/auth/access";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const filename = `${slug}.md`;

    try {
        const userEmail = getUserEmailFromRequest(request.headers);
        const adminEmails = await getAdminEmails();

        const fileContent = await fetchGitHubFile(filename);
        const { content, metadata } = parseFrontmatter(fileContent);

        if (!hasAccessToPost(metadata, userEmail, adminEmails)) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({
            filename,
            title: filename.replace(".md", ""),
            content,
            path: filename,
            metadata,
        });
    } catch (error: any) {
        console.error("[API] Error:", error);
        if (error.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Failed to fetch post", details: error.message },
            { status: 500 }
        );
    }
}
