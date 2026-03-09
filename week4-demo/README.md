# Week4 Demo

`week4-demo`는 Uniswap Workshop용 Next.js 프론트엔드 데모 앱입니다.

현재 포함된 기능:

- Wagmi 기반 지갑 연결
- 토큰 스왑 UI
- 유동성 추가 UI

## 실행 방법

개발 서버 실행:

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속하면 됩니다.

## 주요 파일

- `src/app/page.tsx`: 메인 화면
- `src/app/layout.tsx`: App Router 레이아웃
- `src/config/wagmi.ts`: Wagmi 설정
- `src/components/ConnectWallet.tsx`: 지갑 연결 버튼
- `src/components/Swap.tsx`: 스왑 UI
- `src/components/AddLiquidity.tsx`: 유동성 추가 UI

## 연결된 컨트랙트

- `BAY`: `0xE10090140592694276BcaBe3434d32847027bd69`
- `STAR`: `0x47F8d8d6E9001D4052C04c78D07fe939F050ACEb`
- `LP`: `0xd6e758bED11A61BcA082ACFd31764a1F4765DFd2`

## 참고

- 참고 자료: `https://ahwlsqja.github.io/uniswap-workshop/`
- 상위 저장소 README: `../README.md`
