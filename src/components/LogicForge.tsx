import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Node } from './Node';
import { Wire } from './Wire';
import { ContextMenu } from './ContextMenu';
import { useSimulation } from '../utils/engine';
import { NodeData, WireData, WiringState, ContextMenuState, generateId, bezier } from '../utils/types';
import { NodeType } from '../utils/defs';
import { Zap, Save, FolderOpen, Square, Moon, Sun, ZoomIn, ZoomOut } from 'lucide-react';
import { clsx } from 'clsx';

export const LogicForge = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [wires, setWires] = useState<WireData[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [wiringSrc, setWiringSrc] = useState<WiringState | null>(null);
  const [ctxMenu, setCtxMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, target: null });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [zoom, setZoom] = useState(1);

  const signals = useSimulation(nodes, wires);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingNode = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const previewPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('ntype') as NodeType;
    if (!type) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = Math.max(0, Math.round(((e.clientX - rect.left) / zoom - 60) / 12) * 12);
    const y = Math.max(0, Math.round(((e.clientY - rect.top) / zoom - 40) / 12) * 12);
    
    setNodes(prev => [...prev, { id: generateId(), type, x, y, data: { val: 0, hz: 2 } }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNode.current) {
      const { id, ox, oy } = draggingNode.current;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const nx = Math.max(0, Math.round(((e.clientX - rect.left) / zoom - ox) / 12) * 12);
      const ny = Math.max(0, Math.round(((e.clientY - rect.top) / zoom - oy) / 12) * 12);
      
      setNodes(prev => prev.map(n => n.id === id ? { ...n, x: nx, y: ny } : n));
    }

    if (wiringSrc && previewPathRef.current && canvasRef.current) {
      const el = document.querySelector(`[data-handle="${wiringSrc.id}-${wiringSrc.dir}-${wiringSrc.port}"]`);
      if (el) {
        const r1 = el.getBoundingClientRect();
        const cr = canvasRef.current.getBoundingClientRect();
        const x1 = (r1.left - cr.left + r1.width / 2) / zoom;
        const y1 = (r1.top - cr.top + r1.height / 2) / zoom;
        const x2 = (e.clientX - cr.left) / zoom;
        const y2 = (e.clientY - cr.top) / zoom;
        
        previewPathRef.current.setAttribute('d', wiringSrc.dir === 'o' ? bezier(x1, y1, x2, y2) : bezier(x2, y2, x1, y1));
      }
    }
  };

  const handlePointerUp = () => {
    draggingNode.current = null;
  };

  const handleHandleClick = (e: React.MouseEvent, nodeId: string, dir: 'i' | 'o', port: number) => {
    e.stopPropagation();
    if (!wiringSrc) {
      setWiringSrc({ id: nodeId, dir, port });
      if (previewPathRef.current) {
        previewPathRef.current.style.opacity = '1';
        previewPathRef.current.style.visibility = 'visible';
      }
    } else {
      if (wiringSrc.id === nodeId || wiringSrc.dir === dir) {
        cancelWiring();
        return;
      }
      
      const fn = wiringSrc.dir === 'o' ? wiringSrc.id : nodeId;
      const fp = wiringSrc.dir === 'o' ? wiringSrc.port : port;
      const tn = wiringSrc.dir === 'o' ? nodeId : wiringSrc.id;
      const tp = wiringSrc.dir === 'o' ? port : wiringSrc.port;
      
      setWires(prev => [...prev, { id: generateId(), fn, fp, tn, tp }]);
      cancelWiring();
    }
  };

  const cancelWiring = () => {
    setWiringSrc(null);
    if (previewPathRef.current) {
      previewPathRef.current.style.opacity = '0';
      previewPathRef.current.style.visibility = 'hidden';
      previewPathRef.current.setAttribute('d', '');
    }
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setWires(prev => prev.filter(w => w.fn !== id && w.tn !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const deleteWire = (id: string) => {
    setWires(prev => prev.filter(w => w.id !== id));
  };

  const loadExample = () => {
    setNodes([]);
    setWires([]);
    cancelWiring();
    
    setTimeout(() => {
      const tA = generateId(); const tB = generateId(); const tCin = generateId(); const clk = generateId();
      const xor1 = generateId(); const xor2 = generateId(); const and1 = generateId(); const and2 = generateId(); const or1 = generateId();
      const lSum = generateId(); const lCo = generateId(); const orC = generateId(); const lClk = generateId(); const aud = generateId();

      setNodes([
        { id: tA, type: 'TOGGLE', x: 60, y: 60, data: { val: 0 } },
        { id: tB, type: 'TOGGLE', x: 60, y: 180, data: { val: 0 } },
        { id: tCin, type: 'TOGGLE', x: 60, y: 300, data: { val: 0 } },
        { id: clk, type: 'CLOCK', x: 60, y: 430, data: { hz: 2 } },
        { id: xor1, type: 'XOR2', x: 260, y: 100, data: {} },
        { id: xor2, type: 'XOR2', x: 440, y: 100, data: {} },
        { id: and1, type: 'AND2', x: 260, y: 240, data: {} },
        { id: and2, type: 'AND2', x: 440, y: 250, data: {} },
        { id: or1, type: 'OR2', x: 600, y: 210, data: {} },
        { id: lSum, type: 'LAMP', x: 610, y: 60, data: {} },
        { id: lCo, type: 'LAMP', x: 780, y: 200, data: {} },
        { id: orC, type: 'OR2', x: 440, y: 400, data: {} },
        { id: lClk, type: 'LAMP', x: 610, y: 390, data: {} },
        { id: aud, type: 'AUDIO', x: 610, y: 490, data: {} }
      ]);

      setWires([
        { id: generateId(), fn: tA, fp: 0, tn: xor1, tp: 0 }, { id: generateId(), fn: tB, fp: 0, tn: xor1, tp: 1 },
        { id: generateId(), fn: xor1, fp: 0, tn: xor2, tp: 0 }, { id: generateId(), fn: tCin, fp: 0, tn: xor2, tp: 1 },
        { id: generateId(), fn: xor2, fp: 0, tn: lSum, tp: 0 },
        { id: generateId(), fn: tA, fp: 0, tn: and1, tp: 0 }, { id: generateId(), fn: tB, fp: 0, tn: and1, tp: 1 },
        { id: generateId(), fn: xor1, fp: 0, tn: and2, tp: 0 }, { id: generateId(), fn: tCin, fp: 0, tn: and2, tp: 1 },
        { id: generateId(), fn: and1, fp: 0, tn: or1, tp: 0 }, { id: generateId(), fn: and2, fp: 0, tn: or1, tp: 1 },
        { id: generateId(), fn: or1, fp: 0, tn: lCo, tp: 0 },
        { id: generateId(), fn: clk, fp: 0, tn: orC, tp: 0 }, { id: generateId(), fn: tA, fp: 0, tn: orC, tp: 1 },
        { id: generateId(), fn: orC, fp: 0, tn: lClk, tp: 0 }, { id: generateId(), fn: orC, fp: 0, tn: aud, tp: 0 }
      ]);
    }, 50);
  };

  const handleSave = () => {
    const data = { version: 1, nodes, wires };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.lgf.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.nodes && data.wires) {
          setNodes(data.nodes);
          setWires(data.wires);
        }
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelWiring();
        setCtxMenu(prev => ({ ...prev, visible: false }));
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) return;
        deleteNode(selectedNode);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#1a2130] text-slate-900 dark:text-[#dde2f0] font-mono select-none">
      {/* Topbar */}
      <div className="h-[46px] min-h-[46px] bg-white dark:bg-[#0d1018] border-b border-slate-200 dark:border-[#1e2438] flex items-center px-3.5 gap-2.5 z-50 shadow-sm">
        <div className="font-sans font-extrabold text-[15px] tracking-wide">Logic<span className="text-rose-500">Forge</span></div>
        <div className="w-px h-[18px] bg-slate-300 dark:bg-[#262e45]" />
        
        <button onClick={loadExample} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded-md text-[10px] text-slate-600 dark:text-[#7d8ba8] hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
          <Zap size={12} /> Example
        </button>
        <div className="w-px h-[18px] bg-slate-300 dark:bg-[#262e45]" />
        
        <button onClick={handleSave} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded-md text-[10px] text-slate-600 dark:text-[#7d8ba8] hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
          <Save size={12} /> Save
        </button>
        <label className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded-md text-[10px] text-slate-600 dark:text-[#7d8ba8] hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer">
          <FolderOpen size={12} /> Load
          <input type="file" accept=".json" className="hidden" onChange={handleLoad} />
        </label>
        <div className="w-px h-[18px] bg-slate-300 dark:bg-[#262e45]" />
        
        <button onClick={() => { setNodes([]); setWires([]); cancelWiring(); }} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded-md text-[10px] text-slate-600 dark:text-[#7d8ba8] hover:border-rose-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
          <Square size={12} /> Clear
        </button>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(0,229,160,0.35)] animate-pulse" />
          Simulating
        </div>
        <div className="w-px h-[18px] bg-slate-300 dark:bg-[#262e45]" />
        
        <div className="text-[9px] text-slate-500 dark:text-[#454e68] hidden md:block">
          <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded text-[8px]">Click handle</kbd> to wire · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded text-[8px]">ESC</kbd> cancel
        </div>
        <div className="w-px h-[18px] bg-slate-300 dark:bg-[#262e45]" />
        
        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded-md text-[10px] text-slate-600 dark:text-[#7d8ba8] hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
          {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />} {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <div className="w-px h-[18px] bg-slate-300 dark:bg-[#262e45]" />
        
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#161c2a] border border-slate-300 dark:border-[#262e45] rounded-md p-0.5">
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1 text-slate-600 dark:text-[#7d8ba8] hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors">
            <ZoomOut size={12} />
          </button>
          <span className="text-[10px] text-slate-600 dark:text-[#7d8ba8] min-w-[32px] text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1 text-slate-600 dark:text-[#7d8ba8] hover:text-blue-500 hover:bg-blue-500/10 rounded transition-colors">
            <ZoomIn size={12} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div 
          className="flex-1 overflow-auto bg-slate-50 dark:bg-[#1a2130]"
          onScroll={() => setCtxMenu(prev => ({ ...prev, visible: false }))}
        >
          <div 
            id="canvas-container"
            ref={canvasRef}
            className={clsx("relative w-[10000vw] h-[10000vh] origin-top-left", wiringSrc && "cursor-crosshair")}
            style={{ 
              backgroundImage: 'radial-gradient(circle, #9098b8 1px, transparent 1px)', 
              backgroundSize: '22px 22px',
              transform: `scale(${zoom})`
            }}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
            onDrop={handleDrop}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerDown={() => { cancelWiring(); setSelectedNode(null); setCtxMenu(prev => ({ ...prev, visible: false })); }}
            onContextMenu={e => { e.preventDefault(); setCtxMenu(prev => ({ ...prev, visible: false })); }}
          >
            {/* Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {wires.map(w => (
              <Wire 
                key={w.id} 
                wire={w} 
                signal={signals[`${w.fn}-o-${w.fp}`] || 0} 
                zoom={zoom}
                onContextMenu={(e) => setCtxMenu({ visible: true, x: e.clientX, y: e.clientY, target: { kind: 'wire', id: w.id } })}
              />
            ))}
          </svg>

          {/* Nodes Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="pointer-events-auto w-full h-full">
              {nodes.map(n => (
                <Node
                  key={n.id}
                  node={n}
                  selected={selectedNode === n.id}
                  signals={signals}
                  wiringSrc={wiringSrc}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setSelectedNode(n.id);
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    draggingNode.current = { id: n.id, ox: (e.clientX - rect.left) / zoom, oy: (e.clientY - rect.top) / zoom };
                  }}
                  onHandleClick={(e, dir, port) => handleHandleClick(e, n.id, dir, port)}
                  onHandleContextMenu={(e, dir, port) => setCtxMenu({ visible: true, x: e.clientX, y: e.clientY, target: { kind: 'handle', id: n.id, dir, port } })}
                  onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedNode(n.id); setCtxMenu({ visible: true, x: e.clientX, y: e.clientY, target: { kind: 'node', id: n.id } }); }}
                  updateData={(data) => setNodes(prev => prev.map(pn => pn.id === n.id ? { ...pn, data: { ...pn.data, ...data } } : pn))}
                />
              ))}
            </div>
          </div>

          {/* Preview Wire Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <path ref={previewPathRef} className="fill-none stroke-blue-500 stroke-2 stroke-dasharray-[7_4] opacity-0 invisible transition-opacity duration-100" />
          </svg>
        </div>
        </div>
      </div>

      <ContextMenu
        state={ctxMenu}
        onClose={() => setCtxMenu(prev => ({ ...prev, visible: false }))}
        wireCount={ctxMenu.target?.kind === 'handle' ? wires.filter(w => (ctxMenu.target?.dir === 'o' && w.fn === ctxMenu.target.id && w.fp === ctxMenu.target.port) || (ctxMenu.target?.dir === 'i' && w.tn === ctxMenu.target.id && w.tp === ctxMenu.target.port)).length : 0}
        onAction={(action) => {
          if (!ctxMenu.target) return;
          if (action === 'delete') {
            if (ctxMenu.target.kind === 'node') deleteNode(ctxMenu.target.id);
            else deleteWire(ctxMenu.target.id);
          } else if (action === 'duplicate' && ctxMenu.target.kind === 'node') {
            const nd = nodes.find(n => n.id === ctxMenu.target!.id);
            if (nd) setNodes(prev => [...prev, { ...nd, id: generateId(), x: nd.x + 24, y: nd.y + 24 }]);
          } else if (action === 'disconnect') {
            if (ctxMenu.target.kind === 'node') {
              setWires(prev => prev.filter(w => w.fn !== ctxMenu.target!.id && w.tn !== ctxMenu.target!.id));
            } else if (ctxMenu.target.kind === 'handle') {
              setWires(prev => prev.filter(w => !((ctxMenu.target!.dir === 'o' && w.fn === ctxMenu.target!.id && w.fp === ctxMenu.target!.port) || (ctxMenu.target!.dir === 'i' && w.tn === ctxMenu.target!.id && w.tp === ctxMenu.target!.port))));
            }
          }
          setCtxMenu(prev => ({ ...prev, visible: false }));
        }}
      />
    </div>
  );
};
