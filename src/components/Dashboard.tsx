import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
const data = [{name: 'M1', v: 400}, {name: 'M2', v: 3000}, {name: 'M3', v: 2000}, {name: 'M4', v: 2780}, {name: 'M5', v: 1890}];
export default function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black italic">Estado del Imperio: Marcos</h2>
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-[#161b22] p-8 rounded-[2rem] border border-slate-800 shadow-xl"><p className="text-slate-500 text-xs font-bold uppercase">Empresas</p><h3 className="text-5xl font-black mt-2">14</h3></div>
        <div className="bg-[#161b22] p-8 rounded-[2rem] border border-slate-800 shadow-xl border-l-4 border-cyan-500"><p className="text-cyan-500 text-xs font-bold uppercase">Comisiones</p><h3 className="text-5xl font-black mt-2">$342,000</h3></div>
        <div className="bg-[#161b22] p-8 rounded-[2rem] border border-slate-800 shadow-xl border-l-4 border-blue-500 text-blue-500"><p className="text-xs font-bold uppercase">Genio</p><h3 className="text-5xl font-black mt-2">100%</h3></div>
      </div>
      <div className="bg-[#161b22] p-10 rounded-[3rem] border border-slate-800 h-80">
        <h4 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest">Tendencia de Crecimiento</h4>
        <ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><Area type="monotone" dataKey="v" stroke="#00d4ff" fill="#00d4ff22" /><XAxis dataKey="name" hide/><YAxis hide/><Tooltip contentStyle={{backgroundColor:'#0d1117', border:'none', borderRadius:'10px'}}/></AreaChart></ResponsiveContainer>
      </div>
    </div>
  );
}
