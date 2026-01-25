"use client";

import { BsLink45Deg } from "react-icons/bs";
import toast from "react-hot-toast";
import styles from "../styles/HeaderLink.module.scss";

interface HeaderLinkProps {
    sectionId: string;
}

export function HeaderLink({ sectionId }: HeaderLinkProps) {
    const handleCopyLink = async () => {
        const sectionIndex = sectionId.replace("section-", "");
        const baseUrl = window.location.href.split("?")[0];
        const url = `${baseUrl}?section=${sectionIndex}`;

        try {
            await navigator.clipboard.writeText(url);
            toast.success("URL이 복사되었습니다");
        } catch (error) {
            toast.error("URL 복사에 실패했습니다");
        }
    };

    return (
        <button className={styles.headerLink} onClick={handleCopyLink} aria-label="링크 복사">
            <BsLink45Deg />
        </button>
    );
}
