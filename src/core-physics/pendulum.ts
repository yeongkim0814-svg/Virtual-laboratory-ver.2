import { rk4Step, type State } from './integrator';

export interface PendulumParams {
  length: number; // m
  gravity: number; // m/s^2
  damping: number; // 1/s, 공기저항 근사 (0이면 에너지 완전 보존)
}

/** 상태 y = [theta, omega]. 소각도 근사(sin θ ≈ θ) 없이 실제 비선형 방정식을 적분한다.
 * θ'' = -(g/L) sin θ - b θ'
 * 진폭이 커질수록(대략 20°를 넘으면) 단순조화운동 근사 T=2π√(L/g)에서 벗어나기 시작하고,
 * 그 이탈량을 실제 시뮬레이션 주기와 비교해 보여주는 것이 이 실험의 교육적 핵심이다. */
export function pendulumDerivative(p: PendulumParams): (t: number, y: State) => State {
  return (_t, y) => {
    const [theta, omega] = y;
    const alpha = -(p.gravity / p.length) * Math.sin(theta) - p.damping * omega;
    return [omega, alpha];
  };
}

export function stepPendulum(p: PendulumParams, y: State, dt: number, t = 0): State {
  return rk4Step(pendulumDerivative(p), t, y, dt);
}

/** 소각도 근사 주기 (검증용 기준선) */
export function smallAnglePeriod(p: PendulumParams): number {
  return 2 * Math.PI * Math.sqrt(p.length / p.gravity);
}

/** 질량 m=1로 정규화한 역학적 에너지. damping=0일 때 이 값이 일정하게 유지되는지가
 * 적분기(RK4)와 시뮬레이션이 물리적으로 올바른지의 검증 지표가 된다. */
export function pendulumEnergy(p: PendulumParams, y: State): number {
  const [theta, omega] = y;
  const kinetic = 0.5 * p.length * p.length * omega * omega;
  const potential = p.gravity * p.length * (1 - Math.cos(theta));
  return kinetic + potential;
}
