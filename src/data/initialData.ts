import { 
  Employee, 
  PayrollPeriod, 
  Payslip, 
  PayslipItem,
  TimeOffRequest, 
  AttendanceRecord, 
  JobOpening, 
  Candidate, 
  PerformanceGoal, 
  Recognition, 
  CompanyAnnouncement,
  AppAccountUser,
  SecurityPolicyCriteria,
  AuditLogEntry
} from '../types/hr';

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_PAYROLL_PERIOD: PayrollPeriod = {
  id: 'period-2026-09',
  name: 'Septiembre 2026 - Mensual Completo',
  type: 'Mensual',
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  status: 'Abierta',
  totalCost: 0,
  employeeCount: 0,
};

export function generatePayslipForEmployee(emp: Employee, periodId: string): Payslip {
  const baseSalary = emp.baseSalary;
  const daysWorked = 30;
  
  // Devengos
  const earnings: PayslipItem[] = [
    {
      code: 'DEV-001',
      concept: 'Sueldo Básico Mensual',
      type: 'earning' as const,
      amount: baseSalary,
    },
  ];

  // Auxilio legal de transporte si salario <= 2 SMMLV (aprox 3.200.000 COP)
  if (baseSalary > 0 && baseSalary <= 3200000) {
    earnings.push({
      code: 'DEV-002',
      concept: 'Auxilio Legal de Transporte',
      type: 'earning' as const,
      amount: 162000,
    });
  }

  // Bonificación por desempeño si aplica
  const bonusAmount = Math.round(baseSalary * 0.05);
  if (bonusAmount > 0) {
    earnings.push({
      code: 'DEV-003',
      concept: 'Bonificación No Salarial por Logro',
      type: 'earning' as const,
      amount: bonusAmount,
    });
  }

  const totalEarnings = earnings.reduce((acc, item) => acc + item.amount, 0);

  // Deducciones legales
  const healthDeduction = Math.round(baseSalary * 0.04);
  const pensionDeduction = Math.round(baseSalary * 0.04);

  const deductions: PayslipItem[] = [
    {
      code: 'DED-001',
      concept: 'Aporte a Salud EPS (4%)',
      type: 'deduction' as const,
      amount: healthDeduction,
      percentage: 4,
    },
    {
      code: 'DED-002',
      concept: 'Aporte a Pensión AFP (4%)',
      type: 'deduction' as const,
      amount: pensionDeduction,
      percentage: 4,
    },
  ];

  // Fondo solidaridad pensional si > 4 SMMLV
  if (baseSalary >= 6400000) {
    const solidarity = Math.round(baseSalary * 0.01);
    deductions.push({
      code: 'DED-003',
      concept: 'Fondo de Solidaridad Pensional (1%)',
      type: 'deduction' as const,
      amount: solidarity,
      percentage: 1,
    });
  }

  // Retención en la fuente estimada para salarios altos
  if (baseSalary >= 9000000) {
    const withholding = Math.round((baseSalary - 7000000) * 0.19);
    deductions.push({
      code: 'DED-004',
      concept: 'Retención en la Fuente laboral',
      type: 'deduction' as const,
      amount: withholding,
    });
  }

  const totalDeductions = deductions.reduce((acc, item) => acc + item.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  return {
    id: `pay-${periodId}-${emp.id}`,
    periodId,
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    employeeDocument: `${emp.documentType} ${emp.documentNumber}`,
    jobTitle: emp.jobTitle,
    department: emp.department,
    hireDate: emp.hireDate,
    baseSalary: emp.baseSalary,
    daysWorked,
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    netPay,
    status: 'Calculado',
    paymentDate: '2026-09-30',
  };
}

export const INITIAL_TIME_OFF_REQUESTS: TimeOffRequest[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_JOB_OPENINGS: JobOpening[] = [];

export const INITIAL_CANDIDATES: Candidate[] = [];

export const INITIAL_GOALS: PerformanceGoal[] = [];

export const INITIAL_RECOGNITIONS: Recognition[] = [];

export const INITIAL_ANNOUNCEMENTS: CompanyAnnouncement[] = [];

export const INITIAL_SECURITY_CRITERIA: SecurityPolicyCriteria = {
  requireTwoFactorForHighAdvances: true,
  highAdvanceThreshold: 3000000,
  maxDailyExpenseLodging: 250000,
  maxDailyExpenseFood: 120000,
  allowSelfApproval: false,
  autoSyncSiigoOnApproval: true,
};

export const INITIAL_APP_USERS: AppAccountUser[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];
