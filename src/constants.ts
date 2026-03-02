import { Bid } from './types';

export const BIDS_DATA: Bid[] = [
  { id: "DOD-IT-99", niche: 'IT_CYBER', lat: 38.8951, lon: -77.0364, name: "Zero Trust Network Security", monto: 8500000, city: "Washington, DC", agencia: "Pentagon", fecha: "2024-06-15", type: 'Services', days_left: 12, tags: "Full Open" },
  { id: "NASA-IT-10", niche: 'IT_CYBER', lat: 30.2672, lon: -97.7431, name: "Mars Data Center Support", monto: 3200000, city: "Austin, TX", agencia: "NASA", fecha: "2024-07-01", type: 'Services', days_left: 20, tags: "Small Business" },
  { id: "VA-2024-001", niche: 'MEDICAL', lat: 39.2904, lon: -76.6122, name: "Robotic Prosthetics Supply", monto: 1200000, city: "Baltimore, MD", agencia: "Veterans Affairs", fecha: "2024-05-20", type: 'Supplies', days_left: 8, tags: "SDVOSB" },
  { id: "HHS-MED-44", niche: 'MEDICAL', lat: 34.0522, lon: -118.2437, name: "X-Ray Equipment Maintenance", monto: 450000, city: "Los Angeles, CA", agencia: "Health & Human Services", fecha: "2024-05-25", type: 'Services', days_left: 15, tags: "WOSB" },
  { id: "DEF-2024-05", niche: 'DEFENSE', lat: 36.8508, lon: -76.2859, name: "Naval Base Logistics Support", monto: 15000000, city: "Norfolk, VA", agencia: "Department of Defense", fecha: "2024-08-10", type: 'Services', days_left: 30, tags: "Full Open" },
  { id: "CON-2024-12", niche: 'CONSTRUCTION', lat: 40.7128, lon: -74.0060, name: "Federal Building Renovation", monto: 5000000, city: "New York, NY", agencia: "GSA", fecha: "2024-09-05", type: 'Services', days_left: 45, tags: "Small Business" },
  { id: "DLA-2024-M1", niche: "IT_CYBER", name: "50 Rugged Laptops for Navy", monto: 45000, type: "Supplies", days_left: 5, tags: "Small Business" },
  { id: "VA-MED-99", niche: "MEDICAL", name: "Surgical Kit Resupply - Florida", monto: 12000, type: "Supplies", days_left: 3, tags: "SDVOSB" },
  { id: "ARMY-IT-44", niche: "IT_CYBER", name: "Cybersecurity Audit - Small Office", monto: 85000, type: "Services", days_left: 10, tags: "SDVOSB" },
  { id: "USDA-CONS-10", niche: "CONSTRUCTION", name: "Roof Repair - Federal Building", monto: 195000, type: "Services", days_left: 15, tags: "Small Business" },
  { id: "DHS-IT-22", niche: "IT_CYBER", name: "Cloud Storage Subscription", monto: 240000, type: "Services", days_left: 2, tags: "WOSB" },
  { id: "REAL-IT-101", niche: "IT_CYBER", name: "Software Support for Army", monto: 150000, type: "Services", days_left: 8, agencia: "US Army", tags: "Small Business" },
  { id: "REAL-MED-202", niche: "MEDICAL", name: "Wheelchair Supply - VA Hospital", monto: 45000, type: "Supplies", days_left: 4, agencia: "Veterans Affairs", tags: "SDVOSB" },
  { id: "DLA-SUP-45", niche: "MEDICAL", name: "1000 First Aid Kits", monto: 25000, type: "Supplies", days_left: 6, agencia: "DLA", tags: "SDVOSB" },
  { id: "GSA-IT-22", niche: "IT_CYBER", name: "Network Cabling - Office", monto: 15000, type: "Services", days_left: 12, agencia: "GSA", tags: "Small Business" },
  { id: "VA-MED-12", niche: "MEDICAL", name: "Patient Monitors", monto: 185000, type: "Supplies", days_left: 10, agencia: "Veterans Affairs", tags: "WOSB" }
];
