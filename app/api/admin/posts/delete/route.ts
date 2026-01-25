import { NextRequest, NextResponse } from "next/server";
import { deleteGitHubFile } from "@server/github/posts";
import { getUserEmailFromRequest } from "@server/auth/session";
import { isAdmin, getAdminEmails } from "@server/auth/access";

export async function DELETE(request: NextRequest) {
    try {
        const userEmail = getUserEmailFromRequest(request.headers);
        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get("filename");

        if (!filename || typeof filename !== "string") {
            return NextResponse.json({ error: "Filename is required" }, { status: 400 });
        }

        const adminEmails = await getAdminEmails();
        if (!isAdmin(userEmail, adminEmails)) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        await deleteGitHubFile(filename);

        return NextResponse.json({ success: true, message: "Post deleted" });
    } catch (error: any) {
        console.error("[API] Error deleting post:", error);
        if (error.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Failed to delete post", details: error.message },
            { status: 500 }
        );
    }
}
