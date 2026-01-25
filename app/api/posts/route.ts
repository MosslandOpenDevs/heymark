import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubFileList, fetchGitHubFile } from "@server/github/client";
import { parseFrontmatter } from "@server/markdown/parse";
import { getUserEmailFromRequest } from "@server/auth/session";
import { hasAccessToPost, getAdminEmails } from "@server/auth/access";
import type { IPostMetadata } from "@server/markdown/types";

interface IPostListItem {
    filename: string;
    title: string;
    path: string;
    metadata: IPostMetadata;
}

async function fetchPostMetadata(file: any): Promise<IPostListItem | null> {
    try {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        const { metadata } = parseFrontmatter(content);

        return {
            filename: file.name,
            title: file.name.replace(".md", ""),
            path: file.name,
            metadata,
        };
    } catch (error) {
        console.error(`Error fetching file ${file.name}:`, error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const userEmail = getUserEmailFromRequest(request.headers);
        const adminEmails = await getAdminEmails();

        const mdFiles = await fetchGitHubFileList();
        const posts = await Promise.all(mdFiles.map(fetchPostMetadata));
        const validPosts = posts.filter((post): post is IPostListItem => post !== null);
        const visiblePosts = validPosts.filter((post) =>
            hasAccessToPost(post.metadata, userEmail, adminEmails)
        );

        return NextResponse.json({ posts: visiblePosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
