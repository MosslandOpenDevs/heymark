"use client";

import { useAuthStore } from "@/features/auth";
import { usePost } from "../lib/use-post";
import { extractTableOfContents } from "../lib/use-toc";
import { LoadingSpinner } from "@/shared/ui";
import { Toolbar } from "./Toolbar";
import { TableOfContents } from "./TableOfContents";
import { Renderer } from "./Renderer";
import styles from "../styles/Container.module.scss";

interface ContainerProps {
    slug: string;
    isAdmin: boolean;
}

export function Container({ slug, isAdmin }: ContainerProps) {
    const { user } = useAuthStore();
    const { post, loading } = usePost(slug, user?.email || null);

    const tocItems = post ? extractTableOfContents(post.content) : [];

    if (loading) {
        return (
            <div className={styles.viewPage}>
                <div className={styles.container}>
                    <LoadingSpinner className={styles.loading} />
                </div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className={styles.viewPage}>
            <div className={styles.container}>
                <Toolbar isAdmin={isAdmin} slug={slug} />
                <div className={styles.toolbarActionsInline}>
                    {tocItems.length > 0 && <TableOfContents items={tocItems} />}
                </div>
                <div className={styles.content}>
                    <Renderer file={post} />
                </div>
            </div>
        </div>
    );
}
