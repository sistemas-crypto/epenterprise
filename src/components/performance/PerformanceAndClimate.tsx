import React, { useState, useEffect } from 'react';
import { useHR } from '../../context/HRContext';
import {
  Target,
  Smile,
  Plus,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  X,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  Clock,
  Send,
  Building,
  UserCheck,
  Briefcase,
  Users,
  Search,
  CheckSquare,
  Inbox
} from 'lucide-react';

interface HelpdeskTicket {
  id: string;
  employeeName: string;
  category: string;
  subject: string;
  description: string;
  status: 'Recibido' | 'En Proceso' | 'Resuelto';
  createdAt: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

interface PersonalPlan {
  id: string;
  department: string;
  position: string;
  budgeted: number;
  active: number;
  vacancies: number;
  salaryBudget: number;
}

export const PerformanceAndClimate: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoalProgress,
    employees,
    currentRole,
    showToast,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'goals' | 'climate' | 'service' | 'planning'>('goals');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Helpdesk State
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(() => {
    const saved = localStorage.getItem('ep_helpdesk_tickets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TCK-101',
        employeeName: 'Andrés Felipe Gómez',
        category: 'Consultas de Nómina',
        subject: 'Duda con recargo nocturno de septiembre',
        description: 'Hola, revisé mi colilla de pago y noto que faltaron computar 3 horas de recargo nocturno del fin de semana del 12.',
        status: 'En Proceso',
        createdAt: '2026-09-28',
        priority: 'Alta',
      },
      {
        id: 'TCK-102',
        employeeName: 'Laura Camila Restrepo',
        category: 'Certificados Laborales',
        subject: 'Certificado laboral con salario para arriendo',
        description: 'Solicito comedidamente se me expida un certificado laboral detallando salario básico e incentivos para presentar a inmobiliaria.',
        status: 'Resuelto',
        createdAt: '2026-09-29',
        priority: 'Media',
      },
      {
        id: 'TCK-103',
        employeeName: 'David Felipe Díaz',
        category: 'Soporte de TI / Equipos',
        subject: 'Pantalla externa parpadea',
        description: 'El monitor que me entregaron para el puesto de trabajo presenta destellos constantes de color negro. Solicito revisión.',
        status: 'Recibido',
        createdAt: '2026-10-02',
        priority: 'Baja',
      }
    ];
  });

  // Planning State
  const [planningPositions, setPlanningPositions] = useState<PersonalPlan[]>(() => {
    const saved = localStorage.getItem('ep_personal_planning');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'PLAN-001',
        department: 'Operaciones / Ventas',
        position: 'Asesor Comercial de Línea Especializada',
        budgeted: 15,
        active: 12,
        vacancies: 3,
        salaryBudget: 4500000,
      },
      {
        id: 'PLAN-002',
        department: 'Finanzas & Contabilidad',
        position: 'Analista de Impuestos y Tesorería',
        budgeted: 2,
        active: 2,
        vacancies: 0,
        salaryBudget: 3800000,
      },
      {
        id: 'PLAN-003',
        department: 'Dirección Técnica',
        position: 'Ingeniero de Calidad y Asuntos Regulatorios',
        budgeted: 4,
        active: 3,
        vacancies: 1,
        salaryBudget: 5500000,
      },
      {
        id: 'PLAN-004',
        department: 'Tecnología & TI',
        position: 'Especialista en Sistemas y Soporte',
        budgeted: 2,
        active: 1,
        vacancies: 1,
        salaryBudget: 4000000,
      },
      {
        id: 'PLAN-005',
        department: 'Logística',
        position: 'Auxiliar de Distribución y Despachos',
        budgeted: 8,
        active: 8,
        vacancies: 0,
        salaryBudget: 1800000,
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ep_helpdesk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('ep_personal_planning', JSON.stringify(planningPositions));
  }, [planningPositions]);

  // New Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [category, setCategory] = useState<'Objetivo de Negocio' | 'Desarrollo Individual' | 'Proyecto Clave'>('Objetivo de Negocio');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [weight, setWeight] = useState(30);

  // Climate Survey form state
  const [climateRating, setClimateRating] = useState(9);
  const [climateComment, setClimateComment] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // New Ticket State
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Consultas de Nómina');
  const [ticketPriority, setTicketPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [ticketDesc, setTicketDesc] = useState('');

  // New Planning Position State
  const [showAddPlanning, setShowAddPlanning] = useState(false);
  const [planDept, setPlanDept] = useState('Operaciones / Ventas');
  const [planPos, setPlanPos] = useState('');
  const [planBudgeted, setPlanBudgeted] = useState(2);
  const [planActive, setPlanActive] = useState(2);
  const [planVacancies, setPlanVacancies] = useState(0);
  const [planSalary, setPlanSalary] = useState(3000000);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle) return;

    const assignedEmp = employees.find((e) => e.id === employeeId);

    addGoal({
      employeeId,
      employeeName: assignedEmp ? `${assignedEmp.firstName} ${assignedEmp.lastName}` : 'Trabajador',
      title: goalTitle,
      description: goalDescription,
      category,
      targetDate,
      progress: 0,
      weight: Number(weight),
      status: 'En Progreso',
    });

    setShowAddGoalModal(false);
    setGoalTitle('');
    setGoalDescription('');
    showToast('success', 'Objetivo Asignado', 'El nuevo objetivo estratégico ha sido creado correctamente.');
  };

  const handleClimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveySubmitted(true);
    showToast('success', '¡Gracias por tu Feedback!', 'Tu respuesta fue procesada de manera 100% anónima para medir el clima y bienestar.');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;

    const newTicket: HelpdeskTicket = {
      id: `TCK-${Math.floor(104 + Math.random() * 899)}`,
      employeeName: 'Usuario Autenticado',
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDesc,
      status: 'Recibido',
      priority: ticketPriority,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTickets([newTicket, ...tickets]);
    setShowAddTicket(false);
    setTicketSubject('');
    setTicketDesc('');
    showToast('success', 'Ticket Radicado', 'Tu solicitud se ha enviado al canal de Servicio al Colaborador.');
  };

  const handleCreatePlanning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planPos) return;

    const newPlan: PersonalPlan = {
      id: `PLAN-${Math.floor(106 + Math.random() * 899)}`,
      department: planDept,
      position: planPos,
      budgeted: Number(planBudgeted),
      active: Number(planActive),
      vacancies: Number(planVacancies),
      salaryBudget: Number(planSalary),
    };

    setPlanningPositions([...planningPositions, newPlan]);
    setShowAddPlanning(false);
    setPlanPos('');
    showToast('success', 'Posición Planificada', 'La estructura de personal ha sido actualizada con éxito.');
  };

  const handleUpdateTicketStatus = (id: string, nextStatus: 'Recibido' | 'En Proceso' | 'Resuelto') => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    showToast('info', 'Ticket Actualizado', `El ticket ${id} cambió de estado a ${nextStatus}.`);
  };

  const handleUpdateVacancies = (id: string, increment: boolean) => {
    setPlanningPositions(planningPositions.map(p => {
      if (p.id === id) {
        const nextVacancies = increment ? p.vacancies + 1 : Math.max(0, p.vacancies - 1);
        return { ...p, vacancies: nextVacancies };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            📊 Gestión Integral de Personal & Clima
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluación de OKRs, medición de eNPS, canal unificado de atención interna y planeación en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'goals' && (
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Nuevo Objetivo / OKR
            </button>
          )}
          {activeTab === 'service' && (
            <button
              onClick={() => setShowAddTicket(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Crear Solicitud / Ticket
            </button>
          )}
          {activeTab === 'planning' && (
            <button
              onClick={() => setShowAddPlanning(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Planificar Posición / Vacante
            </button>
          )}
        </div>
      </div>

      {/* Tabs Menu con iconos coloridos */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'goals'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-500" />
          <span>Metas & OKRs ({goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('climate')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'climate'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <Smile className="w-4 h-4 text-pink-500" />
          <span>Clima eNPS</span>
        </button>

        <button
          onClick={() => setActiveTab('service')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'service'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <span>Servicio al Colaborador ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('planning')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'planning'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <Building className="w-4 h-4 text-amber-500" />
          <span>Planeación de Personal & Headcount</span>
        </button>
      </div>

      {/* TAB 1: Goals & OKRs */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => (
              <div key={g.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {g.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {g.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    g.status === 'Cumplido'
                      ? 'bg-emerald-50 text-emerald-700'
                      : g.status === 'En Riesgo'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {g.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Asignado a: <strong className="text-slate-800">{g.employeeName}</strong></span>
                  <span className="font-mono tabular-nums">Meta: {g.targetDate}</span>
                </div>

                {/* Interactive Progress Slider */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Progreso</span>
                    <span className="font-mono text-teal-900 font-bold tabular-nums">{g.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        g.progress >= 100
                          ? 'bg-emerald-500'
                          : g.progress < 40
                          ? 'bg-rose-500'
                          : 'bg-teal-600'
                      }`}
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-400">Ponderación: {g.weight}%</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateGoalProgress(g.id, Math.max(0, g.progress - 10))}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                        title="Disminuir progreso 10%"
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => updateGoalProgress(g.id, Math.min(100, g.progress + 10))}
                        className="px-2 py-0.5 text-[11px] bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded cursor-pointer"
                        title="Aumentar progreso 10%"
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Climate & eNPS */}
      {activeTab === 'climate' && (
        <div className="space-y-6">
          {/* Executive eNPS Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                eNPS Organizacional EP Enterprise
              </span>
              <p className="text-4xl font-extrabold text-teal-700 font-mono mt-2 tabular-nums">
                +68
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Nivel Excelente (Benchmark Latam)
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Desglose de Trabajadores
              </span>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-700 font-semibold">Promotores (9-10):</span>
                  <span className="font-mono font-bold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Neutros / Pasivos (7-8):</span>
                  <span className="font-mono font-bold">16%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-600 font-semibold">Detractores (1-6):</span>
                  <span className="font-mono font-bold">6%</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Dimensiones Más Destacadas
              </span>
              <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                <p>🌟 <strong>Cultura y Compañerismo:</strong> 4.8 / 5.0</p>
                <p>⚖️ <strong>Balance Vida - Trabajo:</strong> 4.6 / 5.0</p>
                <p>🎯 <strong>Claridad de Metas:</strong> 4.7 / 5.0</p>
              </div>
            </div>
          </div>

          {/* Interactive Anonymous Climate Survey Form */}
          <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Smile className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Encuesta de Pulso y Bienestar Laboral (100% Anónima)
                </h3>
                <p className="text-xs text-slate-500">
                  En una escala de 0 a 10, ¿con qué probabilidad recomendarías a Essential Pharma como un gran lugar para trabajar?
                </p>
              </div>
            </div>

            {surveySubmitted ? (
              <div className="p-8 text-center text-xs space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900">¡Tu opinión fue recibida!</h4>
                <p className="text-slate-500">
                  Gracias por contribuir a construir un ambiente de trabajo excepcional.
                </p>
                <button
                  onClick={() => setSurveySubmitted(false)}
                  className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
                >
                  Enviar otra respuesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleClimateSubmit} className="mt-5 space-y-4 text-xs">
                {/* 0-10 Rating Scale */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2 font-semibold">
                    <span>0: Nada probable</span>
                    <span>10: Totalmente probable</span>
                  </div>
                  <div className="grid grid-cols-11 gap-1">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setClimateRating(i)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          climateRating === i
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ¿Qué es lo que más valoras o qué sugerencia tienes para el equipo directivo?
                  </label>
                  <textarea
                    rows={3}
                    value={climateComment}
                    onChange={(e) => setClimateComment(e.target.value)}
                    placeholder="Comparte tu opinión con total tranquilidad, no se registra tu usuario..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                  >
                    Enviar Calificación Anónima
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Servicio al Colaborador */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          {/* Hero statistics and channels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-indigo-600" />
                    Buzón de Solicitudes y Peticiones Internas
                  </h3>
                  <span className="text-xs text-slate-500">Respuestas garantizadas en menos de 24h</span>
                </div>

                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50/60 rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                            {t.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">
                            {t.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.priority === 'Alta' ? 'bg-rose-50 text-rose-700' :
                            t.priority === 'Media' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Prioridad {t.priority}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            t.status === 'Resuelto' ? 'bg-emerald-100 text-emerald-800' :
                            t.status === 'En Proceso' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3 pl-1">
                        {t.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/50 text-[11px] text-slate-400">
                        <span>Radicado por: <strong className="text-slate-600">{t.employeeName}</strong></span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {t.createdAt}
                          </span>
                          {currentRole === 'admin_hr' && (
                            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5">
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'En Proceso')}
                                className="px-1.5 py-0.5 text-[9px] font-bold text-blue-700 hover:bg-blue-50 rounded"
                              >
                                Procesar
                              </button>
                              <button
                                onClick={() => handleUpdateTicketStatus(t.id, 'Resuelto')}
                                className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
                              >
                                Resolver
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support and communication channels sidebar */}
            <div className="space-y-4">
              <div className="bg-indigo-900 text-white rounded-xl p-5 space-y-4 shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                  Canales de Comunicación Directa
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-all">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <span>💬 Chat Corporativo Directo</span>
                    </p>
                    <p className="text-[11px] text-indigo-200 mt-1">
                      Comunícate en tiempo real con el equipo de Gestión Humana para atención al instante.
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-all">
                    <p className="font-bold text-white">📞 Línea de Bienestar & Familia</p>
                    <p className="text-[11px] text-indigo-200 mt-1">
                      Asesoría psicológica y legal gratuita para colaboradores y su núcleo familiar: <strong>01-8000-HUMANO</strong>.
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-all">
                    <p className="font-bold text-white">📨 Buzón de Felicitaciones y Sugerencias</p>
                    <p className="text-[11px] text-indigo-200 mt-1">
                      ¿Quieres destacar un proceso o sugerir una mejora? Envíanos tus comentarios oficiales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service SLA card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Compromiso SLA de Respuestas:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-500">
                  <li>Consultas de Nómina: Max 24 horas hábiles.</li>
                  <li>Certificados Laborales: Descarga inmediata o firma en 12 horas.</li>
                  <li>Incapacidades & Salud: Procesamiento el mismo día de radicado.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Planeación de Personal & Headcount */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {/* Summary dashboard for HR planning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Presupuesto Total Headcount
              </span>
              <p className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {planningPositions.reduce((sum, p) => sum + p.budgeted, 0)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Posiciones aprobadas por Junta Directiva
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Colaboradores Activos
              </span>
              <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">
                {planningPositions.reduce((sum, p) => sum + p.active, 0)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {Math.round((planningPositions.reduce((sum, p) => sum + p.active, 0) / planningPositions.reduce((sum, p) => sum + p.budgeted, 0)) * 100)}% de ocupación actual
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Vacantes Abiertas (Desvíos)
              </span>
              <p className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
                {planningPositions.reduce((sum, p) => sum + p.vacancies, 0)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                En reclutamiento por Selección & ATS
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Costo Mensual de Nómina Planificada
              </span>
              <p className="text-2xl font-extrabold text-indigo-600 font-mono mt-2">
                ${(planningPositions.reduce((sum, p) => sum + (p.budgeted * p.salaryBudget), 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Proyección en pesos colombianos COP
              </p>
            </div>
          </div>

          {/* Table representing personal positions and vacancies in real time */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                Matriz de Control de Cargos y Desviaciones en Tiempo Real
              </h3>
              <p className="text-xs text-slate-500">
                Alineación entre puestos presupuestados, nómina real y vacantes activas.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                    <th className="px-5 py-3">Código & Departamento</th>
                    <th className="px-5 py-3">Cargo Planificado</th>
                    <th className="px-5 py-3 text-center">Presupuestado</th>
                    <th className="px-5 py-3 text-center">Activo Real</th>
                    <th className="px-5 py-3 text-center">Vacantes</th>
                    <th className="px-5 py-3">Salario Mensual</th>
                    <th className="px-5 py-3 text-center">Estado / Desviación</th>
                    {currentRole === 'admin_hr' && <th className="px-5 py-3 text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {planningPositions.map((p) => {
                    const deviation = p.budgeted - p.active;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5">
                          <span className="block font-mono text-[10px] text-slate-400">{p.id}</span>
                          <span className="font-semibold text-slate-800">{p.department}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-900">
                          {p.position}
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-slate-700">
                          {p.budgeted}
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-emerald-700">
                          {p.active}
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-amber-700">
                          {p.vacancies}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-600">
                          ${p.salaryBudget.toLocaleString('es-CO')} COP
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {deviation > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" />
                              Desvío: -{deviation} Puestos
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Estructura Completa
                            </span>
                          )}
                        </td>
                        {currentRole === 'admin_hr' && (
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateVacancies(p.id, false)}
                                className="p-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded cursor-pointer"
                                title="Reducir 1 Vacante"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleUpdateVacancies(p.id, true)}
                                className="p-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded font-bold cursor-pointer"
                                title="Sumar 1 Vacante"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Create Goal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Crear Nuevo Objetivo / OKR</h3>
              <button onClick={() => setShowAddGoalModal(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título del Objetivo *</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Ej. Cumplir 100% plan de auditorías de calidad"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trabajador Asignado</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.jobTitle})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Objetivo de Negocio">Objetivo de Negocio</option>
                    <option value="Proyecto Clave">Proyecto Clave</option>
                    <option value="Desarrollo Individual">Desarrollo Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ponderación (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descripción / Entregables</label>
                <textarea
                  rows={2}
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Detalla los criterios de éxito esperados..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 rounded-lg cursor-pointer"
                >
                  Guardar Objetivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Helpdesk Ticket */}
      {showAddTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Radicar Nueva Solicitud o Ticket</h3>
              <button onClick={() => setShowAddTicket(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asunto de la Solicitud *</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ej. Error en deducción de salud o certificado retenido"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Consultas de Nómina">Consultas de Nómina</option>
                    <option value="Certificados Laborales">Certificados Laborales</option>
                    <option value="Soporte de TI / Equipos">Soporte de TI / Equipos</option>
                    <option value="Salud y Seguridad (SST)">Salud y Seguridad (SST)</option>
                    <option value="Bienestar y Capacitación">Bienestar y Capacitación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prioridad Requerida</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Alta">Alta (Impacta labor)</option>
                    <option value="Media">Media (Urgencia normal)</option>
                    <option value="Baja">Baja (Pregunta general)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descripción Detallada *</label>
                <textarea
                  rows={3}
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Por favor sé muy claro y específico en tu solicitud para brindarte la mejor respuesta..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTicket(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-indigo-600 rounded-lg cursor-pointer"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Planning Position */}
      {showAddPlanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Planificar Nueva Posición en la Estructura</h3>
              <button onClick={() => setShowAddPlanning(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePlanning} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre del Cargo Planificado *</label>
                <input
                  type="text"
                  required
                  value={planPos}
                  onChange={(e) => setPlanPos(e.target.value)}
                  placeholder="Ej. Líder de Inteligencia de Negocios"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Departamento / Área</label>
                <select
                  value={planDept}
                  onChange={(e) => setPlanDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Operaciones / Ventas">Operaciones / Ventas</option>
                  <option value="Finanzas & Contabilidad">Finanzas & Contabilidad</option>
                  <option value="Dirección Técnica">Dirección Técnica</option>
                  <option value="Tecnología & TI">Tecnología & TI</option>
                  <option value="Logística">Logística</option>
                  <option value="Gestión Humana">Gestión Humana</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Presupuestados</label>
                  <input
                    type="number"
                    min="1"
                    value={planBudgeted}
                    onChange={(e) => setPlanBudgeted(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Activos Reales</label>
                  <input
                    type="number"
                    min="0"
                    value={planActive}
                    onChange={(e) => setPlanActive(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vacantes Activas</label>
                  <input
                    type="number"
                    min="0"
                    value={planVacancies}
                    onChange={(e) => setPlanVacancies(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Presupuesto Salarial Unitario (Mensual) *</label>
                <input
                  type="number"
                  required
                  min="1300000"
                  value={planSalary}
                  onChange={(e) => setPlanSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPlanning(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-amber-600 rounded-lg cursor-pointer"
                >
                  Registrar Estructura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
