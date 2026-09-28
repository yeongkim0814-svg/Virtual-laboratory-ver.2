import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { spawnPoint } from './roomLayout';

const MOVE_SPEED = 4; // m/s
const EYE_HEIGHT = 1.6;

/** Minecraft식 1인칭: 시점 회전은 PointerLockControls, 이동은 Rapier RigidBody(캡슐)의
 * 속도를 직접 설정해 벽/가구와의 충돌을 물리 엔진이 처리하게 한다.
 * 이 컨트롤러는 "게임 물리"만 담당하며 실험 물리 계산과는 무관하다. */
export function PlayerController() {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame(() => {
    const rb = body.current;
    if (!rb) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();

    const move = new THREE.Vector3();
    if (keys.current['KeyW']) move.add(forward);
    if (keys.current['KeyS']) move.sub(forward);
    if (keys.current['KeyD']) move.add(right);
    if (keys.current['KeyA']) move.sub(right);
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(MOVE_SPEED);

    const vel = rb.linvel();
    rb.setLinvel({ x: move.x, y: vel.y, z: move.z }, true);

    const t = rb.translation();
    camera.position.set(t.x, t.y + EYE_HEIGHT * 0.5, t.z);
  });

  return (
    <>
      <PointerLockControls />
      <RigidBody
        ref={body}
        position={spawnPoint}
        enabledRotations={[false, false, false]}
        mass={1}
        linearDamping={0.5}
        colliders={false}
      >
        <CapsuleCollider args={[EYE_HEIGHT / 2 - 0.3, 0.3]} />
      </RigidBody>
    </>
  );
}
