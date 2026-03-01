import React, { useState } from 'react';
import { 
  Shield, Zap, Brain, Terminal, Users, BarChart3, CreditCard, 
  Target, MessageSquare, Lock, Bell, Search, Trash2, FileText, 
  ChevronRight, CheckCircle, AlertTriangle, Send, Plus, History, Settings
} from 'lucide-react';

export default function App() {
  // --- ESTADOS DE MANDO ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loginTab, setLoginTab] = useState('LOGIN');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola Marcos. Sistema Jarvis v23.0 Operativo. ¿Cuál es el plan estratégico hoy?' }
  ]);

  const handleLogin = () => {
    if (user.toLowerCase().trim() === 'jefe' && pass === '2Hermanos') setIsLoggedIn(true);
  };

  // --- VISTA 1: IDENTITY GATE (COMO TU FOTO) ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#161b22] rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl">
          <div className="text-center mb-8">
            <Shield className="text-blue-500 mx-auto mb-4" size={50} />
            <h1 className="text-3xl font-black italic tracking-tighter">GovWin Advisor</h1>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-slate-800">
            <button onClick={() => setLoginTab('LOGIN')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${loginTab === 'LOGIN' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>LOGIN</button>
            <button onClick={() => setLoginTab('REGISTER')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${loginTab === 'REGISTER' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>REGISTER BUSINESS</button>
            <button onClick={() => setLoginTab('RECOVERY')} className={`flex-1 py-2 text-[10px] font-black rounded-lg ${loginTab === 'RECOVERY' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>RECOVERY</button>
          </div>
          {loginTab === 'LOGIN' && (
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Username / Usuario</label>
              <input className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500" placeholder="Enter your username" onChange={e => setUser(e.target.value)} />
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Password / Contraseña</label>
              <input className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500" type="password" placeholder="••••••••" onChange={e => setPass(e.target.value)} />
              <button onClick={handleLogin} className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs mt-4">Access System</button>
            </div>
          )}
          {loginTab !== 'LOGIN' && <div className="text-center py-6 text-slate-500 italic">Sección {loginTab} Protegida.</div>}
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPAL: MODO MASTER (MARCOS) ---
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex font-sans overflow-hidden">
      {/* SIDEBAR TIPO STARK (COMO TU FOTO) */}
      <aside className="w-72 bg-[#0d1117] border-r border-slate-800 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2"><Shield className="text-blue-500" size={24}/><h1 className="text-xl font-black italic tracking-tighter text-white">GOVWIN</h1></div>
        
        <div className="bg-[#161b22] p-4 rounded-2xl border border-slate-800 mb-8">
          <p className="text-[10px]
