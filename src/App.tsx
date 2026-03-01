import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SalaStark from './components/SalaStark';
import Hunter from './components/Hunter';
import Users from './components/Users';
import Coupons from './components/Coupons';
import Engineering from './components/Engineering';

export default function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  return (
    <div className="flex bg-[#0a0c10] min-h-screen text-white font-sans overflow-hidden">
      {/* SIDEBAR FIJA */}
      <div className="w-64 flex-shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* CONTENIDO PRINCIPAL CON SCROLL */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'DASHBOARD' && <Dashboard />}
          {activeTab === 'STARK' && <SalaStark />}
          {activeTab === 'HUNTER' && <Hunter />}
          {activeTab === 'USERS' && <Users />}
          {activeTab === 'COUPONS' && <Coupons />}
          {activeTab === 'ENGINEERING' && <Engineering />}
        </div>
      </main>
    </div>
  );
}
