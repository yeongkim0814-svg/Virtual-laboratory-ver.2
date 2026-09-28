// 첨부 스케치를 좌표로 옮긴 배치 데이터. 렌더링(Room.tsx)과 분리해두면
// 나중에 방 형태를 바꿀 때 좌표 표만 수정하면 된다.
// 좌표계: x=동서, z=남북(+z가 스케치의 아래쪽/남쪽), y=높이. 단위 m.

export interface WallSegment {
  center: [number, number, number];
  size: [number, number, number]; // width(x), height(y), depth(z)
}

export interface Furniture {
  label: string;
  center: [number, number, number];
  size: [number, number, number];
  color: string;
}

export const WALL_HEIGHT = 3;
const WT = 0.2; // 벽 두께

// 메인 실험실: x 0~12, z 0~6 (z=0이 스케치 상단 "Experimental table" 벽)
// 부속실(Large experimental items 등): x 9~16, z -6~0, 문(door)으로 연결
export const walls: WallSegment[] = [
  // 메인 실험실 외벽 (북쪽 벽은 부속실 문 부분만 비움)
  { center: [4.6, WALL_HEIGHT / 2, 0], size: [9.2, WALL_HEIGHT, WT] }, // 북쪽 좌측
  { center: [11.5, WALL_HEIGHT / 2, 0], size: [1, WALL_HEIGHT, WT] }, // 북쪽 우측(문 옆)
  { center: [0, WALL_HEIGHT / 2, 3], size: [WT, WALL_HEIGHT, 6] }, // 서쪽 벽 (블랙보드)
  { center: [6, WALL_HEIGHT / 2, 6], size: [12, WALL_HEIGHT, WT] }, // 남쪽 벽
  { center: [12, WALL_HEIGHT / 2, 3], size: [WT, WALL_HEIGHT, 6] }, // 동쪽 벽

  // 부속실
  { center: [12.5, WALL_HEIGHT / 2, -6], size: [7, WALL_HEIGHT, WT] }, // 부속실 북쪽 벽
  { center: [9, WALL_HEIGHT / 2, -4], size: [WT, WALL_HEIGHT, 3.8] }, // 부속실 서쪽 벽 (문 위)
  { center: [16, WALL_HEIGHT / 2, -3], size: [WT, WALL_HEIGHT, 6] }, // 부속실 동쪽 벽
];

export const furniture: Furniture[] = [
  // 메인 실험실 — 북쪽 벽을 따라 실험대 두 개
  { label: 'Experimental table', center: [4, 0.45, 1], size: [1.4, 0.9, 1.6], color: '#8a8f98' },
  { label: 'Experimental table', center: [6.5, 0.45, 1], size: [1.4, 0.9, 1.6], color: '#8a8f98' },

  // 서쪽 벽 옆 책상 + 장비대
  { label: 'table', center: [1.1, 0.45, 1], size: [1, 0.9, 1.5], color: '#9c8365' },
  { label: 'equipment', center: [1.1, 0.4, 2.4], size: [1, 0.8, 0.7], color: '#4a4f5a' },

  // 남서쪽 스탠딩 책상 + 노트북
  { label: 'standing table', center: [0.8, 0.55, 5.3], size: [0.9, 1.1, 0.6], color: '#9c8365' },

  // 남쪽 벽 긴 보관장 (storage of experimental items)
  { label: 'storage', center: [6, 0.4, 5.6], size: [8, 0.8, 0.5], color: '#6b7280' },

  // 부속실
  { label: 'table', center: [11, 0.45, -5.3], size: [3, 0.9, 1], color: '#8a8f98' },
  { label: 'storage', center: [15, 0.45, -5.3], size: [1.6, 0.9, 1.4], color: '#6b7280' },
  { label: 'large experimental items', center: [15.2, 0.6, -3], size: [1, 1.2, 3.6], color: '#3f4552' },
  { label: 'waste reagent', center: [10, 0.35, -0.6], size: [1, 0.7, 0.6], color: '#5c6470' },
];

export const doorGap = { center: [10.25, WALL_HEIGHT / 2, 0] as [number, number, number], size: [1.5, WALL_HEIGHT, WT] };

export const spawnPoint: [number, number, number] = [4, 1.7, 4.5];
