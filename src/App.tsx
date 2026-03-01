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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        {activeTab === 'DASHBOARD' && <Dashboard />}
        {activeTab === 'STARK' && <SalaStark />}
        {activeTab === 'HUNTER' && <Hunter />}
        {activeTab === 'USERS' && <Users />}
        {activeTab === 'COUPONS' && <Coupons />}
        {activeTab === 'ENGINEERING' && <Engineering />}
      </main>
    </div>
  );
}
