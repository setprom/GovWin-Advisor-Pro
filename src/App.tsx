import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  LogOut, 
  Users, 
  FileText, 
  Lock, 
  Zap, 
  Radar as RadarIcon, 
  Brain, 
  CreditCard, 
  Settings,
  Terminal,
  Mail,
  ChevronRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Importamos nuestros tipos y constantes
import { User, MenuOption, Plan, UserRecord, Evidence, EngineeringLog, Bid, Briefing } from './types';
import { BIDS_DATA } from './constants';

// Importamos los componentes que creamos
import { NavBtn, MetricCard, NeuralLink } from './components/Layout';
import { MarketFeedView, TheForgeLabView, ConsultarChristianView } from './components/UserViews';
import { AdminView, UserManagementView, StrategyRoomView, EngineeringLogView } from './components/AdminViews';

export default function App() {
  // --- ESTADO GLOBAL ---
  const [user, setUser] = useState<User | null>(null);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenuOption>('DASHBOARD');
  const [evidenceLog, setEvidenceLog] = useState<Evidence[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Configuración de APIs y Logs
  const [samApiKey, setSamApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [strategyHistory, setStrategyHistory] = useState<{ role: string, content: string }[]>([]);
  const [engineeringLogs, setEngineeringLogs] = useState<EngineeringLog[]>([]);
  const [briefings, setBriefings] = useState<Briefing[]>([]);

  // Base de datos local (Simulada en localStorage)
  const [usersDb, setUsersDb] = useState<Record<string, UserRecord>>({
    "jefe": { pass: "2Hermanos", niche: "MASTER", active: true, type: 'ADMIN', plan: 'GOLD' }
  });

  // --- PERSISTENCIA (LOCAL STORAGE) ---
  useEffect(() => {
    const config = localStorage.getItem('vance_config');
    if (config) {
      const { samApiKey, groqApiKey } = JSON.parse(config);
      setSamApiKey(samApiKey);
      setGroqApiKey(groqApiKey);
    }
    
    const history = localStorage.getItem('vance_history');
    if (history) setStrategyHistory(JSON.parse(history));

    const logs = localStorage.getItem('vance_eng_logs');
    if (logs) setEngineeringLogs(JSON.parse(logs));
  }, []);

  // --- LÓGICA DE ACCESO ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerUser = username.toLowerCase();
    const record = usersDb[lowerUser];

    if (record && record.pass === password) {
      setUser({ 
        username: lowerUser, 
        niche: record.niche, 
        isAdmin: record.type === 'ADMIN',
        plan: record.plan 
      });
      if (record.type === 'ADMIN') setLegalAccepted(true);
    } else {
      alert("Acceso denegado. Verifica tus credenciales.");
    }
  };

  const logout = () => {
    setUser(null);
    setLegalAccepted(false);
    setUsername('');
    setPassword('');
  };

  // --- RENDERIZADO DE VISTAS ---
  const renderContent = () => {
    if (!user) return null;

    if (user.isAdmin) {
      switch (currentMenu) {
        case 'DASHBOARD': return <AdminView usersCount={Object.keys(usersDb).length} evidenceLog={evidenceLog} />;
        case 'USUARIOS': return <UserManagementView users={usersDb} onCreateUser={(u:string, p:string, n:any, pl:Plan) => setUsersDb(prev => ({...prev, [u.toLowerCase()]: {pass:p, niche:n, active:true, plan:pl}}))} />;
        case 'INTELIGENCIA_SHADOW': return <StrategyRoomView history={strategyHistory} groqApiKey={groqApiKey} onUpdateHistory={(h:any) => { setStrategyHistory(h); localStorage.setItem('vance_history', JSON.stringify(h)); }} />;
        case 'REGISTRO_INGENIERIA': return <EngineeringLogView logs={engineeringLogs} />;
        default: return <AdminView usersCount={Object.keys(usersDb).length} evidenceLog={evidenceLog} />;
      }
    } else {
      switch (currentMenu) {
        case 'MARKET_FEED': return <MarketFeedView niche={user.niche} onSelectBid={(bid) => { setSelectedBid(bid); setCurrentMenu('FORGE'); }} />;
        case 'FORGE': return <TheForgeLabView plan={user.plan} activeBid={selectedBid} onLogEvidence={(ev:any) => setEvidenceLog(prev => [ev, ...prev])} />;
        case 'INTELIGENCIA_SHADOW': return <ConsultarChristianView groqApiKey={groqApiKey} />;
        default: return <MarketFeedView niche={user.niche} onSelectBid={(bid) => { setSelectedBid(bid); setCurrentMenu('FORGE'); }} />;
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md high-tech-card text-center">
          <Shield className="text-brand-blue mx-auto mb-4" size={50} />
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-10">GovWin Advisor</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input className="high-tech-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="high-tech-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="high-tech-button">Access System</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-bg-dark border-r border-border-dark text-white flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-8 flex items-center gap-4">
          <Shield className="w-8 h-8 text-brand-blue" />
          {!isSidebarCollapsed && <h1 className="text-2xl font-black italic uppercase">GovWin AI</h1>}
        </div>
        <nav className="flex-1 px-6 space-y-1">
          {user.isAdmin ? (
            <>
              <NavBtn label="Dashboard" icon={LayoutDashboard} active={currentMenu === 'DASHBOARD'} onClick={() => setCurrentMenu('DASHBOARD')} />
              <NavBtn label="Usuarios" icon={Users} active={currentMenu === 'USUARIOS'} onClick={() => setCurrentMenu('USUARIOS')} />
              <NavBtn label="Estrategia" icon={Brain} active={currentMenu === 'INTELIGENCIA_SHADOW'} onClick={() => setCurrentMenu('INTELIGENCIA_SHADOW')} />
              <NavBtn label="Ingeniería" icon={Terminal} active={currentMenu === 'REGISTRO_INGENIERIA'} onClick={() => setCurrentMenu('REGISTRO_INGENIERIA')} />
            </>
          ) : (
            <>
              <NavBtn label="Market Radar" icon={RadarIcon} active={currentMenu === 'MARKET_FEED'} onClick={() => setCurrentMenu('MARKET_FEED')} />
              <NavBtn label="The Forge" icon={Zap} active={currentMenu === 'FORGE'} onClick={() => setCurrentMenu('FORGE')} />
              <NavBtn label="Consultar Christian" icon={Brain} active={currentMenu === 'INTELIGENCIA_SHADOW'} onClick={() => setCurrentMenu('INTELIGENCIA_SHADOW')} />
            </>
          )}
        </nav>
        <div className="p-6 border-t border-border-dark">
          <button onClick={logout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-brand-red bg-brand-red/5 hover:bg-brand-red/10 transition-all font-black text-[10px] uppercase tracking-widest">
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <NeuralLink />
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
