# Rule Book

AI 코딩 도구의 컨벤션을 중앙에서 관리하고, 각 도구 형식으로 자동 변환하는 시스템.

| Section                             | Description       |
| :---------------------------------- | :---------------- |
| [Overview](#overview)               | 프로젝트 개요     |
| [Features](#features)               | 핵심 기능         |
| [Tech Stack](#tech-stack)           | 기술 스택         |
| [Getting Started](#getting-started) | 시작하기          |
| [Integration](#integration)         | 프로젝트 연동     |
| [Tool Support](#tool-support)       | 지원 도구 및 확장 |

## Overview

프로젝트마다 AI 도구별 규칙 파일을 따로 작성하면 관리가 파편화된다.
이 시스템은 단일 진실 공급원(Single Source of Truth) 원칙에 따라, 한 곳에서 작성한 규칙을 여러 AI 도구 형식으로 자동 변환한다.
규칙을 한 번만 작성하면 Cursor, Claude Code, GitHub Copilot, OpenAI Codex 등에서 즉시 사용할 수 있다.

## Features

- **단일 소스 관리**: 마크다운 파일 하나로 모든 AI 도구의 규칙 통합 관리
- **자동 형식 변환**: 4종 AI 도구의 네이티브 형식으로 자동 변환 (YAML frontmatter, AGENTS.md 등)
- **선택적 변환**: 특정 도구만 선택하여 변환 가능
- **Git Submodule 연동**: 중앙 저장소에서 규칙 수정 시 모든 프로젝트에 일괄 반영
- **플러그인 구조**: 변환 모듈 추가만으로 새 도구 지원 확장

## Tech Stack

- **Runtime**: Node.js
- **Language**: JavaScript
- **Core**: File system API, YAML frontmatter parsing

## Getting Started

### Basic Usage

```bash
# 모든 도구 형식으로 변환
node scripts/sync.js

# 특정 도구만 변환
node scripts/sync.js -t cursor,claude

# 미리보기 (파일 생성 없이 확인)
node scripts/sync.js --preview
```

### Writing Rules

규칙 디렉토리에 마크다운 파일 작성. YAML frontmatter로 메타데이터 정의.

```markdown
---
description: "AI assistant behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Rule Title

Rule content...
```

## Integration

### Git Submodule Setup

```bash
# 개별 프로젝트에서 실행
git submodule add <this-repo-url> .conventions

# 규칙 동기화
node .conventions/scripts/sync.js

# 중앙 저장소 업데이트 반영
git submodule update --remote
node .conventions/scripts/sync.js
```

스크립트는 호출된 프로젝트 루트에 도구별 파일을 생성한다.

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
