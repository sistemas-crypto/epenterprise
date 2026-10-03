import { CorreriaPlanner, SiigoConfig } from '../types/hr';

export const INITIAL_SIIGO_CONFIG: SiigoConfig = {
  apiEndpoint: 'https://api.siigo.com/v1',
  partnerId: 'ESSENTIAL-PHARMA-COL-892',
  userEmail: 'sistemas@essentialpharma.com.co',
  apiKey: 'siigo_prod_sec_99382173491bc820f18a',
  isConnected: true,
  costCenter: 'CC-02 Ventas & Mercadeo Farma',
  lastSyncTimestamp: '2026-09-30 11:45 AM',
};

export const PUC_ACCOUNTS = [
  { code: '515505', name: 'Alojamiento y Hoteles', category: 'Débito' },
  { code: '515510', name: 'Alimentación y Viáticos', category: 'Débito' },
  { code: '515515', name: 'Pasajes Aéreos y Taxis', category: 'Débito' },
  { code: '515595', name: 'Peajes, Combustible y Parqueaderos', category: 'Débito' },
  { code: '515525', name: 'Gastos de Representación y Muestras', category: 'Débito' },
  { code: '133005', name: 'Anticipos a Trabajadores', category: 'Crédito' },
  { code: '111005', name: 'Bancos Nacionales (Dispersión)', category: 'Crédito' },
];

export const INITIAL_CORRERIAS: CorreriaPlanner[] = [];
