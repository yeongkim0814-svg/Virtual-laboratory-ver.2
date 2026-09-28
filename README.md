# Virtual Physics Lab

브라우저에서 바로 접속하는 1인칭(Minecraft식) 3D 가상 물리 실험실. 물리 법칙별 "실험" 단위로 확장한다.

## 스택

- **렌더링/1인칭 이동**: React + Three.js (`@react-three/fiber`, `@react-three/drei`)
- **방/가구 충돌**: `@react-three/rapier` (게임용 리지드바디 물리 — 플레이어 이동에만 사용)
- **실험 물리 계산**: `src/core-physics/` — Rapier와 완전히 분리된 자체 RK4/Verlet 수치적분기.
  게임 물리 엔진은 안정성을 위해 에너지 보존을 희생하는 근사이므로, 교육적으로 정확한 운동
  (진자 주기, 에너지 보존 검증 등)은 직접 적분해서 구현한다.
- **파라미터 UI**: `leva`

## 구조

```
src/
  core-physics/   # 렌더링과 무관한 순수 물리 계산 (적분기, 실험별 운동방정식)
  room/           # 방 레이아웃, 1인칭 컨트롤러, 벽/가구 렌더링+충돌
  experiments/    # 실험 장비 컴포넌트 (현재: 진자)
```

새 실험을 추가하려면 `core-physics/`에 운동방정식(RK4용 derivative 함수)을 정의하고,
`experiments/`에 그 상태를 3D로 렌더링하는 컴포넌트를 만들면 된다.

## 개발

```bash
npm install
npm run dev
```

WASD로 이동, 마우스로 시점 회전(클릭해서 포인터 잠금), ESC로 잠금 해제.
