# 2026 Web Design · Web Publisher · Front-end Portfolio Template

## 구성
- 1440px Desktop / Mobile Responsive
- Hero + background video
- About + Skills Bento UI
- Design / Web Publish / Team Project
- 카드 기본 3개 노출 + 4개 이상 Swiper 탐색
- 카드 클릭 → 프로젝트 상세 모달
- 모달 → 사이트 바로가기 / 작업일지 바로가기
- Scroll Reveal
- Mobile Navigation
- prefers-reduced-motion 대응
- Semantic HTML / focus-visible / skip link

## 시작 방법
1. 이 폴더를 VS Code로 엽니다.
2. Live Server로 `index.html`을 실행합니다.
3. `assets/video/hero.mp4`에 Hero 영상을 넣습니다.
4. `assets/images/`의 이미지를 본인 프로젝트 썸네일로 교체합니다.
5. 각 프로젝트 카드의 `data-site`, `data-log`에 실제 URL을 입력합니다.
6. 이름, 이메일, 소개 문구를 본인 정보로 수정합니다.

## 카드 추가 방법
`index.html`에서 `.project-card` 한 덩어리를 복사한 뒤,
- data-title
- data-category
- data-year
- data-image
- data-description
- data-site
- data-log
를 수정하면 됩니다.

Swiper는 카드가 4개 이상이어도 자동으로 넘길 수 있도록 구성되어 있습니다.

## 폴더 구조
portfolio-template/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ main.js
└─ assets/
   ├─ video/
   │  └─ hero.mp4
   └─ images/

## 디자인 방향
2025~2026 포트폴리오에서 관찰되는
- 대형 타이포그래피
- Bento / modular card layout
- subtle micro-interaction
- motion / scroll reveal
- 강한 첫 화면의 visual hook
- responsive-first
- 접근성 및 성능 고려
를 신입 포트폴리오에 과하지 않게 적용했습니다.

실제 채용용 포트폴리오는 '트렌디함'보다 프로젝트의 문제 해결 과정,
본인의 역할, 실제 배포 URL, 반응형 구현, 협업 방식이 보이도록 콘텐츠를 채우는 것이 중요합니다.
