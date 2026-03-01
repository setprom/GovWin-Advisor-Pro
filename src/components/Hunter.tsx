import React from 'react';
import { Zap } from 'lucide-react';
export default function Hunter() {
  return (
    <div className="text-center py-20 animate-in slide-in-from-bottom-10">
      <Zap className="text-red-500 mx-auto mb-6" size={64} />
      <h2 className="text-5xl font-black uppercase tracking-tighter">Cazador de Ventas</h2>
      <p className="text-slate-400 mb-10 text-lg italic max-w-md mx-auto">Christian Vance está localizando a los perdedores de ayer para traerlos como sus clientes hoy.</p>
      <button onClick={()=>alert("Iniciando cacería en SAM.gov...")} className="bg-red-600 hover:bg-red-500 px-16 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-red-900/40 transition-all">Iniciar Cacería Real</button>
    </div>
  );
}
