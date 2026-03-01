import React from 'react';
import { Power, Plus } from 'lucide-react';
export default function Users() {
  const usersList = [{ id: 1, name: 'TechCorp USA', status: 'ACTIVE' }, { id: 2, name: 'MedSupply FL', status: 'ACTIVE' }];
  return (
    <div className="bg-[#161b22] p-10 rounded-[3rem] border border-slate-800 space-y-8 shadow-2xl">
      <div className="flex justify-between items-center"><h3 className="text-2xl font-black uppercase italic text-white">Gestión de Cuentas</h3><button className="bg-blue-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase">+ Nuevo Cliente</button></div>
      <div className="space-y-4">
        {usersList.map(u => (
          <div key={u.id} className="p-6 bg-black/20 rounded-2xl border border-slate-800 flex justify-between items-center hover:border-blue-500 transition-all">
            <span className="font-bold text-lg">{u.name}</span>
            <button className="p-3 rounded-full text-green-500 bg-green-500/10 hover:bg-red-500/10 hover:text-red-500 transition-all"><Power size={20}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
