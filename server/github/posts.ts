import { GITHUB, ENV_VARS } from "../config/constants";
import { getGitHubFileSha } from "./client";

const GITHUB_TOKEN = ENV_VARS.POSTS_GITHUB_TOKEN;
const REPO_OWNER = GITHUB.REPO_OWNER;
const REPO_NAME = GITHUB.POSTS_REPO_NAME;

export async function updateGitHubFile(
    filename: string,
    content: string,
    message: string
): Promise<void> {
    const sha = await getGitHubFileSha(filename);
    const url = `${GITHUB.API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;

    const encodedContent = Buffer.from(content, "utf-8").toString("base64");

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": GITHUB.USER_AGENT,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            content: encodedContent,
            sha,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `GitHub API error: ${response.status} - ${errorData.message || response.statusText}`
        );
    }
}

export async function deleteGitHubFile(filename: string): Promise<void> {
    const sha = await getGitHubFileSha(filename);
    const url = `${GITHUB.API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": GITHUB.USER_AGENT,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: `Delete post: ${filename}`,
            sha,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `GitHub API error: ${response.status} - ${errorData.message || response.statusText}`
        );
    }
}
