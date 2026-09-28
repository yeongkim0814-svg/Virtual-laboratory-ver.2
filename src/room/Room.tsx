import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { walls, furniture, WALL_HEIGHT } from './roomLayout';

// drei의 <Text>(troika)는 폰트 fallback 데이터를 CDN에서 fetch하는데,
// 그 요청이 막히면(오프라인/사내망/광고차단) 예외가 앱 전체를 리로드시킨다.
// 라벨은 장식 요소일 뿐이므로 그 네트워크 의존성 없는 <Html> DOM 오버레이로 대체한다.
function Label({ children }: { children: string }) {
  return (
    <Html center distanceFactor={8} occlude>
      <div
        style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 13,
          color: '#1a1d24',
          background: 'rgba(255,255,255,0.75)',
          padding: '1px 6px',
          borderRadius: 3,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </Html>
  );
}

export function Room() {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[6, 0, -3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 14]} />
          <meshStandardMaterial color="#c7ccd4" />
        </mesh>
      </RigidBody>

      {walls.map((w, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh position={w.center} castShadow receiveShadow>
            <boxGeometry args={w.size} />
            <meshStandardMaterial color="#e7e9ee" />
          </mesh>
        </RigidBody>
      ))}

      {furniture.map((f, i) => (
        <group key={i}>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={f.center} castShadow receiveShadow>
              <boxGeometry args={f.size} />
              <meshStandardMaterial color={f.color} />
            </mesh>
          </RigidBody>
          <group position={[f.center[0], f.center[1] + f.size[1] / 2 + 0.15, f.center[2]]}>
            <Label>{f.label}</Label>
          </group>
        </group>
      ))}

      <group position={[0.05, WALL_HEIGHT / 2, 2]}>
        <Label>Blackboard</Label>
      </group>

      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 10, 4]} intensity={0.8} castShadow />
    </>
  );
}
