import React, { useEffect, useRef } from 'react';
import { WireData } from '../utils/types';
import { bezier } from '../utils/types';

interface WireProps {
  key?: React.Key;
  wire: WireData;
  signal: number;
  zoom: number;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const Wire = ({ wire, signal, zoom, onContextMenu }: WireProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let req: number;
    const updatePath = () => {
      const el1 = document.querySelector(`[data-handle="${wire.fn}-o-${wire.fp}"]`);
      const el2 = document.querySelector(`[data-handle="${wire.tn}-i-${wire.tp}"]`);
      const canvas = document.getElementById('canvas-container');
      
      if (el1 && el2 && canvas && pathRef.current) {
        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();
        const cr = canvas.getBoundingClientRect();
        
        const x1 = (r1.left - cr.left + r1.width / 2) / zoom;
        const y1 = (r1.top - cr.top + r1.height / 2) / zoom;
        const x2 = (r2.left - cr.left + r2.width / 2) / zoom;
        const y2 = (r2.top - cr.top + r2.height / 2) / zoom;
        
        pathRef.current.setAttribute('d', bezier(x1, y1, x2, y2));
      }
      req = requestAnimationFrame(updatePath);
    };
    req = requestAnimationFrame(updatePath);
    return () => cancelAnimationFrame(req);
  }, [wire, zoom]);

  return (
    <path
      ref={pathRef}
      className={`fill-none stroke-2 stroke-linecap-round cursor-pointer pointer-events-auto transition-colors hover:stroke-[4px] ${
        signal ? 'stroke-rose-500 drop-shadow-[0_0_4px_rgba(255,45,85,0.55)]' : 'stroke-slate-400 dark:stroke-white'
      }`}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e); }}
    />
  );
};
