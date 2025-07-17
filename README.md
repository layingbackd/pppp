# 작품 아카이브 시스템

작품을 체계적으로 관리하고 웹 페이지로 자동 생성하는 시스템입니다.

## 📁 프로젝트 구조

```
forSharing0717/
├── index.html              # 메인 갤러리 페이지
├── archives.html           # 아카이브 페이지
├── generateContent.js      # 콘텐츠 생성 스크립트
├── content.json           # 생성되는 작품 데이터 (자동생성)
├── package.json           # 프로젝트 설정
├── style.css              # 스타일시트
├── assets/                # 공통 에셋 파일들
│   ├── circle.svg
│   ├── LineCircles.svg
│   └── sunLogo.svg
├── profile/               # 프로필 정보
│   ├── profile.webp
│   ├── ko.txt
│   ├── en.txt
│   ├── email.txt
│   ├── instagram.txt
│   └── who.txt
└── artworks/              # 작품 폴더
    └── 순번_작품명/        # 개별 작품 폴더
        ├── 작품명.html     # 작품 상세 페이지 (자동생성)
        ├── thumbnail.png   # 썸네일 이미지
        ├── 순번_이름.txt   # 순번별 텍스트 설명
        ├── 순번_이름.jpg   # 순번별 미디어 파일
        └── link_순번_이름.txt # 링크 파일
```

## 🚀 빠른 시작

### 1. 콘텐츠 생성
```bash
node generateContent.js
```

### 2. 로컬 서버 실행
```bash
npm run serve
```
브라우저에서 `http://localhost:8080` 접속

## 📋 작품 추가 방법

### 1. 새 작품 폴더 생성
`artworks/` 폴더에 새 폴더를 생성합니다.
- 폴더명 형식: `순번_작품명` (예: `5_새로운작품`)

### 2. 필수 파일 추가

#### 썸네일 이미지
- 파일명: `thumbnail.png` 또는 `thumnail.png`
- 권장 크기: 300x300px

#### 콘텐츠 파일 (순번별 정렬)
- **텍스트**: `순번_설명.txt` (예: `1_작품소개.txt`, `3_제작과정.txt`)
- **이미지**: `순번_이름.jpg` (예: `2_메인이미지.jpg`, `4_상세컷.png`)
- **비디오**: `순번_이름.mp4` (예: `5_제작영상.mp4`)

#### 링크 파일 (선택사항)
- 형식: `link_순번_이름.txt` (예: `link_1_인스타그램.txt`)
- 파일 내용: URL 주소만 입력

### 3. 지원 파일 형식

**이미지**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.tiff`, `.svg`
**비디오**: `.mp4`, `.mov`, `.webm`, `.avi`, `.mkv`
**텍스트**: `.txt`

## 🎨 작품 폴더 예시

```
artworks/4_together! ,2025 copy 4/
├── together! ,2025 copy 4.html  # 자동 생성됨
├── thumbnail.png                # 썸네일
├── 1_good.png                  # 첫 번째 이미지
├── 2_description.txt           # 두 번째 설명 텍스트
├── 3_description.txt           # 세 번째 설명 텍스트
├── link_1_출처 자료 copy.txt   # 첫 번째 링크
└── link_2_인스타그램.txt       # 두 번째 링크
```

**텍스트 파일 예시** (`2_description.txt`):
```
이것은 작품에 대한 설명입니다.
여러 줄로 작성할 수 있으며,
작가의 의도와 제작 과정을 자유롭게 서술할 수 있습니다.

제작일: 2025년 1월
재료: 디지털 미디어
```

**링크 파일 예시** (`link_1_인스타그램.txt`):
```
https://www.instagram.com/movingweb/
```

## 🔧 자동 생성되는 파일들

### content.json
모든 작품 정보가 JSON 형태로 저장됩니다:
```json
[
  {
    "title": "together! ,2025 copy 4",
    "folder": "4_together! ,2025 copy 4",
    "thumbnail": "thumbnail.png",
    "media": ["1_good.png"],
    "orderedContent": [
      {
        "type": "media",
        "content": "1_good.png"
      },
      {
        "type": "text", 
        "content": "작품 설명 내용..."
      }
    ],
    "links": [
      {
        "title": "출처 자료 copy",
        "url": "https://example.com"
      }
    ]
  }
]
```

### 개별 작품 HTML 페이지
각 작품 폴더에 자동으로 생성되며 다음을 포함합니다:
- 작품 제목
- 순번별로 정렬된 텍스트와 미디어
- 관련 링크들
- 반응형 디자인

## 📝 사용법
  로컬에서는 이렇게 하시면 됩니당 ! 
1. **새 작품 추가**: 위의 방법에 따라 작품 폴더와 파일들 생성
2. **콘텐츠 생성**: `node generateContent.js` 실행
3. **확인**: `npm run serve`로 로컬 서버 실행 후 확인

## ⚡ GitHub Actions 자동화할땐 아래로..

GitHub에서 자동으로 콘텐츠를 생성하려면 `.github/workflows/generate-content.yml` 파일을 생성하세요:

```yaml
name: Generate Content

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci || npm install
      
      - name: Generate content
        run: node generateContent.js
      
      - name: Commit and push changes
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add .
          git commit -m "자동 콘텐츠 생성" || echo "No changes to commit"
          git push
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 🎯 주의사항

1. **파일명**: 특수문자 사용 시 URL 인코딩 문제가 발생할 수 있음
2. **이미지 최적화**: 썸네일은 적절한 크기로 최적화 권장
3. **비디오 호환성**: `.mp4` 형식이 가장 좋은 브라우저 호환성을 제공
4. **순번 규칙**: 숫자 순번이 표시 순서를 결정하므로 일관성 있게 사용
5. **한글 파일명**: 웹 호환성을 위해 영문 사용 권장

## 🌐 배포

- **로컬**: `npm run serve`로 테스트
- **GitHub Pages**: repository 설정에서 Pages 활성화
- **기타 호스팅**: 정적 파일 호스팅 서비스 사용 가능

---

**개발**: 김연우 MovingWeb : https://www.instagram.com/movingweb/
**업데이트**: 2025년 7월
