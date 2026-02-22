# Heymark

Heymark는 하나의 Skill 저장소를 여러 AI Tool 형식으로 변환하고 동기화하는 허브 시스템입니다.

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Tools](#supported-tools)
4. [How to Use](#how-to-use)
5. [How to Dev](#how-to-dev)

## Overview

AI Tool은 프롬프트 문맥에 맞는 Skill을 로드해 반복적인 지시문 입력을 줄이는 기능을 지원합니다.
이 기능을 사용하면 공통 작업을 표준화하고, 팀 내에서 일관된 작업 기준을 유지할 수 있다는 장점이 있습니다.
하지만 프로젝트마다 Skill을 개별적으로 연결하고 관리해야 하며, AI Tool마다 요구하는 Skill 파일 형식도 달라
같은 내용을 여러 형식으로 반복 관리해야 하는 불편이 있습니다.
Heymark는 단일 Skill 저장소(Single Source of Truth)를 중심으로 도구별 형식 변환과 동기화를 자동화해,
반복 운영 비용을 줄이고 AI 활용 효율을 극대화합니다.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/3819f0d7-9bb2-474f-a58a-da3d1344207d" />

_프롬프트 문맥에 맞는 Skill을 자동 로드하는 모습입니다._

## Features

- 단일 소스 관리: Markdown 기반 Skill을 한 곳에서 관리
- 자동 형식 변환: 도구별 형식으로 Skill 자동 생성
- 선택 동기화: 전체 또는 특정 도구만 동기화
- 샘플 Skill 즉시 사용: heymark 샘플 Skill 저장소로 바로 시작

## Supported Tools

| Tool        | CLI usage     | Output Format                            |
| :---------- | :------------ | :--------------------------------------- |
| Cursor      | `cursor`      | `.cursor/rules/*.mdc`                    |
| Claude Code | `claude-code` | `.claude/skills/*/SKILL.md`              |
| Copilot     | `copilot`     | `.github/instructions/*.instructions.md` |
| Codex       | `codex`       | `.agents/skills/*/SKILL.md`              |
| Antigravity | `antigravity` | `.agent/skills/*/SKILL.md`               |

## How to Use

### Prepare Skill Repository

Skill 저장소는 아래처럼 구성하면 됩니다.

```text
my-skills-repository/
  ai-behavior.md
  code-conventions.md
  api-skills.md
```

각 Skill Markdown에는 frontmatter를 포함합니다.

```markdown
---
description: "AI coding behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Skill Title

Skill content...
```

### Quick Start

```bash
npx heymark link https://github.com/MosslandOpenDevs/heymark.git --folder skill-samples
npx heymark sync .
```

_`link`와 `sync` 실행 후, 각 도구가 요구하는 디렉터리에 Skill 파일이 생성됩니다._

<img width="250" alt="image" src="https://github.com/user-attachments/assets/0e5bc974-12d6-4aab-b0aa-16ca5659f973" />

### Commands

```bash
npx heymark link <GitHub-저장소-URL>
npx heymark link <GitHub-저장소-URL> --folder <folder-name>  # 하위 폴더 사용 시
npx heymark link <GitHub-저장소-URL> --branch <branch-name>  # 다른 브랜치 사용 시

npx heymark sync .                        # 전체 동기화
npx heymark sync cursor claude-code       # 일부 도구만 동기화

npx heymark clean .                       # 전체 정리
npx heymark clean cursor claude-code      # 일부 도구만 정리

npx heymark help
```

## How to Dev

### Tech Stack

- Runtime: Node.js
- Language: JavaScript
- Core: File system API, YAML frontmatter parsing

### Local Development

`How to Use` 섹션의 `npx heymark`를 `node src/index.js`로 바꿔 실행하면 됩니다.

### Release

```bash
npm login
npm version patch  # 또는 minor, major
git push --follow-tags
npm publish
```

### Versioning

- `patch` (1.0.0 -> 1.0.1): 버그 수정, 오타 수정
- `minor` (1.0.0 -> 1.1.0): 새 Skill 추가, 기능 개선
- `major` (1.0.0 -> 2.0.0): 호환성 깨지는 변경
