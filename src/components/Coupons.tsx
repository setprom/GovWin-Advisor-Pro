import React from 'react';
export default function Coupons() {
  return (
    <div className="bg-[#161b22] p-10 rounded-[3rem] border border-slate-800 space-y-8 shadow-2xl">
      <h2 className="text-3xl font-black text-yellow-500 uppercase tracking-tighter italic">Fábrica de Cupones</h2>
      <div className="flex gap-4"><input className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-6 py-4" placeholder="CÓDIGO: MARCOS100" /><button className="bg-yellow-600 text-black px-10 rounded-xl font-black uppercase text-xs">Generar</button></div>
      <div className="p-10 bg-yellow-500/5 border-2 border-dashed border-yellow-500/20 rounded-[2rem] text-center"><p className="text-yellow-500 font-mono text-4xl font-black">JEFE100</p><p className="text-yellow-500/50 text-[10px] font-black uppercase mt-4">Cupón Maestro Activado</p></div>
    </div>
  );
}
