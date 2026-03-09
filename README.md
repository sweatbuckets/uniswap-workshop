# Uniswap Workshop

Uniswap V3 워크숍용 스마트 컨트랙트와 Next.js 데모 앱을 함께 담은 저장소입니다.

## 구성

- `src/`: Solidity 컨트랙트
- `script/`: Foundry 배포 스크립트
- `test/`: Foundry 테스트
- `week4-demo/`: 지갑 연결, 스왑, 유동성 추가를 확인하는 프론트엔드 데모

## 배포된 컨트랙트 주소

이번 워크숍에서 배포된 컨트랙트 주소는 아래와 같습니다.

- `BAY`: `0xE10090140592694276BcaBe3434d32847027bd69`
- `STAR`: `0x47F8d8d6E9001D4052C04c78D07fe939F050ACEb`
- `LP`: `0xd6e758bED11A61BcA082ACFd31764a1F4765DFd2`

## 스마트 컨트랙트 실행

빌드:

```bash
forge build
```

테스트:

```bash
forge test
```

포맷:

```bash
forge fmt
```

## 프론트엔드 실행

프론트엔드 앱은 `week4-demo` 디렉토리에서 실행합니다.

```bash
cd week4-demo
npm install
npm run dev
```

## 참고

- 참고 자료: `https://ahwlsqja.github.io/uniswap-workshop/`
- Foundry 설정 파일: `foundry.toml`
- 프론트엔드 Wagmi 설정: `week4-demo/src/config/wagmi.ts`
