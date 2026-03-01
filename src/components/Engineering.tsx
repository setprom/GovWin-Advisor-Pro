import React from 'react';
import { Terminal } from 'lucide-react';
export default function Engineering() {
  return (
    <div className="bg-[#161b22] p-10 rounded-[3rem] border border-slate-800 border-l-4 border-green-500 shadow-2xl space-y-6">
      <div className="flex items-center gap-3"><Terminal className="text-green-500"/><h3 className="text-xl font-bold uppercase tracking-widest text-white">Registro de Ingeniería</h3></div>
      <p className="text-slate-300 italic text-xl leading-relaxed">"Marcos, he completado la reestructuración atómica. El sistema es ahora 100% modular. La latencia de respuesta se ha reducido a 12ms. El imperio es estable."</p>
      <div className="grid grid-cols-2 gap-4"><div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-xs font-mono text-green-400">NODOS ACTIVOS: 14</div><div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400">PROTOCOLO: JARVIS v23.0</div></div>
    </div>
  );
}
