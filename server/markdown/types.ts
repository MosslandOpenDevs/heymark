// @note Frontmatter: visibility, sharedWith, createdAt.

export interface IPostMetadata {
    visibility: string;
    sharedWith: string[];
    createdAt?: string;
}

export interface IParsedPost {
    content: string;
    metadata: IPostMetadata;
}
