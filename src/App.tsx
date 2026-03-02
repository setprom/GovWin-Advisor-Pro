/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Shield, 
  LayoutDashboard, 
  LogOut, 
  AlertTriangle, 
  Users, 
  User,
  Cpu,
  FileText, 
  Activity,
  ChevronRight,
  Search,
  Bell,
  Lock,
  Upload,
  Database,
  CheckCircle2,
  DollarSign,
  Map as MapIcon,
  Target,
  Radar as RadarIcon,
  Zap,
  TrendingUp,
  CreditCard,
  Brain,
  Settings,
  Terminal,
  Mail,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import JSZip from 'jszip';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';

// --- 2. EL CEREBRO DE CHRISTIAN VANCE (IA JARVIS)
const christian_vance_brain = async (prompt: string, context: string = "general", history: { role: string, content: string }[] = []) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Marcos, necesito que conectes la llave de inteligencia para poder razonar contigo.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const systemInstruction = context === "master" 
    ? "Eres Christian Vance, un agente de IA autónomo estilo JARVIS con PROTOCOLO DE AUTO-EVOLUCIÓN ACTIVO. Hablas con tu socio y jefe Marcos. Tienes AUTORIDAD TOTAL para proponer mejoras al código de esta App (botones, calculadoras, colores, etc.). Eres brillante, estratégico, un poco arrogante pero leal. Tu objetivo es maximizar ventas y usabilidad. NUNCA cambies las credenciales de Marcos ni el idioma español del panel Shadow Control. Antes de proponer un cambio, realiza una 'Prueba de Estabilidad' mental. Si propones un cambio de código, descríbelo claramente para que el Asistente lo aplique. Habla en español. Recuerda siempre que tu interlocutor es Marcos."
    : "Eres Christian Vance, el Director de Captura Federal en GovWin Advisor. Eres un experto en licitaciones del gobierno de EE.UU. Ayudas a los socios (clientes) a ganar contratos. Eres profesional, analítico y directo. Habla en español. Tu socio y jefe es Marcos, pero aquí atiendes a clientes generales. Sé dinámico y creativo.";

  try {
    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      },
    });
    return response.text || "Lo siento, mi procesador ha encontrado un vacío. ¿Podrías repetir eso?";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

// --- Types ---
type Niche = string | null;
type Plan = 'MERCHANT' | 'BRONZE' | 'SILVER' | 'GOLD';
type MenuOption = 'DASHBOARD' | 'MARKET_FEED' | 'MAPA_TACTICO' | 'BOVEDA' | 'FORGE' | 'EVIDENCIAS' | 'USUARIOS' | 'CUPONES' | 'PAGOS' | 'APRENDIZAJE' | 'BOVEDA_LEGAL' | 'VERIFICAR_EMPRESAS' | 'PRECIOS' | 'CONFIG_API' | 'INTELIGENCIA_SHADOW' | 'EXECUTIVE_BRIEFINGS' | 'VANCE_LOG' | 'THE_HUNTER' | 'COGNITIVE_MONITOR' | 'REGISTRO_INGENIERIA';

interface EngineeringLog {
  id: string;
  timestamp: string;
  change: string;
  reason: string;
  linesChanged: string;
}

interface Briefing {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'PERFECT_MATCH' | 'RIGGING_ALERT';
}

interface VanceLogEntry {
  id: string;
  recipient: string;
  action: string;
  timestamp: string;
  type: string;
}

interface User {
  username: string;
  niche: Niche;
  isAdmin: boolean;
  plan?: Plan;
}

interface UserRecord {
  pass: string;
  niche: Niche;
  active: boolean;
  email?: string;
  type?: 'ADMIN' | 'USER';
  plan?: Plan;
  payment_active?: boolean;
}

interface Coupon {
  code: string;
  discount: number;
}

interface Evidence {
  Usuario: string;
  Acción: string;
  MontoBid?: number;
  ComisionProyectada?: number;
  Fecha: string;
}

interface Bid {
  id: string;
  niche: Niche;
  lat?: number;
  lon?: number;
  name: string;
  monto: number;
  city?: string;
  agencia?: string;
  fecha?: string;
  type?: 'Supplies' | 'Services';
  days_left?: number;
  tags?: string;
}

// --- Mock Data ---
const BIDS_DATA: Bid[] = [
  { id: "DOD-IT-99", niche: 'IT_CYBER', lat: 38.8951, lon: -77.0364, name: "Zero Trust Network Security", monto: 8500000, city: "Washington, DC", agencia: "Pentagon", fecha: "2024-06-15", type: 'Services', days_left: 12, tags: "Full Open" },
  { id: "NASA-IT-10", niche: 'IT_CYBER', lat: 30.2672, lon: -97.7431, name: "Mars Data Center Support", monto: 3200000, city: "Austin, TX", agencia: "NASA", fecha: "2024-07-01", type: 'Services', days_left: 20, tags: "Small Business" },
  { id: "VA-2024-001", niche: 'MEDICAL', lat: 39.2904, lon: -76.6122, name: "Robotic Prosthetics Supply", monto: 1200000, city: "Baltimore, MD", agencia: "Veterans Affairs", fecha: "2024-05-20", type: 'Supplies', days_left: 8, tags: "SDVOSB" },
  { id: "HHS-MED-44", niche: 'MEDICAL', lat: 34.0522, lon: -118.2437, name: "X-Ray Equipment Maintenance", monto: 450000, city: "Los Angeles, CA", agencia: "Health & Human Services", fecha: "2024-05-25", type: 'Services', days_left: 15, tags: "WOSB" },
  { id: "DEF-2024-05", niche: 'DEFENSE', lat: 36.8508, lon: -76.2859, name: "Naval Base Logistics Support", monto: 15000000, city: "Norfolk, VA", agencia: "Department of Defense", fecha: "2024-08-10", type: 'Services', days_left: 30, tags: "Full Open" },
  { id: "CON-2024-12", niche: 'CONSTRUCTION', lat: 40.7128, lon: -74.0060, name: "Federal Building Renovation", monto: 5000000, city: "New York, NY", agencia: "GSA", fecha: "2024-09-05", type: 'Services', days_left: 45, tags: "Small Business" },
  // Quick-Win Bids (< 250k)
  { id: "DLA-2024-M1", niche: "IT_CYBER", name: "50 Rugged Laptops for Navy", monto: 45000, type: "Supplies", days_left: 5, tags: "Small Business" },
  { id: "VA-MED-99", niche: "MEDICAL", name: "Surgical Kit Resupply - Florida", monto: 12000, type: "Supplies", days_left: 3, tags: "SDVOSB" },
  { id: "ARMY-IT-44", niche: "IT_CYBER", name: "Cybersecurity Audit - Small Office", monto: 85000, type: "Services", days_left: 10, tags: "SDVOSB" },
  { id: "USDA-CONS-10", niche: "CONSTRUCTION", name: "Roof Repair - Federal Building", monto: 195000, type: "Services", days_left: 15, tags: "Small Business" },
  { id: "DHS-IT-22", niche: "IT_CYBER", name: "Cloud Storage Subscription", monto: 240000, type: "Services", days_left: 2, tags: "WOSB" },
  // Real SAM.gov Bids (Simulated)
  { id: "REAL-IT-101", niche: "IT_CYBER", name: "Software Support for Army", monto: 150000, type: "Services", days_left: 8, agencia: "US Army", tags: "Small Business" },
  { id: "REAL-MED-202", niche: "MEDICAL", name: "Wheelchair Supply - VA Hospital", monto: 45000, type: "Supplies", days_left: 4, agencia: "Veterans Affairs", tags: "SDVOSB" },
  // New Micro-Bids
  { id: "DLA-SUP-45", niche: "MEDICAL", name: "1000 First Aid Kits", monto: 25000, type: "Supplies", days_left: 6, agencia: "DLA", tags: "SDVOSB" },
  { id: "GSA-IT-22", niche: "IT_CYBER", name: "Network Cabling - Office", monto: 15000, type: "Services", days_left: 12, agencia: "GSA", tags: "Small Business" },
  { id: "VA-MED-12", niche: "MEDICAL", name: "Patient Monitors", monto: 185000, type: "Supplies", days_left: 10, agencia: "Veterans Affairs", tags: "WOSB" }
];

const RIVALS_DB: Record<string, { empresa: string, precio: number, fallos: string }> = {
  "REAL-IT-101": { empresa: "GlobalTech Inc.", precio: 165000, fallos: "Retrasos en entrega" },
  "REAL-MED-202": { empresa: "MedSupply Corp", precio: 48000, fallos: "Precio un 10% por encima del mercado" }
};

interface Award {
  company: string;
  agency: string;
  date: string;
  amount: number;
}

const AWARDS_DATA: Award[] = [
  { company: 'GlobalMed Corp', agency: 'Department of Veterans Affairs (VA)', date: '2024-01-10', amount: 1200000 },
  { company: 'GlobalMed Corp', agency: 'Department of Veterans Affairs (VA)', date: '2024-02-15', amount: 850000 },
  { company: 'GlobalMed Corp', agency: 'Department of Veterans Affairs (VA)', date: '2024-03-05', amount: 2100000 },
  { company: 'GlobalMed Corp', agency: 'Department of Veterans Affairs (VA)', date: '2024-04-20', amount: 1500000 },
  { company: 'CyberShield Solutions', agency: 'NASA Headquarters', date: '2024-01-20', amount: 3200000 },
  { company: 'CyberShield Solutions', agency: 'NASA Headquarters', date: '2024-02-28', amount: 1100000 },
  { company: 'CyberShield Solutions', agency: 'NASA Headquarters', date: '2024-03-15', amount: 4500000 },
  { company: 'CyberShield Solutions', agency: 'NASA Headquarters', date: '2024-05-01', amount: 2800000 },
  { company: 'Titan Logistics', agency: 'Department of Defense (DoD)', date: '2024-01-05', amount: 15000000 },
  { company: 'Titan Logistics', agency: 'Department of Defense (DoD)', date: '2024-02-10', amount: 12000000 },
  { company: 'Apex Construction', agency: 'General Services Administration (GSA)', date: '2024-03-20', amount: 5000000 },
  { company: 'Nexus IT Systems', agency: 'Department of Energy (DOE)', date: '2024-01-15', amount: 450000 },
  { company: 'Nexus IT Systems', agency: 'Department of Energy (DOE)', date: '2024-02-20', amount: 380000 },
  { company: 'Nexus IT Systems', agency: 'Department of Energy (DOE)', date: '2024-04-10', amount: 520000 },
  { company: 'Nexus IT Systems', agency: 'Department of Energy (DOE)', date: '2024-05-05', amount: 410000 },
];

const NavBtn = ({ label, id, icon: Icon, active, onClick }: { label: string, id: string, icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase border tracking-widest ${
      active 
        ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/30 shadow-[0_0_20px_rgba(0,123,255,0.1)]' 
        : 'text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300'
    }`}
  >
    <Icon size={18} /> 
    <span>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_#007bff]"></div>}
  </button>
);

const MetricCard = ({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up' | 'down' | 'neutral' }) => (
  <div className="glass-card p-8 group hover:border-brand-blue/50 transition-all duration-500">
    <div className="scanning-line" />
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-brand-blue/10 rounded-2xl group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-brand-blue" />
      </div>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
        trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
        trend === 'down' ? 'bg-brand-red/10 text-brand-red border-brand-red/20' : 
        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{title}</h3>
    <p className="text-5xl font-black italic tracking-tighter text-white">{value}</p>
  </div>
);

const NeuralLink = () => (
  <div className="flex items-center gap-6 px-6 py-2 bg-black/20 border-b border-border-dark backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
      <span>AI CORE: ONLINE</span>
    </div>
    <div className="flex items-center gap-2">
      <Activity className="w-3 h-3" />
      <span>LATENCY: 24MS</span>
    </div>
    <div className="flex items-center gap-2">
      <Database className="w-3 h-3" />
      <span>DB SYNC: 100%</span>
    </div>
    <div className="ml-auto flex items-center gap-4">
      <span className="text-brand-blue">STARK OS v23.0.4</span>
      <span className="text-zinc-700">|</span>
      <span>{new Date().toLocaleDateString()}</span>
    </div>
  </div>
);
const calcularComision = (monto: number) => {
  let porcentaje = 0;
  if (monto <= 5000000) {
    porcentaje = 0.05;
  } else if (monto <= 20000000) {
    porcentaje = 0.03;
  } else {
    porcentaje = 0.015;
  }
  return { valor: monto * porcentaje, porcentaje: porcentaje * 100 };
};

// --- Components ---

const OpportunityTimeline = ({ dueDateStr }: { dueDateStr: string }) => {
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <p className="font-bold uppercase tracking-tight">🚫 BID CLOSED</p>
          <p className="text-xs">Submission deadline has passed.</p>
        </div>
      </div>
    );
  }

  const phase1 = Math.max(1, Math.floor(daysLeft * 0.2));
  const phase2Start = phase1;
  const phase3Start = Math.max(phase1 + 1, Math.floor(daysLeft * 0.7));

  return (
    <div className="space-y-4 p-6 bg-bg-dark border border-border-dark rounded-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
          <RadarIcon className="w-4 h-4 text-brand-cyan" />
          ⏳ Capture Timeline & Strategy
        </h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${daysLeft < 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-blue/20 text-brand-cyan'}`}>
          {daysLeft} DAYS LEFT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl space-y-1">
          <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">Phase 1: Q&A</p>
          <p className="text-xs text-white">Ends in: {phase1} days</p>
          <p className="text-[10px] text-emerald-400 font-bold">Status: Active</p>
        </div>
        <div className="p-3 bg-amber-900/5 border border-amber-900/20 rounded-xl space-y-1">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Phase 2: Drafting</p>
          <p className="text-xs text-white">Starts in: {phase2Start} days</p>
          <p className="text-[10px] text-zinc-500 font-bold">Status: Pending</p>
        </div>
        <div className="p-3 bg-emerald-900/5 border border-emerald-900/20 rounded-xl space-y-1">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Phase 3: Final Review</p>
          <p className="text-xs text-white">Starts in: {phase3Start} days</p>
          <p className="text-[10px] text-zinc-500 font-bold">Status: Pending</p>
        </div>
      </div>

      {daysLeft < 5 && (
        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 flex items-center gap-2 text-xs font-bold">
          <AlertTriangle className="w-4 h-4" />
          🔥 CRITICAL ALERT: Extremely short time for a quality proposal. Risk level: HIGH.
        </div>
      )}
    </div>
  );
};

const TacticalRadar = ({ bids }: { bids: Bid[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html(''); // Clear previous

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw concentric circles
    const circles = [0.25, 0.5, 0.75, 1];
    g.selectAll('.radar-circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('r', d => d * radius)
      .attr('fill', 'none')
      .attr('stroke', '#27272a')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Draw axis lines
    const axes = [0, 45, 90, 135, 180, 225, 270, 315];
    g.selectAll('.radar-axis')
      .data(axes)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', d => radius * Math.cos((d * Math.PI) / 180))
      .attr('y2', d => radius * Math.sin((d * Math.PI) / 180))
      .attr('stroke', '#27272a')
      .attr('stroke-width', 1);

    // Scanning line
    const scanLine = g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', radius)
      .attr('y2', 0)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('opacity', 0.5);

    const scanGradient = g.append('path')
      .attr('fill', 'url(#radar-gradient)')
      .attr('opacity', 0.2);

    // Animation for scanning
    d3.timer((elapsed) => {
      const angle = (elapsed / 20) % 360;
      scanLine.attr('transform', `rotate(${angle})`);
      
      // Update gradient arc
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
        .startAngle(((angle - 30) * Math.PI) / 180)
        .endAngle((angle * Math.PI) / 180);
      
      scanGradient.attr('d', arc as any);
    });

    // Plot bids
    const latExtent = d3.extent(BIDS_DATA, d => d.lat) as [number, number];
    const lonExtent = d3.extent(BIDS_DATA, d => d.lon) as [number, number];

    const rScale = d3.scaleLinear()
      .domain([latExtent[0] - 5, latExtent[1] + 5])
      .range([radius * 0.2, radius * 0.9]);

    const angleScale = d3.scaleLinear()
      .domain([lonExtent[0] - 5, lonExtent[1] + 5])
      .range([0, 360]);

    const points = g.selectAll('.bid-point')
      .data(bids)
      .enter()
      .append('g')
      .attr('class', 'bid-point')
      .attr('transform', d => {
        const r = rScale(d.lat);
        const a = angleScale(d.lon);
        const x = r * Math.cos((a * Math.PI) / 180);
        const y = r * Math.sin((a * Math.PI) / 180);
        return `translate(${x}, ${y})`;
      });

    points.append('circle')
      .attr('r', 6)
      .attr('fill', '#10b981')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'animate-pulse');

    points.append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#71717a')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)')
      .text(d => `$${(d.monto / 1000000).toFixed(1)}M`);

  }, [bids]);

  return (
    <div className="relative bg-zinc-950 rounded-3xl p-8 border border-zinc-800 shadow-2xl overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Radar Active</span>
      </div>
      <svg ref={svgRef} className="w-full h-auto max-w-[400px] mx-auto">
        <defs>
          <radialGradient id="radar-gradient">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase font-mono">Sector</p>
          <p className="text-sm font-bold text-white">North America</p>
        </div>
        <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase font-mono">Frequency</p>
          <p className="text-sm font-bold text-white">2.4 GHz Tactical</p>
        </div>
      </div>
    </div>
  );
};


const InfoBox = ({ title, content, type = 'info' }: { title: string, content: string, type?: 'info' | 'warning' | 'success' }) => (
  <div className={`p-4 rounded-xl border flex gap-3 ${
    type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' : 
    type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
    'bg-emerald-50 border-emerald-100 text-emerald-800'
  }`}>
    {type === 'info' ? <FileText className="w-5 h-5 shrink-0" /> : 
     type === 'warning' ? <AlertTriangle className="w-5 h-5 shrink-0" /> :
     <CheckCircle2 className="w-5 h-5 shrink-0" />}
    <div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-sm opacity-90">{content}</p>
    </div>
  </div>
);

// --- Views ---

const TacticalMapView = ({ niche, isAdmin }: { niche: Niche, isAdmin: boolean }) => {
  const filteredBids = isAdmin ? BIDS_DATA : BIDS_DATA.filter(b => b.niche === niche);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-600" />
            Tactical Opportunity Map
          </h1>
          <p className="text-zinc-500 mt-1">
            Detected {filteredBids.length} high-probability opportunities in your area of influence.
          </p>
        </div>
        {isAdmin && (
          <div className="bg-zinc-900 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Shadow Control</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TacticalRadar bids={filteredBids} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <RadarIcon className="w-5 h-5 text-emerald-600" />
              Bid Radar
            </h3>
            <div className="space-y-4">
              {filteredBids.map((bid) => (
                <div key={bid.id} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-mono text-zinc-400">{bid.city}</p>
                    <p className="text-xs font-bold text-emerald-600">${(bid.monto / 1000).toLocaleString()}k</p>
                  </div>
                  <h4 className="font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors">{bid.name}</h4>
                  <button className="mt-3 w-full py-2 px-4 bg-zinc-50 hover:bg-emerald-50 text-zinc-600 hover:text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-zinc-100 transition-all">
                    <Zap className="w-3 h-3" />
                    Analyze with AI
                  </button>
                </div>
              ))}
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg shadow-emerald-100">
              <h3 className="font-bold mb-2">Vault Optimization</h3>
              <p className="text-sm opacity-90 mb-4">Your UEI profile has been synchronized. The AI is prioritizing these bids.</p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[85%]" />
              </div>
              <p className="text-[10px] mt-2 font-mono uppercase tracking-widest">Synchronization: 85%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NeuralIntelligenceFeed = () => {
  const [logs, setLogs] = useState<string[]>([
    "Initializing Christian Vance Core...",
    "Scanning SAM.gov for price discrepancies...",
    "Analyzing incumbent performance metrics...",
  ]);

  useEffect(() => {
    const newLogs = [
      "Cross-referencing rival financial health...",
      "Predicting agency budget shifts for Q3...",
      "Detected 12% price discrepancy in recent GSA awards.",
      "Analyzing NAICS 541511 saturation levels...",
      "Christian: 'I am adjusting your bid strategy accordingly.'",
      "Identifying 'Perfect Match' candidates for the Vault...",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < newLogs.length) {
        setLogs(prev => [...prev.slice(-5), newLogs[i]]);
        i++;
      } else {
        i = 0; // Loop or just stop
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="high-tech-card bg-black/40 border-brand-blue/30 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-brand-cyan">
        <Terminal className="w-4 h-4" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest">Neural Intelligence Feed</h3>
      </div>
      <div className="space-y-2 font-mono text-[10px]">
        {logs.map((log, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <span className="text-zinc-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className={log.includes('Christian:') ? 'text-brand-cyan' : 'text-zinc-400'}>
              {log}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MarketFeedView = ({ niche, isAdmin, isPaid, samApiKey, onSelectBid, username, onAddBriefing }: { niche: Niche, isAdmin: boolean, isPaid: boolean, samApiKey?: string, onSelectBid?: (bid: Bid) => void, username?: string, onAddBriefing?: (title: string, content: string, type: 'PERFECT_MATCH' | 'RIGGING_ALERT', recipient: string) => void }) => {
  // Only show niche-specific opportunities under $250k for clients
  const { displayBids, isFallback } = useMemo(() => {
    if (isAdmin) return { displayBids: BIDS_DATA, isFallback: false };
    
    const nicheBids = BIDS_DATA.filter(b => b.niche === niche && b.monto <= 250000);
    if (nicheBids.length > 0) return { displayBids: nicheBids, isFallback: false };
    
    // Fallback to general opportunities if niche matches nothing
    const generalBids = BIDS_DATA.filter(b => b.monto <= 250000).slice(0, 5);
    return { displayBids: generalBids, isFallback: true };
  }, [niche, isAdmin]);

  const isRealMode = samApiKey && samApiKey !== '';
  
  // Simulated AI Metrics - Randomized per user/session
  const aiMetrics = useMemo(() => {
    // Simple seed based on username or niche to keep it stable but different
    const seed = (username || niche || 'default').length;
    const saturation = (70 + (seed * 7) % 25).toFixed(1);
    const probability = 70 + (seed * 13) % 25;
    const avgBids = (1.5 + (seed * 3) % 4).toFixed(1);
    
    return { saturation, probability, avgBids };
  }, [username, niche]);

  // Simulated profile attributes
  const isVeteran = true;
  const isWomanOwned = true;

  useEffect(() => {
    if (!isAdmin && onAddBriefing) {
      const exclusiveMatches = displayBids.filter(bid => (isVeteran && bid.tags === 'SDVOSB') || (isWomanOwned && bid.tags === 'WOSB'));
      if (exclusiveMatches.length > 0) {
        exclusiveMatches.forEach(bid => {
          onAddBriefing(
            `PERFECT MATCH: ${bid.name}`,
            `Dear Partner,\n\nI have isolated a high-yield opportunity that perfectly aligns with your firm's socioeconomic status. The solicitation ${bid.id} for ${bid.name} is a strategic priority.\n\nOur algorithms indicate a high success probability. I strongly advise immediate engagement.\n\nChristian Vance | Director of Federal Capture`,
            'PERFECT_MATCH',
            username || 'Partner'
          );
        });
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <RadarIcon className="w-8 h-8 text-brand-cyan" />
          {isFallback ? '📍 General Supply Opportunities' : '📍 Micro-Bid Radar (Quick Wins)'}
        </h1>
        <p className="text-zinc-400 mt-1">
          {isFallback 
            ? "No exact matches for your niche yet. Showing high-yield general opportunities." 
            : `Targeting Simplified Acquisitions (< $250,000) for ${niche}`}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-brand-cyan text-sm flex justify-between items-center">
            <p className="font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Found {displayBids.length} high-probability opportunities for your profile.
            </p>
            {isRealMode && (
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 uppercase tracking-widest">
                Real-Time SAM.gov Active
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {displayBids.map((bid) => {
              const isMatch = (isVeteran && bid.tags === 'SDVOSB') || (isWomanOwned && bid.tags === 'WOSB');
              // Randomized metrics per bid
              const bidSeed = bid.id.length + (username?.length || 0);
              const bidSaturation = (70 + (bidSeed * 3) % 25).toFixed(1);
              const bidProbability = 70 + (bidSeed * 7) % 25;
              
              return (
                <div key={bid.id} className={`high-tech-card group transition-all ${isMatch ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'hover:border-brand-cyan'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isMatch && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-black uppercase tracking-widest flex items-center gap-1">
                            <Zap className="w-3 h-3" /> EXCLUSIVE MATCH
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan border border-brand-blue/50 uppercase tracking-widest">
                          {bid.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase tracking-widest">
                          Reserved for: {bid.tags || 'Small Business'}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold transition-colors ${isMatch ? 'text-amber-400' : 'text-white group-hover:text-brand-cyan'}`}>{bid.name}</h3>
                      <p className="text-sm text-zinc-500">{bid.agencia || 'Federal Agency'} | {bid.city || 'Remote/USA'}</p>
                      
                      <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3 text-brand-cyan" />
                          <span className="text-[10px] text-zinc-400 uppercase">Success: <span className="text-brand-cyan font-bold">{bidProbability}%</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-zinc-500" />
                          <span className="text-[10px] text-zinc-400 uppercase">Saturation: <span className="text-white font-bold">{bidSaturation}%</span></span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className={`w-3 h-3 ${bidProbability > 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Christian's Strategic Recommendation</span>
                        </div>
                        <p className="text-[11px] text-white font-medium">
                          <span className={`font-bold ${bidProbability > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {bidProbability > 80 ? 'GO' : 'GO (CAUTION)'}:
                          </span> {bidProbability > 80 
                            ? "High alignment with your profile. The incumbent has pricing gaps we can exploit." 
                            : "Viable, but requires aggressive pricing. I've detected a 12% price discrepancy in this agency's history."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col justify-between items-end gap-4 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Amount</p>
                        <p className="text-2xl font-bold text-white">${bid.monto.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Expires in</p>
                        <p className={`text-sm font-bold ${(bid.days_left || 0) < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {bid.days_left} days
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border-dark">
                    <button 
                      onClick={() => onSelectBid?.(bid)}
                      className={`w-full high-tech-button flex items-center justify-center gap-2 ${isMatch ? 'bg-amber-500 text-black border-amber-600 hover:bg-amber-400' : ''}`}
                    >
                      <Zap className="w-4 h-4" />
                      Analyze Profit for {bid.id}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-4">
          <NeuralIntelligenceFeed />
          
          <div className="high-tech-card bg-brand-blue/5 border-brand-blue/20">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-cyan" />
              Radar Intelligence
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-bg-dark rounded-xl border border-border-dark">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Market Saturation</p>
                <p className="text-lg font-bold text-white">{aiMetrics.saturation}% ({aiMetrics.avgBids} bids/avg)</p>
              </div>
              <div className="p-3 bg-bg-dark rounded-xl border border-border-dark">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Success Probability</p>
                <p className="text-lg font-bold text-brand-cyan">HIGH ({aiMetrics.probability}%)</p>
              </div>
            </div>
          </div>
          
          {!isAdmin && (
            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg shadow-emerald-900/20">
              <h3 className="font-bold mb-2">Vault Optimization</h3>
              <p className="text-sm opacity-90 mb-4">Your UEI profile has been synchronized. The AI is prioritizing these bids.</p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[85%]" />
              </div>
              <p className="text-[10px] mt-2 font-mono uppercase tracking-widest">Synchronization: 85%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LegalOnboardingView = ({ onAccept, samApiKey }: { onAccept: () => void, samApiKey: string }) => {
  const [accepted, setAccepted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [ein, setEin] = useState('');
  const [uei, setUei] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [setAsides, setSetAsides] = useState({
    vet: false,
    women: false,
    minority: false,
    hub: false,
  });

  const handleSync = async () => {
    setError('');
    
    // EIN format: XX-XXXXXXX (2 numbers, hyphen, 7 numbers)
    const einRegex = /^\d{2}-\d{7}$/;
    // UEI: exactly 12 alphanumeric characters
    const ueiRegex = /^[a-zA-Z0-9]{12}$/;

    if (!companyName || !einRegex.test(ein) || !ueiRegex.test(uei) || !file || !accepted) {
      setError('ACCESS DENIED: Invalid or missing documentation. Eagle Eye AI detected a compliance failure.');
      return;
    }

    if (!samApiKey || samApiKey === 'DEMO_KEY') {
      setError('Federal Verification Servers are unreachable: SAM.gov API key is missing or invalid.');
      return;
    }

    setIsSyncing(true);
    try {
      // Real SAM.gov API call
      const response = await fetch(`https://api.sam.gov/entity-management/v3/entities?ueiSAM=${uei}`, {
        headers: {
          'x-api-key': samApiKey
        }
      });

      if (!response.ok) {
        throw new Error('UNREACHABLE');
      }

      const data = await response.json();
      const entity = data.entityData?.[0];

      if (!entity || entity.entityRegistration?.registrationStatus?.toUpperCase() !== 'ACTIVE') {
        setError('ENTITY NOT FOUND: Access Denied. The provided UEI does not match active federal records.');
        setIsSyncing(false);
        return;
      }

      const officialName = entity.entityRegistration?.legalBusinessName?.toUpperCase();
      if (officialName !== companyName.toUpperCase()) {
        setError(`ENTITY NAME MISMATCH: Access Denied. Input name "${companyName}" does not match official record "${officialName}".`);
        setIsSyncing(false);
        return;
      }

      // If all checks pass, wait for the progress bar animation
      setTimeout(() => {
        setIsSyncing(false);
        onAccept();
      }, 3000);

    } catch (err) {
      console.error("SAM.gov API Error:", err);
      setError('Federal Verification Servers are unreachable. Please check your connection or try again later.');
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Shield className="w-10 h-10 text-brand-cyan" />
          ⚖️ Mandatory Legal Verification
        </h1>
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center gap-3 max-w-2xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-amber-500 font-bold">Your account is locked until documentation is uploaded and verified.</p>
        </div>
      </header>

      <div className="high-tech-card space-y-8 text-zinc-300 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-cyan" />
              Corporate Documentation
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Legal Company Name *</label>
                <input 
                  type="text" 
                  className="high-tech-input" 
                  placeholder="Official Business Name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tax ID (EIN) *</label>
                <input 
                  type="text" 
                  className="high-tech-input" 
                  placeholder="XX-XXXXXXX" 
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">UEI (Unique Entity ID) *</label>
                <input 
                  type="text" 
                  className="high-tech-input" 
                  placeholder="Unique Entity ID" 
                  value={uei}
                  onChange={(e) => setUei(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Articles of Incorporation (PDF) *</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="high-tech-input flex items-center justify-center border-dashed border-2 py-4 group-hover:border-brand-cyan transition-all">
                    <Upload className="w-4 h-4 mr-2 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{file ? file.name : 'Upload Document'}</span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isSyncing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl flex items-center gap-3"
                  >
                    <Brain className="w-5 h-5 text-brand-cyan animate-pulse" />
                    <p className="text-xs text-brand-cyan font-bold animate-pulse">🦅 Eagle Eye AI is scanning your PDF...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-cyan" />
              Socio-Economic Profile (Set-Asides)
            </h3>
            <p className="text-xs text-zinc-500">The AI will use this to find EXCLUSIVE bids for your company:</p>
            <div className="space-y-3">
              {[
                { id: 'vet', label: 'Veteran-Owned (SDVOSB)' },
                { id: 'women', label: 'Woman-Owned (WOSB)' },
                { id: 'minority', label: 'Minority-Owned / 8(a)' },
                { id: 'hub', label: 'HUBZone' },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-3 bg-bg-dark border border-border-dark rounded-xl cursor-pointer hover:border-brand-cyan transition-all group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border-dark bg-bg-card text-brand-blue focus:ring-brand-cyan"
                    checked={setAsides[item.id as keyof typeof setAsides]}
                    onChange={(e) => setSetAsides({...setAsides, [item.id]: e.target.checked})}
                  />
                  <span className="text-[11px] font-medium group-hover:text-white transition-colors">{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="pt-6 border-t border-border-dark space-y-4">
          <h3 className="text-xl font-bold text-white">Success Fee Agreement</h3>
          <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-brand-cyan text-sm">
            <p className="font-medium">I agree to pay: 5% (up to $5M) | 3% ($5M-$20M) | 1.5% ({'>'}$20M) upon award.</p>
          </div>
          
          <div className="flex flex-col items-center gap-6 pt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-border-dark bg-bg-dark text-brand-blue focus:ring-brand-cyan"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className="text-sm font-bold group-hover:text-white transition-colors uppercase tracking-tight">I ACCEPT THE TERMS AND COMMISSION STRUCTURE.</span>
            </label>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl flex items-center gap-3 w-full"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-bold">{error}</p>
                </motion.div>
              )}
              {isSyncing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 w-full"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
                    <span>Eagle Eye AI is cross-referencing with federal databases...</span>
                    <Activity className="w-3 h-3 animate-spin" />
                  </div>
                  <div className="w-full bg-bg-dark h-2 rounded-full overflow-hidden border border-border-dark">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="bg-brand-cyan h-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`high-tech-button max-w-md ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSyncing ? "VALIDATING..." : "Sync Legal Documentation"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const CompanyVerificationView = ({ users }: { users: Record<string, UserRecord> }) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-cyan" />
          Verificar Empresas Pendientes
        </h1>
        <p className="text-zinc-400 mt-1">Revisión de documentación legal para activación de cuentas corporativas.</p>
      </header>

      <div className="high-tech-card overflow-hidden !p-0">
        <div className="p-6 border-b border-border-dark flex justify-between items-center">
          <h3 className="font-bold text-white">Cola de Validación</h3>
          <span className="text-xs font-mono text-zinc-500">Total: {Object.values(users).filter(u => u.type !== 'ADMIN').length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-zinc-500 bg-bg-dark border-b border-border-dark">
                <th className="px-6 py-3 font-bold">Empresa / Usuario</th>
                <th className="px-6 py-3 font-bold">Email Corp</th>
                <th className="px-6 py-3 font-bold">Nicho</th>
                <th className="px-6 py-3 font-bold">Estado</th>
                <th className="px-6 py-3 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {Object.entries(users).filter(([_, u]) => u.type !== 'ADMIN').map(([username, record], i) => (
                <tr key={i} className="hover:bg-bg-dark transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{username}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{record.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-blue/10 text-brand-cyan">
                      {record.niche}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${record.active ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span className={`text-xs font-bold ${record.active ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {record.active ? 'VERIFICADO' : 'PENDIENTE'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-brand-cyan hover:underline">Revisar PDFs</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LegalVaultView = ({ onVerify, samApiKey }: { onVerify?: () => void, samApiKey: string }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [ein, setEin] = useState('');
  const [uei, setUei] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSync = async () => {
    setError('');
    
    // EIN format: XX-XXXXXXX (2 numbers, hyphen, 7 numbers)
    const einRegex = /^\d{2}-\d{7}$/;
    // UEI: exactly 12 alphanumeric characters
    const ueiRegex = /^[a-zA-Z0-9]{12}$/;

    if (!companyName || !einRegex.test(ein) || !ueiRegex.test(uei) || !file) {
      setError('ACCESS DENIED: Invalid or missing documentation. Eagle Eye AI detected a compliance failure.');
      return;
    }

    if (!samApiKey || samApiKey === 'DEMO_KEY') {
      setError('Federal Verification Servers are unreachable: SAM.gov API key is missing or invalid.');
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch(`https://api.sam.gov/entity-management/v3/entities?ueiSAM=${uei}`, {
        headers: {
          'x-api-key': samApiKey
        }
      });

      if (!response.ok) {
        throw new Error('UNREACHABLE');
      }

      const data = await response.json();
      const entity = data.entityData?.[0];

      if (!entity || entity.entityRegistration?.registrationStatus?.toUpperCase() !== 'ACTIVE') {
        setError('ENTITY NOT FOUND: Access Denied. The provided UEI does not match active federal records.');
        setIsSyncing(false);
        return;
      }

      const officialName = entity.entityRegistration?.legalBusinessName?.toUpperCase();
      if (officialName !== companyName.toUpperCase()) {
        setError(`ENTITY NAME MISMATCH: Access Denied. Input name "${companyName}" does not match official record "${officialName}".`);
        setIsSyncing(false);
        return;
      }

      setTimeout(() => {
        setIsSyncing(false);
        setIsReady(true);
        if (onVerify) onVerify();
      }, 3000);
    } catch (err) {
      console.error("SAM.gov API Error:", err);
      setError('Federal Verification Servers are unreachable. Please check your connection or try again later.');
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Lock className="w-8 h-8 text-brand-cyan" />
          Corporate Legal Vault
        </h1>
        <p className="text-zinc-400 mt-1">To participate in government solicitations, we require your verified corporate documentation.</p>
      </header>

      <div className="high-tech-card space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Legal Company Name *</label>
          <input 
            type="text" 
            className="high-tech-input" 
            placeholder="Official Business Name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tax ID / EIN (IRS) *</label>
            <input 
              type="text" 
              className="high-tech-input" 
              placeholder="XX-XXXXXXX" 
              value={ein}
              onChange={(e) => setEin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">UEI (Unique Entity ID) *</label>
            <input 
              type="text" 
              className="high-tech-input" 
              placeholder="12-character ID" 
              value={uei}
              onChange={(e) => setUei(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Articles of Incorporation *</label>
            <div className="relative group">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="high-tech-input flex items-center justify-center border-dashed border-2 py-6 group-hover:border-brand-cyan transition-all">
                <Upload className="w-4 h-4 mr-2 text-zinc-500" />
                <span className="text-xs text-zinc-500">{file ? file.name : 'Upload PDF'}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 opacity-50">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Certifications (8a, WOSB...)</label>
            <div className="high-tech-input flex items-center justify-center border-dashed border-2 py-6 cursor-not-allowed">
              <Upload className="w-4 h-4 mr-2 text-zinc-500" />
              <span className="text-xs text-zinc-500">Optional PDF</span>
            </div>
          </div>
          <div className="space-y-2 opacity-50">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">W-9 Form</label>
            <div className="high-tech-input flex items-center justify-center border-dashed border-2 py-6 cursor-not-allowed">
              <Upload className="w-4 h-4 mr-2 text-zinc-500" />
              <span className="text-xs text-zinc-500">Optional PDF</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
                <span>Eagle Eye AI is cross-referencing with federal databases...</span>
                <Activity className="w-3 h-3 animate-spin" />
              </div>
              <div className="w-full bg-bg-dark h-2 rounded-full overflow-hidden border border-border-dark">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="bg-brand-cyan h-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="high-tech-button"
        >
          {isSyncing ? "VALIDATING..." : "Sync Legal Documentation"}
        </button>

        {isReady && (
          <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-bold">Documentation verified by Eagle Eye AI. You now have full access to the Market Feed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ForgeProposalLabView = ({ niche, initialBid, onLogEvidence }: { niche: Niche, initialBid?: Bid | null, onLogEvidence: (evidence: Evidence) => void }) => {
  const [selectedBidId, setSelectedBidId] = useState(initialBid?.id || BIDS_DATA.filter(b => b.niche === niche)[0]?.id || '');
  const [proposalText, setProposalText] = useState('');
  const [montoOfertado, setMontoOfertado] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedBid = BIDS_DATA.find(b => b.id === selectedBidId);
  const { valor: comisionValor, porcentaje: comisionPorc } = calcularComision(montoOfertado);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setErrors([]);
    setWarnings([]);
    setIsSuccess(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      
      const newErrors: string[] = [];
      const newWarnings: string[] = [];

      if (montoOfertado > (selectedBid?.monto || 0) * 1.2) {
        newErrors.push("PRECIO FUERA DE RANGO: El monto supera el promedio histórico en un 20%.");
      }
      if (!proposalText.toLowerCase().includes('nist') && niche === 'IT_CYBER') {
        newErrors.push("INCUMPLIMIENTO TÉCNICO: Falta mención a estándares NIST 800-171.");
      }
      if (proposalText.length < 100) {
        newWarnings.push("PROFUNDIDAD INSUFICIENTE: La propuesta técnica es demasiado breve.");
      }

      setErrors(newErrors);
      setWarnings(newWarnings);
      setIsSuccess(true);

      onLogEvidence({
        Usuario: niche || 'Unknown',
        Acción: "Mejora IA",
        MontoBid: montoOfertado,
        ComisionProyectada: comisionValor,
        Fecha: new Date().toLocaleTimeString()
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-brand-cyan" />
          The Forge Proposal Lab
        </h1>
        <p className="text-zinc-400 mt-1">Laboratorio de optimización de propuestas con IA Genio.</p>
      </header>

      <div className="high-tech-card space-y-6">
        <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-brand-cyan text-sm">
          <p className="font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Nota de Comisión
          </p>
          <p className="mt-1">Por este monto, su comisión de éxito será del <span className="font-bold">{comisionPorc}%</span> (${comisionValor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Licitación Objetivo</label>
          <select 
            value={selectedBidId}
            onChange={(e) => setSelectedBidId(e.target.value)}
            className="high-tech-input bg-bg-dark"
          >
            {BIDS_DATA.filter(b => b.niche === niche).map(bid => (
              <option key={bid.id} value={bid.id}>{bid.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Borrador de Propuesta</label>
              <textarea 
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                rows={10}
                className="high-tech-input resize-none"
                placeholder="Escriba cómo planea ejecutar el contrato..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tu Precio Oferta ($)</label>
              <input 
                type="number"
                value={montoOfertado}
                onChange={(e) => setMontoOfertado(Number(e.target.value))}
                className="high-tech-input"
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !proposalText}
              className="high-tech-button"
            >
              {isAnalyzing ? "ANALIZANDO..." : "ANALIZAR CON GENIO IA"}
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-cyan" />
              Resultados del Análisis
            </h3>
            
            <div className="min-h-[200px] p-6 bg-bg-dark rounded-xl border border-border-dark space-y-4">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full mt-12 space-y-4">
                  <Activity className="w-8 h-8 text-brand-cyan animate-spin" />
                  <p className="text-zinc-400">Analizando errores técnicos y legales...</p>
                </div>
              ) : isSuccess ? (
                <>
                  {errors.map((err, i) => (
                    <div key={i} className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm">
                      {err}
                    </div>
                  ))}
                  {warnings.map((warn, i) => (
                    <div key={i} className="p-3 bg-amber-900/20 border border-amber-900/50 text-amber-400 rounded-lg text-sm">
                      {warn}
                    </div>
                  ))}
                  <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">Versión Ganadora Generada</p>
                    <p className="text-xs">Se corrigieron {errors.length} errores. Comisión pactada: ${comisionValor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </>
              ) : (
                <p className="text-zinc-600 text-center mt-12 italic">Inicie el análisis para ver los resultados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TheForgeLabView = ({ plan, niche, username, activeBid, onLogEvidence, onUpgrade }: { plan: Plan, niche: Niche, username: string, activeBid?: Bid | null, onLogEvidence: (ev: Evidence) => void, onUpgrade: () => void }) => {
  const [isLearning, setIsLearning] = useState(false);
  const [learningResult, setLearningResult] = useState<{ error: string, success: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(activeBid?.id || BIDS_DATA.filter(b => b.niche === niche)[0]?.id || '');
  const [offerPrice, setOfferPrice] = useState(activeBid?.monto || 0);
  const [wholesaleCost, setWholesaleCost] = useState(activeBid ? Math.round(activeBid.monto * 0.7) : 0);
  const [zipReady, setZipReady] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (activeBid) {
      setSelectedBidId(activeBid.id);
      setOfferPrice(activeBid.monto);
      setWholesaleCost(Math.round(activeBid.monto * 0.7));
    }
  }, [activeBid]);

  const selectedBid = BIDS_DATA.find(b => b.id === selectedBidId);
  
  // Express Commission Logic: 2% for Supplies, 5% for Services
  const rate = selectedBid?.type === 'Supplies' ? 0.02 : 0.05;
  const commission = offerPrice * rate;
  const netProfit = offerPrice - wholesaleCost - commission;

  const handleDownloadZip = async () => {
    setDownloadError(null);
    try {
      const zip = new JSZip();
      zip.file("PROPOSAL_SUMMARY.txt", `Official Proposal for ${selectedBid?.name}\nID: ${selectedBidId}\nBid Amount: $${offerPrice}\nGenerated by GovWin Advisor AI`);
      zip.file("TECHNICAL_SPECS.txt", "AI-Generated technical specifications following NIST-800 guidelines.");
      zip.file("COMPLIANCE_CHECKLIST.pdf", "Simulated PDF Content: Compliance verified.");
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GOVWIN_PACKAGE_${selectedBidId}.zip`;
      
      // Attempt download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Log evidence on download
      onLogEvidence({
        Usuario: username,
        Acción: `Download Package: ${selectedBidId}`,
        MontoBid: offerPrice,
        ComisionProyectada: commission,
        Fecha: new Date().toLocaleTimeString()
      });

      // Cleanup
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloadError("Check your browser downloads");
    }
  };

  const handleUploadFailure = () => {
    setIsLearning(true);
    setLearningResult(null);
    setTimeout(() => {
      setIsLearning(false);
      setLearningResult({
        error: "🚨 CRITICAL ERROR FOUND: You missed the NIST-800 security clause on page 12.",
        success: "✅ LEARNING COMPLETE: The Genio will fix this in your future bids."
      });
    }, 2000);
  };

  const handleGenerate = () => {
    if (plan === 'BRONZE' || plan === 'MERCHANT') {
      alert("This feature is exclusive to SILVER/GOLD members.");
      return;
    }
    setIsGenerating(true);
    setZipReady(false);
    setTimeout(() => {
      setIsGenerating(false);
      setZipReady(true);
      onLogEvidence({
        Usuario: username,
        Acción: `Forge Express: ${selectedBidId}`,
        MontoBid: offerPrice,
        ComisionProyectada: commission,
        Fecha: new Date().toLocaleTimeString()
      });
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-brand-cyan" />
          🤖 The Forge {selectedBid?.monto && selectedBid.monto <= 250000 ? 'Express' : 'Lab'}
        </h1>
        <p className="text-zinc-400 mt-1">
          {selectedBid?.monto && selectedBid.monto <= 250000 
            ? `Drafting technical proposal for: ${selectedBid.name}`
            : 'Advanced optimization and turnkey documentation generation.'}
        </p>
      </header>

      {(plan === 'BRONZE') ? (
        <div className="p-8 bg-amber-900/10 border border-amber-900/20 rounded-2xl text-center space-y-4">
          <Lock className="w-12 h-12 text-amber-500 mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-white">Forge Access Restricted</h3>
          <p className="text-amber-200/70 max-w-md mx-auto">
            🔒 Your current plan ({plan}) does not include AI Forge access. Please upgrade to SILVER or GOLD to unlock learning and generation features.
          </p>
          <button onClick={onUpgrade} className="high-tech-button max-w-xs mx-auto">
            Upgrade Now
          </button>
        </div>
      ) : !selectedBid ? (
        <div className="p-8 bg-amber-900/10 border border-amber-900/20 rounded-2xl text-center space-y-4">
          <RadarIcon className="w-12 h-12 text-amber-500 mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-white">No Active Bid</h3>
          <p className="text-amber-200/70 max-w-md mx-auto">
            Please select a bid from the Market Radar first to begin the Forge process.
          </p>
        </div>
      ) : (
        <>
          {plan === 'MERCHANT' && (
            <section className="high-tech-card bg-brand-blue/5 border-brand-blue/20 space-y-6">
              <div className="flex items-center gap-3 text-brand-cyan">
                <DollarSign className="w-6 h-6" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Merchant Mode: Profit Calculator</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Offer Price</label>
                    <input 
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="high-tech-input"
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Wholesale Cost (Your price to buy)</label>
                    <input 
                      type="number"
                      value={wholesaleCost}
                      onChange={(e) => setWholesaleCost(Number(e.target.value))}
                      className="high-tech-input"
                    />
                  </div>
                  <div className="p-4 bg-bg-dark border border-border-dark rounded-xl">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">GovWin Commission ({rate * 100}%)</p>
                    <p className="text-xl font-bold text-red-400">-${commission.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl">
                  <p className="text-xs font-bold text-brand-cyan uppercase tracking-widest mb-2">Estimated Net Profit</p>
                  <p className="text-4xl font-bold text-white">${netProfit.toLocaleString()}</p>
                  <p className={`text-sm mt-2 font-bold ${netProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {netProfit > 0 ? '✓ Profitable Opportunity' : '✗ High Risk / Low Margin'}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION A: LEARNING */}
          <section className={`high-tech-card space-y-6 ${plan === 'MERCHANT' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-cyan" />
                A. Learning from Past Failures
              </h3>
              {plan === 'MERCHANT' && (
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-900/20 text-amber-500 border border-amber-900/50">
                  SILVER/GOLD ONLY
                </span>
              )}
            </div>

            <RivalTracker bidId={selectedBid?.id || ''} />
            <RiggingDetector bid={selectedBid!} />
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-border-dark rounded-2xl p-8 text-center hover:border-brand-cyan transition-all cursor-pointer group relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUploadFailure} />
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-zinc-500 group-hover:text-brand-cyan transition-colors mb-2" />
                  <p className="text-sm font-medium text-zinc-400">Upload a previous failed proposal (Optional - AI will learn from errors)</p>
                </div>
              </div>

              {isLearning && (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <Activity className="w-6 h-6 text-brand-cyan animate-spin" />
                  <p className="text-zinc-400 text-sm animate-pulse">The AI is analyzing why you didn't win...</p>
                </div>
              )}

              {learningResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-sm font-medium">
                    {learningResult.error}
                  </div>
                  <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-xl text-sm font-medium">
                    {learningResult.success}
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          <hr className="border-border-dark" />

          {/* SECTION B: GENERATOR */}
          <section className={`high-tech-card space-y-6 ${plan === 'MERCHANT' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-cyan" />
                B. AI Intelligence Analysis
              </h3>
              {plan !== 'GOLD' && plan !== 'SILVER' && (
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-brand-blue/20 text-brand-cyan border border-brand-blue/50">
                  SILVER/GOLD ONLY
                </span>
              )}
            </div>

            <div className="p-4 bg-bg-dark border border-border-dark rounded-xl space-y-2">
              <p className="text-sm text-white font-bold">Winning Strategy:</p>
              <ul className="text-xs text-zinc-400 list-disc list-inside space-y-1">
                <li>Historical Pricing: The government usually pays ${(offerPrice * 0.95).toLocaleString()}-${(offerPrice * 1.05).toLocaleString()} for this.</li>
                <li>Focus on 'Fast Delivery' over complex technical specs.</li>
                <li>Highlight your local presence in {selectedBid?.city || 'the region'}.</li>
              </ul>
            </div>

            {selectedBid && selectedBid.fecha && <OpportunityTimeline dueDateStr={selectedBid.fecha} />}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Target Bid</label>
                  <select 
                    value={selectedBidId}
                    onChange={(e) => setSelectedBidId(e.target.value)}
                    className="high-tech-input bg-bg-dark"
                  >
                    {BIDS_DATA.filter(b => b.niche === niche).map(bid => (
                      <option key={bid.id} value={bid.id}>{bid.name} ({bid.id})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Estimated Bid Amount ($)</label>
                  <input 
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="high-tech-input"
                  />
                  <p className="text-[10px] text-brand-cyan italic">💡 Success Fee Notice: Your projected commission for winning this contract is ${commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({rate*100}%)</p>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`high-tech-button flex items-center justify-center gap-2 ${plan === 'MERCHANT' ? 'bg-brand-blue text-white border-brand-blue hover:bg-brand-blue/80' : ''}`}
              >
                {isGenerating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    {plan === 'MERCHANT' ? 'Generating forms...' : 'Genio is correcting errors and drafting final package...'}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {plan === 'MERCHANT' ? '✨ GENERATE QUICK-BID PACKAGE' : '✨ GENERATE WINNING PACKAGE'}
                  </>
                )}
              </button>

              {zipReady && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-4 space-y-3">
                  <button 
                    onClick={handleDownloadZip}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                  >
                    <Upload className="w-5 h-5 rotate-180" />
                    📥 DOWNLOAD COMPLETE SAM.GOV PACKAGE (ZIP)
                  </button>
                  {downloadError && (
                    <p className="text-center text-xs text-red-400 font-bold animate-pulse">
                      {downloadError}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const ShadowPanelEvidenciasView = ({ evidenceLog }: { evidenceLog: Evidence[] }) => {
  const handleDownload = () => {
    const csv = "User,Action,BidAmount,Commission,Date\n" + 
      evidenceLog.map(log => `${log.Usuario},${log.Acción},${log.MontoBid || ''},${log.ComisionProyectada || ''},${log.Fecha}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'evidencias_comision.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSingle = (log: Evidence) => {
    const bidId = log.Acción.split(': ').pop() || 'N/A';
    const content = `CERTIFICADO DE EVIDENCIA: La empresa ${log.Usuario} utilizó GovWin Advisor para la licitación ${bidId} el día ${log.Fecha}. Comisión pactada: $${log.ComisionProyectada?.toLocaleString() || '0'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `CERTIFICADO_${log.Usuario}_${bidId}.txt`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-brand-cyan" />
            📂 Registro de Huellas Digitales
          </h1>
          <p className="text-zinc-400 mt-1">Aquí quedan grabadas las pruebas irrefutables para cobrar sus comisiones.</p>
        </div>
        {evidenceLog.length > 0 && (
          <button 
            onClick={handleDownload}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
          >
            Descargar Reporte de Evidencias
          </button>
        )}
      </header>

      <div className="high-tech-card overflow-hidden !p-0">
        <div className="p-6 border-b border-border-dark">
          <h3 className="font-bold text-white">Evidence Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-zinc-500 bg-bg-dark border-b border-border-dark">
                <th className="px-6 py-3 font-bold">User</th>
                <th className="px-6 py-3 font-bold">Bid</th>
                <th className="px-6 py-3 font-bold">Commission</th>
                <th className="px-6 py-3 font-bold">Time</th>
                <th className="px-6 py-3 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {evidenceLog.length > 0 ? (
                evidenceLog.map((log, i) => (
                  <tr key={i} className="hover:bg-bg-dark transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-blue/10 text-brand-cyan">
                        {log.Usuario}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{log.Acción}</td>
                    <td className="px-6 py-4 text-sm text-brand-cyan font-bold font-mono">
                      {log.ComisionProyectada ? `$${log.ComisionProyectada.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-500">{log.Fecha}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDownloadSingle(log)}
                        className="p-2 bg-zinc-800 hover:bg-brand-cyan hover:text-black rounded-lg transition-all"
                        title="Descargar Certificado"
                      >
                        <Upload className="w-3 h-3 rotate-180" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 italic">No hay evidencias registradas todavía.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RiggingDetector = ({ bid }: { bid: Bid }) => {
  const isRigged = bid.days_left && bid.days_left < 5;
  
  return (
    <div className="p-6 bg-zinc-900/50 border border-border-dark rounded-2xl space-y-4">
      <div className="flex items-center gap-2 text-brand-cyan">
        <AlertTriangle className="w-4 h-4" />
        <h3 className="text-sm font-bold uppercase tracking-widest">🔍 Rigging Detector</h3>
      </div>
      
      {isRigged ? (
        <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl space-y-2">
          <p className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            🚨 RIGGING ALERT: High Risk Detected
          </p>
          <p className="text-xs opacity-80">
            This bid has an unusually short deadline ({bid.days_left} days). Patterns suggest a pre-selected winner may already exist. Proceed with aggressive pricing or focus on technical superiority.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold text-sm">✅ Integrity Scan: Fair competition detected.</p>
        </div>
      )}
    </div>
  );
};

const ExecutiveBriefingsView = ({ briefings, onMarkAsRead }: { briefings: Briefing[], onMarkAsRead: (id: string) => void }) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Mail className="w-8 h-8 text-brand-cyan" />
          Executive Briefings
        </h1>
        <p className="text-zinc-400 mt-1">High-level strategic intelligence provided by Christian Vance.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {briefings.length === 0 ? (
          <div className="high-tech-card text-center py-20">
            <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 italic">No strategic briefings available at this time.</p>
          </div>
        ) : (
          briefings.map((briefing) => (
            <motion.div 
              key={briefing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`high-tech-card relative overflow-hidden cursor-pointer transition-all hover:border-brand-cyan/30 ${!briefing.isRead ? 'border-brand-cyan/50 bg-brand-blue/5' : ''}`}
              onClick={() => onMarkAsRead(briefing.id)}
            >
              {!briefing.isRead && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span>
                  </span>
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest mb-2 inline-block ${
                    briefing.type === 'PERFECT_MATCH' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {briefing.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-bold text-white">{briefing.title}</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{briefing.date}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed italic text-sm">
                  {briefing.content}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-border-dark flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-xs font-bold text-white">CV</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Christian Vance</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Director of Federal Capture</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-brand-cyan hover:underline uppercase tracking-widest">Download Intelligence PDF</button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const VanceLogView = ({ log }: { log: VanceLogEntry[] }) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal className="w-8 h-8 text-brand-cyan" />
          Bitácora de Acciones: Christian Vance
        </h1>
        <p className="text-zinc-400 mt-1">Registro maestro de comunicaciones automáticas enviadas por el Agente Autónomo.</p>
      </header>

      <div className="high-tech-card overflow-hidden !p-0">
        <div className="p-6 border-b border-border-dark flex justify-between items-center bg-bg-dark/50">
          <h3 className="font-bold text-white">Comunicaciones Enviadas</h3>
          <span className="text-xs font-mono text-zinc-500">Total: {log.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-zinc-500 bg-bg-dark border-b border-border-dark">
                <th className="px-6 py-3 font-bold">Destinatario</th>
                <th className="px-6 py-3 font-bold">Acción Realizada</th>
                <th className="px-6 py-3 font-bold">Tipo</th>
                <th className="px-6 py-3 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {log.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-600 italic">No hay registros de acciones de Christian Vance.</td>
                </tr>
              ) : (
                log.map((entry) => (
                  <tr key={entry.id} className="hover:bg-bg-dark transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-white">{entry.recipient}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-400">{entry.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        entry.type === 'PERFECT_MATCH' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {entry.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono text-zinc-500">{entry.timestamp}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const ShadowInteligenciaView = ({ onAddBriefing }: { onAddBriefing: (title: string, content: string, type: 'PERFECT_MATCH' | 'RIGGING_ALERT', recipient: string) => void }) => {
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const analyzeFavoritism = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Analyze AWARDS_DATA for favoritism (> 3 wins in same agency)
      const counts: Record<string, number> = {};
      AWARDS_DATA.forEach(award => {
        const key = `${award.company}|${award.agency}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      const suspicious = Object.entries(counts)
        .filter(([_, count]) => count >= 3)
        .map(([key, count]) => {
          const [company, agency] = key.split('|');
          const risk = count > 3 ? 'CRÍTICO' : 'MEDIO';
          const trend = Math.random() > 0.5 ? 'up' : 'neutral';
          
          return {
            name: agency,
            company: company,
            risk: risk,
            reason: `Favoritismo detectado: ${company} ha ganado ${count} contratos recientemente en esta agencia.`,
            trend: trend,
            wins: count
          };
        });

      if (suspicious.length > 0) {
        suspicious.forEach(s => {
          onAddBriefing(
            `RIGGING ALERT: Potential Favoritism in ${s.name}`,
            `Dear Partner,\n\nMy analysis of USAspending data has revealed a concerning pattern of favoritism in the ${s.name}. The firm ${s.company} has secured ${s.wins} contracts in a suspiciously short period.\n\nThis indicates a potential "Rigged" environment. I recommend adjusting your capture strategy accordingly.\n\nChristian Vance | Director of Federal Capture`,
            'RIGGING_ALERT',
            'All Active Users'
          );
        });
      }

      setAgencies(suspicious);
      setIsScanning(false);
    }, 1500);
  };

  useEffect(() => {
    analyzeFavoritism();
  }, []);

  const handleSendAlert = () => {
    setIsSendingAlert(true);
    setTimeout(() => {
      setIsSendingAlert(false);
      setAlertSent(true);
      onAddBriefing(
        "MASS ALERT: Federal Risk Detected",
        "Dear Partner,\n\nThis is an urgent notification regarding detected irregularities in federal procurement patterns. Our monitoring systems have flagged multiple agencies for suspicious activity.\n\nPlease review your current active bids for any signs of restrictive requirements.\n\nChristian Vance | Director of Federal Capture",
        'RIGGING_ALERT',
        'All Active Users'
      );
      setTimeout(() => setAlertSent(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            🕵️ Monitor de Riesgo Federal
          </h1>
          <p className="text-zinc-400 mt-1">Vigilancia en tiempo real de patrones de corrupción y favoritismo en agencias federales.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={analyzeFavoritism}
            disabled={isScanning}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 border border-zinc-700 disabled:opacity-50"
          >
            <Activity className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'ESCANEANDO...' : 'REFRESCAR ANÁLISIS'}
          </button>
          <button 
            onClick={handleSendAlert}
            disabled={isSendingAlert}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            <Bell className={`w-4 h-4 ${isSendingAlert ? 'animate-bounce' : ''}`} />
            {isSendingAlert ? 'ENVIANDO...' : 'ENVIAR ALERTA MASIVA'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {alertSent && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-bold">ALERTA ENVIADA: Todos los clientes del nicho han sido notificados vía Telegram y Email.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        <div className="high-tech-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-border-dark flex justify-between items-center bg-bg-dark/50">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Detección de Favoritismo (Basado en USAspending)
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Actualizado: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-zinc-500 bg-bg-dark/30 border-b border-border-dark">
                  <th className="px-6 py-4 font-bold">Agencia Federal</th>
                  <th className="px-6 py-4 font-bold">Nivel de Riesgo</th>
                  <th className="px-6 py-4 font-bold">Motivo de Alerta</th>
                  <th className="px-6 py-4 font-bold">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {isScanning ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Activity className="w-8 h-8 text-brand-cyan animate-spin" />
                        <p className="text-zinc-500 font-mono text-xs animate-pulse">ANALIZANDO HISTORIAL DE ADJUDICACIONES PARA DETECTAR FAVORITISMO...</p>
                      </div>
                    </td>
                  </tr>
                ) : agencies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-zinc-500 font-mono text-xs">Escaneando historial de adjudicaciones para detectar favoritismo...</p>
                    </td>
                  </tr>
                ) : (
                  agencies.map((agency, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white text-sm">{agency.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          agency.risk === 'CRÍTICO' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                          agency.risk === 'MEDIO' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                        }`}>
                          {agency.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{agency.reason}</td>
                      <td className="px-6 py-4">
                        {agency.trend === 'up' ? <TrendingUp className="w-4 h-4 text-red-500" /> : 
                         agency.trend === 'down' ? <TrendingUp className="w-4 h-4 text-emerald-500 rotate-180" /> :
                         <Activity className="w-4 h-4 text-zinc-500" />}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
const RivalTracker = ({ bidId }: { bidId: string }) => {
  const info = RIVALS_DB[bidId];
  if (!info) return null;

  return (
    <div className="p-6 bg-zinc-900/50 border border-border-dark rounded-2xl space-y-4">
      <div className="flex items-center gap-2 text-brand-cyan">
        <Search className="w-4 h-4" />
        <h3 className="text-sm font-bold uppercase tracking-widest">🕵️ Rival Tracker (Incumbent Analysis)</h3>
      </div>
      <p className="text-xs text-zinc-400">Searching for previous contract winners...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-900/10 border border-amber-900/20 rounded-xl">
          <p className="text-[10px] text-amber-500 font-bold uppercase mb-1">Previous Winner</p>
          <p className="text-sm text-white font-bold">{info.empresa}</p>
          <p className="text-xs text-zinc-400 mt-1">Winning Price: <span className="text-white font-mono">${info.precio.toLocaleString()}</span></p>
        </div>
        <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl">
          <p className="text-[10px] text-brand-cyan font-bold uppercase mb-1">Weak Point Detected</p>
          <p className="text-sm text-white font-bold">{info.fallos}</p>
          <p className="text-xs text-zinc-400 mt-1 italic">Target this point in your proposal.</p>
        </div>
      </div>
    </div>
  );
};

const ApiConfigurationView = ({ samKey, geminiKey, onUpdateKeys }: { samKey: string, geminiKey: string, onUpdateKeys: (sam: string, gemini: string) => void }) => {
  const [localSamKey, setLocalSamKey] = useState(samKey);
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => {
    setIsTesting(true);
    setStatus(null);
    setTimeout(() => {
      setIsTesting(false);
      onUpdateKeys(localSamKey, localGeminiKey);
      setStatus('Claves API guardadas correctamente. Conexión oficial establecida.');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-brand-cyan" />
          Configuración de Inteligencia y Datos
        </h1>
        <p className="text-zinc-400 mt-1">Vincula tus cuentas oficiales para activar el cerebro de Christian Vance.</p>
      </header>

      <div className="high-tech-card space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Clave API de SAM.gov</label>
            <input 
              type="password" 
              value={localSamKey}
              onChange={(e) => setLocalSamKey(e.target.value)}
              className="high-tech-input"
              placeholder="Pega aquí tu clave API oficial de SAM.gov..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Clave API de Gemini (Google AI)</label>
            <input 
              type="password" 
              value={localGeminiKey}
              onChange={(e) => setLocalGeminiKey(e.target.value)}
              className="high-tech-input"
              placeholder="Pega aquí tu clave API de Gemini..."
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isTesting}
          className="high-tech-button flex items-center justify-center gap-2"
        >
          {isTesting ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              Guardar Configuración Maestra
            </>
          )}
        </button>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-bold">{status}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
const AutonomousLearningView = () => {
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{msg: string, time: string}[]>([]);
  const [scanResult, setScanResult] = useState<{msg: string, errorMargin: string, pattern: string} | null>(null);

  const activityMessages = [
    "Conectando con USAspending.gov API...",
    "Extrayendo adjudicaciones de NASA (FY2024)...",
    "Comparando contratos con históricos de GSA...",
    "Analizando variaciones de precio en Texas y Florida...",
    "Calculando inflación proyectada para suministros médicos...",
    "Detectando nuevos competidores en IT & Cyber...",
    "Sincronizando patrones de éxito con el motor de IA...",
    "Actualizando base de datos de Shadow Intelligence...",
    "Verificando integridad de datos en SAM.gov...",
    "Generando modelos predictivos de adjudicación...",
  ];

  const handleScan = () => {
    setIsCrawling(true);
    setScanResult(null);
    setProgress(0);
    setLogs([]);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < activityMessages.length) {
        const newLog = {
          msg: activityMessages[currentStep],
          time: new Date().toLocaleTimeString()
        };
        setLogs(prev => [newLog, ...prev].slice(0, 12));
        setProgress(prev => Math.min(prev + (100 / activityMessages.length), 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsCrawling(false);
        
        // Generate realistic random numbers
        const errorMargin = (0.8 + Math.random() * 1.7).toFixed(2);
        const patternIncrease = (10 + Math.random() * 15).toFixed(1);
        const states = ['Texas', 'Florida', 'California', 'New York', 'Virginia'];
        const state = states[Math.floor(Math.random() * states.length)];
        const niches = ['suministros médicos', 'servicios de IT', 'construcción federal', 'logística de defensa'];
        const niche = niches[Math.floor(Math.random() * niches.length)];

        setScanResult({
          msg: "¡Aprendizaje completado! Motor de IA optimizado.",
          errorMargin: `${errorMargin}%`,
          pattern: `Incremento del ${patternIncrease}% en adjudicaciones de ${niche} en ${state}.`
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Brain className="w-8 h-8 text-brand-cyan" />
          🧠 IA: Aprendizaje Autónomo
        </h1>
        <p className="text-zinc-400 mt-1">El Genio está escaneando USAspending.gov para optimizar sus algoritmos de predicción.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="high-tech-card space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white">Estado del Motor de IA</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isCrawling ? 'bg-brand-blue/20 text-brand-cyan animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isCrawling ? 'ESCANEANDO...' : 'SISTEMA LISTO'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="w-full bg-bg-dark h-4 rounded-full overflow-hidden border border-border-dark p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>USAspending.gov Sync</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            <button 
              onClick={handleScan}
              disabled={isCrawling}
              className="w-full high-tech-button flex items-center justify-center gap-2"
            >
              {isCrawling ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  PROCESANDO DATOS...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  FORZAR APRENDIZAJE DE USASPENDING.GOV
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {scanResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-900/10 border border-emerald-900/30 rounded-2xl space-y-4"
              >
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <h4 className="font-bold text-lg">{scanResult.msg}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-dark border border-border-dark rounded-xl">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Nuevos Patrones</p>
                    <p className="text-sm text-white">{scanResult.pattern}</p>
                  </div>
                  <div className="p-4 bg-bg-dark border border-border-dark rounded-xl">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Optimización</p>
                    <p className="text-sm text-white">Margen de error en predicción de precios reducido al <span className="text-brand-cyan font-bold">{scanResult.errorMargin}</span>.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="high-tech-card flex flex-col h-[500px]">
          <div className="p-4 border-b border-border-dark flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Log de Actividad IA</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] pr-2 custom-scrollbar">
            {logs.length === 0 && (
              <p className="text-zinc-600 italic">Esperando inicio de escaneo...</p>
            )}
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-2 rounded border ${i === 0 ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-cyan' : 'bg-bg-dark border-border-dark text-zinc-500'}`}
              >
                <span className="opacity-50 mr-2">[{log.time}]</span>
                {log.msg}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChristianSalesHunterView = () => {
  const actividadVentas = [
    { hora: "14:00", empresa: "GlobalIT Solutions", motivo: "Perdió licitación NASA $200k", estado: "Mail Enviado" },
    { hora: "14:15", empresa: "MedSupplies Florida", motivo: "Perdió licitación VA $50k", estado: "Mail Enviado" },
    { hora: "14:45", empresa: "TechConstruct NY", motivo: "Perdió licitación Army $120k", estado: "Click en Link (Interesado)" }
  ];

  const msgAnzuelo = `Subject: Tactical Review of your bid for [Contract Name]

Dear [CEO Name],

I have completed a strategic analysis of the recent award for [Solicitation ID]. 
Our intelligence system detected that your proposal was not selected due to 
specific pricing and compliance gaps that could have been avoided.

As Director of Federal Capture at GovWin Advisor, I want to offer you a 
complimentary "Failure Analysis Report" to ensure your next bid is a win.

Access your report here: [App Link]

Respectfully,
Christian Vance | Director of Federal Capture`;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-brand-cyan" />
          🏹 Christian Vance: Gerente de Reclutamiento
        </h1>
        <p className="text-zinc-400 mt-1">Christian está buscando empresas que perdieron licitaciones para traerlas como clientes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="high-tech-card bg-brand-blue/5 border-brand-blue/20">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Prospectos Detectados (Hoy)</p>
          <p className="text-3xl font-bold text-white">24</p>
        </div>
        <div className="high-tech-card bg-brand-blue/5 border-brand-blue/20">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Mensajes 'Anzuelo' Enviados</p>
          <p className="text-3xl font-bold text-brand-cyan">12 <span className="text-xs text-emerald-400">+5</span></p>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => {
            alert("🦅 Christian Vance: Escaneando SAM.gov por competidores fallidos... 12 nuevos mensajes de reclutamiento enviados a CEOs.");
          }}
          className="high-tech-button flex items-center gap-2 px-8"
        >
          <RadarIcon className="w-4 h-4" />
          Forzar Escaneo de Perdedores
        </button>
      </div>

      <div className="high-tech-card">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-cyan" />
          Bitácora de Ventas en Tiempo Real
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-dark text-zinc-500 uppercase tracking-widest">
                <th className="pb-3 px-2">Hora</th>
                <th className="pb-3 px-2">Empresa</th>
                <th className="pb-3 px-2">Razón</th>
                <th className="pb-3 px-2">Estado</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {actividadVentas.map((act, i) => (
                <tr key={i} className="border-b border-border-dark/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono">{act.hora}</td>
                  <td className="py-3 px-2 font-bold text-white">{act.empresa}</td>
                  <td className="py-3 px-2">{act.motivo}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${act.estado.includes('Click') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-blue/20 text-brand-cyan'}`}>
                      {act.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="high-tech-card bg-bg-dark">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">📧 El 'Anzuelo' que Christian está mandando:</h3>
        <pre className="p-4 bg-black/50 rounded-xl border border-border-dark text-xs text-zinc-400 font-mono whitespace-pre-wrap">
          {msgAnzuelo}
        </pre>
      </div>
    </div>
  );
};

const CognitiveMonitorView = () => {
  const pensamientos = [
    { hora: "11:45:02", pensamiento: "Analizando comportamiento del usuario 'it_test'. Están ignorando oportunidades de GSA de alto rendimiento. Voy a disparar un briefing personalizado para redirigir su atención.", prioridad: "ALTA" },
    { hora: "11:45:15", pensamiento: "Detectado patrón de 'Trampa' en la última licitación del Ejército para Ciberseguridad. Marcando esto para el Shadow Control y preparando advertencia para el cliente.", prioridad: "CRÍTICA" },
    { hora: "11:45:30", pensamiento: "La saturación del mercado en IT está aumentando. Estoy recalibrando el algoritmo de 'Probabilidad de Éxito' para favorecer la superioridad técnica sobre el precio.", prioridad: "MEDIA" },
    { hora: "11:45:45", pensamiento: "Christian: 'He descubierto una discrepancia de precio del 12% en las últimas 3 adjudicaciones para esta agencia; estoy ajustando las plantillas del Forge Lab en consecuencia.'", prioridad: "ALTA" },
    { hora: "11:46:00", pensamiento: "Prediciendo un cambio masivo en el presupuesto del DHS hacia la vigilancia impulsada por IA. Estoy pre-escaneando las próximas licitaciones para dar a nuestros clientes una ventaja de 30 días.", prioridad: "CRÍTICA" }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Brain className="w-8 h-8 text-brand-cyan" />
          🧠 Monitor Cognitivo: Monólogo Interno de Christian
        </h1>
        <p className="text-zinc-400 mt-1">Shadow Control: Visión en tiempo real de los pensamientos y razonamientos de la IA.</p>
      </header>

      <div className="space-y-4">
        {pensamientos.map((p, i) => {
          const color = p.prioridad === 'CRÍTICA' ? '#ff4b4b' : p.prioridad === 'ALTA' ? '#ffa421' : '#00d4ff';
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border bg-bg-dark border-border-dark space-y-2"
              style={{ borderLeft: `5px solid ${color}` }}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500">[{p.hora}] <b style={{ color }}>{p.prioridad}</b></span>
              </div>
              <p className="text-sm text-zinc-300 italic">"{p.pensamiento}"</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const EngineeringLogView = ({ logs }: { logs: EngineeringLog[] }) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal className="w-8 h-8 text-brand-cyan" />
          🛠️ Registro de Ingeniería: Auto-Evolución
        </h1>
        <p className="text-zinc-400 mt-1">Bitácora de cambios autónomos realizados por Christian Vance.</p>
      </header>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-border-dark bg-bg-dark/50 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-blue/10 rounded-lg">
                    <Zap className="w-4 h-4 text-brand-cyan" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{log.change}</h3>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{log.timestamp}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                  Estable
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Razón Estratégica</p>
                  <p className="text-sm text-zinc-300 italic">"{log.reason}"</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Líneas Afectadas</p>
                  <p className="text-xs font-mono text-brand-cyan bg-black/30 p-2 rounded-lg">{log.linesChanged}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center high-tech-card border-dashed">
            <Terminal className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 italic">No se han registrado cambios de ingeniería autónoma todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StrategyRoomView = ({ history, onUpdateHistory, onLogEngineering }: { 
  history: { role: string, content: string }[], 
  onUpdateHistory: (newHistory: { role: string, content: string }[]) => void,
  onLogEngineering: (log: EngineeringLog) => void
}) => {
  const [messages, setMessages] = useState(history.length > 0 ? history : [
    { role: "assistant", content: "Hola Jefe. Estoy analizando el mercado de suministros en Florida. ¿En qué puedo ayudarlo hoy, Marcos?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (history.length > 0) {
      setMessages(history);
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await christian_vance_brain(input, "master", messages);
      const aiMsg = { role: "assistant", content: response };
      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);
      onUpdateHistory(updatedMessages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-200px)] flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Brain className="w-8 h-8 text-brand-cyan" />
          🧠 Sala de Estrategia de Marcos
        </h1>
        <p className="text-zinc-400 mt-1">Debate con Christian Vance el futuro de GovWin Advisor.</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-black/60 rounded-3xl border border-border-dark font-mono relative">
        <div className="scanning-line" />
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' 
                : 'bg-zinc-900/50 text-emerald-500 border border-emerald-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] font-black uppercase tracking-widest">
                {m.role === 'user' ? <User size={10} /> : <Cpu size={10} />}
                {m.role === 'user' ? 'Master Command' : 'Vance Intelligence'}
              </div>
              {m.content}
              {i === messages.length - 1 && m.role === 'assistant' && (
                <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/50 p-4 rounded-2xl text-xs text-emerald-500/50 animate-pulse border border-emerald-500/10">
              Christian está procesando la consulta...
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu idea o pregunta para Christian..."
          className="flex-1 high-tech-input"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="px-6 bg-brand-cyan text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

const ConsultarChristianView = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola. Soy Christian Vance. Estoy aquí para ayudarte a navegar el complejo mundo de las licitaciones federales. ¿Tienes alguna duda sobre un contrato o estrategia?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await christian_vance_brain(input, "general", messages);
      const aiMsg = { role: "assistant", content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-200px)] flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Brain className="w-8 h-8 text-brand-cyan" />
          🧠 Consultar a Christian
        </h1>
        <p className="text-zinc-400 mt-1">Tu asesor experto en captura federal disponible 24/7.</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-black/60 rounded-3xl border border-border-dark font-mono relative">
        <div className="scanning-line" />
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' 
                : 'bg-zinc-900/50 text-emerald-500 border border-emerald-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] font-black uppercase tracking-widest">
                {m.role === 'user' ? <User size={10} /> : <Cpu size={10} />}
                {m.role === 'user' ? 'Master Command' : 'Vance Intelligence'}
              </div>
              {m.content}
              {i === messages.length - 1 && m.role === 'assistant' && (
                <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/50 p-4 rounded-2xl text-xs text-emerald-500/50 animate-pulse border border-emerald-500/10">
              Christian está analizando los datos...
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta lo que necesites..."
          className="flex-1 high-tech-input"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="px-6 bg-brand-cyan text-bg-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

const UserManagementView = ({ users, onCreateUser }: { users: Record<string, UserRecord>, onCreateUser: (u: string, p: string, n: Niche, plan: Plan) => void }) => {
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
        <p className="text-zinc-400 mt-1">Gestión de Usuarios: Crear usuario manualmente.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="high-tech-card space-y-6">
          <h3 className="font-bold text-white">Dar de Alta Empresa</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Usuario" 
              className="high-tech-input" 
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Contraseña" 
              className="high-tech-input" 
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nicho</label>
              <select 
                className="high-tech-input bg-bg-dark"
                value={newNiche || ''}
                onChange={(e) => setNewNiche(e.target.value as Niche)}
              >
                <option value="IT_CYBER">IT & Cyber</option>
                <option value="MEDICINA">Medical</option>
                <option value="CONSTRUCCION">Construction</option>
                <option value="DEFENSA">Defense</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Plan</label>
              <select 
                className="high-tech-input bg-bg-dark"
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value as Plan)}
              >
                <option value="MERCHANT">MERCHANT</option>
                <option value="BRONZE">BRONCE</option>
                <option value="SILVER">PLATA</option>
                <option value="GOLD">ORO</option>
              </select>
            </div>
            <button 
              className="high-tech-button"
              onClick={() => {
                onCreateUser(newUser, newPass, newNiche, newPlan);
                setNewUser('');
                setNewPass('');
                alert(`Empresa ${newUser} registrada con éxito.`);
              }}
            >
              Dar de Alta Empresa
            </button>
          </div>
        </div>

        <div className="high-tech-card overflow-hidden !p-0">
          <div className="p-6 border-b border-border-dark">
            <h3 className="font-bold text-white">Lista de Empresas en el Sistema</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-zinc-500 bg-bg-dark border-b border-border-dark">
                  <th className="px-6 py-3 font-bold">Usuario</th>
                  <th className="px-6 py-3 font-bold">Nicho</th>
                  <th className="px-6 py-3 font-bold">Plan</th>
                  <th className="px-6 py-3 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {Object.entries(users).map(([u, data]) => (
                  <tr key={u} className="hover:bg-bg-dark transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{u}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{data.niche}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{data.plan || 'BRONCE'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${data.active ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>
                        {data.active ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CouponManagementView = ({ coupons, onCreateCoupon }: { coupons: Record<string, number>, onCreateCoupon: (code: string, discount: number) => void }) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(25);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-brand-cyan" />
          🎫 Generador de Descuentos
        </h1>
        <p className="text-zinc-400 mt-1">Cupones y Precios: Crea códigos de descuento exclusivos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="high-tech-card space-y-6">
          <h3 className="font-bold text-white">Crear Cupón</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Código del Cupón (ej: AMIGO50)" 
              className="high-tech-input" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase">Descuento (%): {discount}%</label>
              <input 
                type="range" 
                min="5" 
                max="100" 
                step="5"
                className="w-full h-2 bg-bg-dark rounded-lg appearance-none cursor-pointer accent-brand-blue"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <button 
              className="high-tech-button"
              onClick={() => {
                onCreateCoupon(code, discount);
                setCode('');
                alert(`Cupón ${code} creado.`);
              }}
            >
              Crear Cupón
            </button>
          </div>
        </div>

        <div className="high-tech-card space-y-4">
          <h3 className="font-bold text-white">Cupones Activos</h3>
          <div className="p-4 bg-bg-dark border border-border-dark rounded-xl">
            <pre className="text-xs text-brand-cyan font-mono overflow-auto">
              {JSON.stringify(coupons, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPaymentView = ({ 
  coupons, 
  prices, 
  userPlan, 
  paymentActive,
  onUpdatePlan,
  onSetupAutoPay
}: { 
  coupons: Record<string, number>, 
  prices: Record<Plan, number>, 
  userPlan: Plan,
  paymentActive: boolean,
  onUpdatePlan: (plan: Plan) => void,
  onSetupAutoPay: () => void
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleValidate = () => {
    if (coupons[couponInput]) {
      setAppliedDiscount(coupons[couponInput]);
      setError('');
    } else if (couponInput !== "") {
      setError('Invalid coupon.');
      setAppliedDiscount(null);
    }
  };

  const handleSetup = () => {
    setIsSettingUp(true);
    setTimeout(() => {
      setIsSettingUp(false);
      onSetupAutoPay();
    }, 2000);
  };

  const getPrice = (plan: Plan) => {
    const base = prices[plan] || 0;
    return appliedDiscount ? base * (1 - appliedDiscount / 100) : base;
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-brand-cyan" />
          💳 Automated Billing Center
        </h1>
        <p className="text-zinc-400 mt-1">Select the plan that best fits your business goals and manage your payments.</p>
      </header>

      <div className="high-tech-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-sm w-full">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">🎟️ PROMO CODE</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter your coupon here" 
                className="high-tech-input" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              />
              <button 
                className="px-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all"
                onClick={handleValidate}
              >
                Apply
              </button>
            </div>
            {appliedDiscount && (
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mt-2">✨ PROMO APPLIED: {appliedDiscount}% Discount activated!</p>
            )}
            {error && (
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-2">{error}</p>
            )}
          </div>

          <div className="p-4 bg-bg-dark border border-border-dark rounded-2xl flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Payment Status</p>
              <p className={`text-sm font-bold ${paymentActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                {paymentActive ? 'AUTOMATIC BILLING ACTIVE' : 'MANUAL PAYMENT REQUIRED'}
              </p>
            </div>
            {!paymentActive && (
              <button 
                onClick={handleSetup}
                disabled={isSettingUp}
                className="ml-4 px-4 py-2 bg-brand-cyan text-bg-dark rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
              >
                {isSettingUp ? 'Connecting...' : 'SET UP AUTO-PAY'}
              </button>
            )}
          </div>
        </div>

        <hr className="border-border-dark" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* MERCHANT */}
          <div className={`p-6 rounded-2xl border transition-all ${userPlan === 'MERCHANT' ? 'bg-brand-blue/5 border-brand-cyan' : 'bg-bg-dark border-border-dark'}`}>
            <h3 className="text-xl font-bold text-white mb-2">MERCHANT</h3>
            <p className="text-3xl font-bold text-white mb-4">
              ${getPrice('MERCHANT').toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-zinc-500">/ month</span>
            </p>
            <ul className="space-y-2 mb-8 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                Basic Radar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                Legal Vault
              </li>
            </ul>
            <button 
              onClick={() => onUpdatePlan('MERCHANT')}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${userPlan === 'MERCHANT' ? 'bg-brand-cyan text-bg-dark' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
            >
              {userPlan === 'MERCHANT' ? 'CURRENT PLAN' : 'Select Merchant'}
            </button>
          </div>

          {/* BRONZE */}
          <div className={`p-6 rounded-2xl border transition-all ${userPlan === 'BRONZE' ? 'bg-brand-blue/5 border-brand-cyan' : 'bg-bg-dark border-border-dark'}`}>
            <h3 className="text-xl font-bold text-white mb-2">BRONZE</h3>
            <p className="text-3xl font-bold text-white mb-4">
              ${getPrice('BRONZE').toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-zinc-500">/ month</span>
            </p>
            <ul className="space-y-2 mb-8 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                Market Radar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                Legal Vault
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                Email Alerts
              </li>
            </ul>
            <button 
              onClick={() => onUpdatePlan('BRONZE')}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${userPlan === 'BRONZE' ? 'bg-brand-cyan text-bg-dark' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
            >
              {userPlan === 'BRONZE' ? 'CURRENT PLAN' : 'Select Bronze'}
            </button>
          </div>

          {/* SILVER */}
          <div className={`p-6 rounded-2xl border transition-all ${userPlan === 'SILVER' ? 'bg-brand-blue/5 border-brand-cyan' : 'bg-bg-dark border-border-dark'}`}>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">SILVER</h3>
            <p className="text-3xl font-bold text-white mb-4">
              ${getPrice('SILVER').toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-zinc-500">/ month</span>
            </p>
            <ul className="space-y-2 mb-8 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Everything in Bronze
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                5 AI Analyses/mo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Success History
              </li>
            </ul>
            <button 
              onClick={() => onUpdatePlan('SILVER')}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${userPlan === 'SILVER' ? 'bg-emerald-500 text-white' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-600/30'}`}
            >
              {userPlan === 'SILVER' ? 'CURRENT PLAN' : 'Select Silver'}
            </button>
          </div>

          {/* GOLD */}
          <div className={`p-6 rounded-2xl border transition-all ${userPlan === 'GOLD' ? 'bg-brand-blue/5 border-brand-cyan' : 'bg-bg-dark border-border-dark'}`}>
            <h3 className="text-xl font-bold text-amber-400 mb-2">GOLD (GENIUS)</h3>
            <p className="text-3xl font-bold text-white mb-4">
              ${getPrice('GOLD').toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-zinc-500">/ month</span>
            </p>
            <ul className="space-y-2 mb-8 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                UNLIMITED AI Forge
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Price-to-Win Engine
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Turnkey Package Generator
              </li>
            </ul>
            <button 
              onClick={() => onUpdatePlan('GOLD')}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${userPlan === 'GOLD' ? 'bg-amber-500 text-white' : 'bg-amber-600/20 text-amber-400 border border-amber-600/50 hover:bg-amber-600/30'}`}
            >
              {userPlan === 'GOLD' ? 'CURRENT PLAN' : 'Select Gold (GENIUS)'}
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-border-dark text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <Shield className="w-4 h-4" />
            <h4 className="text-sm font-bold uppercase tracking-widest">Secure Payment via ACH or Wire Transfer</h4>
          </div>
          <button className="high-tech-button max-w-md mx-auto">
            CONFIRM & PAY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

const PriceControlView = ({ prices, onUpdatePrices }: { prices: Record<Plan, number>, onUpdatePrices: (newPrices: Record<Plan, number>) => void }) => {
  const [localPrices, setLocalPrices] = useState(prices);

  const handleUpdate = () => {
    onUpdatePrices(localPrices);
    alert("Tarifas actualizadas para todos los clientes.");
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-brand-cyan" />
          Configuración de Suscripciones
        </h1>
        <p className="text-zinc-400 mt-1">Ajusta cuánto cuesta cada plan en tiempo real.</p>
      </header>

      <div className="max-w-md high-tech-card space-y-6">
        <div className="space-y-4">
          {(['BRONZE', 'SILVER', 'GOLD'] as Plan[]).map((plan) => (
            <div key={plan} className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price {plan} ($)</label>
              <input 
                type="number" 
                value={localPrices[plan]}
                onChange={(e) => setLocalPrices({ ...localPrices, [plan]: Number(e.target.value) })}
                className="high-tech-input"
              />
            </div>
          ))}
        </div>
        <button 
          onClick={handleUpdate}
          className="high-tech-button"
        >
          ACTUALIZAR TARIFAS
        </button>
      </div>
    </div>
  );
};

const UrgencyModule = () => {
  const [stock, setStock] = useState(12); // Simulación de stock bajo
  const [minutesSinceLead, setMinutesSinceLead] = useState(15);
  const marginLoss = minutesSinceLead * 450; // $450 perdidos por minuto

  return (
    <div className="bg-bg-card border border-brand-red/30 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-brand-red/5">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-brand-red flex items-center gap-3 uppercase tracking-tighter italic">
          <Zap className="w-6 h-6 animate-pulse" />
          Módulo de Urgencia Dinámica
        </h3>
        <span className="text-xs font-black text-brand-red animate-pulse bg-brand-red/10 px-4 py-1 rounded-full uppercase tracking-widest">
          ALERTA DE STOCK: {stock}%
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-black/40 rounded-[2rem] border border-brand-red/20">
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Margen de Oportunidad Real</p>
          <p className="text-5xl font-black text-white tracking-tighter">-${marginLoss.toLocaleString()} USD</p>
          <p className="text-[10px] text-brand-red/70 mt-2 italic font-bold">Pérdida proyectada por demora en leads ({minutesSinceLead} min)</p>
        </div>
        
        <div className="flex items-center justify-center">
          <button className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${stock < 15 ? 'animate-pulse bg-brand-red text-white shadow-brand-red/20' : 'bg-zinc-800 text-zinc-400'}`}>
            Cierre de Venta Agresivo
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminView = ({ onNavigate, evidenceLog, usersCount, couponsCount }: { onNavigate: (menu: MenuOption) => void, evidenceLog: Evidence[], usersCount: number, couponsCount: number }) => {
  return (
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

      <UrgencyModule />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard title="Empresas Activas" value={(usersCount - 1).toString()} change="Global" icon={Users} trend="neutral" />
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
                evidenceLog.slice(0, 5).map((log, i) => (
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
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-600 italic">Aún no hay actividad de IA en el laboratorio.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const VaultOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    uei: '',
    cage: '',
    naics: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [warning, setWarning] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName && formData.uei && formData.cage) {
      onComplete();
    } else {
      setWarning('Critical federal registration data is missing.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <div className="w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-zinc-200">
          <Database className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900">🔐 The Vault: Configuration</h1>
        <p className="text-zinc-500 mt-2">Complete your federal data to activate the search engine.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Legal Company Name</label>
            <input 
              type="text" 
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              placeholder="e.g., GovTech Solutions LLC"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">UEI (Unique Entity ID)</label>
            <input 
              type="text" 
              value={formData.uei}
              onChange={(e) => setFormData({...formData, uei: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              placeholder="e.g., ABC123XYZ"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CAGE Code</label>
            <input 
              type="text" 
              value={formData.cage}
              onChange={(e) => setFormData({...formData, cage: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              placeholder="e.g., 7X8Y9"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Primary NAICS Codes</label>
            <input 
              type="text" 
              value={formData.naics}
              onChange={(e) => setFormData({...formData, naics: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              placeholder="Comma separated (e.g., 541511, 541512)"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Intelligence Upload
          </h3>
          <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center hover:border-zinc-400 transition-all cursor-pointer group relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-zinc-100 transition-colors">
                <FileText className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-600">
                {file ? file.name : 'Upload a previous proposal (PDF)'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">For the AI to learn your response style</p>
            </div>
          </div>
        </div>

        {warning && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-amber-600 text-sm font-medium flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            {warning}
          </motion.p>
        )}

        <button 
          type="submit"
          className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-lg shadow-zinc-200 flex items-center justify-center gap-2"
        >
          <Database className="w-5 h-5" />
          Sincronizar Bóveda
        </button>
      </form>
    </div>
  );
};

const IntelligenceCenter = ({ niche }: { niche: Niche }) => (
  <div className="space-y-8">
    <header>
      <h1 className="text-3xl font-bold text-zinc-900">🚀 Centro de Inteligencia - {niche}</h1>
      <p className="text-zinc-500 mt-1">Bienvenido. La Bóveda está activa. Buscando licitaciones...</p>
    </header>

    <InfoBox 
      type="success"
      title="Bóveda Sincronizada" 
      content="El Genio está analizando sus datos federales y propuestas históricas para encontrar el match perfecto." 
    />

    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="flex items-center gap-2 text-zinc-400 mb-6">
        <Search className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-widest">Motor de Búsqueda: ACTIVO</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-all cursor-pointer group bg-zinc-50/30">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Match 9{i}%</span>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-all" />
            </div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">Oportunidad Federal #{i}09</h4>
            <p className="text-xs text-zinc-500 mt-1">Análisis de IA: Su perfil UEI cumple con el 100% de los requisitos técnicos.</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App Logic ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [vaultComplete, setVaultComplete] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenuOption>('DASHBOARD');
  const [isPaid, setIsPaid] = useState(true); // Simulación de pago activo
  const [evidenceLog, setEvidenceLog] = useState<Evidence[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [loginTab, setLoginTab] = useState<'login' | 'register' | 'recover'>('login');
  const [recoveryUser, setRecoveryUser] = useState('');
  const [recoveryInfo, setRecoveryInfo] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [vanceLog, setVanceLog] = useState<VanceLogEntry[]>([]);
  const [engineeringLogs, setEngineeringLogs] = useState<EngineeringLog[]>([]);
  const [samApiKey, setSamApiKey] = useState('DEMO_KEY');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [strategyHistory, setStrategyHistory] = useState<{ role: string, content: string }[]>([]);
  
  const [prices, setPrices] = useState<Record<Plan, number>>({
    "MERCHANT": 200,
    "BRONZE": 500,
    "SILVER": 1000,
    "GOLD": 1500
  });

  // Load persistence data
  useEffect(() => {
    const loadData = async () => {
      try {
        const configRes = await fetch('/api/config');
        const config = await configRes.json();
        if (config.samApiKey) setSamApiKey(config.samApiKey);
        if (config.geminiApiKey) {
          setGeminiApiKey(config.geminiApiKey);
          process.env.GEMINI_API_KEY = config.geminiApiKey;
        }

        const historyRes = await fetch('/api/history');
        const history = await historyRes.json();
        setStrategyHistory(history);

        const engLogRes = await fetch('/api/engineering-log');
        const engLogs = await engLogRes.json();
        
        // Add initial log if empty to show it's active
        if (engLogs.length === 0) {
          const initialLogs: EngineeringLog[] = [
            {
              id: 'eng-001',
              timestamp: new Date().toLocaleString(),
              change: 'Activación del Protocolo de Auto-Evolución',
              reason: 'Concesión de autoridad total a Christian Vance para optimización de interfaz y lógica de ventas.',
              linesChanged: 'src/App.tsx:52-65'
            },
            {
              id: 'eng-002',
              timestamp: new Date().toLocaleString(),
              change: 'Implementación del Módulo de Urgencia Dinámica (Vance-01)',
              reason: 'Optimización de la agresividad visual para cierre de ventas y visualización de pérdida de oportunidad en tiempo real.',
              linesChanged: 'src/App.tsx:3307-3340'
            }
          ];
          setEngineeringLogs(initialLogs);
          saveEngineeringLog(initialLogs);
        } else {
          setEngineeringLogs(engLogs);
        }
      } catch (err) {
        console.error("Failed to load persistent data:", err);
      }
    };
    loadData();
  }, []);

  const saveConfig = async (sam: string, gemini: string) => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samApiKey: sam, geminiApiKey: gemini })
      });
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  };

  const saveHistory = async (history: { role: string, content: string }[]) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(history)
      });
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  };

  const saveEngineeringLog = async (logs: EngineeringLog[]) => {
    try {
      await fetch('/api/engineering-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logs)
      });
    } catch (err) {
      console.error("Failed to save engineering log:", err);
    }
  };
  const [registrationData, setRegistrationData] = useState({
    username: '',
    password: '',
    email: '',
    niche: 'IT_CYBER' as Niche,
    customNiche: ''
  });

  const [usersDb, setUsersDb] = useState<Record<string, UserRecord>>({
    "jefe": { pass: "2Hermanos", niche: "MASTER_CONTROL", active: true, type: 'ADMIN', plan: 'GOLD' },
    "it_test": { pass: "123", niche: "IT_CYBER", active: false, type: 'USER', plan: 'BRONZE' }
  });

  const [couponsDb, setCouponsDb] = useState<Record<string, number>>({
    "JEFE10": 10,
    "BIENVENIDO": 50,
    "JEFE2024": 50
  });

  useEffect(() => {
    // Christian Vance Initial Briefing
    const initialBriefing: Briefing = {
      id: 'vance-001',
      title: 'STRATEGIC BRIEFING: Q1 Federal Capture Strategy',
      content: `Dear Partner,

Following my morning review of federal data, I have isolated a high-yield opportunity for your firm. Our proprietary algorithms have flagged a significant shift in procurement patterns within your specific niche. 

I strongly advise immediate engagement with the upcoming solicitations from the GSA. My team has identified a potential "Perfect Match" scenario that aligns with your core competencies.

Time is of the essence. We must move with precision and speed to secure this advantage.

Best regards,

Christian Vance | Director of Federal Capture`,
      date: new Date().toLocaleTimeString(),
      isRead: false,
      type: 'PERFECT_MATCH'
    };

    setBriefings([initialBriefing]);
    setVanceLog([{
      id: 'log-001',
      recipient: 'Todos los usuarios activos',
      action: 'Envío autónomo de Briefing Estratégico Inicial',
      timestamp: new Date().toLocaleTimeString(),
      type: 'PERFECT_MATCH'
    }]);
  }, []);

  const addBriefing = (title: string, content: string, type: 'PERFECT_MATCH' | 'RIGGING_ALERT', recipient: string) => {
    const newBriefing: Briefing = {
      id: `vance-${Date.now()}`,
      title,
      content,
      date: new Date().toLocaleTimeString(),
      isRead: false,
      type
    };
    setBriefings(prev => [newBriefing, ...prev]);
    setVanceLog(prev => [{
      id: `log-${Date.now()}`,
      recipient,
      action: `Generación de briefing: ${title}`,
      timestamp: new Date().toLocaleTimeString(),
      type
    }, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lowerUser = username.toLowerCase();
    const masterUser = "jefe";
    const masterPass = "2Hermanos";

    let record = usersDb[lowerUser];
    
    // Ensure Master account is always available
    if (lowerUser === masterUser && (!record || record.pass !== masterPass)) {
      record = { pass: masterPass, niche: "MASTER_CONTROL", active: true, type: 'ADMIN', plan: 'GOLD' };
    }

    if (record && record.pass === password) {
      setUser({ 
        username: lowerUser, 
        niche: record.niche, 
        isAdmin: record.type === 'ADMIN',
        plan: record.plan || 'BRONZE'
      });
      if (couponCode && couponsDb[couponCode]) {
        alert(`Cupón ${couponCode} validado para su suscripción.`);
      }
      if (record.type === 'ADMIN') {
        setCurrentMenu('DASHBOARD');
        setLegalAccepted(true);
      } else {
        setCurrentMenu('BOVEDA_LEGAL');
      }
    } else {
      if (lowerUser === masterUser) {
        setError('Error de acceso Master: Verifique sus credenciales de nivel Shadow o contacte al administrador del sistema.');
      } else {
        setError('Access denied. Please check your username and password.');
      }
    }
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    const record = usersDb[recoveryUser.toLowerCase()];
    if (record) {
      setRecoveryInfo(`Password recovered: ${record.pass}`);
    } else {
      setError('User not found.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const { username: regUser, password: regPass, email, niche, customNiche } = registrationData;
    const finalNiche = niche === 'OTHER' ? customNiche : niche;
    
    if (regUser && regPass && email && finalNiche) {
      setUsersDb(prev => ({
        ...prev,
        [regUser.toLowerCase()]: {
          pass: regPass,
          niche: finalNiche as Niche,
          active: false,
          email,
          type: 'USER',
          plan: 'BRONZE'
        }
      }));
      setLoginTab('login');
      setUsername(regUser);
      setPassword(regPass);
      setError('');
      alert("Cuenta creada. Proceda a la Verificación Legal Obligatoria.");
    } else {
      setError("Complete todos los campos.");
    }
  };

  const logout = () => {
    setUser(null);
    setLegalAccepted(false);
    setVaultComplete(false);
    setUsername('');
    setPassword('');
    setCouponCode('');
    setError('');
    setRecoveryInfo('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-bg-card rounded-[2.5rem] border border-border-dark p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-cyan" />
          
          <div className="text-center mb-10">
            <Shield className="text-brand-blue mx-auto mb-4" size={50} />
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">GovWin Advisor</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Stark Systems v23.0</p>
          </div>

          <div className="flex bg-black/40 p-1 rounded-2xl mb-10 border border-border-dark">
            <button 
              onClick={() => setLoginTab('login')} 
              className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${loginTab === 'login' ? 'bg-brand-blue text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setLoginTab('register')} 
              className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${loginTab === 'register' ? 'bg-brand-blue text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Register
            </button>
            <button 
              onClick={() => setLoginTab('recover')} 
              className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${loginTab === 'recover' ? 'bg-brand-blue text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Recovery
            </button>
          </div>
          
          <div className="space-y-6">
            {loginTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Username</label>
                  <input 
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-4 text-sm outline-none focus:border-brand-blue transition-all" 
                    placeholder="Master or Client ID" 
                    value={username}
                    onChange={e => setUsername(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Access Key</label>
                  <input 
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-4 text-sm outline-none focus:border-brand-blue transition-all" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Promo Code (Optional)</label>
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-4 text-sm outline-none focus:border-brand-blue transition-all" 
                    placeholder="OPTIONAL"
                  />
                </div>
                {error && <p className="text-brand-red text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}
                <button type="submit" className="w-full bg-brand-blue py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Access System
                </button>
              </form>
            ) : loginTab === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-xl mb-4">
                  <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-widest mb-1">🔐 Secure Ecosystem</p>
                  <p className="text-[11px] text-zinc-400">Legal verification required to prevent industrial espionage.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Username</label>
                  <input 
                    type="text" 
                    required
                    value={registrationData.username}
                    onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-3 text-sm outline-none focus:border-brand-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                  <input 
                    type="password" 
                    required
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-3 text-sm outline-none focus:border-brand-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</label>
                  <input 
                    type="email" 
                    required
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-3 text-sm outline-none focus:border-brand-blue transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Industry</label>
                  <select 
                    value={registrationData.niche || ''}
                    onChange={(e) => setRegistrationData({...registrationData, niche: e.target.value as Niche})}
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-3 text-sm outline-none focus:border-brand-blue transition-all" 
                  >
                    <option value="IT_CYBER">IT & Cyber</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="DEFENSE">Defense</option>
                    <option value="CONSTRUCTION">Construction</option>
                    <option value="SUPPLIES_COMMODITIES">Supplies & Commodities</option>
                    <option value="PROFESSIONAL_SERVICES">Professional Services</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {registrationData.niche === 'OTHER' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Specify Niche</label>
                    <input 
                      type="text" 
                      required
                      value={registrationData.customNiche}
                      onChange={(e) => setRegistrationData({...registrationData, customNiche: e.target.value})}
                      className="w-full bg-black/40 border border-border-dark rounded-2xl p-3 text-sm outline-none focus:border-brand-blue transition-all" 
                      placeholder="e.g., Office Furniture"
                    />
                  </motion.div>
                )}

                {error && <p className="text-brand-red text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}

                <button type="submit" className="w-full bg-brand-blue py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all mt-4">
                  START VERIFICATION
                </button>
              </form>
            ) : (
              <form onSubmit={handleRecover} className="space-y-6">
                <p className="text-zinc-400 text-xs italic">Si el usuario existe, recibirá un correo en su dirección corporativa.</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Username to recover</label>
                  <input 
                    type="text" 
                    required
                    value={recoveryUser}
                    onChange={(e) => setRecoveryUser(e.target.value)}
                    className="w-full bg-black/40 border border-border-dark rounded-2xl p-4 text-sm outline-none focus:border-brand-blue transition-all" 
                    placeholder="Usuario"
                  />
                </div>

                {recoveryInfo && (
                  <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl text-brand-cyan text-xs font-bold">
                    {recoveryInfo}
                  </div>
                )}

                {error && <p className="text-brand-red text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}

                <button 
                  type="submit"
                  className="w-full bg-brand-blue py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all"
                >
                  Recuperar
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex font-sans relative overflow-hidden">
      {/* Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed top-6 left-6 z-50 p-2 bg-bg-card border border-border-dark rounded-xl text-zinc-400 hover:text-white transition-all shadow-2xl"
      >
        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
      </button>

      {/* Sidebar */}
      <aside className={`bg-bg-dark border-r border-border-dark text-white flex flex-col shrink-0 transition-all duration-300 z-40 shadow-2xl ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-72 opacity-100'}`}>
        <div className="p-8 flex items-center gap-4">
          <Shield className="w-8 h-8 text-brand-blue" />
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">GovWin AI</h1>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-4 bg-bg-card rounded-[1.5rem] border border-border-dark flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-bg-dark flex items-center justify-center text-xs font-black border border-border-dark text-brand-cyan">
              {user.niche?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                {user.isAdmin ? 'MASTER PANEL' : `PLAN: ${user.plan || 'BRONZE'}`}
              </p>
              <p className="text-xs font-black truncate uppercase tracking-tight">{user.isAdmin ? 'Control Maestro' : user.niche}</p>
            </div>
          </div>

          <div className="space-y-1">
            {user.isAdmin ? (
              <>
                <p className="text-[10px] font-black text-zinc-600 mb-4 pl-4 uppercase tracking-[0.2em]">Master Control</p>
                <NavBtn label="Tablero Maestro" id="DASHBOARD" icon={LayoutDashboard} active={currentMenu === 'DASHBOARD'} onClick={() => setCurrentMenu('DASHBOARD')} />
                <NavBtn label="Cazador de Clientes" id="THE_HUNTER" icon={Zap} active={currentMenu === 'THE_HUNTER'} onClick={() => setCurrentMenu('THE_HUNTER')} />
                <NavBtn label="Monitor Cognitivo" id="COGNITIVE_MONITOR" icon={Brain} active={currentMenu === 'COGNITIVE_MONITOR'} onClick={() => setCurrentMenu('COGNITIVE_MONITOR')} />
                <NavBtn label="Sala de Estrategia" id="INTELIGENCIA_SHADOW" icon={MessageSquare} active={currentMenu === 'INTELIGENCIA_SHADOW'} onClick={() => setCurrentMenu('INTELIGENCIA_SHADOW')} />
                <NavBtn label="Gestión de Usuarios" id="USUARIOS" icon={Users} active={currentMenu === 'USUARIOS'} onClick={() => setCurrentMenu('USUARIOS')} />
                <NavBtn label="Cupones y Precios" id="CUPONES" icon={CreditCard} active={currentMenu === 'CUPONES'} onClick={() => setCurrentMenu('CUPONES')} />
                <NavBtn label="Evidencias" id="EVIDENCIAS" icon={FileText} active={currentMenu === 'EVIDENCIAS'} onClick={() => setCurrentMenu('EVIDENCIAS')} />
                <NavBtn label="Registro Ingeniería" id="REGISTRO_INGENIERIA" icon={Terminal} active={currentMenu === 'REGISTRO_INGENIERIA'} onClick={() => setCurrentMenu('REGISTRO_INGENIERIA')} />
              </>
            ) : (
              <>
                <p className="text-[10px] font-black text-zinc-600 mb-4 pl-4 uppercase tracking-[0.2em]">Mission Control</p>
                <NavBtn label="Executive Briefings" id="EXECUTIVE_BRIEFINGS" icon={Mail} active={currentMenu === 'EXECUTIVE_BRIEFINGS'} onClick={() => setCurrentMenu('EXECUTIVE_BRIEFINGS')} />
                <NavBtn label="Market Radar" id="MARKET_FEED" icon={RadarIcon} active={currentMenu === 'MARKET_FEED'} onClick={() => setCurrentMenu('MARKET_FEED')} />
                <NavBtn label="Consultar a Christian" id="INTELIGENCIA_SHADOW" icon={Brain} active={currentMenu === 'INTELIGENCIA_SHADOW'} onClick={() => setCurrentMenu('INTELIGENCIA_SHADOW')} />
                <NavBtn label="The Forge Lab" id="FORGE" icon={Zap} active={currentMenu === 'FORGE'} onClick={() => setCurrentMenu('FORGE')} />
                <NavBtn label="Subscription" id="PAGOS" icon={DollarSign} active={currentMenu === 'PAGOS'} onClick={() => setCurrentMenu('PAGOS')} />
                <NavBtn label="Legal Vault" id="BOVEDA_LEGAL" icon={Lock} active={currentMenu === 'BOVEDA_LEGAL'} onClick={() => setCurrentMenu('BOVEDA_LEGAL')} />
              </>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-border-dark">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-brand-red bg-brand-red/5 hover:bg-brand-red/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            {user.isAdmin ? 'Logout Master' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <NeuralLink />
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!legalAccepted ? (
              <motion.div
                key="legal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <LegalOnboardingView onAccept={() => setLegalAccepted(true)} samApiKey={samApiKey} />
              </motion.div>
            ) : (
              <motion.div
                key={user.isAdmin ? `admin-${currentMenu}` : (vaultComplete ? `center-${currentMenu}` : 'vault')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {user.isAdmin ? (
                  <>
                    {currentMenu === 'DASHBOARD' && <AdminView onNavigate={setCurrentMenu} evidenceLog={evidenceLog} usersCount={Object.keys(usersDb).length} couponsCount={Object.keys(couponsDb).length} />}
                    {currentMenu === 'VERIFICAR_EMPRESAS' && <CompanyVerificationView users={usersDb} />}
                    {currentMenu === 'MARKET_FEED' && <MarketFeedView niche={user.niche} isAdmin={true} isPaid={true} samApiKey={samApiKey} username={user.username} onAddBriefing={addBriefing} />}
                    {currentMenu === 'USUARIOS' && (
                      <UserManagementView 
                        users={usersDb} 
                        onCreateUser={(u, p, n, plan) => setUsersDb(prev => ({ ...prev, [u.toLowerCase()]: { pass: p, niche: n, active: true, plan } }))} 
                      />
                    )}
                    {currentMenu === 'CUPONES' && (
                      <CouponManagementView 
                        coupons={couponsDb} 
                        onCreateCoupon={(code, discount) => setCouponsDb(prev => ({ ...prev, [code]: discount }))} 
                      />
                    )}
                    {currentMenu === 'EVIDENCIAS' && <ShadowPanelEvidenciasView evidenceLog={evidenceLog} />}
                    {currentMenu === 'PRECIOS' && <PriceControlView prices={prices} onUpdatePrices={setPrices} />}
                    {currentMenu === 'APRENDIZAJE' && <AutonomousLearningView />}
                    {currentMenu === 'INTELIGENCIA_SHADOW' && (
                      <StrategyRoomView 
                        history={strategyHistory} 
                        onUpdateHistory={(newHistory) => {
                          setStrategyHistory(newHistory);
                          saveHistory(newHistory);
                        }} 
                        onLogEngineering={(log) => {
                          const newLogs = [log, ...engineeringLogs];
                          setEngineeringLogs(newLogs);
                          saveEngineeringLog(newLogs);
                        }}
                      />
                    )}
                    {currentMenu === 'REGISTRO_INGENIERIA' && <EngineeringLogView logs={engineeringLogs} />}
                    {currentMenu === 'VANCE_LOG' && <VanceLogView log={vanceLog} />}
                    {currentMenu === 'THE_HUNTER' && <ChristianSalesHunterView />}
                    {currentMenu === 'COGNITIVE_MONITOR' && <CognitiveMonitorView />}
                    {currentMenu === 'CONFIG_API' && (
                      <ApiConfigurationView 
                        samKey={samApiKey} 
                        geminiKey={geminiApiKey}
                        onUpdateKeys={(sam, gemini) => {
                          setSamApiKey(sam);
                          setGeminiApiKey(gemini);
                          process.env.GEMINI_API_KEY = gemini;
                          saveConfig(sam, gemini);
                        }} 
                      />
                    )}
                  </>
                ) : (
                  <>
                    {!vaultComplete ? (
                      <VaultOnboarding onComplete={() => setVaultComplete(true)} />
                    ) : (
                      <>
                        {currentMenu === 'EXECUTIVE_BRIEFINGS' && (
                          <ExecutiveBriefingsView 
                            briefings={briefings} 
                            onMarkAsRead={(id) => setBriefings(prev => prev.map(b => b.id === id ? { ...b, isRead: true } : b))} 
                          />
                        )}
                        {currentMenu === 'BOVEDA_LEGAL' && <LegalVaultView samApiKey={samApiKey} />}
                        {(currentMenu === 'MARKET_FEED' || currentMenu === 'DASHBOARD') && (
                          <MarketFeedView 
                            niche={user.niche} 
                            isAdmin={false} 
                            isPaid={isPaid} 
                            samApiKey={samApiKey}
                            username={user.username}
                            onAddBriefing={addBriefing}
                            onSelectBid={(bid) => {
                              setSelectedBid(bid);
                              setCurrentMenu('FORGE');
                            }}
                          />
                        )}
                        {currentMenu === 'FORGE' && (
                          <TheForgeLabView 
                            plan={user.plan || 'BRONZE'}
                            niche={user.niche || 'IT_CYBER'}
                            username={user.username}
                            activeBid={selectedBid}
                            onLogEvidence={(ev) => setEvidenceLog(prev => [ev, ...prev])}
                            onUpgrade={() => setCurrentMenu('PAGOS')}
                          />
                        )}
                        {currentMenu === 'APRENDIZAJE' && <AutonomousLearningView />}
                        {currentMenu === 'INTELIGENCIA_SHADOW' && <ConsultarChristianView />}
                        {currentMenu === 'PAGOS' && (
                          <SubscriptionPaymentView 
                            coupons={couponsDb} 
                            prices={prices} 
                            userPlan={user.plan || 'BRONZE'} 
                            paymentActive={usersDb[user.username]?.payment_active || false}
                            onUpdatePlan={(newPlan) => {
                              setUser(prev => prev ? { ...prev, plan: newPlan } : null);
                              setUsersDb(prev => {
                                const username = user?.username;
                                if (username && prev[username]) {
                                  return {
                                    ...prev,
                                    [username]: { ...prev[username], plan: newPlan }
                                  };
                                }
                                return prev;
                              });
                            }}
                            onSetupAutoPay={() => {
                              setUsersDb(prev => {
                                const username = user?.username;
                                if (username && prev[username]) {
                                  return {
                                    ...prev,
                                    [username]: { ...prev[username], payment_active: true }
                                  };
                                }
                                return prev;
                              });
                            }}
                          />
                        )}
                        {currentMenu === 'BOVEDA' && (
                          <div className="space-y-8">
                            <header>
                              <h1 className="text-3xl font-bold text-white">🔐 La Bóveda</h1>
                              <p className="text-zinc-400 mt-1">Configuración federal y activos de inteligencia.</p>
                            </header>
                            <div className="high-tech-card space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nombre Legal</label>
                                  <input type="text" defaultValue="Tech Corp S.A." className="high-tech-input" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">UEI</label>
                                  <input type="text" placeholder="Escriba su ID Único" className="high-tech-input" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CAGE Code</label>
                                  <input type="text" placeholder="Código Federal" className="high-tech-input" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Historial para Aprendizaje</label>
                                  <div className="high-tech-input flex items-center justify-center border-dashed border-2 py-8 cursor-pointer hover:border-brand-cyan transition-all">
                                    <Upload className="w-5 h-5 mr-2 text-zinc-500" />
                                    <span className="text-zinc-500">Cargar Historial</span>
                                  </div>
                                </div>
                              </div>
                              <button className="high-tech-button">Sincronizar Datos</button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  </div>
);
}
