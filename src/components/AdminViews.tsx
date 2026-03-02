import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Brain, 
  Zap, 
  Lock, 
  Terminal, 
  Activity,
  CheckCircle2,
  MessageSquare,
  User,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRecord, Niche, Plan, EngineeringLog, Evidence, MenuOption } from '../types';
import { MetricCard } from './Layout';
import { christian_vance_brain } from '../services/ai';

export const AdminView = ({ usersCount, evidenceLog }: any) => (
  <div className="space-y-12">
    <header className="flex justify-between items-end">
      <div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Estado del Imperio</h1>
        <p className="text-zinc-500 mt-2 font-bold uppercase text-[10px] tracking-widest italic">Control Maestro Activo. Bienvenido, Marcos.</p>
      </div>
      <div className="bg-brand-blue px-8 py-3 rounded-2xl font-black text-xs shadow-lg shadow-brand-blue/40 flex items-center gap-3">
        <Lock className="w-4 h-4" />
        <span className="uppercase tracking-widest">MODO MARCOS 🔐</span>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <MetricCard title="Empresas Activas" value={(usersCount).toString()} change="Global" icon={Users} trend="neutral" />
      <MetricCard title="Comisiones Proyectadas" value="$145,000" change="+5%" icon={DollarSign} trend="up" />
      <MetricCard title="Nivel del Genio" value="98%" change="OPTIMIZADO" icon={Brain} trend="up" />
    </div>

    <div className="high-tech-card overflow-hidden !p-0">
      <div className="p-6 border-b border-border-dark">
        <h3 className="font-bold text-white">Actividad de los Clientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-zinc-500 bg-bg-dark border-b border-border-dark">
              <th className="px-6 py-3 font-bold">Usuario</th>
              <th className="px-6 py-3 font-bold">Acción</th>
              <th className="px-6 py-3 font-bold">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {evidenceLog.length > 0 ? (
              evidenceLog.slice(0, 5).map((log: any, i: number) => (
                <tr key={i} className="hover:bg-bg-dark transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-blue/10 text-brand-cyan">
                      {log.Usuario}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{log.Acción}</td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-500">{log.Fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-zinc-600 italic">Aún no hay actividad registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const UserManagementView = ({ users, onCreateUser }: { users: Record<string, UserRecord>, onCreateUser: any }) => {
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newNiche, setNewNiche] = useState<Niche>('IT_CYBER');
  const [newPlan, setNewPlan] = useState<Plan>('BRONZE');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-brand-cyan" />
          👥 Control de Clientes
        </h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="high-tech-card space-y-6">
          <h3 className="font-bold text-white">Dar de Alta Empresa</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Usuario" className="high-tech-input" value={newUser} onChange={e => setNewUser(e.target.value)} />
            <input type="text" placeholder="Contraseña" className="high-tech-input" value={newPass} onChange={e => setNewPass(e.target.value)} />
            <select className="high-tech-input bg-bg-dark" value={newNiche || ''} onChange={e => setNewNiche(e.target.value as Niche)}>
              <option value="IT_CYBER">IT & Cyber</option>
              <option value="MEDICAL">Medical</option>
              <option value="CONSTRUCTION">Construction</option>
            </select>
            <select className="high-tech-input bg-bg-dark" value={newPlan} onChange={e => setNewPlan(e.target.value as Plan)}>
              <option value="BRONZE">BRONCE</option>
              <option value="SILVER">PLATA</option>
              <option value="GOLD">ORO</option>
            </select>
            <button className="high-tech-button" onClick={() => { onCreateUser(newUser, newPass, newNiche, newPlan); setNewUser(''); setNewPass(''); }}>Registrar</button>
          </div>
        </div>
        <div className="high-tech-card overflow-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-500 uppercase border-b border-border-dark">
                <th className="pb-3">Usuario</th>
                <th className="pb-3">Nicho</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(users).map(([u, data]) => (
                <tr key={u} className="border-b border-border-dark/50">
                  <td className="py-3 font-mono">{u}</td>
                  <td className="py-3">{data.niche}</td>
                  <td className="py-3 text-emerald-400">{data.active ? 'ACTIVO' : 'PENDIENTE'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const StrategyRoomView = ({ history, onUpdateHistory, groqApiKey }: any) => {
  const [messages, setMessages] = useState(history.length > 0 ? history : [{ role: "assistant", content: "Hola Jefe. ¿En qué puedo ayudarlo hoy?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const response = await christian_vance_brain(groqApiKey, input, "master", messages);
      const updated = [...newMessages, { role: "assistant", content: response }];
      setMessages(updated);
      onUpdateHistory(updated);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-200px)] flex flex-col">
      <header><h1 className="text-3xl font-bold text-white">🧠 Sala de Estrategia</h1></header>
      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-black/60 rounded-3xl border border-border-dark font-mono custom-scrollbar">
        {messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs ${m.role === 'user' ? 'bg-brand-blue/20 text-brand-blue' : 'bg-zinc-900/50 text-emerald-500'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 high-tech-input" placeholder="Comando maestro..." />
        <button onClick={handleSend} className="px-6 bg-brand-cyan text-bg-dark rounded-xl font-bold">Enviar</button>
      </div>
    </div>
  );
};

export const EngineeringLogView = ({ logs }: { logs: EngineeringLog[] }) => (
  <div className="space-y-8">
    <header><h1 className="text-3xl font-bold text-white">🛠️ Registro de Ingeniería</h1></header>
    <div className="space-y-4">
      {logs.map(log => (
        <div key={log.id} className="p-6 rounded-2xl border border-border-dark bg-bg-dark/50 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white">{log.change}</h3>
            <span className="text-[10px] font-mono text-zinc-500">{log.timestamp}</span>
          </div>
          <p className="text-sm text-zinc-300 italic">"{log.reason}"</p>
          <p className="text-xs font-mono text-brand-cyan bg-black/30 p-2 rounded-lg">{log.linesChanged}</p>
        </div>
      ))}
    </div>
  </div>
);
