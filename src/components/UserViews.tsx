import React, { useState } from 'react';
import { 
  Radar as RadarIcon, 
  Zap, 
  Brain, 
  Shield, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Activity, 
  Mail, 
  User, 
  Cpu,
  Database,
  AlertTriangle,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { Bid, Plan, Niche, Briefing, Evidence, EngineeringLog } from '../types';
import { BIDS_DATA } from '../constants';
import { christian_vance_brain } from '../services/ai';

export const MarketFeedView = ({ niche, onSelectBid }: { niche: Niche, onSelectBid: (bid: Bid) => void }) => {
  const displayBids = BIDS_DATA.filter(b => b.niche === niche);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <RadarIcon className="w-8 h-8 text-brand-cyan" />
          📍 Market Radar (Quick Wins)
        </h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {displayBids.map(bid => (
            <div key={bid.id} className="high-tech-card hover:border-brand-cyan transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan border border-brand-blue/50 uppercase">{bid.id}</span>
                  <h3 className="text-xl font-bold text-white">{bid.name}</h3>
                  <p className="text-sm text-zinc-500">{bid.agencia} | {bid.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${bid.monto.toLocaleString()}</p>
                  <p className="text-xs text-emerald-400">{bid.days_left} days left</p>
                </div>
              </div>
              <button onClick={() => onSelectBid(bid)} className="mt-6 w-full high-tech-button">Analyze Profit</button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="high-tech-card bg-brand-blue/5 border-brand-blue/20">
            <h3 className="font-bold text-white mb-4">Radar Intelligence</h3>
            <p className="text-xs text-zinc-400">Market Saturation: 74%</p>
            <p className="text-xs text-brand-cyan">Success Probability: HIGH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TheForgeLabView = ({ plan, activeBid, onLogEvidence }: any) => {
  const [offerPrice, setOfferPrice] = useState(activeBid?.monto || 0);
  const [wholesaleCost, setWholesaleCost] = useState(Math.round((activeBid?.monto || 0) * 0.7));
  const [isGenerating, setIsGenerating] = useState(false);
  const [zipReady, setZipReady] = useState(false);

  const rate = activeBid?.type === 'Supplies' ? 0.02 : 0.05;
  const commission = offerPrice * rate;
  const netProfit = offerPrice - wholesaleCost - commission;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setZipReady(true);
      onLogEvidence({ Usuario: "User", Acción: `Forge: ${activeBid?.id}`, MontoBid: offerPrice, ComisionProyectada: commission, Fecha: new Date().toLocaleTimeString() });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-brand-cyan" />
          🤖 The Forge Lab
        </h1>
      </header>
      <div className="high-tech-card space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Offer Price</label>
            <input type="number" className="high-tech-input" value={offerPrice} onChange={e => setOfferPrice(Number(e.target.value))} />
            <label className="text-xs font-bold text-zinc-500 uppercase">Wholesale Cost</label>
            <input type="number" className="high-tech-input" value={wholesaleCost} onChange={e => setWholesaleCost(Number(e.target.value))} />
          </div>
          <div className="p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex flex-col justify-center items-center">
            <p className="text-xs font-bold text-brand-cyan uppercase">Net Profit</p>
            <p className="text-4xl font-bold text-white">${netProfit.toLocaleString()}</p>
            <p className="text-xs text-red-400 mt-2">Commission: ${commission.toLocaleString()}</p>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating} className="high-tech-button">
          {isGenerating ? "GENERATING..." : "GENERATE WINNING PACKAGE"}
        </button>
        {zipReady && (
          <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-xl text-center font-bold">
            📥 PACKAGE READY FOR DOWNLOAD
          </div>
        )}
      </div>
    </div>
  );
};

export const ConsultarChristianView = ({ groqApiKey }: { groqApiKey: string }) => {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hola. Soy Christian Vance. ¿En qué puedo ayudarte hoy?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await christian_vance_brain(groqApiKey, input, "general", messages);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-black/60 rounded-3xl border border-border-dark font-mono custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs ${m.role === 'user' ? 'bg-brand-blue/20 text-brand-blue' : 'bg-zinc-900/50 text-emerald-500'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-xs text-emerald-500/50 animate-pulse">Christian está analizando...</div>}
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 high-tech-input" placeholder="Pregunta lo que necesites..." />
        <button onClick={handleSend} disabled={isLoading} className="px-6 bg-brand-cyan text-bg-dark rounded-xl font-bold text-xs uppercase">Enviar</button>
      </div>
    </div>
  );
};
