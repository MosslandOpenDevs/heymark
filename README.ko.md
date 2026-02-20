# Heymark

AI 코딩 도구별 Skill 문서를 단일 위치에서 관리하고, 각 도구 형식으로 자동 변환하는 도구입니다.  
한 번 작성한 Markdown 소스를 여러 에이전트 도구에 맞춰 재사용할 수 있습니다.

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Agent Tools](#supported-agent-tools)
4. [Tech Stack](#tech-stack)
5. [Heymark Usage](#heymark-usage)
6. [Heymark Development](#heymark-development)

## Overview

프로젝트마다 AI 도구별 Skill 파일을 따로 관리하면 문서가 분산되고 유지보수 비용이 커집니다.  
Heymark는 단일 진실 공급원(Single Source of Truth) 원칙으로, 하나의 Markdown 소스를 여러 도구 형식으로 변환합니다.  
한 번 작성한 Skill을 Cursor, Claude Code, GitHub Copilot, OpenAI Codex, Antigravity에서 바로 사용할 수 있습니다.

## Features

- 단일 소스 관리: Markdown 파일 하나로 여러 AI 도구의 Skill을 통합 관리
- 자동 형식 변환: 각 도구의 네이티브 형식으로 자동 변환 (YAML frontmatter, AGENTS.md 등)
- 선택적 변환: 필요한 도구만 선택해서 변환 가능
- NPM 패키지 배포: npx 기반으로 설치 없이 실행 가능
- 플러그인 구조: 변환 모듈을 추가해 지원 도구 확장 가능

## Supported Agent Tools

| Tool           | Output Format                            | Key Features                                             |
| :------------- | :--------------------------------------- | :------------------------------------------------------- |
| Cursor         | `.cursor/rules/*.mdc`                    | YAML frontmatter (`description`, `globs`, `alwaysApply`) |
| Claude Code    | `.claude/skills/*/SKILL.md`              | Skill 디렉터리 구조 + YAML frontmatter                   |
| GitHub Copilot | `.github/instructions/*.instructions.md` | `applyTo` 다중 패턴 매핑                                 |
| OpenAI Codex   | `.agents/skills/*/SKILL.md`              | Skill 디렉터리 구조 + YAML frontmatter                   |
| Antigravity    | `.agent/skills/*/SKILL.md`               | Skill 디렉터리 구조 + YAML frontmatter                   |

## Tech Stack

- Runtime: Node.js
- Language: JavaScript
- Core: File system API, YAML frontmatter parsing

## Heymark Usage

### 1. Prepare the Skill Markdown Archive Repository

Skill 소스 디렉터리(외부 또는 개인 GitHub 저장소)에 Markdown 파일을 작성하고, YAML frontmatter로 메타데이터를 정의합니다.

```markdown
---
description: "AI assistant behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Skill Title

Skill content...
```

저장소 구조는 다음처럼 단순하게 구성하면 됩니다.

```text
my-skills-repository/
  ai-behavior.md
  code-conventions.md
  api-skills.md
```

Skill 소스는 원격 GitHub 저장소(Public/Private)에서 읽습니다.

### 2. Initial Setup

최초 1회, 사용할 Skill 소스 저장소를 설정합니다.

```bash
# Skill 소스 설정 (.heymark/config.json 생성)
npx heymark init <GitHub-저장소-URL>
```

```bash
# HTTPS (Private이면 Git credential/토큰 설정 필요)
npx heymark init https://github.com/org/my-rules.git

# SSH (Private 저장소 권장)
npx heymark init git@github.com:org/my-rules.git

# 저장소 안에서 .md가 하위 폴더에 있을 때
npx heymark init https://github.com/org/my-rules.git --dir rules --branch main
```

### 3. Run

설치 없이 npx로 바로 실행할 수 있습니다.  
Skill은 외부 GitHub 저장소에서 가져오며, 저장소 내 Markdown 파일을 각 AI 도구 형식으로 변환해 현재 프로젝트에 생성합니다.

```bash
# .heymark/config.json에 설정된 외부 Skill 저장소에서 가져와 모든 도구 형식으로 변환
# (기존 생성 파일 삭제 후 새로 생성)
npx heymark

# 단일 실행에서만 다른 외부 저장소 사용 (.heymark/config.json 무시)
npx heymark --source https://github.com/org/other-rules.git

# 특정 도구만 변환
npx heymark -t cursor,claude

# 미리보기 (파일 생성 없이 변환 결과만 확인)
npx heymark --preview

# 이전에 생성된 도구별 파일 삭제
npx heymark --clean

# CLI help
npx heymark --help
```

## Heymark Development

### 1. Local Execution

```bash
# Skill 소스 설정 (최초 1회, GitHub 저장소 URL)
node scripts/sync.js init https://github.com/org/my-rules.git

# 모든 도구 형식으로 변환
node scripts/sync.js

# 단일 실행에서만 다른 저장소 사용
node scripts/sync.js --source https://github.com/org/other-rules.git

# 특정 도구만 변환
node scripts/sync.js -t cursor,claude

# 미리보기 (파일 생성 없이 확인)
node scripts/sync.js --preview

# 생성된 파일 삭제
node scripts/sync.js --clean
```

### 2. Release

```bash
# NPM 로그인
npm login
# Username: your-npm-username
# Email: your-email@example.com

# 1. Skill 수정 후 테스트
node scripts/sync.js --preview

# 2. 버전 업데이트 (자동으로 Git 태그 생성)
npm version patch  # 또는 minor, major

# 3. GitHub에 푸시
git push --follow-tags  # 커밋과 태그를 함께 푸시

# 4. NPM에 배포
npm publish
```

### 3. Versioning

- `patch` (1.0.0 -> 1.0.1): 버그 수정, 오타 수정
- `minor` (1.0.0 -> 1.1.0): 새 Skill 추가, 기능 개선
- `major` (1.0.0 -> 2.0.0): 호환성 깨지는 변경
- `npm version` 명령어는 자동으로 Git 태그를 생성합니다.
- `git push --follow-tags`는 일반 커밋과 태그를 함께 푸시합니다. (권장)
- 또는 `git push && git push --tags`로 커밋 푸시 후 모든 태그를 별도로 푸시할 수 있습니다.
