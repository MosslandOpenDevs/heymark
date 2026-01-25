import { GITHUB, ENV_VARS } from "../config/constants";
import type { IGitHubFile } from "./types";

// @note GitHub: PAT with repo from env; Accept vnd.github.v3+json or .raw; rate 5,000/h (auth), 60/h (anon).

const GITHUB_TOKEN = ENV_VARS.POSTS_GITHUB_TOKEN;
const REPO_OWNER = GITHUB.REPO_OWNER;
const REPO_NAME = GITHUB.POSTS_REPO_NAME;

export async function fetchGitHubFile(filename: string): Promise<string> {
    const url = `${GITHUB.API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3.raw",
            "User-Agent": GITHUB.USER_AGENT,
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("NOT_FOUND");
        }
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.text();
}

export async function fetchGitHubFileList(): Promise<IGitHubFile[]> {
    const url = `${GITHUB.API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": GITHUB.USER_AGENT,
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    return files.filter((f: any) => f.type === "file" && f.name.endsWith(".md"));
}

export async function getGitHubFileSha(filename: string): Promise<string> {
    const url = `${GITHUB.API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": GITHUB.USER_AGENT,
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("NOT_FOUND");
        }
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.sha;
}
