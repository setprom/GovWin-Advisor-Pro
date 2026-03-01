import React, { useState } from 'react';
import { 
  Shield, Zap, Brain, Terminal, Users, BarChart3, CreditCard, 
  MessageSquare, Target, Lock, Bell, Search, Trash2, FileText,
  ChevronRight, CheckCircle, AlertTriangle, Send
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loginTab, setLoginTab] = useState('LOGIN');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    if (user.toLowerCase() === 'jefe' && pass === '2Hermanos') setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl">
          <div className="text-center mb-8">
            <Shield className="text-blue-500 mx-auto mb-4" size={50} />
            <h1 className="text-3xl font-black italic tracking-tighter">GovWin Advisor</h1>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-slate-800">
            <button onClick={() => setLoginTab('LOGIN')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${loginTab === 'LOGIN' ? 'bg-blue-600' : 'text-slate-500'}`}>LOGIN</button>
            <button onClick={() => setLoginTab('REGISTER')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${loginTab === 'REGISTER' ? 'bg-blue-600' : 'text-slate-500'}`}>REGISTER BUSINESS</button>
            <button onClick={() => setLoginTab('RECOVERY')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${loginTab === 'RECOVERY' ? 'bg-blue-600' : 'text-slate-500'}`}>RECOVERY</button>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Username / Usuario</label>
            <input className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-4 text-sm" placeholder="Enter your username" onChange={e => setUser(e.target.value)} />
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Password / Contraseña</label>
            <input className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-4 text-sm" type="password" placeholder="••••••••" onChange={e => setPass(e.target.value)} />
            <button onClick={handleLogin} className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs mt-4">Access System</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex overflow-hidden font-sans">
      {/* SIDEBAR TIPO FOTO */}
      <aside className="w-72 bg-[#0d1117] border-r border-slate-800 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2"><Shield className="text-blue-500" size={24}/><h1 className="text-xl font-black italic tracking-tighter">GOVWIN</h1></div>
        <div className="bg-[#161b22] p-4 rounded-2xl border border-slate-800 mb-8">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Modo Jefe</p>
          <p className="text-xs font-black">Control Maestro...</p>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarBtn label="Tablero Maestro" icon={<BarChart3 size={18}/>} active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
          <SidebarBtn label="Cazador de Clientes" icon={<Target size={18}/>} active={activeTab === 'HUNTER'} onClick={() => setActiveTab('HUNTER')} />
          <SidebarBtn label="Monitor Cognitivo" icon={<Brain size={18}/>} active={activeTab === 'COGNITIVE'} onClick={() => setActiveTab('COGNITIVE')} />
          <SidebarBtn label="Sala de Estrategia" icon={<MessageSquare size={18}/>} active={activeTab === 'STARK'} onClick={() => setActiveTab('STARK')} />
          <SidebarBtn label="Gestión de Usuarios" icon={<Users size={18}/>} active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} />
          <SidebarBtn label="Cupones y Precios" icon={<CreditCard size={18}/>} active={activeTab === 'COUPONS'} onClick={() => setActiveTab('COUPONS')} />
          <SidebarBtn label="Evidencias" icon={<FileText size={18}/>} active={activeTab === 'EVIDENCE'} onClick={() => setActiveTab('EVIDENCE')} />
          <SidebarBtn label="Registro de Ingeniería" icon={<Terminal size={18}/>} active={activeTab === 'ENGINEERING'} onClick={() => setActiveTab('ENGINEERING')} />
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-5xl font-black">Estado del Imperio</h2>
                <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-widest">Control Maestro Activo. Bienvenido, Marcos.</p>
              </div>
              <div className="bg-blue-600 px-8 py-3 rounded-2xl font-black text-xs shadow-lg shadow-blue-900/40">MODO MARCOS 🔐</div>
            </header>

            {/* MÓDULO DE URGENCIA (ROJO COMO LA FOTO) */}
            <div className="bg-[#161b22] border border-red-500/30 rounded-[2.5rem] p-8 relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-red-500 font-black tracking-tighter text-2xl flex items-center gap-2"><Zap size={20}/> MÓDULO DE URGENCIA DINÁMICA (VANCE-01)</h3>
                   <p className="text-slate-500 text-xs font-bold mt-1">Margen de oportunidad real</p>
                 </div>
                 <div className="text-right text-[10px] font-black text-red-500/50 uppercase">Alerta de Stock: 12%</div>
               </div>
               <div className="text-5xl font-black mb-6">-$6,750 USD</div>
               <p className="text-red-500/70 text-xs font-bold mb-8 italic">Pérdida proyectada por demora en leads (15 min)</p>
               <button className="bg-red-500 w-full py-4 rounded-2xl font-black uppercase text-sm shadow-xl shadow-red-900/40">Cierre de Venta Agresivo</button>
            </div>

            {/* MÉTRICAS BLANCAS (COMO LA FOTO) */}
            <div className="grid grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] text-black shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <Users className="text-slate-400" />
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">Global</span>
                  </div>
                  <p className="text-slate-500 text-sm font-bold uppercase">Empresas Activas</p>
                  <h3 className="text-6xl font-black mt-2">14</h3>
               </div>
               <div className="bg-white p-10 rounded-[3rem] text-black shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <CreditCard className="text-slate-400" />
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black">+5%</span>
                  </div>
                  <p className="text-slate-500 text-sm font-bold uppercase">Comisiones Proyectadas</p>
                  <h3 className="text-6xl font-black mt-2">$342,000</h3>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarBtn({ label, icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-[11px] uppercase border ${active ? 'bg-blue-600/10 text-blue-400 border-blue-600/30' : 'text-slate-500 border-transparent hover:bg-slate-800'}`}>
      {icon} <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
    </button>
  );
}
}
