"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import { LoginButton, LogoutButton } from "@/features/auth";
import { usePosts } from "../lib/use-posts";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";
import styles from "../styles/Container.module.scss";

export function Container() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { posts, loading } = usePosts(user?.email || null);

    const handleFileClick = (filename: string) => {
        router.push(`/${filename}`);
    };

    const handleLogout = () => {
        window.location.reload();
    };

    return (
        <div className={styles.listPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>@heymark</h1>

                    {isAuthenticated && user ? (
                        <div className={styles.userInfo}>
                            <span className={styles.userEmail}>{user.email}</span>
                            <LogoutButton onLogout={handleLogout}>Logout</LogoutButton>
                        </div>
                    ) : (
                        <LoginButton returnPath="/">Login</LoginButton>
                    )}
                </div>

                <div className={styles.list}>
                    {loading ? (
                        <Skeleton />
                    ) : posts.length === 0 ? (
                        <div className={styles.empty}>게시물이 없습니다</div>
                    ) : (
                        posts.map((post) => (
                            <Card key={post.filename} post={post} onClick={handleFileClick} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
