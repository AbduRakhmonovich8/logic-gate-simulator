import React, { useEffect, useRef, useState } from 'react';
import { ContextMenuState } from '../utils/types';
import { clsx } from 'clsx';
import { Trash2, Copy, Unplug } from 'lucide-react';

interface ContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
  onAction: (action: 'delete' | 'duplicate' | 'disconnect') => void;
  wireCount?: number;
}

export const ContextMenu = ({ state, onClose, onAction, wireCount }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: state.x, y: state.y });

  useEffect(() => {
    setPos({ x: state.x, y: state.y });
  }, [state.x, state.y]);

  useEffect(() => {
    if (state.visible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newX = state.x;
      let newY = state.y;
      if (rect.right > window.innerWidth) newX = state.x - rect.width;
      if (rect.bottom > window.innerHeight) newY = state.y - rect.height;
      if (newX !== state.x || newY !== state.y) {
        setPos({ x: newX, y: newY });
      }
    }
  }, [state.visible, state.x, state.y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (state.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.visible, onClose]);

  if (!state.visible || !state.target) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] bg-white dark:bg-[#11151f] border border-slate-200 dark:border-[#262e45] rounded-lg py-1 min-w-[160px] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      style={{ left: pos.x, top: pos.y }}
    >
      {state.target.kind === 'handle' ? (
        <div
          className={clsx("px-3.5 py-2 cursor-pointer text-[10px] tracking-wide transition-colors flex items-center gap-2", wireCount === 0 ? "text-slate-400 cursor-not-allowed" : "text-rose-500 hover:bg-rose-500/10")}
          onClick={() => { if (wireCount! > 0) onAction('disconnect'); }}
        >
          <Unplug size={12} />
          {wireCount === 0 ? 'No wires to disconnect' : `Disconnect (${wireCount} wire${wireCount! > 1 ? 's' : ''})`}
        </div>
      ) : (
        <>
          <div
            className="px-3.5 py-2 cursor-pointer text-[10px] tracking-wide text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
            onClick={() => onAction('delete')}
          >
            <Trash2 size={12} />
            Delete
          </div>
          {state.target.kind === 'node' && (
            <>
              <div className="h-px bg-slate-200 dark:bg-[#1e2438] my-1" />
              <div
                className="px-3.5 py-2 cursor-pointer text-[10px] tracking-wide text-slate-600 dark:text-[#7d8ba8] hover:bg-slate-100 dark:hover:bg-[#1c2235] hover:text-slate-900 dark:hover:text-[#dde2f0] transition-colors flex items-center gap-2"
                onClick={() => onAction('duplicate')}
              >
                <Copy size={12} />
                Duplicate
              </div>
              <div
                className="px-3.5 py-2 cursor-pointer text-[10px] tracking-wide text-slate-600 dark:text-[#7d8ba8] hover:bg-slate-100 dark:hover:bg-[#1c2235] hover:text-slate-900 dark:hover:text-[#dde2f0] transition-colors flex items-center gap-2"
                onClick={() => onAction('disconnect')}
              >
                <Unplug size={12} />
                Disconnect all
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
