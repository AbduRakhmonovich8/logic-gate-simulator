import React from 'react';
import { DEFS, NodeType } from '../utils/defs';

const SidebarItem = ({ type, def }: { key?: React.Key; type: NodeType; def: any }) => {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 cursor-grab hover:bg-slate-800/50 dark:hover:bg-slate-800/50 border-l-2 border-transparent hover:border-blue-500 transition-colors active:cursor-grabbing"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('ntype', type);
        e.dataTransfer.effectAllowed = 'copy';
      }}
    >
      <div className="w-8 h-6 flex items-center justify-center shrink-0">
        {def.svg}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-[11px] font-medium text-slate-900 dark:text-slate-200">{def.label}</div>
        <div className="text-[9px] text-slate-500 dark:text-slate-400">{type}</div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const gates: NodeType[] = ['AND2', 'AND3', 'AND4', 'OR2', 'OR3', 'OR4', 'NOT', 'NAND2', 'NOR2', 'XOR2', 'XNOR2'];
  const inputs: NodeType[] = ['TOGGLE', 'BUTTON', 'CLOCK', 'CONST0', 'CONST1', 'MIC'];
  const outputs: NodeType[] = ['LAMP', 'RGB_LAMP', 'AUDIO', 'SEGMENT_7'];

  return (
    <div className="w-[220px] min-w-[220px] bg-slate-100 dark:bg-[#0d1018] border-r border-slate-200 dark:border-[#1e2438] flex flex-col overflow-y-auto custom-scrollbar">
      <div className="px-3 pt-3 pb-1 text-[9px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Logic Gates</div>
      {gates.map(t => <SidebarItem key={t} type={t} def={DEFS[t]} />)}
      
      <div className="h-px bg-slate-200 dark:bg-[#1e2438] mx-3 my-1" />
      
      <div className="px-3 pt-3 pb-1 text-[9px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Inputs</div>
      {inputs.map(t => <SidebarItem key={t} type={t} def={DEFS[t]} />)}

      <div className="h-px bg-slate-200 dark:bg-[#1e2438] mx-3 my-1" />
      
      <div className="px-3 pt-3 pb-1 text-[9px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Outputs</div>
      {outputs.map(t => <SidebarItem key={t} type={t} def={DEFS[t]} />)}
    </div>
  );
};
