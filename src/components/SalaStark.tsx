import React, { useState } from 'react';
import { Send } from 'lucide-react';
export default function SalaStark() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hola Marcos. ¿Cuál es el próximo movimiento estratégico?' }]);
  const [input, setInput] = useState('');

  const sendMsg = async () => {
    if(!input) return;
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    // El motor Groq se conecta vía Vercel Environment Variables
    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${import.meta.env.VITE_GROQ_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{role:"system", content:"Eres Christian Vance, socio de Marcos. Habla en español."}, ...messages, userMsg] })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Marcos, conexión inestable. Revisa la VITE_GROQ_KEY.' }]); }
  };

  return (
    <div className="bg-[#161b22] rounded-[2.5rem] border border-slate-800 h-[80vh] flex flex-col overflow-hidden shadow-2xl">
      <div className="p-4 bg-black/40 border-b border-slate-800 font-black text-[10px] uppercase text-cyan-400">Christian Vance Neural Link v23.0</div>
      <div className="flex-1 p-8 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[75%] text-sm ${m.role === 'user' ? 'bg-blue-600 shadow-lg' : 'bg-slate-800 border border-slate-700 text-slate-200'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-black/40 border-t border-slate-800 flex gap-2">
        <input className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-white" placeholder="Habla con Christian Vance..." value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter' && sendMsg()} />
        <button onClick={sendMsg} className="bg-cyan-500 text-black px-8 rounded-xl font-black"><Send size={18}/></button>
      </div>
    </div>
  );
}
