import React from 'react';
import { Activity, Database, Shield } from 'lucide-react';

export const NavBtn = ({ label, icon: Icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase border tracking-widest ${
      active 
        ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/30 shadow-[0_0_20px_rgba(0,123,255,0.1)]' 
        : 'text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300'
    }`}
  >
    <Icon size={18} /> 
    <span>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_#007bff]"></div>}
  </button>
);

export const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="glass-card p-8 group hover:border-brand-blue/50 transition-all duration-500">
    <div className="scanning-line" />
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-brand-blue/10 rounded-2xl group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-brand-blue" />
      </div>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
        trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
        trend === 'down' ? 'bg-brand-red/10 text-brand-red border-brand-red/20' : 
        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{title}</h3>
    <p className="text-5xl font-black italic tracking-tighter text-white">{value}</p>
  </div>
);

export const NeuralLink = () => (
  <div className="flex items-center gap-6 px-6 py-2 bg-black/20 border-b border-border-dark backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
      <span>AI CORE: ONLINE</span>
    </div>
    <div className="flex items-center gap-2">
      <Activity className="w-3 h-3" />
      <span>LATENCY: 24MS</span>
    </div>
    <div className="flex items-center gap-2">
      <Database className="w-3 h-3" />
      <span>DB SYNC: 100%</span>
    </div>
    <div className="ml-auto flex items-center gap-4">
      <span className="text-brand-blue">STARK OS v23.0.4</span>
      <span className="text-zinc-700">|</span>
      <span>{new Date().toLocaleDateString()}</span>
    </div>
  </div>
);
