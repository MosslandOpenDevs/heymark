---
description: "README document writing guide: structure, style, and format conventions"
globs: "README.md"
alwaysApply: false
---

# README Writing Guide

## Structure

README는 다음 순서를 따른다:

1. **Title** — 프로젝트를 대표하는 심플한 영어 이름
2. **Intro** — 1-2줄 한국어 프로젝트 소개
3. **Table of Contents** — 마크다운 테이블 형태
4. **Overview** — 프로젝트 배경과 핵심 가치 (3-5문장)
5. **Features** — 핵심 기능만 (추상적 설명 금지)
6. **Tech Stack** — 핵심 기술만 (사소한 라이브러리 제외)
7. **Getting Started** — 설치 및 실행 (최소 단계)

## Format

### Language

- 제목, 소제목: **영어**
- 본문: **한국어**
- 코드, 명령어: 영어

### Style

- 이모지 금지
- 장황한 설명 금지; 간결하고 공식적인 어조
- 바뀌기 쉬운 파일명, 변수명, 경로는 언급하지 않음
- HTML 태그 최소화

### Table of Contents

```markdown
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
```

### Features

- 실제로 **구분 가능한 대표 기능**만 나열
- 각 기능은 한 줄 설명
- 추상적 표현 금지: ~~"강력한 성능"~~, ~~"혁신적인 아키텍처"~~

### Tech Stack

- 프레임워크, 언어, 핵심 인프라만
- 유틸 라이브러리, 개발 도구 제외
- 테이블 또는 간단한 리스트

### Getting Started

- Prerequisites (필요 시만)
- 설치 명령어 (코드 블록)
- 실행 명령어 (코드 블록)

## Anti-Patterns

- 7개 이상 섹션의 장황한 README
- 뱃지, 이모지, 장식적 요소
- 추상적 기능 소개
- 자주 변하는 파일명/변수명 언급
- 불필요한 Contributing, License, Changelog 섹션
