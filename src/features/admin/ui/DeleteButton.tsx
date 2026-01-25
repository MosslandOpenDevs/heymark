"use client";

import { IoTrashOutline } from "react-icons/io5";
import styles from "../styles/DeleteButton.module.scss";

interface DeleteButtonProps {
    disabled?: boolean;
    onClick: () => void;
}

export function DeleteButton({ disabled, onClick }: DeleteButtonProps) {
    return (
        <button className={styles.deleteButton} onClick={onClick} disabled={disabled}>
            <IoTrashOutline />
            Delete Post
        </button>
    );
}
