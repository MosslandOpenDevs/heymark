"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import { Button, LoadingSpinner } from "@/shared/ui";
import { useAuthStore } from "@/features/auth";
import { useAdminStore } from "../lib/store";
import { useAdmin } from "../lib/use-admin";
import { usePost } from "@/features/post-view/lib/use-post";
import { VisibilityToggle } from "./VisibilityToggle";
import { ShareManager } from "./ShareManager";
import { DeleteButton } from "./DeleteButton";
import styles from "../styles/Settings.module.scss";

interface SettingsProps {
    slug: string;
}

export function Settings({ slug }: SettingsProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isAdmin, archiveEmails } = useAdminStore();
    const { post, loading } = usePost(slug, user?.email || null);
    const [file, setFile] = useState(post);
    const { saving, updateSharedWith, updateVisibility, deletePost } = useAdmin(
        file,
        user?.email || null
    );

    useEffect(() => {
        if (post) {
            setFile(post);
        }
    }, [post]);

    useEffect(() => {
        if (!isAdmin) {
            toast.error("Admin access required");
            router.push("/");
        }
    }, [isAdmin, router]);

    const handleRemoveEmail = async (emailToRemove: string) => {
        if (!file) return;

        const updatedSharedWith = file.metadata.sharedWith.filter(
            (email) => email !== emailToRemove
        );

        try {
            await updateSharedWith(updatedSharedWith, file.metadata.visibility as any);
            setFile({
                ...file,
                metadata: {
                    ...file.metadata,
                    sharedWith: updatedSharedWith,
                },
            });
            toast.success("이메일이 제거되었습니다");
        } catch (error) {
            toast.error("이메일 제거에 실패했습니다");
            console.error(error);
        }
    };

    const handleAddEmails = async (newEmails: string[]) => {
        if (!file) return;

        const updatedSharedWith = [...file.metadata.sharedWith, ...newEmails];

        try {
            await updateSharedWith(updatedSharedWith, file.metadata.visibility as any);
            setFile({
                ...file,
                metadata: {
                    ...file.metadata,
                    sharedWith: updatedSharedWith,
                },
            });
            toast.success(`${newEmails.length}개의 이메일이 추가되었습니다`);
        } catch (error) {
            toast.error("이메일 추가에 실패했습니다");
            console.error(error);
        }
    };

    const handleVisibilityToggle = async (newVisibility: "public" | "private") => {
        if (!file) return;

        try {
            await updateVisibility(newVisibility);
            setFile({
                ...file,
                metadata: {
                    ...file.metadata,
                    visibility: newVisibility,
                },
            });
            toast.success(`${newVisibility}으로 변경되었습니다`);
        } catch (error) {
            toast.error("Visibility 변경에 실패했습니다");
            console.error(error);
        }
    };

    const handleDeleteClick = async () => {
        if (!file) return;

        const confirmed = window.confirm("게시물을 삭제하시겠습니까?");

        if (confirmed) {
            try {
                await deletePost();
                toast.success("게시물이 삭제되었습니다");
                router.push("/");
            } catch (error) {
                toast.error("게시물 삭제에 실패했습니다");
                console.error(error);
            }
        }
    };

    if (loading || !file) {
        return (
            <div className={styles.settingPage}>
                <LoadingSpinner />
            </div>
        );
    }

    const baseFilename = file.filename.replace(".md", "");

    return (
        <div className={styles.settingPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Button
                        variant="text"
                        startIcon={<IoArrowBack />}
                        onClick={() => router.push(`/${baseFilename}`)}
                        className={styles.backButton}
                    >
                        Back to Post
                    </Button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                Shared Emails ({file.metadata.sharedWith.length})
                            </h2>
                            <VisibilityToggle
                                visibility={file.metadata.visibility as "public" | "private"}
                                disabled={saving}
                                onChange={handleVisibilityToggle}
                            />
                        </div>
                        <ShareManager
                            sharedWith={file.metadata.sharedWith}
                            visibility={file.metadata.visibility as "public" | "private"}
                            archiveEmails={archiveEmails}
                            disabled={saving}
                            onAdd={handleAddEmails}
                            onRemove={handleRemoveEmail}
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <DeleteButton disabled={saving} onClick={handleDeleteClick} />
                </div>
            </div>
        </div>
    );
}
