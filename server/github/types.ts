export interface IGitHubFile {
    name: string;
    path: string;
    type: string;
    download_url: string;
    sha?: string;
}

export interface IGitHubCommitRequest {
    message: string;
    content: string;
    sha?: string;
}

export interface IGitHubCommitResponse {
    content: {
        name: string;
        path: string;
        sha: string;
    };
    commit: {
        sha: string;
        message: string;
    };
}
