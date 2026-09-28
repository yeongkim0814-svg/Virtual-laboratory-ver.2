// 렌더링 엔진(three.js/Rapier)과 완전히 분리된 수치적분 코어.
// 실험 물리(진자, 충돌 등)는 이 모듈만 사용하고, Rapier는 "플레이어 이동/방 충돌"에만 쓴다.
// 왜 분리하는가: 게임 물리 엔진은 안정성을 위해 에너지 보존을 희생하는 근사를 쓰므로
// 교육적으로 정확한 운동(진자 주기, 에너지 보존 검증)을 보장하지 못한다.

export type State = number[];
export type Derivative = (t: number, y: State) => State;

/** 4차 룽게-쿠타법. 오일러법 대비 국소 절단오차가 O(h^5)로 훨씬 작아
 * 진자·궤도 운동처럼 장시간 적분해도 에너지가 발산하지 않는다. */
export function rk4Step(f: Derivative, t: number, y: State, dt: number): State {
  const n = y.length;
  const add = (a: State, b: State, scale: number) =>
    a.map((v, i) => v + b[i] * scale);

  const k1 = f(t, y);
  const k2 = f(t + dt / 2, add(y, k1, dt / 2));
  const k3 = f(t + dt / 2, add(y, k2, dt / 2));
  const k4 = f(t + dt, add(y, k3, dt));

  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = y[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return out;
}

/** velocity Verlet. 심플렉틱 적분기라 RK4보다 스텝당 정확도는 낮지만
 * 장시간 평균 에너지 오차가 진동하지 않고 bounded → 궤도/스프링 장시간 시연에 유리. */
export function verletStep(
  accel: (t: number, x: State) => State,
  t: number,
  x: State,
  v: State,
  dt: number
): { x: State; v: State } {
  const a0 = accel(t, x);
  const xNext = x.map((xi, i) => xi + v[i] * dt + 0.5 * a0[i] * dt * dt);
  const a1 = accel(t + dt, xNext);
  const vNext = v.map((vi, i) => vi + 0.5 * (a0[i] + a1[i]) * dt);
  return { x: xNext, v: vNext };
}
