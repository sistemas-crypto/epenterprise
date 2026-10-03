import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  PayrollPeriod,
  Payslip,
  TimeOffRequest,
  AttendanceRecord,
  JobOpening,
  Candidate,
  PerformanceGoal,
  Recognition,
  CompanyAnnouncement,
  UserRole,
  Currency,
  CandidateStage,
  CorreriaPlanner,
  ExpenseReceipt,
  SiigoConfig,
  AppAccountUser,
  SecurityPolicyCriteria,
  AuditLogEntry,
  UserPermissions,
} from '../types/hr';
import {
  INITIAL_EMPLOYEES,
  INITIAL_PAYROLL_PERIOD,
  INITIAL_TIME_OFF_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_JOB_OPENINGS,
  INITIAL_CANDIDATES,
  INITIAL_GOALS,
  INITIAL_RECOGNITIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_APP_USERS,
  INITIAL_SECURITY_CRITERIA,
  INITIAL_AUDIT_LOGS,
  generatePayslipForEmployee,
} from '../data/initialData';
import { INITIAL_CORRERIAS, INITIAL_SIIGO_CONFIG } from '../data/accountingData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface HRContextType {
  // Roles & View
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Employee;
  setCurrentUser: (emp: Employee) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Company Settings
  companyName: string;
  setCompanyName: (name: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amount: number) => string;

  // Employees (Trabajadores)
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id' | 'code' | 'vacationDaysAvailable' | 'vacationDaysTaken'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  updateCurrentUserAvatar: (newAvatarUrl: string) => void;
  clearAllMockEmployees: () => void;
  clearAllMockAccounting: () => void;

  // Payroll
  currentPeriod: PayrollPeriod;
  payslips: Payslip[];
  calculatePayroll: () => void;
  closePayroll: () => void;
  selectedPayslip: Payslip | null;
  setSelectedPayslip: (slip: Payslip | null) => void;

  // Time off & Attendance
  timeOffRequests: TimeOffRequest[];
  requestTimeOff: (req: Omit<TimeOffRequest, 'id' | 'status' | 'requestedAt'>) => void;
  approveTimeOff: (id: string, reviewerNotes?: string) => void;
  rejectTimeOff: (id: string, reviewerNotes?: string) => void;
  attendanceRecords: AttendanceRecord[];
  isClockedIn: boolean;
  activeAttendance: AttendanceRecord | null;
  clockIn: (location?: string) => void;
  clockOut: () => void;

  // Recruitment / ATS
  jobOpenings: JobOpening[];
  candidates: Candidate[];
  addJobOpening: (job: Omit<JobOpening, 'id' | 'createdAt'>) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  moveCandidateStage: (candidateId: string, stage: CandidateStage) => void;
  hireCandidate: (candidateId: string) => void;

  // Performance & Goals
  goals: PerformanceGoal[];
  addGoal: (goal: Omit<PerformanceGoal, 'id'>) => void;
  updateGoalProgress: (id: string, progress: number) => void;

  // Community & Recognitions
  recognitions: Recognition[];
  addRecognition: (rec: Omit<Recognition, 'id' | 'date' | 'likesCount'>) => void;
  likeRecognition: (id: string) => void;
  announcements: CompanyAnnouncement[];
  addAnnouncement: (ann: Omit<CompanyAnnouncement, 'id' | 'date' | 'commentsCount'>) => void;

  // MÓDULO CONTABLE: CORRERÍAS, VIÁTICOS & SIIGO NUBE
  correrias: CorreriaPlanner[];
  selectedCorreria: CorreriaPlanner | null;
  setSelectedCorreria: (c: CorreriaPlanner | null) => void;
  createCorreria: (c: Omit<CorreriaPlanner, 'id' | 'code' | 'status' | 'expenses' | 'totalExpensesLegalized' | 'balanceDue' | 'siigoSyncStatus'>) => void;
  authorizeCorreriaAdvance: (id: string, approvedAmount: number, notes?: string) => void;
  disburseAdvance: (id: string, refNumber: string, bank: string) => void;
  addExpenseToCorreria: (correriaId: string, expense: Omit<ExpenseReceipt, 'id'>) => void;
  removeExpenseFromCorreria: (correriaId: string, expenseId: string) => void;
  submitLegalization: (correriaId: string) => void;
  approveLegalization: (correriaId: string, notes?: string) => void;
  sendLegalizationReminders: () => void;
  syncWithSiigoNube: (correriaId: string) => Promise<{ success: boolean; voucherNumber: string }>;
  siigoConfig: SiigoConfig;
  updateSiigoConfig: (cfg: Partial<SiigoConfig>) => void;

  // Notifications
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;

  // PANEL DE ADMINISTRACIÓN & USUARIOS
  appUsers: AppAccountUser[];
  addAppUser: (user: Omit<AppAccountUser, 'id' | 'createdAt'>) => void;
  updateAppUser: (id: string, updates: Partial<AppAccountUser>) => void;
  deleteAppUser: (id: string) => void;
  securityCriteria: SecurityPolicyCriteria;
  updateSecurityCriteria: (updates: Partial<SecurityPolicyCriteria>) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Reset
  resetAllData: () => void;
  logout: () => void;
}

export const DEFAULT_CURRENT_USER: Employee = {
  id: 'usr-admin',
  code: 'DIR-001',
  firstName: 'Administrador',
  lastName: 'General',
  email: 'sistemas@essentialpharma.com.co',
  phone: '+57 300 000 0000',
  documentType: 'CC',
  documentNumber: '1.000.000.000',
  avatar: '',
  jobTitle: 'Dirección General / Administración',
  department: 'Dirección General',
  hireDate: '2026-01-01',
  birthDate: '1990-01-01',
  status: 'Activo',
  contractType: 'Término Indefinido',
  baseSalary: 0,
  bankName: 'Bancolombia',
  accountNumber: '',
  healthProvider: 'Sura EPS',
  pensionProvider: 'Protección AFP',
  arlProvider: 'Seguros Bolívar',
  emergencyContact: {
    name: 'Contacto Corporativo',
    relationship: 'Oficina Central',
    phone: '+57 300 000 0000',
  },
  vacationDaysAvailable: 0,
  vacationDaysTaken: 0,
};

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state keys - purge legacy mock employees if present
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_employees');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (e: any) =>
              ['emp-1', 'emp-2', 'emp-3', 'emp-4', 'emp-5', 'emp-6', 'emp-7'].includes(e.id) ||
              e.firstName === 'Mariana' ||
              e.firstName === 'Carlos Eduardo' ||
              e.firstName === 'Laura Camila' ||
              e.firstName === 'Andrés Felipe' ||
              e.firstName === 'Valentina' ||
              e.firstName === 'David Felipe' ||
              e.code === 'DIR-001' ||
              e.code === 'DIR-002'
          )
        ) {
          localStorage.removeItem('ep_enterprise_employees');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('admin_hr');
  const [currentUser, setCurrentUser] = useState<Employee>(() => {
    const savedAvatar = localStorage.getItem('ep_enterprise_user_avatar');
    const base = employees[0] || DEFAULT_CURRENT_USER;
    return savedAvatar ? { ...base, avatar: savedAvatar } : base;
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [companyName, setCompanyName] = useState<string>('Essential Pharma S.A.S.');
  const [currency, setCurrency] = useState<Currency>('COP');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Payroll
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriod>(() => {
    const saved = localStorage.getItem('ep_enterprise_period');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL_PERIOD;
  });

  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_payslips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((p: any) => p.employeeId?.startsWith('emp-'))) {
          localStorage.removeItem('ep_enterprise_payslips');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Time off - purge legacy mock requests
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_timeoff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((r: any) => ['req-01', 'req-02', 'req-03', 'req-04'].includes(r.id) || r.employeeId?.startsWith('emp-'))) {
          localStorage.removeItem('ep_enterprise_timeoff');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_TIME_OFF_REQUESTS;
  });

  // Attendance - purge legacy mock records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_attendance');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a: any) => ['att-1', 'att-2', 'att-3', 'att-4', 'att-5'].includes(a.id) || a.employeeId?.startsWith('emp-'))) {
          localStorage.removeItem('ep_enterprise_attendance');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [activeAttendance, setActiveAttendance] = useState<AttendanceRecord | null>(null);

  // ATS - purge legacy mock vacancies & candidates
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((j: any) => ['job-01', 'job-02', 'job-03'].includes(j.id))) {
          localStorage.removeItem('ep_enterprise_jobs');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_JOB_OPENINGS;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_candidates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((c: any) => ['cand-01', 'cand-02', 'cand-03', 'cand-04'].includes(c.id))) {
          localStorage.removeItem('ep_enterprise_candidates');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_CANDIDATES;
  });

  // Performance - purge mock goals
  const [goals, setGoals] = useState<PerformanceGoal[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_goals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((g: any) => ['goal-1', 'goal-2', 'goal-3', 'goal-4'].includes(g.id))) {
          localStorage.removeItem('ep_enterprise_goals');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_GOALS;
  });

  // Panel de Administración & Criterios - purge mock users and logs
  const [appUsers, setAppUsers] = useState<AppAccountUser[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_app_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((u: any) => ['user-001', 'user-002', 'user-003', 'user-004', 'user-005', 'user-006'].includes(u.id))) {
          localStorage.removeItem('ep_enterprise_app_users');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_APP_USERS;
  });

  const [securityCriteria, setSecurityCriteria] = useState<SecurityPolicyCriteria>(() => {
    const saved = localStorage.getItem('ep_enterprise_security_criteria');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_CRITERIA;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_audit_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a: any) => ['aud-001', 'aud-002', 'aud-003', 'aud-004', 'aud-005'].includes(a.id))) {
          localStorage.removeItem('ep_enterprise_audit_logs');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('ep_enterprise_app_users', JSON.stringify(appUsers));
  }, [appUsers]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_security_criteria', JSON.stringify(securityCriteria));
  }, [securityCriteria]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Recognitions & Announcements - purge mock community posts
  const [recognitions, setRecognitions] = useState<Recognition[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_recognitions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((r: any) => ['rec-1', 'rec-2'].includes(r.id))) {
          localStorage.removeItem('ep_enterprise_recognitions');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_RECOGNITIONS;
  });

  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a: any) => ['ann-1', 'ann-2', 'ann-3'].includes(a.id))) {
          localStorage.removeItem('ep_enterprise_announcements');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // ==========================================
  // CONTABILIDAD: CORRERÍAS & SIIGO NUBE STATE
  // ==========================================
  const [correrias, setCorrerias] = useState<CorreriaPlanner[]>(() => {
    const saved = localStorage.getItem('ep_enterprise_correrias');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (c: any) =>
              ['corr-084', 'corr-085', 'corr-086', 'corr-001'].includes(c.id) ||
              c.code?.includes('2026-084') ||
              c.code?.includes('2026-085') ||
              c.code?.includes('2026-086') ||
              c.adviserName?.includes('David Felipe') ||
              c.adviserName?.includes('Andrés Gómez') ||
              c.adviserName?.includes('Laura Camila') ||
              c.projectName?.includes('Santanderes')
          )
        ) {
          localStorage.removeItem('ep_enterprise_correrias');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_CORRERIAS;
  });

  const [selectedCorreria, setSelectedCorreria] = useState<CorreriaPlanner | null>(null);

  const [siigoConfig, setSiigoConfig] = useState<SiigoConfig>(() => {
    const saved = localStorage.getItem('ep_enterprise_siigo');
    return saved ? JSON.parse(saved) : INITIAL_SIIGO_CONFIG;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ep_enterprise_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_period', JSON.stringify(currentPeriod));
  }, [currentPeriod]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_payslips', JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_timeoff', JSON.stringify(timeOffRequests));
  }, [timeOffRequests]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_jobs', JSON.stringify(jobOpenings));
  }, [jobOpenings]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_recognitions', JSON.stringify(recognitions));
  }, [recognitions]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_correrias', JSON.stringify(correrias));
  }, [correrias]);

  useEffect(() => {
    localStorage.setItem('ep_enterprise_siigo', JSON.stringify(siigoConfig));
  }, [siigoConfig]);

  // Adjust currentUser based on role if switching
  useEffect(() => {
    const savedAvatar = localStorage.getItem('ep_enterprise_user_avatar');
    if (currentRole === 'admin_hr') {
      const admin = employees[0] || DEFAULT_CURRENT_USER;
      setCurrentUser(savedAvatar ? { ...admin, avatar: savedAvatar } : admin);
    } else if (currentRole === 'team_lead') {
      const lead = employees[1] || { ...DEFAULT_CURRENT_USER, jobTitle: 'Dirección de Proyecto / Jefatura', code: 'DIR-002' };
      setCurrentUser(savedAvatar ? { ...lead, avatar: savedAvatar } : lead);
    } else {
      const emp = employees[2] || { ...DEFAULT_CURRENT_USER, jobTitle: 'Colaborador / Asesor', code: 'COL-001' };
      setCurrentUser(savedAvatar ? { ...emp, avatar: savedAvatar } : emp);
    }
  }, [currentRole, employees]);

  const updateCurrentUserAvatar = (newAvatarUrl: string) => {
    localStorage.setItem('ep_enterprise_user_avatar', newAvatarUrl);
    setCurrentUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === currentUser.id ? { ...e, avatar: newAvatarUrl } : e));
      localStorage.setItem('ep_enterprise_employees', JSON.stringify(updated));
      return updated;
    });
    showToast('success', 'Foto de Perfil Actualizada', 'Tu nueva foto de perfil se ha guardado correctamente.');
  };

  const clearAllMockEmployees = () => {
    if (window.confirm('¿Deseas eliminar los datos ficticios de los colaboradores? El directorio quedará en 0 listo para nuevos registros de Essential Pharma.')) {
      setEmployees([]);
      localStorage.removeItem('ep_enterprise_employees');
      showToast('success', 'Directorio Limpio', 'Se eliminaron los datos ficticios. Directorio listo para registrar el personal.');
    }
  };

  const clearAllMockAccounting = () => {
    if (window.confirm('¿Deseas eliminar los registros contables ficticios? El módulo de correrías y anticipos quedará en 0.')) {
      setCorrerias([]);
      localStorage.removeItem('ep_enterprise_correrias');
      showToast('success', 'Contabilidad Limpia', 'Se eliminó la información contable previa. Módulo listo para nuevos registros.');
    }
  };

  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatCurrency = (amount: number): string => {
    if (currency === 'USD') {
      const inUSD = Math.round(amount / 4000);
      return `$${inUSD.toLocaleString('en-US')} USD`;
    }
    if (currency === 'CLP') {
      const inCLP = Math.round(amount * 0.24);
      return `$${inCLP.toLocaleString('es-CL')} CLP`;
    }
    if (currency === 'MXN') {
      const inMXN = Math.round(amount / 210);
      return `$${inMXN.toLocaleString('es-MX')} MXN`;
    }
    return `$${amount.toLocaleString('es-CO')} COP`;
  };

  // Actions
  const addEmployee = (empData: Omit<Employee, 'id' | 'code' | 'vacationDaysAvailable' | 'vacationDaysTaken'>) => {
    const nextCodeNumber = employees.length + 1;
    const code = `EMP-${String(nextCodeNumber).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      code,
      vacationDaysAvailable: 15,
      vacationDaysTaken: 0,
    };
    const updated = [newEmp, ...employees];
    setEmployees(updated);

    // Auto generate payslip for current period
    const newPayslip = generatePayslipForEmployee(newEmp, currentPeriod.id);
    setPayslips((prev) => [...prev, newPayslip]);

    showToast('success', 'Trabajador registrado', `${newEmp.firstName} ${newEmp.lastName} ha sido registrado exitosamente.`);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          if (currentUser.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return e;
      })
    );
    showToast('info', 'Ficha actualizada', 'Los datos del trabajador se guardaron correctamente.');
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      localStorage.setItem('ep_enterprise_employees', JSON.stringify(updated));
      return updated;
    });
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(null);
    }
    showToast('info', 'Trabajador Eliminado', 'Se ha eliminado el trabajador del sistema.');
  };

  const calculatePayroll = () => {
    const newSlips = employees.map((emp) => generatePayslipForEmployee(emp, currentPeriod.id));
    setPayslips(newSlips);
    const totalCost = newSlips.reduce((sum, s) => sum + s.totalEarnings, 0);
    setCurrentPeriod((prev) => ({
      ...prev,
      status: 'En Revisión',
      totalCost,
      employeeCount: newSlips.length,
    }));
    showToast('success', 'Nómina recalculada', `Se procesaron las liquidaciones de ${newSlips.length} trabajadores para ${currentPeriod.name}.`);
  };

  const closePayroll = () => {
    setCurrentPeriod((prev) => ({
      ...prev,
      status: 'Cerrada y Pagada',
    }));
    setPayslips((prev) => prev.map((s) => ({ ...s, status: 'Pagado' })));
    showToast('success', 'Nómina Cerrada y Aprobada', 'Se generó la orden de dispersión bancaria y notificación a los trabajadores.');
  };

  const requestTimeOff = (reqData: Omit<TimeOffRequest, 'id' | 'status' | 'requestedAt'>) => {
    const newReq: TimeOffRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'Pendiente',
      requestedAt: '2026-09-30',
    };
    setTimeOffRequests((prev) => [newReq, ...prev]);
    showToast('info', 'Solicitud enviada', `Tu solicitud de ${newReq.type} por ${newReq.totalDays} días está en revisión por tu jefatura.`);
  };

  const approveTimeOff = (id: string, reviewerNotes?: string) => {
    const req = timeOffRequests.find((r) => r.id === id);
    if (!req) return;

    setTimeOffRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Aprobado',
              reviewedBy: `${currentUser.firstName} ${currentUser.lastName}`,
              reviewedAt: '2026-09-30',
              reviewerNotes: reviewerNotes || 'Solicitud aprobada.',
            }
          : r
      )
    );

    // Update employee vacation days balance if applicable
    if (req.type === 'Vacaciones Legales') {
      setEmployees((prev) =>
        prev.map((e) => {
          if (e.id === req.employeeId) {
            return {
              ...e,
              vacationDaysAvailable: Math.max(0, e.vacationDaysAvailable - req.totalDays),
              vacationDaysTaken: e.vacationDaysTaken + req.totalDays,
              status: 'Vacaciones',
            };
          }
          return e;
        })
      );
    }

    showToast('success', 'Permiso Aprobado', `Se aprobó la solicitud de ${req.employeeName}. Se notificó por correo institucional.`);
  };

  const rejectTimeOff = (id: string, reviewerNotes?: string) => {
    setTimeOffRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rechazado',
              reviewedBy: `${currentUser.firstName} ${currentUser.lastName}`,
              reviewedAt: '2026-09-30',
              reviewerNotes: reviewerNotes || 'Solicitud no autorizada por motivos operativos.',
            }
          : r
      )
    );
    showToast('warning', 'Permiso Rechazado', 'Se notificó la decisión al trabajador con las observaciones registradas.');
  };

  const clockIn = (location: string = 'Sede Principal - Bogotá') => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: `${currentUser.firstName} ${currentUser.lastName}`,
      date: '2026-09-30',
      clockIn: timeStr,
      totalHoursWorked: 0,
      status: 'En turno',
      location,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);
    setActiveAttendance(newRecord);
    setIsClockedIn(true);
    showToast('success', 'Marcaje de Entrada', `Registro exitoso a las ${timeStr} en ${location}. ¡Que tengas un excelente turno!`);
  };

  const clockOut = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (activeAttendance) {
      const updated = {
        ...activeAttendance,
        clockOut: timeStr,
        totalHoursWorked: 8.5,
        status: 'Puntual' as const,
      };
      setAttendanceRecords((prev) => prev.map((a) => (a.id === activeAttendance.id ? updated : a)));
      setActiveAttendance(null);
    }
    setIsClockedIn(false);
    showToast('info', 'Marcaje de Salida', `Salida registrada a las ${timeStr}. Jornada completada con éxito.`);
  };

  // Recruitment
  const addJobOpening = (jobData: Omit<JobOpening, 'id' | 'createdAt'>) => {
    const newJob: JobOpening = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: '2026-09-30',
    };
    setJobOpenings((prev) => [newJob, ...prev]);
    showToast('success', 'Vacante publicada', `La posición ${newJob.title} se encuentra activa en el portal de empleo.`);
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCand: Candidate = {
      ...candidateData,
      id: `cand-${Date.now()}`,
      appliedDate: '2026-09-30',
    };
    setCandidates((prev) => [newCand, ...prev]);
    showToast('success', 'Candidato postulado', `${newCand.name} fue registrado en el proceso de selección.`);
  };

  const moveCandidateStage = (candidateId: string, stage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage } : c))
    );
    const cand = candidates.find((c) => c.id === candidateId);
    showToast('info', 'Etapa actualizada', `${cand?.name || 'Candidato'} movido a la etapa "${stage}".`);
  };

  const hireCandidate = (candidateId: string) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    const opening = jobOpenings.find((j) => j.id === cand.jobOpeningId);
    const [firstName, ...lastNameParts] = cand.name.split(' ');
    const lastName = lastNameParts.join(' ') || 'Trabajador';

    addEmployee({
      firstName,
      lastName,
      email: cand.email,
      phone: cand.phone,
      documentType: 'CC',
      documentNumber: `1.0${Math.floor(10000000 + Math.random() * 90000000)}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      jobTitle: opening ? opening.title : 'Especialista',
      department: opening ? opening.department : 'Operaciones',
      hireDate: '2026-10-01',
      birthDate: '1995-05-15',
      status: 'Activo',
      contractType: 'Término Indefinido',
      baseSalary: cand.currentSalaryExpectation || 5500000,
      bankName: 'Bancolombia',
      accountNumber: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100000 + Math.random() * 900000)}-01`,
      healthProvider: 'Sura EPS',
      pensionProvider: 'Protección AFP',
      arlProvider: 'Seguros Bolívar (Riesgo I)',
      emergencyContact: {
        name: 'Familiar Principal',
        relationship: 'Contacto',
        phone: cand.phone,
      },
    });

    moveCandidateStage(candidateId, 'Contratado');
    showToast('success', '¡Candidato Contratado!', `${cand.name} ha sido promovido y creado como trabajador activo en EP Enterprise.`);
  };

  // Goals
  const addGoal = (goalData: Omit<PerformanceGoal, 'id'>) => {
    const newGoal: PerformanceGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast('success', 'Objetivo Creado', `Se asignó la meta "${newGoal.title}" con ponderación del ${newGoal.weight}%.`);
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const status = progress >= 100 ? 'Cumplido' : progress < 40 ? 'En Riesgo' : 'En Progreso';
          return { ...g, progress, status };
        }
        return g;
      })
    );
  };

  // Recognitions
  const addRecognition = (recData: Omit<Recognition, 'id' | 'date' | 'likesCount'>) => {
    const newRec: Recognition = {
      ...recData,
      id: `rec-${Date.now()}`,
      date: '2026-09-30',
      likesCount: 1,
    };
    setRecognitions((prev) => [newRec, ...prev]);
    showToast('success', '¡Reconocimiento Publicado!', `Has enviado una insignia de ${newRec.badge} a ${newRec.toEmployeeName}.`);
  };

  const likeRecognition = (id: string) => {
    setRecognitions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likesCount: r.likesCount + 1 } : r))
    );
  };

  const addAnnouncement = (annData: Omit<CompanyAnnouncement, 'id' | 'date' | 'commentsCount'>) => {
    const newAnn: CompanyAnnouncement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: '2026-09-30',
      commentsCount: 0,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('success', 'Comunicado Publicado', 'El aviso ha sido enviado al muro corporativo.');
  };

  // ==========================================
  // CONTABILIDAD: CORRERÍAS & VIÁTICOS & SIIGO
  // ==========================================
  const createCorreria = (correriaData: Omit<CorreriaPlanner, 'id' | 'code' | 'status' | 'expenses' | 'totalExpensesLegalized' | 'balanceDue' | 'siigoSyncStatus'>) => {
    const nextNum = correrias.length + 85;
    const code = `CORR-2026-${String(nextNum).padStart(3, '0')}`;
    const newCorreria: CorreriaPlanner = {
      ...correriaData,
      id: `corr-${Date.now()}`,
      code,
      status: 'Enviado a Dirección',
      expenses: [],
      totalExpensesLegalized: 0,
      balanceDue: 0,
      siigoSyncStatus: 'No Sincronizado',
    };

    setCorrerias((prev) => [newCorreria, ...prev]);
    showToast(
      'success',
      'Planeador de Correría Radicado',
      `El planeador ${code} para ${newCorreria.projectName} fue enviado a la Dirección del Proyecto para autorizar anticipo de ${formatCurrency(newCorreria.totalAdvanceRequested)}.`
    );
  };

  const authorizeCorreriaAdvance = (id: string, approvedAmount: number, notes?: string) => {
    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Autorizado por Dirección',
            totalAdvanceApproved: approvedAmount,
            directorNotes: notes || 'Anticipo y viáticos autorizados por la Dirección del Proyecto.',
            authorizedBy: `${currentUser.firstName} ${currentUser.lastName} · Dirección`,
            authorizedAt: '2026-10-01 10:30 AM',
          };
        }
        return c;
      })
    );
    showToast(
      'success',
      'Anticipo Autorizado por Dirección',
      `Se autorizó un anticipo de viáticos por ${formatCurrency(approvedAmount)} para la correría. Pendiente desembolso de tesorería.`
    );
  };

  const disburseAdvance = (id: string, refNumber: string, bank: string) => {
    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Anticipo Desembolsado',
            advanceDisbursementDate: '2026-10-01',
            advanceDisbursementRef: refNumber || `TR-BCOL-${Math.floor(100000 + Math.random() * 900000)}`,
            advanceBankName: bank || 'Bancolombia Cta Cte',
          };
        }
        return c;
      })
    );
    showToast(
      'success',
      'Anticipo Desembolsado',
      `Se registró la transferencia bancaria (${refNumber}) al asesor. Correría lista para ejecución.`
    );
  };

  const addExpenseToCorreria = (correriaId: string, expenseData: Omit<ExpenseReceipt, 'id'>) => {
    const newExpense: ExpenseReceipt = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };

    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === correriaId) {
          const updatedExpenses = [...c.expenses, newExpense];
          const totalExpensesLegalized = updatedExpenses.reduce((sum, e) => sum + e.amountTotal, 0);
          const balanceDue = c.totalAdvanceApproved - totalExpensesLegalized;

          return {
            ...c,
            expenses: updatedExpenses,
            totalExpensesLegalized,
            balanceDue,
          };
        }
        return c;
      })
    );

    showToast('success', 'Gasto Registrado', `Factura ${expenseData.invoiceNumber} (${expenseData.providerName}) por ${formatCurrency(expenseData.amountTotal)} agregada.`);
  };

  const removeExpenseFromCorreria = (correriaId: string, expenseId: string) => {
    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === correriaId) {
          const updatedExpenses = c.expenses.filter((e) => e.id !== expenseId);
          const totalExpensesLegalized = updatedExpenses.reduce((sum, e) => sum + e.amountTotal, 0);
          const balanceDue = c.totalAdvanceApproved - totalExpensesLegalized;

          return {
            ...c,
            expenses: updatedExpenses,
            totalExpensesLegalized,
            balanceDue,
          };
        }
        return c;
      })
    );
    showToast('info', 'Gasto eliminado', 'El comprobante fue retirado de la legalización.');
  };

  const submitLegalization = (correriaId: string) => {
    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === correriaId) {
          return {
            ...c,
            status: 'Legalización Radicada',
            legalizationSubmittedDate: '2026-10-01',
          };
        }
        return c;
      })
    );
    showToast('success', 'Legalización Radicada', 'Los soportes y facturas fueron radicados para revisión contable.');
  };

  const approveLegalization = (correriaId: string, notes?: string) => {
    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === correriaId) {
          return {
            ...c,
            status: 'Legalizado por Contabilidad',
            accountingApprovedBy: `${currentUser.firstName} ${currentUser.lastName} · Contabilidad`,
            accountingApprovalDate: '2026-10-01',
            accountingNotes: notes || 'Facturas electrónicas DIAN y soportes validados conforme a políticas contables.',
          };
        }
        return c;
      })
    );
    showToast('success', 'Legalización Aprobada Contablemente', 'Todos los gastos fueron certificados. Listo para contabilizar en Siigo Nube.');
  };

  const sendLegalizationReminders = () => {
    const today = new Date();
    const remindersSent: string[] = [];

    correrias.forEach((c) => {
      if (['Anticipo Desembolsado', 'En Ejecución'].includes(c.status) && c.endDate) {
        const endDate = new Date(c.endDate);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Remind if 2 days or less to deadline
        if (diffDays >= 0 && diffDays <= 2) {
          console.log(`[EMAIL MOCK] Sending legalization reminder to ${c.adviserEmail} for ${c.code}. Deadline: ${c.endDate}`);
          remindersSent.push(c.code);
        }
      }
    });

    if (remindersSent.length > 0) {
      showToast('success', 'Recordatorios Enviados', `Se han enviado recordatorios a ${remindersSent.length} asesores.`);
    } else {
      showToast('info', 'Sin Recordatorios', 'No hay correrías próximas a vencer en este momento.');
    }
  };

  const syncWithSiigoNube = async (correriaId: string): Promise<{ success: boolean; voucherNumber: string }> => {
    const correria = correrias.find((c) => c.id === correriaId);
    if (!correria) return { success: false, voucherNumber: '' };

    // Simulate SIIGO Nube Cloud API response
    const voucherNumber = `SIIGO-CE-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toISOString();

    const payloadLog = JSON.stringify({
      endpoint: `${siigoConfig.apiEndpoint}/v1/expenses`,
      method: 'POST',
      headers: {
        'Partner-Id': siigoConfig.partnerId,
        'Authorization': `Bearer ${siigoConfig.apiKey.substring(0, 10)}...`,
        'Content-Type': 'application/json',
      },
      body: {
        document: { id: 412, type: 'CE', name: 'Comprobante de Egreso - Legalización Viáticos' },
        date: '2026-10-01',
        cost_center: siigoConfig.costCenter,
        beneficiary: {
          identification: correria.adviserId,
          name: correria.adviserName,
        },
        items: correria.expenses.map((exp) => ({
          account_puc: exp.pucAccount.split(' ')[0],
          description: `${exp.concept} - ${exp.providerName} Fac: ${exp.invoiceNumber}`,
          subtotal: exp.amountSubtotal,
          tax: exp.amountTax,
          total: exp.amountTotal,
        })),
        advance_offset: {
          account_puc: '133005',
          description: 'Cruce Anticipo Viáticos Correría',
          amount: correria.totalAdvanceApproved,
        },
        balance_settlement: {
          account_puc: '111005',
          description: correria.balanceDue >= 0 ? 'Reintegro del trabajador a banco' : 'Reembolso por pagar al trabajador',
          amount: Math.abs(correria.balanceDue),
        },
      },
      response: {
        status: 201,
        statusText: 'Created',
        data: {
          id: voucherNumber,
          siigo_internal_id: 'DOC-SIIGO-9938102',
          synced_at: nowStr,
          message: 'Comprobante de Egreso Contabilizado Exitosamente en Siigo Nube Cloud',
        },
      },
    }, null, 2);

    setCorrerias((prev) =>
      prev.map((c) => {
        if (c.id === correriaId) {
          return {
            ...c,
            status: 'Contabilizado en Siigo Nube',
            siigoVoucherNumber: voucherNumber,
            siigoSyncStatus: 'Sincronizado Exitoso',
            siigoSyncDate: '2026-10-01 11:20 AM',
            siigoPayloadLog: payloadLog,
          };
        }
        return c;
      })
    );

    setSiigoConfig((prev) => ({
      ...prev,
      lastSyncTimestamp: '2026-10-01 11:20 AM',
    }));

    showToast(
      'success',
      '¡Contabilizado en Siigo Nube!',
      `Se sincronizó con la API de Siigo Nube. Comprobante generado: ${voucherNumber}.`
    );

    return { success: true, voucherNumber };
  };

  const updateSiigoConfig = (cfg: Partial<SiigoConfig>) => {
    setSiigoConfig((prev) => ({ ...prev, ...cfg }));
    showToast('info', 'Configuración Siigo Nube Actualizada', 'Los parámetros de conexión con la API de Siigo se guardaron.');
  };

  // ADMIN METHODS
  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const addAppUser = (newUser: Omit<AppAccountUser, 'id' | 'createdAt'>) => {
    const id = `user-${Date.now().toString().slice(-4)}`;
    const createdDate = new Date().toISOString().split('T')[0];
    const userWithId: AppAccountUser = {
      ...newUser,
      id,
      createdAt: createdDate,
    };
    setAppUsers((prev) => [userWithId, ...prev]);
    addAuditLog({
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrador',
      actorRole: currentRole,
      action: 'Creación de Usuario',
      details: `Usuario ${newUser.name} (${newUser.email}) registrado con rol ${newUser.roleName}.`,
      category: 'Usuarios',
    });
    showToast('success', 'Usuario Creado Exitosamente', `Se registraron las credenciales y criterios para ${newUser.name}.`);
  };

  const updateAppUser = (id: string, updates: Partial<AppAccountUser>) => {
    setAppUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    const targetUser = appUsers.find((u) => u.id === id);
    addAuditLog({
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrador',
      actorRole: currentRole,
      action: 'Actualización de Usuario / Criterios',
      details: `Se actualizaron los permisos y configuración de ${targetUser ? targetUser.name : id}.`,
      category: 'Usuarios',
    });
    showToast('info', 'Usuario Actualizado', 'Los criterios, roles o datos del usuario fueron guardados.');
  };

  const deleteAppUser = (id: string) => {
    const target = appUsers.find((u) => u.id === id);
    setAppUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog({
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrador',
      actorRole: currentRole,
      action: 'Eliminación de Usuario',
      details: `Se eliminó el acceso al usuario ${target ? target.name : id}.`,
      category: 'Usuarios',
    });
    showToast('warning', 'Usuario Eliminado', 'El usuario ha sido removido del sistema.');
  };

  const updateSecurityCriteria = (updates: Partial<SecurityPolicyCriteria>) => {
    setSecurityCriteria((prev) => ({ ...prev, ...updates }));
    addAuditLog({
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrador',
      actorRole: currentRole,
      action: 'Modificación de Criterios y Políticas',
      details: 'Se actualizaron los topes de viáticos y políticas de aprobación.',
      category: 'Seguridad',
    });
    showToast('success', 'Criterios Actualizados', 'Las políticas de seguridad y topes de viáticos fueron guardados.');
  };

  const resetAllData = () => {
    localStorage.removeItem('ep_enterprise_employees');
    localStorage.removeItem('ep_enterprise_period');
    localStorage.removeItem('ep_enterprise_payslips');
    localStorage.removeItem('ep_enterprise_timeoff');
    localStorage.removeItem('ep_enterprise_attendance');
    localStorage.removeItem('ep_enterprise_jobs');
    localStorage.removeItem('ep_enterprise_candidates');
    localStorage.removeItem('ep_enterprise_goals');
    localStorage.removeItem('ep_enterprise_recognitions');
    localStorage.removeItem('ep_enterprise_announcements');
    localStorage.removeItem('ep_enterprise_correrias');
    localStorage.removeItem('ep_enterprise_siigo');

    setEmployees(INITIAL_EMPLOYEES);
    setCurrentPeriod(INITIAL_PAYROLL_PERIOD);
    setPayslips(INITIAL_EMPLOYEES.map((e) => generatePayslipForEmployee(e, INITIAL_PAYROLL_PERIOD.id)));
    setTimeOffRequests(INITIAL_TIME_OFF_REQUESTS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setJobOpenings(INITIAL_JOB_OPENINGS);
    setCandidates(INITIAL_CANDIDATES);
    setGoals(INITIAL_GOALS);
    setRecognitions(INITIAL_RECOGNITIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCorrerias(INITIAL_CORRERIAS);
    setSiigoConfig(INITIAL_SIIGO_CONFIG);
    setCurrentRole('admin_hr');
    const savedAvatar = localStorage.getItem('ep_enterprise_user_avatar');
    const defaultUser = INITIAL_EMPLOYEES[0] || DEFAULT_CURRENT_USER;
    setCurrentUser(savedAvatar ? { ...defaultUser, avatar: savedAvatar } : defaultUser);

    showToast('info', 'Datos restablecidos', 'Se han cargado los datos iniciales de EP Enterprise - Essential Pharma.');
  };

  const logout = () => {
    localStorage.removeItem('ep_enterprise_user_avatar');
    window.location.reload();
  };

  return (
    <HRContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        companyName,
        setCompanyName,
        currency,
        setCurrency,
        formatCurrency,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        selectedEmployee,
        setSelectedEmployee,
        updateCurrentUserAvatar,
        clearAllMockEmployees,
        clearAllMockAccounting,
        currentPeriod,
        payslips,
        calculatePayroll,
        closePayroll,
        selectedPayslip,
        setSelectedPayslip,
        timeOffRequests,
        requestTimeOff,
        approveTimeOff,
        rejectTimeOff,
        attendanceRecords,
        isClockedIn,
        activeAttendance,
        clockIn,
        clockOut,
        jobOpenings,
        candidates,
        addJobOpening,
        addCandidate,
        moveCandidateStage,
        hireCandidate,
        goals,
        addGoal,
        updateGoalProgress,
        recognitions,
        addRecognition,
        likeRecognition,
        announcements,
        addAnnouncement,
        correrias,
        selectedCorreria,
        setSelectedCorreria,
        createCorreria,
        authorizeCorreriaAdvance,
        disburseAdvance,
        addExpenseToCorreria,
        removeExpenseFromCorreria,
        submitLegalization,
        approveLegalization,
        sendLegalizationReminders,
        syncWithSiigoNube,
        siigoConfig,
        updateSiigoConfig,
        appUsers,
        addAppUser,
        updateAppUser,
        deleteAppUser,
        securityCriteria,
        updateSecurityCriteria,
        auditLogs,
        addAuditLog,
        toasts,
        dismissToast,
        showToast,
        resetAllData,
        logout,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = (): HRContextType => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};
