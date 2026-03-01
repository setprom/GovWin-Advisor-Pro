import React from 'react';
import { Shield, BarChart3, Brain, Zap, Users, CreditCard, Terminal } from 'lucide-react';
export default function Sidebar({ activeTab, setActiveTab }: any) {
  const menu = [
    { id: 'DASHBOARD', label: 'Tablero Maestro', icon: <BarChart3 size={18}/> },
    { id: 'STARK', label: 'Sala Stark', icon: <Brain size={18}/> },
    { id: 'HUNTER', label: 'Cazador Ventas', icon: <Zap size={18}/> },
    { id: 'USERS', label: 'Usuarios', icon: <Users size={18}/> },
    { id: 'COUPONS', label: 'Cupones', icon: <CreditCard size={18}/> },
    { id: 'ENGINEERING', label: 'Ingeniería', icon: <Terminal size={18}/> }
  ];
  return (
    <aside className="w-64 bg-[#0d1117] border-r border-slate-800 p-6 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10"><Shield className="text-blue-500"/><h1 className="font-black italic text-lg">GOVWIN AI</h1></div>
      {menu.map(m => (
        <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center gap-3 p-4 rounded-xl mb-1 transition-all text-[10px] font-black uppercase ${activeTab === m.id ? 'bg-blue-600/10 text-blue-400 border border-blue-600/30 shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
          {m.icon} <span>{m.label}</span>
        </button>
      ))}
    </aside>
  );
}
