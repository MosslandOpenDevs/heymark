import simpleGit from "simple-git";
import chalk from "chalk";

export async function ensureLatest(repoPath) {
    try {
        const git = simpleGit(repoPath);

        // 로컬 변경사항 확인
        const status = await git.status();
        if (!status.isClean()) {
            throw new Error(
                "Local changes detected. Please commit or stash them first:\n" +
                    '  git add . && git commit -m "message"\n' +
                    "  or\n" +
                    "  git stash"
            );
        }

        // 최신 커밋 가져오기
        await git.pull("origin", "main");
    } catch (error) {
        console.error(chalk.red("✗ Failed to sync with remote"));
        throw error;
    }
}

export async function commitAndPush(repoPath, message) {
    try {
        const git = simpleGit(repoPath);

        await git.add(".");
        await git.commit(message);
        await git.push();
    } catch (error) {
        console.error(chalk.red("✗ Git operation failed"));
        throw error;
    }
}
