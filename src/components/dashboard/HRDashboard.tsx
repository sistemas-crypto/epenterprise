import React from 'react';
import { useHR } from '../../context/HRContext';
import {
  Users,
  CreditCard,
  Calendar,
  Clock,
  Cake,
  Award,
  ArrowRight,
  UserPlus,
  FileText,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Building,
  FileSpreadsheet,
  Receipt,
  CloudCheck
} from 'lucide-react';

export const HRDashboard: React.FC = () => {
  const {
    currentUser,
    currentRole,
    employees,
    currentPeriod,
    timeOffRequests,
    correrias,
    formatCurrency,
    setActiveTab,
    isClockedIn,
    clockIn,
    clockOut,
    jobOpenings,
    recognitions,
    announcements,
  } = useHR();

  const totalEmployees = employees.length;
  const onVacationEmployees = employees.filter((e) => e.status === 'Vacaciones');
  const pendingRequests = timeOffRequests.filter((r) => r.status === 'Pendiente');
  const openPositions = jobOpenings.filter((j) => j.status === 'Abierta').length;

  const pendingCorrerias = correrias.filter(
    (c) => c.status === 'Enviado a Dirección' || c.status === 'Legalización Radicada'
  );

  const upcomingBirthdays = employees
    .filter((e) => e.birthDate)
    .map((e) => {
      const parts = e.birthDate.split('-');
      return { ...e, birthMonth: parts[1], birthDay: parts[2] };
    })
    .filter((e) => {
      const month = new Date().getMonth() + 1;
      return parseInt(e.birthMonth) === month;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ¡Hola, {currentUser.firstName}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bienvenido a <span className="font-bold text-emerald-800">EP ENTERPRISE</span> · {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('accounting')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Correrías & Viáticos (Siigo)
          </button>

          {currentRole === 'admin_hr' && (
            <>
              <button
                onClick={() => setActiveTab('employees')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                Nuevo Trabajador
              </button>
              <button
                onClick={() => setActiveTab('payroll')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                Liquidar Nómina
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Certificado Laboral
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Trabajadores */}
        <div 
          onClick={() => setActiveTab('employees')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Trabajadores Activos</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {totalEmployees}
            </span>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span>Plantilla Essential Pharma</span>
              <span aria-hidden="true">·</span>
              <span>7 áreas</span>
            </div>
          </div>
        </div>

        {/* Card 2: Correrías & Viáticos (NEW) */}
        <div 
          onClick={() => setActiveTab('accounting')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Correrías & Viáticos</span>
            <Receipt className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {correrias.length}
            </span>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span className="text-amber-800 font-bold">{pendingCorrerias.length} por autorizar/legalizar</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Siigo Nube</span>
            </div>
          </div>
        </div>

        {/* Card 4: Solicitudes de Vacaciones / Permisos */}
        <div 
          onClick={() => setActiveTab('timeoff')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Solicitudes de Permisos</span>
            <AlertCircle className={`w-4 h-4 ${pendingRequests.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {pendingRequests.length}
            </span>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span>En revisión jefatura</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Gestionar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Módulo Contable Preview + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Correrías & Viáticos Quick View */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Correrías de Asesores & Anticipos (Módulo Contable)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('accounting')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                Ver todas ({correrias.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {correrias.slice(0, 3).map((corr) => (
                <div
                  key={corr.id}
                  onClick={() => setActiveTab('accounting')}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 p-2 rounded-lg transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-800 font-bold text-xs">{corr.code}</span>
                      <span className="text-xs font-semibold text-slate-800">{corr.projectName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Asesor: <strong className="text-slate-700">{corr.adviserName}</strong> · Ruta: {corr.targetCities.join(', ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-900">
                      {formatCurrency(corr.totalAdvanceRequested)}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {corr.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reloj de Asistencia Biométrico / Virtual */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">Control de Asistencia del Trabajador</h3>
              </div>
              <span className="text-xs text-slate-500">
                Jornada Laboral Ordinaria
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <p className="text-sm font-bold text-slate-800">
                    {isClockedIn ? 'Actualmente en turno activo' : 'Fuera de turno laboral'}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {currentUser.firstName} {currentUser.lastName} · {currentUser.jobTitle}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sede Principal - Bogotá (Planta & Laboratorios)</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Acción Rápida
                </span>
                <button
                  onClick={isClockedIn ? clockOut : () => clockIn('Sede Principal')}
                  className={`mt-2 w-full py-2 px-3 text-xs font-bold rounded-lg transition-all shadow-xs ${
                    isClockedIn
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isClockedIn ? 'Registrar Salida' : 'Registrar Entrada'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cumpleaños, Reconocimientos & ATS */}
        <div className="space-y-6">
          {/* Cumpleaños del Mes */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Cake className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Cumpleaños Próximos</h3>
            </div>

            <div className="mt-3 space-y-3">
              {upcomingBirthdays.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={b.avatar}
                      alt={b.firstName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {b.firstName} {b.lastName.split(' ')[0]}
                      </p>
                      <p className="text-[11px] text-slate-400">{b.department}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {b.birthDay} de {b.birthMonth === '09' ? 'Sep' : b.birthMonth === '10' ? 'Oct' : 'Nov'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recognitions Widget ("EP Reconocimientos") */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">Reconocimientos de Equipo</h3>
              </div>
              <button
                onClick={() => setActiveTab('community')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Ver todos
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {recognitions.slice(0, 2).map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                      {rec.badge}
                    </span>
                    <span className="text-[11px] text-slate-400">{rec.likesCount} aplausos</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 italic leading-relaxed">
                    "{rec.message}"
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    De: {rec.fromEmployeeName} para {rec.toEmployeeName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
