"use client";

import { GoRepo, GoLock } from "react-icons/go";
import type { IMarkdownFile } from "@/shared/lib/types";
import styles from "../styles/Card.module.scss";

interface CardProps {
    post: IMarkdownFile;
    onClick: (filename: string) => void;
}

export function Card({ post, onClick }: CardProps) {
    const handleClick = () => {
        const baseFilename = post.filename.replace(".md", "");
        onClick(baseFilename);
    };

    return (
        <div className={styles.item} onClick={handleClick}>
            <div className={styles.itemMain}>
                <div className={styles.itemTitleRow}>
                    <GoRepo className={styles.repoIcon} />
                    <h2 className={styles.itemTitle} title={post.title}>
                        {post.title}
                    </h2>
                    {post.metadata.visibility === "private" && (
                        <span className={styles.sharedBadge}>
                            <GoLock size={12} />
                            <span className={styles.badgeText}>Shared</span>
                        </span>
                    )}
                </div>
                <div className={styles.itemMeta}>
                    {post.metadata.createdAt && (
                        <span className={styles.date}>{post.metadata.createdAt}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
