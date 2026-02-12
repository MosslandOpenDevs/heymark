# Rule Book

AI 코딩 도구의 컨벤션을 중앙에서 관리하고, 각 도구 형식으로 자동 변환하는 시스템.

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Publishing](#publishing)
5. [Integration](#integration)
6. [Getting Started](#getting-started)
7. [Tool Support](#tool-support)

## Overview

프로젝트마다 AI 도구별 규칙 파일을 따로 작성하면 관리가 파편화된다.
이 시스템은 단일 진실 공급원(Single Source of Truth) 원칙에 따라, 한 곳에서 작성한 규칙을 여러 AI 도구 형식으로 자동 변환한다.
규칙을 한 번만 작성하면 Cursor, Claude Code, GitHub Copilot, OpenAI Codex 등에서 즉시 사용할 수 있다.

## Features

- **단일 소스 관리**: 마크다운 파일 하나로 모든 AI 도구의 규칙 통합 관리
- **자동 형식 변환**: 4종 AI 도구의 네이티브 형식으로 자동 변환 (YAML frontmatter, AGENTS.md 등)
- **선택적 변환**: 특정 도구만 선택하여 변환 가능
- **NPM 패키지 배포**: NPM registry를 통한 public 배포로 간편한 설치 및 버전 관리
- **플러그인 구조**: 변환 모듈 추가만으로 새 도구 지원 확장

## Tech Stack

- **Runtime**: Node.js
- **Language**: JavaScript
- **Core**: File system API, YAML frontmatter parsing

## Publishing

패키지 관리자용 가이드 (일반 사용자는 [Integration](#integration) 참고).

### 초기 설정 (한 번만)

```bash
# NPM 로그인
npm login
# Username: your-npm-username
# Email: your-email@example.com
```

### 배포 프로세스

```bash
# 1. 규칙 수정 후 테스트
node scripts/sync.js --preview

# 2. 버전 업데이트 (자동으로 Git 태그 생성)
npm version patch  # 또는 minor, major

# 3. GitHub에 푸시
git push --follow-tags  # 커밋과 태그를 함께 푸시

# 4. NPM에 배포
npm publish
```

**버전 관리:**

- `patch` (1.0.0 → 1.0.1): 버그 수정, 오타 수정
- `minor` (1.0.0 → 1.1.0): 새 규칙 추가, 기능 개선
- `major` (1.0.0 → 2.0.0): 호환성 깨지는 변경

**Git 태그 설명:**

- `npm version` 명령어는 자동으로 Git 태그를 생성합니다
- `git push --follow-tags`: 일반 커밋과 태그를 함께 푸시 (추천)
- 또는 `git push && git push --tags`: 커밋 푸시 후 모든 태그 푸시

## Integration

### Installation

```bash
# 패키지 설치
npm install --save-dev @i2na/rule-book
```

### Usage with npx

설치 없이 바로 실행하거나, 설치 후 npx로 실행할 수 있습니다.

```bash
# 모든 도구 형식으로 변환 (기존 파일 자동 삭제 후 새로 생성)
npx @i2na/rule-book

# 특정 도구만 변환
npx @i2na/rule-book -t cursor,claude

# 미리보기 (파일 생성 없이 확인)
npx @i2na/rule-book --preview

# 생성된 파일 삭제
npx @i2na/rule-book --clean

# 도움말
npx @i2na/rule-book --help
```

**설치 없이 바로 사용:**

```bash
# 설치 없이 최신 버전으로 실행
npx @i2na/rule-book@latest
```

**패키지 업데이트:**

```bash
npm update @i2na/rule-book
npx @i2na/rule-book
```

**동작 방식:**

- 기본적으로 기존 생성된 파일을 삭제한 후 새로 생성합니다
- 이를 통해 이전 버전의 파일이 남지 않고 깔끔하게 동기화됩니다

## Getting Started

규칙을 작성하고 로컬에서 테스트하는 방법.

### Writing Rules

규칙 디렉토리(`rules/`)에 마크다운 파일 작성. YAML frontmatter로 메타데이터 정의:

```markdown
---
description: "AI assistant behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Rule Title

Rule content...
```

### Local Testing

```bash
# 모든 도구 형식으로 변환
node scripts/sync.js

# 특정 도구만 변환
node scripts/sync.js -t cursor,claude

# 미리보기 (파일 생성 없이 확인)
node scripts/sync.js --preview

# 생성된 파일 삭제
node scripts/sync.js --clean
```

## Tool Support

### Supported Tools

| Tool           | Output Format               | Key Features                    |
| :------------- | :-------------------------- | :------------------------------ |
| Cursor         | `.cursor/rules/*.mdc`       | YAML frontmatter, glob 매칭     |
| Claude Code    | `.claude/skills/*/SKILL.md` | 스킬 디렉토리 구조              |
| GitHub Copilot | `.github/instructions/*.md` | applyTo 패턴 매칭               |
| OpenAI Codex   | `AGENTS.md`                 | 단일 파일 병합 (Agent Rules v1) |

### Adding New Tools

변환 모듈을 추가하면 자동 인식된다. 필수 export 인터페이스:

```javascript
module.exports = {
    name: "Tool Name",
    output: "output/path/pattern",
    generate(rules, projectRoot) {
        /* ... */
    },
    clean(ruleNames, projectRoot) {
        /* ... */
    },
};
```
