import React, { useState, useEffect } from 'react';
import { LogicForge } from './components/LogicForge';
import { Monitor } from 'lucide-react';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-50 dark:bg-[#090c12] text-slate-900 dark:text-[#dde2f0] font-sans p-6 text-center select-none">
        <Monitor size={64} className="mb-6 text-rose-500" />
        <h1 className="text-2xl font-bold mb-3 tracking-wide">Faqat kompyuter uchun</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          Ushbu dastur murakkab mantiqiy sxemalarni yaratishga mo'ljallangan bo'lib, to'liq ishlashi uchun ekran kengligi kamida 800px bo'lishi talab etiladi. Iltimos, kompyuter yoki noutbukdan kiring.
        </p>
      </div>
    );
  }

  return (
    <LogicForge />
  );
}
