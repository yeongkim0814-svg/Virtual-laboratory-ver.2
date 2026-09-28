// 터치 UI(DOM)와 PlayerController(R3F 프레임 루프) 사이의 공유 입력 상태.
// React state로 넘기면 매 터치 이동마다 리렌더가 일어나므로, 프레임 루프가 직접 읽는 mutable 객체로 둔다.
export const touchInput = {
  moveX: 0, // 조이스틱 -1(좌)~1(우)
  moveY: 0, // 조이스틱 -1(위=전진)~1(아래=후진)
  lookDX: 0, // 이전 프레임 이후 누적된 시점 드래그 px
  lookDY: 0,
};

export const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
