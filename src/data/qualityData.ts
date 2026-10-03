import { QualityDocument, QualityRisk, CAPARecord, InternalAudit } from '../types/hr';

export interface ProcessMetadata {
  id: string;
  code: string;
  name: string;
  category: 'Estratégico' | 'Misional' | 'Apoyo' | 'Control';
  leader: string;
  isoClauses: string;
  objective: string;
}

export const ESSENTIAL_PHARMA_PROCESSES: ProcessMetadata[] = [
  {
    id: 'proc-dir',
    code: 'DE',
    name: 'Dirección Estratégica & Calidad',
    category: 'Estratégico',
    leader: 'Dra. Mariana Morales Silva',
    isoClauses: '4, 5, 6, 9.3',
    objective: 'Definir el rumbo estratégico, políticas corporativas y asegurar la eficacia global del SGC.',
  },
  {
    id: 'proc-cal',
    code: 'AC',
    name: 'Aseguramiento de Calidad & Asuntos Regulatorios',
    category: 'Misional',
    leader: 'Directora Técnica Farmacéutica',
    isoClauses: '8.5, 8.7, 10',
    objective: 'Garantizar el cumplimiento de normativas Invima, liberación de lotes, control de cambios y CAPAs.',
  },
  {
    id: 'proc-log',
    code: 'CS',
    name: 'Cadena de Suministro, Almacén & Cadena de Frío',
    category: 'Misional',
    leader: 'Dr. Carlos Eduardo Restrepo',
    isoClauses: '8.5.4, 8.5.2',
    objective: 'Preservar la calidad e integridad térmica de los productos desde la recepción hasta la entrega clínica.',
  },
  {
    id: 'proc-com',
    code: 'CV',
    name: 'Gestión Comercial, Ventas & Correrías',
    category: 'Misional',
    leader: 'Andrés Felipe Gómez',
    isoClauses: '8.2, 9.1.2',
    objective: 'Atender a comités de farmacia de clínicas y hospitales, garantizando asesoría científica de antibióticos.',
  },
  {
    id: 'proc-tal',
    code: 'TH',
    name: 'Gestión del Talento Humano',
    category: 'Apoyo',
    leader: 'Dra. Mariana Morales / Equipo HR',
    isoClauses: '7.1.2, 7.2, 7.3',
    objective: 'Asegurar la selección, inducción, competencia técnica y bienestar del personal de la organización.',
  },
  {
    id: 'proc-compr',
    code: 'CP',
    name: 'Compras & Calificación de Proveedores',
    category: 'Apoyo',
    leader: 'Laura Camila Benítez',
    isoClauses: '8.4',
    objective: 'Adquirir insumos conformes y evaluar periódicamente a fabricantes farmacéuticos y transportadoras.',
  },
  {
    id: 'proc-sst',
    code: 'SST',
    name: 'Seguridad y Salud en el Trabajo (SG-SST)',
    category: 'Apoyo',
    leader: 'Coordinador SST & COPASST',
    isoClauses: 'Dec. 1072 / Res. 0312',
    objective: 'Prevenir accidentes de trabajo, enfermedades laborales y promover hábitos de trabajo saludables.',
  },
  {
    id: 'proc-ti',
    code: 'TI',
    name: 'Tecnología, Sistemas & ERP Siigo',
    category: 'Apoyo',
    leader: 'Ing. David Felipe Vargas',
    isoClauses: '7.1.3, 7.5',
    objective: 'Mantener la infraestructura tecnológica, disponibilidad de datos y conectividad segura de la nube.',
  },
];

export const INITIAL_QUALITY_DOCUMENTS: QualityDocument[] = [];

export const INITIAL_QUALITY_RISKS: QualityRisk[] = [];

export const INITIAL_CAPAS: CAPARecord[] = [];

export const INITIAL_INTERNAL_AUDITS: InternalAudit[] = [];

