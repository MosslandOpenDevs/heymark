import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import chalk from "chalk";
import { execSync } from "child_process";
import { getConfig } from "../util/config.js";
import { DEFAULTS, GIT, FILE } from "../util/constants.js";

function createFrontmatter(visibility, createdAt) {
    return `---
visibility: ${visibility}
createdAt: ${createdAt}
---

`;
}

export default async function addCommand(filepath, options) {
    try {
        const config = await getConfig();

        // Private repo 최신 상태로 동기화
        console.log(chalk.blue("→ Syncing with remote..."));
        try {
            execSync("git pull --rebase", {
                cwd: config.postsRepoPath,
                stdio: "pipe",
            });
            console.log(chalk.green("✓ Up to date"));
        } catch (error) {
            console.log(chalk.yellow("⚠ No remote changes"));
        }

        // 파일 읽기
        const content = await fs.readFile(filepath, "utf-8");
        const parsed = matter(content);
        const body = parsed.content;

        // 원본 파일명을 그대로 사용 (확장자 제거)
        const slug = path.basename(filepath, FILE.MD_EXTENSION);

        // 한국 시간 생성 (KST)
        const now = new Date();
        const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const year = kstTime.getUTCFullYear();
        const month = String(kstTime.getUTCMonth() + 1).padStart(2, "0");
        const day = String(kstTime.getUTCDate()).padStart(2, "0");
        const hours = String(kstTime.getUTCHours()).padStart(2, "0");
        const minutes = String(kstTime.getUTCMinutes()).padStart(2, "0");
        const timestamp = `${year}.${month}.${day} ${hours}:${minutes}`;

        const visibility = DEFAULTS.DEFAULT_VISIBILITY;
        const createdAt = parsed.data.createdAt || timestamp;

        // frontmatter 생성
        const frontmatterText = createFrontmatter(visibility, createdAt);
        const finalContent = frontmatterText + body.trim();

        // Private repo에 파일 저장
        const targetPath = path.join(config.postsRepoPath, `${slug}${FILE.MD_EXTENSION}`);
        await fs.writeFile(targetPath, finalContent, "utf-8");

        console.log(chalk.green(`✓ Saved → ${slug}${FILE.MD_EXTENSION}`));

        // Git commit & push to private repo
        try {
            execSync(`git add "${slug}${FILE.MD_EXTENSION}"`, {
                cwd: config.postsRepoPath,
                stdio: "pipe",
            });

            // 변경사항이 있는지 확인
            try {
                execSync("git diff --cached --quiet", {
                    cwd: config.postsRepoPath,
                    stdio: "pipe",
                });
                // exit code 0 = 변경사항 없음
                console.log(chalk.yellow("⚠ No changes to commit (file already up to date)"));
            } catch {
                // exit code 1 = 변경사항 있음
                execSync(`git commit -m "${GIT.COMMIT_MESSAGE_PREFIX} ${slug}"`, {
                    cwd: config.postsRepoPath,
                    stdio: "pipe",
                });
                execSync("git push", { cwd: config.postsRepoPath, stdio: "inherit" });
                console.log(chalk.green("✓ Committed & pushed to private repo"));
            }
        } catch (error) {
            console.error(chalk.red("✗ Git operation failed"));
            throw error;
        }

        // -d 플래그가 있을 때만 원본 파일 삭제
        if (options.delete) {
            await fs.unlink(filepath);
            console.log(chalk.green("✓ Removed original file"));
        }

        // URL 출력
        console.log(chalk.cyan(`→ ${config.baseUrl}/${slug}`));
    } catch (error) {
        console.error(chalk.red("✗ Failed to add document"));
        console.error(chalk.dim(error.message));
        process.exit(1);
    }
}
