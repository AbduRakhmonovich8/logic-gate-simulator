import React from 'react';

export type NodeType =
  | 'AND2' | 'AND3' | 'AND4'
  | 'OR2' | 'OR3' | 'OR4'
  | 'NOT' | 'NAND2' | 'NOR2' | 'XOR2' | 'XNOR2'
  | 'TOGGLE' | 'BUTTON' | 'CLOCK' | 'CONST0' | 'CONST1' | 'MIC'
  | 'LAMP' | 'RGB_LAMP' | 'AUDIO' | 'SEGMENT_7';

export interface NodeDef {
  label: string;
  ico: string;
  col: string;
  ni: number;
  no: number;
  fn: (v: number[], d: any, t: number, ext?: any) => number | number[];
  svg: React.ReactNode;
}

export const DEFS: Record<NodeType, NodeDef> = {
  AND2: {
    label: 'AND', ico: '&', col: '#3d9eff', ni: 2, no: 1, fn: v => +(v.every(Boolean)),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3H14Q26 3 26 11Q26 19 14 19H4Z" fill="none" stroke="#3d9eff" strokeWidth="1.5" /><line x1="1" y1="7.5" x2="4" y2="7.5" stroke="#3d9eff" strokeWidth="1.5" /><line x1="1" y1="14.5" x2="4" y2="14.5" stroke="#3d9eff" strokeWidth="1.5" /><line x1="26" y1="11" x2="29" y2="11" stroke="#ff2d55" strokeWidth="1.5" /></svg>
  },
  AND3: {
    label: 'AND', ico: '&', col: '#3d9eff', ni: 3, no: 1, fn: v => +(v.every(Boolean)),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3H14Q26 3 26 11Q26 19 14 19H4Z" fill="none" stroke="#3d9eff" strokeWidth="1.5" /><line x1="26" y1="11" x2="29" y2="11" stroke="#ff2d55" strokeWidth="1.5" /></svg>
  },
  AND4: {
    label: 'AND', ico: '&', col: '#3d9eff', ni: 4, no: 1, fn: v => +(v.every(Boolean)),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3H14Q26 3 26 11Q26 19 14 19H4Z" fill="none" stroke="#3d9eff" strokeWidth="1.5" /><line x1="26" y1="11" x2="29" y2="11" stroke="#ff2d55" strokeWidth="1.5" /></svg>
  },
  OR2: {
    label: 'OR', ico: '≥1', col: '#9b6fff', ni: 2, no: 1, fn: v => +(v.some(Boolean)),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3Q9 3 14 3Q26 3 26 11Q26 19 14 19Q9 19 4 19Q8 11 4 3Z" fill="none" stroke="#9b6fff" strokeWidth="1.5" /><line x1="26" y1="11" x2="29" y2="11" stroke="#ff2d55" strokeWidth="1.5" /></svg>
  },
  OR3: {
    label: 'OR', ico: '≥1', col: '#9b6fff', ni: 3, no: 1, fn: v => +(v.some(Boolean)),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3Q9 3 14 3Q26 3 26 11Q26 19 14 19Q9 19 4 19Q8 11 4 3Z" fill="none" stroke="#9b6fff" strokeWidth="1.5" /><line x1="26" y1="11" x2="29" y2="11" stroke="#ff2d55" strokeWidth="1.5" /></svg>
  },
  OR4: {
    label: 'OR', ico: '≥1', col: '#9b6fff', ni: 4, no: 1, fn: v => +(v.some(Boolean)),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3Q9 3 14 3Q26 3 26 11Q26 19 14 19Q9 19 4 19Q8 11 4 3Z" fill="none" stroke="#9b6fff" strokeWidth="1.5" /><line x1="26" y1="11" x2="29" y2="11" stroke="#ff2d55" strokeWidth="1.5" /></svg>
  },
  NOT: {
    label: 'NOT', ico: '1', col: '#00e5a0', ni: 1, no: 1, fn: v => v[0] ? 0 : 1,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><polygon points="3,3 22,11 3,19" fill="none" stroke="#00e5a0" strokeWidth="1.5" /><circle cx="25" cy="11" r="3" fill="none" stroke="#00e5a0" strokeWidth="1.5" /></svg>
  },
  NAND2: {
    label: 'NAND', ico: '&', col: '#ffc846', ni: 2, no: 1, fn: v => +(!(v.every(Boolean))),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3H14Q26 3 26 11Q26 19 14 19H4Z" fill="none" stroke="#ffc846" strokeWidth="1.5" /><circle cx="28" cy="11" r="2.5" fill="none" stroke="#ffc846" strokeWidth="1.5" /></svg>
  },
  NOR2: {
    label: 'NOR', ico: '≥1', col: '#ffc846', ni: 2, no: 1, fn: v => +(!(v.some(Boolean))),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3Q9 3 14 3Q26 3 26 11Q26 19 14 19Q9 19 4 19Q8 11 4 3Z" fill="none" stroke="#ffc846" strokeWidth="1.5" /><circle cx="28" cy="11" r="2.5" fill="none" stroke="#ffc846" strokeWidth="1.5" /></svg>
  },
  XOR2: {
    label: 'XOR', ico: '=1', col: '#ff5572', ni: 2, no: 1, fn: v => +(v.filter(Boolean).length % 2 === 1),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3Q9 3 14 3Q26 3 26 11Q26 19 14 19Q9 19 4 19Q8 11 4 3Z" fill="none" stroke="#ff5572" strokeWidth="1.5" /><path d="M2 3Q6 11 2 19" fill="none" stroke="#ff5572" strokeWidth="1.5" /></svg>
  },
  XNOR2: {
    label: 'XNOR', ico: '=1', col: '#ff5572', ni: 2, no: 1, fn: v => +(v.filter(Boolean).length % 2 === 0),
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M4 3Q9 3 14 3Q26 3 26 11Q26 19 14 19Q9 19 4 19Q8 11 4 3Z" fill="none" stroke="#ff5572" strokeWidth="1.5" /><path d="M2 3Q6 11 2 19" fill="none" stroke="#ff5572" strokeWidth="1.5" /><circle cx="28" cy="11" r="2.5" fill="none" stroke="#ff5572" strokeWidth="1.5" /></svg>
  },
  TOGGLE: {
    label: 'TOGGLE', ico: 'T', col: '#00e5a0', ni: 0, no: 1, fn: (_, d) => d.val,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><rect x="1" y="6" width="28" height="10" rx="5" fill="none" stroke="#00e5a0" strokeWidth="1.5" /><circle cx="9" cy="11" r="4" fill="#00e5a0" /></svg>
  },
  BUTTON: {
    label: 'BUTTON', ico: 'B', col: '#ffc846', ni: 0, no: 1, fn: (_, d) => d.val,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><circle cx="15" cy="11" r="9" fill="none" stroke="#ffc846" strokeWidth="1.5" /><circle cx="15" cy="11" r="5" fill="#ffc846" opacity=".5" /></svg>
  },
  CLOCK: {
    label: 'CLOCK', ico: '~', col: '#3d9eff', ni: 0, no: 1, fn: (_, d, t) => Math.floor(t / (500 / d.hz)) % 2,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><polyline points="1,15 5,15 5,7 9,7 9,15 13,15 13,7 17,7 17,15 21,15 21,7 25,7 25,15 29,15" fill="none" stroke="#3d9eff" strokeWidth="1.5" /></svg>
  },
  CONST0: {
    label: 'LOW', ico: '0', col: '#454e68', ni: 0, no: 1, fn: () => 0,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><circle cx="15" cy="11" r="8" fill="none" stroke="#454e68" strokeWidth="1.5" /><text x="15" y="15" textAnchor="middle" fill="#454e68" fontSize="10" fontFamily="monospace">0</text></svg>
  },
  CONST1: {
    label: 'HIGH', ico: '1', col: '#ff2d55', ni: 0, no: 1, fn: () => 1,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><circle cx="15" cy="11" r="8" fill="none" stroke="#ff2d55" strokeWidth="1.5" /><text x="15" y="15" textAnchor="middle" fill="#ff2d55" fontSize="10" fontFamily="monospace">1</text></svg>
  },
  MIC: {
    label: 'MIC', ico: 'M', col: '#3d9eff', ni: 0, no: 10,
    fn: (_, __, ___, ext) => {
      const vol = ext?.micVolume || 0;
      const level = Math.min(10, Math.floor(vol / 8));
      return Array.from({ length: 10 }, (_, i) => i < level ? 1 : 0);
    },
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><rect x="11" y="2" width="8" height="12" rx="4" fill="none" stroke="#3d9eff" strokeWidth="1.5" /><path d="M7 9v2a8 8 0 0 0 16 0V9M15 19v2M11 21h8" fill="none" stroke="#3d9eff" strokeWidth="1.5" strokeLinecap="round" /></svg>
  },
  LAMP: {
    label: 'LAMP', ico: 'L', col: '#ffc846', ni: 1, no: 0, fn: () => 0,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><circle cx="15" cy="10" r="7.5" fill="none" stroke="#ffc846" strokeWidth="1.5" /><line x1="11" y1="19" x2="19" y2="19" stroke="#ffc846" strokeWidth="1.5" /><line x1="13" y1="21" x2="17" y2="21" stroke="#ffc846" strokeWidth="1.5" /></svg>
  },
  RGB_LAMP: {
    label: 'RGB', ico: 'RGB', col: '#ffffff', ni: 3, no: 0, fn: () => 0,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><circle cx="15" cy="10" r="7.5" fill="none" stroke="#ffffff" strokeWidth="1.5" /><line x1="11" y1="19" x2="19" y2="19" stroke="#ffffff" strokeWidth="1.5" /><line x1="13" y1="21" x2="17" y2="21" stroke="#ffffff" strokeWidth="1.5" /></svg>
  },
  AUDIO: {
    label: 'AUDIO', ico: 'A', col: '#00e5a0', ni: 1, no: 0, fn: () => 0,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><polygon points="2,7 10,7 18,2 18,20 10,15 2,15" fill="none" stroke="#00e5a0" strokeWidth="1.5" /><path d="M20,7Q24,11 20,15" fill="none" stroke="#00e5a0" strokeWidth="1.5" /></svg>
  },
  SEGMENT_7: {
    label: '7-SEG', ico: '8', col: '#ff2d55', ni: 7, no: 0, fn: () => 0,
    svg: <svg viewBox="0 0 30 22" width="30" height="22"><path d="M11 4h8 M19 4v6 M19 12v6 M11 18h8 M9 12v6 M9 4v6 M11 11h8" fill="none" stroke="#ff2d55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
};
