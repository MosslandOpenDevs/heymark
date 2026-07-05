# Heymark

> **상태 — 아카이브됨 (2026-07).** Heymark는 더 이상 활발히 개발되지 않으며, 참고용 구현으로 보존됩니다. 종료(wind-down) 배경, 2026년 중반 생태계 분석, 마지막 패치 내역, 알려진 한계는 [ARCHIVE.md](ARCHIVE.md)를 참고하세요.

Heymark는 하나의 Skill 저장소를 여러 AI Tool 형식으로 변환하고 동기화하는 허브 시스템입니다.

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Tools](#supported-tools)
4. [How to Use](#how-to-use)
5. [How to Dev](#how-to-dev)
6. [Future Directions](#future-directions)

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
| Antigravity | `antigravity` | `.agents/skills/*/SKILL.md`              |
| OpenClaw    | `openclaw`    | `~/.openclaw/skills/*/SKILL.md`          |

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
- Core: File system API, 자체 Markdown frontmatter 파서 (단순 `key: value` 스칼라만 지원, 완전한 YAML 아님)

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

## Future Directions

v2.1.1 패치로 참고용 구현은 올바르게 정리됐지만, 그렇다고 다시 쓸모가 생긴 것은 아닙니다. 전제 자체에 새로운 진입점(wedge)이 필요합니다. 이 프로젝트를 이어받는다면 가장 먼저 분명히 할 것은 _하지 말아야 할 일_입니다. **도구 개수로 경쟁하지 마세요.** 그 축은 이미 `rulesync`(40개 이상)와 `Ruler`(약 31개)가 차지하고 있고, `SKILL.md`와 `AGENTS.md`가 개방형 표준이 된 지금 일곱 번째, 여덟 번째 대상을 추가해도 얻는 것은 거의 없습니다.

남는 것은 근본적으로 다른 두 방향입니다. 로드맵이 아니라 갈림길입니다 — 하나만 고르세요.

- **A — 표준 우선 변환기.** `AGENTS.md` + 이식성 있는 `SKILL.md`를 기준선으로 삼고, 진짜 예외인 Cursor `.mdc`, Copilot `.instructions.md`, 그리고 경로 재배치(path re-rooting)만 변환합니다. 프로토타이핑은 저렴하지만 상한선이 낮습니다.
- **B — 배포 / 거버넌스.** `link <repo>` 아이디어를 밀어붙입니다. 한 팀이 관리형 skill 저장소 하나를 게시하고, 모든 프로젝트와 도구가 여기서 가져옵니다 — 버전 관리, 출처(provenance), 드리프트 감지와 함께. 표면적은 넓지만 수요는 검증되지 않았습니다.

A는 형식 작업이고 B는 워크플로 작업입니다. 둘은 깔끔하게 합쳐지지 않습니다.

어느 쪽이든 사전 준비는 동일합니다. 도구 플러그인 계약(`src/tools/<name>/index.js`) 덕분에 대상을 추가하거나 빼기가 쉬우니 여기서, 다음 순서로 시작하세요.

1. 테스트 + CI 복원 — `CONTRIBUTING.md`가 요구하며, v2.1.1의 버그는 모두 결정론적이었습니다.
2. `AGENTS.md` 대상 추가 — Heymark에 여전히 빠진 표준 기준 파일입니다.
3. 실제 YAML 프런트매터 파서 작성 (현재 파서는 단일 줄 `key: value`만 처리합니다).
4. OpenClaw를 다른 대상과 일관되게 맞추기 — 선택적으로 `status` / `validate` / `--json` 복원.

단일 진실 공급원(single source of truth)이라는 직관은 옳았습니다. 이긴 형태가 작은 변환기일지 배포 계층일지는 열린 질문이며 — 열린 초대이기도 합니다. 전체 생태계 분석과 어느 쪽도 그럴 가치가 없을 수 있다는 솔직한 판단은 [ARCHIVE.md](ARCHIVE.md) §5를 참고하세요.
