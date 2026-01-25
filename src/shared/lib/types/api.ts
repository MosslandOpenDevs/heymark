export interface IApiResponse<T = any> {
    data?: T;
    error?: string;
    details?: string;
}

export interface IPostsResponse {
    posts: Array<{
        filename: string;
        title: string;
        path: string;
        metadata: {
            visibility: string;
            sharedWith: string[];
            createdAt?: string;
        };
    }>;
}

export interface IPostResponse {
    filename: string;
    title: string;
    content: string;
    path: string;
    metadata: {
        visibility: string;
        sharedWith: string[];
        createdAt?: string;
    };
}
