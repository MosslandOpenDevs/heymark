"use client";

import { GoLock } from "react-icons/go";
import styles from "../styles/VisibilityToggle.module.scss";

interface VisibilityToggleProps {
    visibility: "public" | "private";
    disabled?: boolean;
    onChange: (visibility: "public" | "private") => void;
}

export function VisibilityToggle({ visibility, disabled, onChange }: VisibilityToggleProps) {
    const handleClick = () => {
        const newVisibility = visibility === "public" ? "private" : "public";
        onChange(newVisibility);
    };

    return (
        <button className={styles.visibilityToggle} onClick={handleClick} disabled={disabled}>
            {visibility === "private" && <GoLock size={12} />}
            <span>{visibility === "public" ? "Public" : "Private"}</span>
        </button>
    );
}
