"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { BsShare } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import type { ITocItem } from "@/shared/lib/types";
import { Button } from "@/shared/ui";
import { TableOfContents } from "./TableOfContents";
import styles from "../styles/Toolbar.module.scss";

interface ToolbarProps {
    isAdmin: boolean;
    slug: string;
    tocItems?: ITocItem[];
}

export function Toolbar({ isAdmin, slug, tocItems }: ToolbarProps) {
    const router = useRouter();

    const handleShare = async () => {
        const url = window.location.href.split("?")[0];
        try {
            await navigator.clipboard.writeText(url);
            toast.success("URL이 복사되었습니다");
        } catch (error) {
            toast.error("URL 복사에 실패했습니다");
        }
    };

    return (
        <div className={styles.toolbar}>
            <Button variant="text" startIcon={<IoArrowBack />} onClick={() => router.push("/")}>
                Back to List
            </Button>

            <div className={styles.toolbarActions}>
                {tocItems && tocItems.length > 0 && <TableOfContents items={tocItems} />}
                {isAdmin && (
                    <button
                        className={styles.settingsButton}
                        onClick={() => router.push(`/${slug}/settings`)}
                        title="Settings"
                    >
                        <IoSettingsOutline />
                    </button>
                )}
                <button className={styles.shareButton} onClick={handleShare}>
                    <BsShare />
                </button>
            </div>
        </div>
    );
}
