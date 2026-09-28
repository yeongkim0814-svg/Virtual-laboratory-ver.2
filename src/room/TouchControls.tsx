import { useRef, useState } from 'react';
import { touchInput } from './touchInput';

const JOYSTICK_RADIUS = 60;

interface Stick {
  id: number;
  originX: number;
  originY: number;
  dx: number;
  dy: number;
}

/** 화면 왼쪽 절반: 손가락을 댄 자리에 생기는 플로팅 조이스틱(이동).
 * 오른쪽 절반: 드래그로 시점 회전. pointerId로 손가락을 구분해 두 손 동시 조작이 가능하다. */
export function TouchControls() {
  const [stick, setStick] = useState<Stick | null>(null);
  const lookPointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const stickId = useRef<number | null>(null);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (e.clientX < window.innerWidth / 2 && stickId.current === null) {
      stickId.current = e.pointerId;
      setStick({ id: e.pointerId, originX: e.clientX, originY: e.clientY, dx: 0, dy: 0 });
    } else if (!lookPointer.current) {
      lookPointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === stickId.current && stick) {
      let dx = e.clientX - stick.originX;
      let dy = e.clientY - stick.originY;
      const len = Math.hypot(dx, dy);
      if (len > JOYSTICK_RADIUS) {
        dx *= JOYSTICK_RADIUS / len;
        dy *= JOYSTICK_RADIUS / len;
      }
      touchInput.moveX = dx / JOYSTICK_RADIUS;
      touchInput.moveY = dy / JOYSTICK_RADIUS;
      setStick({ ...stick, dx, dy });
    } else if (lookPointer.current && e.pointerId === lookPointer.current.id) {
      touchInput.lookDX += e.clientX - lookPointer.current.x;
      touchInput.lookDY += e.clientY - lookPointer.current.y;
      lookPointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === stickId.current) {
      stickId.current = null;
      touchInput.moveX = 0;
      touchInput.moveY = 0;
      setStick(null);
    } else if (lookPointer.current?.id === e.pointerId) {
      lookPointer.current = null;
    }
  };

  return (
    <div
      data-testid="touch-layer"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
    >
      {stick && (
        <div
          style={{
            position: 'absolute',
            left: stick.originX - JOYSTICK_RADIUS,
            top: stick.originY - JOYSTICK_RADIUS,
            width: JOYSTICK_RADIUS * 2,
            height: JOYSTICK_RADIUS * 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.4)',
            pointerEvents: 'none',
          }}
        >
          <div
            data-testid="joystick-knob"
            style={{
              position: 'absolute',
              left: JOYSTICK_RADIUS - 24 + stick.dx,
              top: JOYSTICK_RADIUS - 24 + stick.dy,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
            }}
          />
        </div>
      )}
      {!stick && (
        <div
          style={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            pointerEvents: 'none',
          }}
        >
          왼쪽: 이동 · 오른쪽: 시점
        </div>
      )}
    </div>
  );
}
