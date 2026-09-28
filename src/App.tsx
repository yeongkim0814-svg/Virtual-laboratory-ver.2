import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Room } from './room/Room';
import { PlayerController } from './room/PlayerController';
import { PendulumExperiment } from './experiments/PendulumExperiment';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 100 }}>
        <Physics gravity={[0, -9.8, 0]}>
          <Room />
          <PlayerController />
          <PendulumExperiment />
        </Physics>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
        }}
      />

      {!started && (
        <div
          onClick={() => setStarted(true)}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10,10,14,0.75)',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 22 }}>클릭해서 실험실 입장</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>WASD 이동 · 마우스 시점 · ESC로 잠금 해제</div>
        </div>
      )}
    </div>
  );
}

export default App;
