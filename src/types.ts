export type Niche = string | null;
export type Plan = 'MERCHANT' | 'BRONZE' | 'SILVER' | 'GOLD';
export type MenuOption = 
  | 'DASHBOARD' | 'MARKET_FEED' | 'MAPA_TACTICO' | 'BOVEDA' 
  | 'FORGE' | 'EVIDENCIAS' | 'USUARIOS' | 'CUPONES' 
  | 'PAGOS' | 'APRENDIZAJE' | 'BOVEDA_LEGAL' | 'VERIFICAR_EMPRESAS' 
  | 'PRECIOS' | 'CONFIG_API' | 'INTELIGENCIA_SHADOW' 
  | 'EXECUTIVE_BRIEFINGS' | 'VANCE_LOG' | 'THE_HUNTER' 
  | 'COGNITIVE_MONITOR' | 'REGISTRO_INGENIERIA';

export interface EngineeringLog {
  id: string;
  timestamp: string;
  change: string;
  reason: string;
  linesChanged: string;
}

export interface Briefing {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'PERFECT_MATCH' | 'RIGGING_ALERT';
}

export interface VanceLogEntry {
  id: string;
  recipient: string;
  action: string;
  timestamp: string;
  type: string;
}

export interface User {
  username: string;
  niche: Niche;
  isAdmin: boolean;
  plan?: Plan;
}

export interface UserRecord {
  pass: string;
  niche: Niche;
  active: boolean;
  email?: string;
  type?: 'ADMIN' | 'USER';
  plan?: Plan;
  payment_active?: boolean;
}

export interface Evidence {
  Usuario: string;
  Acción: string;
  MontoBid?: number;
  ComisionProyectada?: number;
  Fecha: string;
}

export interface Bid {
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
