# Heymark

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
규칙을 한 번만 작성하면 Cursor, Claude Code, GitHub Copilot, OpenAI Codex, Antigravity 등에서 즉시 사용할 수 있다.

## Features

- **단일 소스 관리**: 마크다운 파일 하나로 모든 AI 도구의 규칙 통합 관리
- **자동 형식 변환**: 5종 AI 도구의 네이티브 형식으로 자동 변환 (YAML frontmatter, AGENTS.md 등)
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

Rule/Skill은 **원격 GitHub 저장소(Public/Private)** 에서 읽습니다.  
최초 1회만 설정하면 됩니다.

```bash
# 규칙 소스 설정 (.heymark/config.json 생성)
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

### Usage with npx

설치 없이 npx로 바로 실행할 수 있습니다.  
규칙은 **원격 GitHub 저장소**에서 가져오며, 해당 저장소 안의 마크다운 파일을 각 AI 도구 형식으로 변환해 현재 프로젝트에 생성합니다.

```bash
# .heymark/config.json에 설정된 외부 규칙 저장소에서 가져와 모든 도구 형식으로 변환 (기존 생성 파일 삭제 후 새로 생성)
npx heymark

# 이번에만 다른 외부 저장소 사용 (.heymark/config.json 무시)
npx heymark --source https://github.com/org/other-rules.git

# 특정 도구만 변환
npx heymark -t cursor,claude

# 미리보기 (파일 생성 없이 변환 결과만 확인)
npx heymark --preview

# 이전에 생성된 도구별 파일 삭제
npx heymark --clean

# 도움말
npx heymark --help
```

## Getting Started

### Writing Rules

규칙 소스 디렉터리(외부 레포)에 마크다운 파일 작성. YAML frontmatter로 메타데이터 정의:

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
# 규칙 소스 설정 (최초 1회, GitHub 저장소 URL)
node scripts/sync.js init https://github.com/org/my-rules.git

# 모든 도구 형식으로 변환
node scripts/sync.js

# 이번에만 다른 저장소 사용
node scripts/sync.js --source https://github.com/org/other-rules.git

# 특정 도구만 변환
node scripts/sync.js -t cursor,claude

# 미리보기 (파일 생성 없이 확인)
node scripts/sync.js --preview

# 생성된 파일 삭제
node scripts/sync.js --clean
```

## Tool Support

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

### Supported Tools

| Tool           | Output Format                            | Key Features                                             |
| :------------- | :--------------------------------------- | :------------------------------------------------------- |
| Cursor         | `.cursor/rules/*.mdc`                    | YAML frontmatter (`description`, `globs`, `alwaysApply`) |
| Claude Code    | `.claude/skills/*/SKILL.md`              | 스킬 디렉토리 구조 + YAML frontmatter                    |
| GitHub Copilot | `.github/instructions/*.instructions.md` | `applyTo` 다중 패턴 매핑                                 |
| OpenAI Codex   | `.agents/skills/*/SKILL.md`              | 스킬 디렉토리 구조 + YAML frontmatter                    |
| Antigravity    | `.agent/skills/*/SKILL.md`               | 스킬 디렉토리 구조 + YAML frontmatter                    |
