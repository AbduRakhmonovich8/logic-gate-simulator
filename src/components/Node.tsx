import React from 'react';
import { NodeData } from '../utils/types';
import { DEFS } from '../utils/defs';
import { clsx } from 'clsx';
import { Volume2 } from 'lucide-react';

interface NodeProps {
  key?: React.Key;
  node: NodeData;
  selected: boolean;
  signals: Record<string, number>;
  onPointerDown: (e: React.PointerEvent) => void;
  onHandleClick: (e: React.MouseEvent, dir: 'i' | 'o', port: number) => void;
  onHandleContextMenu: (e: React.MouseEvent, dir: 'i' | 'o', port: number) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  updateData: (data: any) => void;
  wiringSrc: { id: string; dir: 'i' | 'o'; port: number } | null;
}

export const Node = ({
  node, selected, signals, onPointerDown, onHandleClick, onHandleContextMenu, onContextMenu, updateData, wiringSrc
}: NodeProps) => {
  const def = DEFS[node.type];

  const renderHandle = (dir: 'i' | 'o', port: number) => {
    const isSrc = wiringSrc?.id === node.id && wiringSrc?.dir === dir && wiringSrc?.port === port;
    const val = signals[`${node.id}-${dir}-${port}`] || 0;
    
    return (
      <div
        data-handle={`${node.id}-${dir}-${port}`}
        className={clsx(
          "absolute w-3.5 h-3.5 rounded-full border-2 top-1/2 -translate-y-1/2 cursor-crosshair z-20 transition-all hover:scale-150 hover:border-blue-500 hover:shadow-[0_0_12px_rgba(61,158,255,0.4)]",
          dir === 'i' ? "-left-[7px]" : "-right-[7px]",
          isSrc ? "bg-blue-500 border-blue-300 shadow-[0_0_14px_rgba(61,158,255,0.4)] scale-125" :
          val ? "bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(255,45,85,0.4)]" : "bg-slate-200 dark:bg-[#1c2235] border-slate-400 dark:border-[#262e45]"
        )}
        onPointerDown={(e) => { e.stopPropagation(); onHandleClick(e as any, dir, port); }}
        onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); onHandleContextMenu(e as any, dir, port); }}
      />
    );
  };

  const renderBody = () => {
    if (node.type === 'TOGGLE') {
      const on = !!node.data.val;
      return (
        <>
          <div className="px-3.5 pt-2.5 pb-1.5 flex items-center gap-2.5">
            <div 
              className={clsx("w-[46px] h-[22px] rounded-full relative cursor-pointer transition-colors border-2 shrink-0", on ? "bg-rose-500/20 border-rose-500" : "bg-slate-200 dark:bg-[#1c2235] border-slate-300 dark:border-[#262e45]")}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => { e.stopPropagation(); updateData({ val: on ? 0 : 1 }); }}
            >
              <div className={clsx("absolute top-[2px] w-3.5 h-3.5 rounded-full transition-all", on ? "left-[26px] bg-rose-500 shadow-[0_0_8px_rgba(255,45,85,0.4)]" : "left-[2px] bg-slate-500 dark:bg-[#454e68]")} />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#454e68] flex-1 font-mono">{on ? 'ON' : 'OFF'}</span>
          </div>
          <div className="py-1.5 flex flex-col">
            <div className="flex items-center min-h-[24px] px-5 relative justify-end">
              {renderHandle('o', 0)}
            </div>
          </div>
        </>
      );
    }

    if (node.type === 'BUTTON') {
      const on = !!node.data.val;
      return (
        <>
          <div className="px-3.5 pt-2.5 pb-1.5 flex justify-center">
            <div 
              className={clsx("w-11 h-11 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center relative", on ? "bg-rose-500/15 border-rose-500 shadow-[0_0_16px_rgba(255,45,85,0.4)]" : "bg-slate-200 dark:bg-[#1c2235] border-slate-300 dark:border-[#262e45]")}
              onPointerDown={(e) => { e.stopPropagation(); updateData({ val: 1 }); }}
              onPointerUp={(e) => { e.stopPropagation(); updateData({ val: 0 }); }}
              onPointerLeave={(e) => { e.stopPropagation(); updateData({ val: 0 }); }}
            >
              <div className={clsx("absolute inset-1.5 rounded-full transition-all pointer-events-none", on ? "bg-rose-500" : "bg-slate-300 dark:bg-[#262e45]")} />
            </div>
          </div>
          <div className="py-1.5 flex flex-col">
            <div className="flex items-center min-h-[24px] px-5 relative justify-end">
              {renderHandle('o', 0)}
            </div>
          </div>
        </>
      );
    }

    if (node.type === 'CLOCK') {
      const on = !!(signals[`${node.id}-o-0`] || 0);
      return (
        <>
          <div className="px-3.5 py-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 dark:text-[#454e68] whitespace-nowrap">Hz</span>
              <input 
                type="range" min="0.5" max="20" step="0.5" value={node.data.hz}
                className="flex-1 h-[3px] rounded-full bg-slate-300 dark:bg-[#262e45] cursor-pointer outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                onPointerDown={e => e.stopPropagation()}
                onChange={e => updateData({ hz: parseFloat(e.target.value) })}
              />
            </div>
            <div className="text-[10px] text-blue-500 text-center tracking-wider">{node.data.hz.toFixed(1)} Hz</div>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-[#454e68]">
              <div className={clsx("w-2.5 h-2.5 rounded-full shrink-0 transition-all", on ? "bg-blue-500 shadow-[0_0_10px_rgba(61,158,255,0.4)]" : "bg-slate-300 dark:bg-[#262e45]")} />
              <span className="text-[10px] font-bold text-blue-500">{on ? '1' : '0'}</span>
            </div>
          </div>
          <div className="py-1.5 flex flex-col">
            <div className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('o', 0)}
            </div>
          </div>
        </>
      );
    }

    if (node.type === 'CONST0' || node.type === 'CONST1') {
      const v = node.type === 'CONST1';
      return (
        <div className="py-1.5 flex flex-col">
          <div className="flex items-center min-h-[24px] px-5 relative justify-end pr-5">
            <span className={clsx("text-[9px] font-bold tracking-wider min-w-[10px] text-right", v ? "text-rose-500" : "text-slate-500 dark:text-[#454e68]")}>{v ? '1' : '0'}</span>
            {renderHandle('o', 0)}
          </div>
        </div>
      );
    }

    if (node.type === 'MIC') {
      const volLevel = Array.from({length: 10}).filter((_, i) => signals[`${node.id}-o-${i}`]).length;
      return (
        <>
          <div className="px-3.5 pt-3 pb-2 flex justify-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const active = i < volLevel;
              const color = i > 7 ? 'bg-rose-500 shadow-[0_0_8px_rgba(255,45,85,0.6)]' : i > 4 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
              return (
                <div key={i} className={clsx("w-1.5 h-8 rounded-sm transition-all duration-75", active ? color : "bg-slate-200 dark:bg-[#1c2235]")} />
              );
            })}
          </div>
          <div className="py-1.5 flex flex-col">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`o-${i}`} className="flex items-center min-h-[24px] px-5 relative justify-end">
                <span className="text-[9px] text-slate-500 dark:text-[#454e68] flex-1 font-mono text-right mr-2">lvl {i+1}</span>
                <span className={clsx("text-[9px] font-bold tracking-wider min-w-[10px] text-right font-mono", (signals[`${node.id}-o-${i}`] || 0) ? "text-rose-500" : "text-slate-500 dark:text-[#454e68]")}>{(signals[`${node.id}-o-${i}`] || 0) ? '1' : '0'}</span>
                {renderHandle('o', i)}
              </div>
            ))}
          </div>
        </>
      );
    }

    if (node.type === 'LAMP') {
      const on = !!(signals[`${node.id}-i-0`] || 0);
      return (
        <>
          <div className="px-3.5 py-3 flex justify-center">
            <div className={clsx("w-10 h-10 rounded-full border-2 transition-all", on ? "bg-[radial-gradient(circle,#fff9cc_0%,#ffc846_45%,rgba(255,200,70,0.15)_100%)] border-amber-400 shadow-[0_0_24px_rgba(255,200,70,0.4),0_0_48px_rgba(255,200,70,0.2)]" : "bg-slate-200 dark:bg-[#1c2235] border-slate-300 dark:border-[#262e45]")} />
          </div>
          <div className="py-1.5 flex flex-col">
            <div className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('i', 0)}
            </div>
          </div>
        </>
      );
    }

    if (node.type === 'RGB_LAMP') {
      const r = !!(signals[`${node.id}-i-0`] || 0);
      const g = !!(signals[`${node.id}-i-1`] || 0);
      const b = !!(signals[`${node.id}-i-2`] || 0);
      
      let color = '#1c2235';
      let shadow = 'none';
      
      if (r || g || b) {
        const rVal = r ? 255 : 0;
        const gVal = g ? 255 : 0;
        const bVal = b ? 255 : 0;
        color = `rgb(${rVal}, ${gVal}, ${bVal})`;
        shadow = `0 0 24px rgba(${rVal}, ${gVal}, ${bVal}, 0.6), 0 0 48px rgba(${rVal}, ${gVal}, ${bVal}, 0.3)`;
      }

      return (
        <>
          <div className="px-3.5 py-3 flex justify-center">
            <div 
              className={clsx("w-10 h-10 rounded-full border-2 transition-all", !(r||g||b) && "bg-slate-200 dark:bg-[#1c2235] border-slate-300 dark:border-[#262e45]")} 
              style={r || g || b ? { backgroundColor: color, borderColor: color, boxShadow: shadow } : {}}
            />
          </div>
          <div className="py-1.5 flex flex-col">
            <div className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('i', 0)}
              <span className="text-[9px] text-slate-500 dark:text-[#454e68] flex-1 font-mono ml-2">R</span>
            </div>
            <div className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('i', 1)}
              <span className="text-[9px] text-slate-500 dark:text-[#454e68] flex-1 font-mono ml-2">G</span>
            </div>
            <div className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('i', 2)}
              <span className="text-[9px] text-slate-500 dark:text-[#454e68] flex-1 font-mono ml-2">B</span>
            </div>
          </div>
        </>
      );
    }

    if (node.type === 'AUDIO') {
      const on = !!(signals[`${node.id}-i-0`] || 0);
      return (
        <>
          <div className="px-3.5 py-2.5 flex items-center justify-center gap-2.5">
            <div className={clsx("text-[22px] transition-all", on ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(0,229,160,0.35)]" : "grayscale opacity-30")}><Volume2 size={22} /></div>
            <div className={clsx("flex items-end gap-0.5 h-[22px]", on ? "[&>div]:opacity-100" : "[&>div]:opacity-20")}>
              <div className={clsx("w-[3px] rounded-full bg-emerald-400 transition-all", on ? "h-2 animate-[ab1_0.4s_ease-in-out_infinite]" : "h-[3px]")} />
              <div className={clsx("w-[3px] rounded-full bg-emerald-400 transition-all", on ? "h-4 animate-[ab2_0.4s_ease-in-out_infinite_0.08s]" : "h-[3px]")} />
              <div className={clsx("w-[3px] rounded-full bg-emerald-400 transition-all", on ? "h-[22px] animate-[ab1_0.4s_ease-in-out_infinite_0.16s]" : "h-[3px]")} />
              <div className={clsx("w-[3px] rounded-full bg-emerald-400 transition-all", on ? "h-3.5 animate-[ab2_0.4s_ease-in-out_infinite_0.06s]" : "h-[3px]")} />
              <div className={clsx("w-[3px] rounded-full bg-emerald-400 transition-all", on ? "h-1.5 animate-[ab1_0.4s_ease-in-out_infinite_0.12s]" : "h-[3px]")} />
            </div>
          </div>
          <div className="py-1.5 flex flex-col">
            <div className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('i', 0)}
            </div>
          </div>
        </>
      );
    }

    if (node.type === 'SEGMENT_7') {
      const segs = [
        !!(signals[`${node.id}-i-0`] || 0), // a
        !!(signals[`${node.id}-i-1`] || 0), // b
        !!(signals[`${node.id}-i-2`] || 0), // c
        !!(signals[`${node.id}-i-3`] || 0), // d
        !!(signals[`${node.id}-i-4`] || 0), // e
        !!(signals[`${node.id}-i-5`] || 0), // f
        !!(signals[`${node.id}-i-6`] || 0), // g
      ];
      const labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

      const Segment = ({ on, d }: { on: boolean, d: string }) => (
        <path d={d} className={clsx("transition-all duration-75", on ? "fill-rose-500 drop-shadow-[0_0_8px_rgba(255,45,85,0.8)]" : "fill-slate-200 dark:fill-[#1c2235]")} />
      );

      return (
        <>
          <div className="px-3.5 py-4 flex justify-center bg-slate-100 dark:bg-[#0a0a0a] mx-4 mt-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
            <svg width="40" height="60" viewBox="0 0 40 60" className="overflow-visible">
              <Segment on={segs[0]} d="M 12 6 L 16 2 L 28 2 L 32 6 L 28 10 L 16 10 Z" /> {/* a */}
              <Segment on={segs[1]} d="M 34 8 L 38 12 L 38 26 L 34 30 L 30 26 L 30 12 Z" /> {/* b */}
              <Segment on={segs[2]} d="M 34 32 L 38 36 L 38 50 L 34 54 L 30 50 L 30 36 Z" /> {/* c */}
              <Segment on={segs[3]} d="M 12 56 L 16 52 L 28 52 L 32 56 L 28 60 L 16 60 Z" /> {/* d */}
              <Segment on={segs[4]} d="M 10 32 L 14 36 L 14 50 L 10 54 L 6 50 L 6 36 Z" /> {/* e */}
              <Segment on={segs[5]} d="M 10 8 L 14 12 L 14 26 L 10 30 L 6 26 L 6 12 Z" /> {/* f */}
              <Segment on={segs[6]} d="M 12 31 L 16 27 L 28 27 L 32 31 L 28 35 L 16 35 Z" /> {/* g */}
            </svg>
          </div>
          <div className="py-1.5 flex flex-col">
            {labels.map((lbl, i) => (
              <div key={lbl} className="flex items-center min-h-[24px] px-5 relative">
                {renderHandle('i', i)}
                <span className="text-[9px] text-slate-500 dark:text-[#454e68] flex-1 font-mono ml-2">{lbl}</span>
              </div>
            ))}
          </div>
        </>
      );
    }

    // Logic Gates
    return (
      <div className="py-1.5 flex flex-col">
        {Array.from({ length: def.ni }).map((_, i) => {
          const val = signals[`${node.id}-i-${i}`] || 0;
          return (
            <div key={`i-${i}`} className="flex items-center min-h-[24px] px-5 relative">
              {renderHandle('i', i)}
              <span className="text-[9px] text-slate-500 dark:text-[#454e68] flex-1 font-mono">in{def.ni > 1 ? i : ''}</span>
              <span className={clsx("text-[9px] font-bold tracking-wider min-w-[10px] text-right font-mono", val ? "text-rose-500" : "text-slate-500 dark:text-[#454e68]")}>{val ? '1' : '0'}</span>
            </div>
          );
        })}
        {def.no > 0 && (
          <div className="flex items-center min-h-[24px] px-5 relative justify-end">
            <span className={clsx("text-[9px] font-bold tracking-wider min-w-[10px] text-right font-mono", (signals[`${node.id}-o-0`] || 0) ? "text-rose-500" : "text-slate-500 dark:text-[#454e68]")}>{(signals[`${node.id}-o-0`] || 0) ? '1' : '0'}</span>
            {renderHandle('o', 0)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={`node-${node.id}`}
      className={clsx(
        "absolute min-w-[120px] bg-white dark:bg-[#11151f] border-[1.5px] rounded-xl shadow-xl transition-colors z-10 select-none",
        selected ? "border-blue-500 shadow-[0_0_0_1px_#3d9eff,0_4px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(61,158,255,0.1)]" : "border-slate-300 dark:border-[#262e45] hover:border-slate-400 dark:hover:border-[#303a55]"
      )}
      style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
      onPointerDown={onPointerDown}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center gap-1.5 px-2.5 pt-1.5 pb-1.5 border-b border-slate-200 dark:border-[#1e2438] rounded-t-[10px]">
        <span className="text-xs font-mono" style={{ color: def.col }}>{def.ico}</span>
        <span className="text-[10px] font-bold tracking-wider uppercase font-sans" style={{ color: def.col }}>{def.label}</span>
      </div>
      {renderBody()}
    </div>
  );
};
