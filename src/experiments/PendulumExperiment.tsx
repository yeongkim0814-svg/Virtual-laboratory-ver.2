import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useControls, button } from 'leva';
import * as THREE from 'three';
import { stepPendulum, smallAnglePeriod, pendulumEnergy, type PendulumParams } from '../core-physics/pendulum';
import type { State } from '../core-physics/integrator';

const PIVOT: [number, number, number] = [4, 2.3, 1];
const DEG = Math.PI / 180;

export function PendulumExperiment() {
  const rodRef = useRef<THREE.Group>(null);
  const [energy, setEnergy] = useState(0);
  const [period, setPeriod] = useState(0);
  const lastCrossing = useRef<{ t: number; sign: number } | null>(null);
  const clock = useRef(0);

  const { length, gravity, damping, initialAngleDeg } = useControls('진자 실험 (Pendulum)', {
    length: { value: 1.2, min: 0.3, max: 2.5, step: 0.05, label: '줄 길이 L (m)' },
    gravity: { value: 9.8, min: 1, max: 25, step: 0.1, label: '중력가속도 g' },
    damping: { value: 0, min: 0, max: 1, step: 0.01, label: '감쇠 b' },
    initialAngleDeg: { value: 30, min: 1, max: 170, step: 1, label: '초기 각도 (deg)' },
    reset: button((get) => {
      state.current = [get('진자 실험 (Pendulum).initialAngleDeg') * DEG, 0];
      clock.current = 0;
      lastCrossing.current = null;
    }),
  });

  const params: PendulumParams = { length, gravity, damping };
  const state = useRef<State>([initialAngleDeg * DEG, 0]);

  useFrame((_, dt) => {
    const clamped = Math.min(dt, 1 / 30);
    const prevOmega = state.current[1];
    state.current = stepPendulum(params, state.current, clamped, clock.current);
    clock.current += clamped;

    // omega 부호가 바뀌는(진자가 최저점을 지나는) 순간 사이 간격의 2배 ≈ 실측 주기.
    // 이걸로 소각도 근사 T=2π√(L/g)와 실제 값이 얼마나 벌어지는지 보여준다.
    const omega = state.current[1];
    if (prevOmega < 0 && omega >= 0) {
      if (lastCrossing.current) {
        setPeriod(clock.current - lastCrossing.current.t);
      }
      lastCrossing.current = { t: clock.current, sign: 1 };
    }

    setEnergy(pendulumEnergy(params, state.current));

    if (rodRef.current) {
      rodRef.current.rotation.z = state.current[0];
    }
  });

  const theoreticalPeriod = smallAnglePeriod(params);

  return (
    <group position={PIVOT}>
      <mesh>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <group ref={rodRef}>
        <mesh position={[0, -length / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, length, 8]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, -length, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
      </group>

      <Html position={[0.6, 0.2, 0]} distanceFactor={6}>
        <div style={{ background: 'rgba(20,20,24,0.85)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 12, width: 190, fontFamily: 'monospace', pointerEvents: 'none' }}>
          <div>θ₀ = {initialAngleDeg}°, L = {length.toFixed(2)}m</div>
          <div>E = {energy.toFixed(3)} J/kg</div>
          <div>T(소각도 근사) = {theoreticalPeriod.toFixed(3)}s</div>
          <div>T(실측) = {period > 0 ? period.toFixed(3) + 's' : '측정 중…'}</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>
            θ₀가 커질수록 두 값의 차이가 커짐 (비선형 효과)
          </div>
        </div>
      </Html>
    </group>
  );
}
