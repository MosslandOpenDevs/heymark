import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubFile } from "@server/github/client";
import { updateGitHubFile } from "@server/github/posts";
import { parseFrontmatter, generateFrontmatter } from "@server/markdown/parse";
import { getUserEmailFromRequest } from "@server/auth/session";
import { isAdmin, getAdminEmails } from "@server/auth/access";

export async function PATCH(request: NextRequest) {
    try {
        const userEmail = getUserEmailFromRequest(request.headers);
        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminEmails = await getAdminEmails();
        if (!isAdmin(userEmail, adminEmails)) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const body = await request.json();
        const { filename, visibility } = body;

        if (!filename || typeof filename !== "string") {
            return NextResponse.json({ error: "Filename is required" }, { status: 400 });
        }

        if (!visibility || !["public", "private"].includes(visibility)) {
            return NextResponse.json({ error: "Valid visibility is required" }, { status: 400 });
        }

        const fileContent = await fetchGitHubFile(filename);
        const { content, metadata } = parseFrontmatter(fileContent);

        metadata.visibility = visibility;
        const updatedContent = generateFrontmatter(metadata, content);

        await updateGitHubFile(filename, updatedContent, `Update visibility for ${filename}`);

        return NextResponse.json({
            filename,
            metadata,
        });
    } catch (error: any) {
        console.error("[API] Error updating visibility:", error);
        if (error.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Failed to update visibility", details: error.message },
            { status: 500 }
        );
    }
}
