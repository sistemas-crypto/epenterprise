export type UserRole = 'admin_hr' | 'team_lead' | 'employee';

export type Currency = 'COP' | 'USD' | 'CLP' | 'MXN';

export type EmployeeStatus = 'Activo' | 'Vacaciones' | 'Licencia' | 'Inactivo';

export type ContractType = 'Término Indefinido' | 'Término Fijo' | 'Obra o Labor' | 'Prestación de Servicios' | 'Aprendizaje';

export interface Employee {
  id: string;
  code: string; // e.g. "EMP-0142"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: 'CC' | 'CE' | 'Pasaporte' | 'RUT';
  documentNumber: string;
  avatar: string;
  jobTitle: string;
  department: string;
  managerId?: string;
  managerName?: string;
  hireDate: string; // YYYY-MM-DD
  birthDate: string; // YYYY-MM-DD
  status: EmployeeStatus;
  contractType: ContractType;
  baseSalary: number;
  bankName: string;
  accountNumber: string;
  healthProvider: string; // EPS
  pensionProvider: string; // AFP
  arlProvider: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vacationDaysAvailable: number;
  vacationDaysTaken: number;
}

export type TimeOffType = 
  | 'Vacaciones Legales' 
  | 'Permiso Remunerado' 
  | 'Permiso No Remunerado' 
  | 'Incapacidad Médica' 
  | 'Licencia de Maternidad/Paternidad' 
  | 'Calamidad Doméstica' 
  | 'Día de la Familia';

export type TimeOffStatus = 'Pendiente' | 'Aprobado' | 'Rechazado';

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeDepartment: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: TimeOffStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:mm
  clockOut?: string; // HH:mm
  lunchStart?: string;
  lunchEnd?: string;
  totalHoursWorked: number;
  status: 'Puntual' | 'Retraso' | 'Incompleto' | 'En turno';
  location: string;
}

export interface PayslipItem {
  code: string;
  concept: string;
  type: 'earning' | 'deduction';
  amount: number;
  percentage?: number;
}

export interface Payslip {
  id: string;
  periodId: string;
  employeeId: string;
  employeeName: string;
  employeeDocument: string;
  jobTitle: string;
  department: string;
  hireDate: string;
  baseSalary: number;
  daysWorked: number;
  earnings: PayslipItem[];
  deductions: PayslipItem[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'Borrador' | 'Calculado' | 'Pagado';
  paymentDate: string;
}

export interface PayrollPeriod {
  id: string;
  name: string; // e.g. "Septiembre 2026 - Mensual"
  type: 'Quincenal' | 'Mensual';
  startDate: string;
  endDate: string;
  status: 'Abierta' | 'En Revisión' | 'Cerrada y Pagada';
  totalCost: number;
  employeeCount: number;
}

export type CandidateStage = 'Postulado' | 'En Revisión' | 'Entrevista' | 'Oferta' | 'Contratado' | 'Descartado';

export interface Candidate {
  id: string;
  jobOpeningId: string;
  name: string;
  email: string;
  phone: string;
  experienceYears: number;
  currentSalaryExpectation: number;
  stage: CandidateStage;
  rating: number; // 1-5
  notes: string;
  appliedDate: string;
  cvUrl?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Tiempo Completo' | 'Híbrido' | 'Remoto';
  vacancies: number;
  salaryRange: string;
  status: 'Abierta' | 'Pausada' | 'Cerrada';
  createdAt: string;
  requirements: string[];
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  category: 'Objetivo de Negocio' | 'Desarrollo Individual' | 'Proyecto Clave';
  targetDate: string;
  progress: number; // 0 - 100
  weight: number; // percentage
  status: 'En Progreso' | 'Cumplido' | 'En Riesgo';
}

export interface Recognition {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  fromEmployeeAvatar: string;
  toEmployeeId: string;
  toEmployeeName: string;
  toEmployeeAvatar: string;
  badge: 'Innovación' | 'Trabajo en Equipo' | 'Liderazgo' | 'Pasión por la Calidad' | 'Servicio Excepcional';
  message: string;
  date: string;
  likesCount: number;
}

export interface CompanyAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'Institucional' | 'Beneficios' | 'Eventos' | 'Seguridad y Salud';
  date: string;
  pinned: boolean;
  commentsCount: number;
}

// ==========================================
// MÓDULO CONTABLE: CORRERÍAS, VIÁTICOS & SIIGO NUBE
// ==========================================

export type CorreriaStatus =
  | 'Borrador'
  | 'Enviado a Dirección'
  | 'Autorizado por Dirección'
  | 'Anticipo Desembolsado'
  | 'En Ejecución'
  | 'Legalización Radicada'
  | 'Legalizado por Contabilidad'
  | 'Contabilizado en Siigo Nube'
  | 'Rechazado';

export type ExpenseConcept =
  | 'Transporte Aéreo / Terrestre'
  | 'Alojamiento / Hotel'
  | 'Alimentación'
  | 'Movilidad Local / Taxis'
  | 'Peajes y Combustible'
  | 'Muestras Médicas y Representación'
  | 'Imprevistos y Logística';

export type ExpenseDocumentType =
  | 'Factura Electrónica'
  | 'Talonario Físico'
  | 'Recibo Menor / Planilla';

export interface ExpenseReceipt {
  id: string;
  concept: ExpenseConcept;
  documentType?: ExpenseDocumentType;
  providerName: string;
  providerNit: string;
  invoiceNumber: string;
  date: string;
  amountSubtotal: number;
  amountTax: number;
  amountTotal: number;
  paymentMethod: 'Efectivo Anticipo' | 'Tarjeta Corporativa' | 'Recursos Propios Asesor';
  receiptAttachmentName?: string;
  pucAccount: string; // e.g. "515505 - Alojamiento"
  status: 'Válido DIAN' | 'En Revisión' | 'Objetado';
  requiresDocumentoSoporte?: boolean;
  documentoSoporteNumber?: string;
  documentoSoporteStatus?: 'Pendiente DS' | 'DS Generado' | 'No Aplica';
  notes?: string;
}

export interface CorreriaPlanner {
  id: string;
  code: string; // e.g. "CORR-2026-001"
  adviserId: string;
  adviserName: string;
  adviserEmail: string;
  adviserPhone: string;
  projectName: string; // e.g. "Línea Hospitalaria Santanderes & Norte"
  targetCities: string[];
  startDate: string;
  endDate: string;
  totalDays: number;
  objectives: string;
  clientsToVisit: string[];
  
  // Presupuesto Proyectado (Planeador)
  projectedTransport: number;
  projectedLodging: number;
  projectedFood: number;
  projectedLocalMobility: number;
  projectedContingency: number;
  totalAdvanceRequested: number;
  totalAdvanceApproved: number;
  advanceDisbursementDate?: string;
  advanceDisbursementRef?: string;
  advanceBankName?: string;

  // Estado y Workflow Dirección
  status: CorreriaStatus;
  directorNotes?: string;
  authorizedBy?: string;
  authorizedAt?: string;

  // Legalización de Gastos & Egresos
  expenses: ExpenseReceipt[];
  totalExpensesLegalized: number;
  balanceDue: number; // approvedAdvance - totalExpensesLegalized. If > 0: Asesor reintegra; if < 0: Empresa reembolsa
  legalizationSubmittedDate?: string;
  accountingApprovedBy?: string;
  accountingApprovalDate?: string;
  accountingNotes?: string;

  // Integración Siigo Nube API
  siigoVoucherNumber?: string; // e.g. "CE-2026-00412"
  siigoSyncStatus: 'No Sincronizado' | 'Pendiente' | 'Sincronizado Exitoso' | 'Error API';
  siigoSyncDate?: string;
  siigoCostCenter: string; // e.g. "CC-02 Ventas & Mercadeo Farma"
  siigoPayloadLog?: string;
}

export interface SiigoConfig {
  apiEndpoint: string;
  partnerId: string;
  userEmail: string;
  apiKey: string;
  isConnected: boolean;
  costCenter: string;
  lastSyncTimestamp?: string;
}

export interface UserPermissions {
  canApproveCorrerias: boolean;       // Autorizar planeadores y anticipos de correría (Dirección Proyecto)
  canDisburseAdvances: boolean;       // Registrar desembolsos de anticipos (Tesorería / Contabilidad)
  canLegalizeExpenses: boolean;       // Radicar facturas y egresos contables (Asesores comerciales)
  canApproveLegalizations: boolean;   // Aprobar liquidación final de gastos contables
  canSyncSiigoNube: boolean;          // Emitir comprobantes y sincronizar con Siigo Nube API
  canManagePayroll: boolean;          // Calcular nómina, ver salarios y pagar
  canManageEmployees: boolean;        // Crear y editar trabajadores, contratos y fichas
  canManageTimeOff: boolean;          // Aprobar vacaciones, licencias e incapacidades
  canManageAdminUsers: boolean;       // Administrar usuarios del sistema, roles y criterios
}

export interface AppAccountUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  roleName: string;
  department: string;
  status: 'Activo' | 'Suspendido' | 'Inactivo';
  linkedEmployeeId?: string; // Ficha de trabajador asociada
  avatar?: string;
  temporaryPassword?: string;
  twoFactorEnabled: boolean;
  maxAdvanceLimit?: number; // Criterio: Límite de viáticos
  permissions: UserPermissions;
  createdAt: string;
  lastLogin?: string;
}

export interface SecurityPolicyCriteria {
  requireTwoFactorForHighAdvances: boolean;
  highAdvanceThreshold: number; // e.g. 3000000 COP
  maxDailyExpenseLodging: number; // e.g. 250000 COP
  maxDailyExpenseFood: number;    // e.g. 120000 COP
  allowSelfApproval: boolean;
  autoSyncSiigoOnApproval: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  category: 'Seguridad' | 'Usuarios' | 'Contabilidad' | 'Nómina' | 'Personal';
}

// ==================== ISO 9001:2015 QUALITY MANAGEMENT ====================
export type QualityDocumentType =
  | 'Procedimiento POE'
  | 'Política / Manual'
  | 'Ficha de Caracterización'
  | 'Formato / Plantilla'
  | 'Evidencia / Registro';

export interface QualityDocument {
  id: string;
  code: string; // e.g. "POE-CAL-004"
  title: string;
  process: string;
  documentType?: QualityDocumentType;
  version: number;
  status: 'Vigente' | 'En Revisión' | 'Obsoleto';
  effectiveDate: string;
  approvedBy: string;
  isoClause: string; // e.g. "7.5 Información Documentada"
  fileAttachment?: string;
  fileSize?: string;
}

export interface QualityRisk {
  id: string;
  code: string; // e.g. "RSK-001"
  process: string;
  description: string;
  riskType: 'Riesgo Operativo' | 'Riesgo Regulatorio' | 'Riesgo de Calidad' | 'Oportunidad de Mejora';
  probability: number; // 1-5
  impact: number;      // 1-5
  riskScore: number;   // probability * impact
  level: 'Bajo' | 'Medio' | 'Alto' | 'Extremo';
  treatmentPlan: string;
  responsible: string;
  status: 'Controlado' | 'En Mitigación' | 'En Seguimiento';
}

export interface CAPARecord {
  id: string;
  code: string; // e.g. "NC-2026-003"
  title: string;
  source: 'Auditoría Interna' | 'Reclamo de Cliente / Farmacia' | 'Desviación en Proceso' | 'Inspección de Calidad';
  process: string;
  dateReported: string;
  findingDescription: string;
  rootCauseAnalysis: string; // Método de los 5 Porqués
  correctiveActionPlan: string;
  responsible: string;
  deadline: string;
  status: 'Abierta' | 'En Análisis Causa Raíz' | 'Plan en Ejecución' | 'Cerrada con Eficacia Verificada';
  effectivenessVerified: boolean;
  evidenceAttachmentName?: string;
  evidenceType?: 'Informe Técnico' | 'Fotografía' | 'Certificado Calibración' | 'Acta de Reunión' | 'Otro';
}

export interface InternalAudit {
  id: string;
  code: string; // e.g. "AUD-2026-01"
  title: string;
  scope: string;
  date: string;
  leadAuditor: string;
  processesAudited: string[];
  findings: {
    conformities: number;
    minorNC: number;
    majorNC: number;
    opportunities: number;
  };
  status: 'Programada' | 'En Ejecución' | 'Informe Emitido' | 'Cerrada';
  auditReportAttachmentName?: string;
}

// ==================== SST (SEGURIDAD Y SALUD EN EL TRABAJO - CICLO PHVA) ====================
export type PHVAPhase = 'Planear' | 'Hacer' | 'Verificar' | 'Actuar';

export type SSTDocumentType =
  | 'Política / Manual SG-SST'
  | 'Matriz de Peligros / Legal'
  | 'Plan Anual de Trabajo'
  | 'Procedimiento de Trabajo Seguro'
  | 'Registro de Inducción / Capacitación'
  | 'Entrega de EPP / Dotación'
  | 'Certificado Médico Ocupacional'
  | 'Acta COPASST / CCL'
  | 'Investigación FURAT / ARL'
  | 'Evidencia / Plan de Emergencia';

export interface SSTDocument {
  id: string;
  code: string;
  title: string;
  phase: PHVAPhase;
  documentType: SSTDocumentType;
  version: number;
  status: 'Vigente' | 'En Revisión' | 'Obsoleto';
  effectiveDate: string;
  responsible: string;
  fileAttachment?: string;
  fileSize?: string;
  notes?: string;
}

export interface HazardRiskGTC45 {
  id: string;
  code: string; // e.g. "PEL-001"
  process: string;
  activity: string;
  dangerClassification: 'Biomecánico / Ergonómico' | 'Físico' | 'Químico' | 'Psicosocial' | 'Biológico' | 'Locativo / Mecánico';
  description: string;
  possibleEffects: string;
  exposedCount: number;
  riskEvaluation: 'Aceptable' | 'Aceptable con Control Específico' | 'No Aceptable';
  controlsInPlace: string;
  interventionPlan: string;
  responsible: string;
}

export interface AnnualWorkPlanItem {
  id: string;
  activity: string;
  phase: PHVAPhase;
  responsible: string;
  targetMonth: string;
  budgetAllocated: number;
  completed: boolean;
  status: 'Programada' | 'En Proceso' | 'Completada' | 'Reprogramada';
}

export interface AccidentReport {
  id: string;
  code: string; // e.g. "AT-2026-002"
  reportType: 'Accidente de Trabajo' | 'Incidente' | 'Enfermedad Laboral';
  employeeName: string;
  employeeDepartment: string;
  date: string;
  location: string;
  description: string;
  severity: 'Sin Incapacidad' | 'Leve' | 'Grave' | 'Mortal';
  daysLost: number;
  furatSubmitted: boolean;
  furatNumber?: string;
  furatAttachmentName?: string;
  photoEvidenceName?: string;
  rootCause: string;
  correctiveAction: string;
  status: 'Reportado' | 'Investigación en Curso' | 'Medidas Implementadas' | 'Cerrado ARL';
}

export interface CopasstRecord {
  id: string;
  sessionType: 'Reunión Ordinaria Mensual' | 'Extraordinaria por Accidente' | 'Inspección de Puestos';
  date: string;
  attendeesCount: number;
  mainTopics: string[];
  commitments: string[];
  status: 'Acta Firmada' | 'Pendiente Firmas';
  signedActAttachmentName?: string;
}

export interface SSTIndicator {
  id: string;
  name: string; // e.g. "Índice de Frecuencia de Accidentes (IFA)"
  category: 'Estructura' | 'Proceso' | 'Resultado';
  formula: string;
  target: string;
  current: string;
  status: 'Cumplido' | 'En Seguimiento' | 'Alerta Crítica';
  periodicity: string;
}


