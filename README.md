# Rule Book

AI 코딩 도구(Cursor, Claude Code, GitHub Copilot 등)의 컨벤션을 중앙에서 관리하고, 각 도구에 맞는 형식으로 자동 변환하는 시스템.

---

## Overview

프로젝트마다 AI 도구별 규칙 파일을 따로 작성하면 관리가 파편화된다.
이 저장소는 **단일 진실 공급원(Single Source of Truth)** 원칙에 따라,
`rules/*.md` 파일 하나만 관리하면 8종의 AI 도구 형식으로 자동 변환해준다.

### Supported Tools

| Tool           | Output                                   | Format                                             |
| :------------- | :--------------------------------------- | :------------------------------------------------- |
| Cursor         | `.cursor/rules/*.mdc`                    | YAML frontmatter (description, globs, alwaysApply) |
| Claude Code    | `.claude/skills/*/SKILL.md`              | YAML frontmatter (name, description)               |
| GitHub Copilot | `.github/instructions/*.instructions.md` | applyTo glob 매칭                                  |
| OpenAI Codex   | `AGENTS.md`                              | Merged markdown (Agent Rules v1.0)                 |

---

## Structure

```
rule-book/
├── rules/                   # 컨벤션 원본 (Single Source of Truth)
│   ├── rule01.md
│   └── rule02.md
├── scripts/
│   ├── sync.js              # 메인 실행 스크립트
│   ├── lib/
│   │   └── parser.js        # 공유 유틸리티
│   └── tools/               # 도구별 변환 모듈 (자동 탐색)
│       ├── cursor.js
│       ├── claude.js
│       ├── copilot.js
│       ├── codex.js
└── package.json
```

`scripts/tools/` 디렉토리에 파일을 추가하면 `sync.js`가 자동으로 인식한다.
별도 등록 코드 없이 모듈 파일 하나만 작성하면 새 도구를 지원할 수 있다.

---

## Usage

### Quick Start

```bash
# 모든 도구에 대해 생성
node scripts/sync.js

# npm script
npm run sync
```

### Options

```bash
node scripts/sync.js [options]

--tools, -t <list>   변환할 도구를 콤마로 구분 (기본값: 전체)
--clean, -c          기존 생성 파일을 삭제한 후 재생성
--dry-run, -d        파일을 쓰지 않고 미리보기만 수행
--help, -h           도움말 표시
```

### Examples

```bash
# Cursor + Claude만 생성
node scripts/sync.js -t cursor,claude

# Copilot만 정리 후 재생성
node scripts/sync.js -t copilot --clean

# 전체 미리보기
node scripts/sync.js --dry-run
```

---

## Writing Rules

`rules/` 디렉토리에 마크다운 파일을 작성한다.
YAML frontmatter에 메타데이터를 정의하면 도구별 변환 시 활용된다.

```markdown
---
description: "AI assistant behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Rule Title

Rule content...
```

### Frontmatter Fields

| Field         | Description                                        | Used By         |
| :------------ | :------------------------------------------------- | :-------------- |
| `description` | 규칙 설명. AI가 자동 로딩 판단 시 참조             | Cursor, Claude  |
| `globs`       | 파일 패턴 (콤마 구분). 해당 파일 작업 시 자동 적용 | Cursor, Copilot |
| `alwaysApply` | `true`이면 항상 로드, `false`이면 조건부 로드      | Cursor          |
| `name`        | 규칙 식별자 (미지정 시 파일명 사용)                | Claude          |

frontmatter가 없는 파일도 정상 처리된다.
파일명에서 이름을 추출하고, 기본값이 적용된다.

---

## Project Integration

이 저장소를 개별 프로젝트에서 Git Submodule로 연결하여 사용한다.

### Setup (1회)

```bash
cd my-project
git submodule add <this-repo-url> .conventions
```

### Sync

```bash
node .conventions/scripts/sync.js
```

스크립트는 자신의 위치를 기준으로 `rules/` 경로를 자동 계산하고,
`process.cwd()`(프로젝트 루트)에 도구별 파일을 생성한다.

### Update

중앙 저장소에서 규칙을 수정한 후, 개별 프로젝트에서 반영한다.

```bash
git submodule update --remote
node .conventions/scripts/sync.js
```

---

## Adding a New Tool

`scripts/tools/` 에 모듈 파일을 추가한다.
`sync.js`가 디렉토리를 자동 스캔하므로 등록 코드는 필요 없다.

모듈이 export해야 하는 인터페이스:

```javascript
module.exports = {
    name: "Tool Name",
    output: "output/path/pattern",
    generate(rules, projectRoot) {
        /* 파일 생성 */ return rules.length;
    },
    clean(ruleNames, projectRoot) {
        /* 파일 삭제 */ return [
            /* 삭제된 경로 */
        ];
    },
};
```

---

## Gitignore

개별 프로젝트에서 자동 생성된 파일의 커밋 여부를 팀 정책에 따라 결정한다.

```gitignore
# 로컬에서만 생성해 쓰는 경우
.cursor/rules/
.claude/skills/
.github/instructions/
AGENTS.md
```

팀원 간 동일한 환경 보장이 필요하면 생성된 파일을 커밋에 포함하는 것도 유효한 방법이다.
