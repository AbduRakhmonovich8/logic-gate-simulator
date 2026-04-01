import { NodeType } from './defs';

export interface NodeData {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  data: any; // val, hz, etc.
}

export interface WireData {
  id: string;
  fn: string;
  fp: number;
  tn: string;
  tp: number;
}

export interface WiringState {
  id: string;
  dir: 'i' | 'o';
  port: number;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: {
    kind: 'node' | 'wire' | 'handle';
    id: string;
    dir?: 'i' | 'o';
    port?: number;
  } | null;
}

export const generateId = () => 'x' + Math.random().toString(36).substring(2, 9);

export const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = Math.max(Math.abs(x2 - x1) * 0.55, 50);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
};
