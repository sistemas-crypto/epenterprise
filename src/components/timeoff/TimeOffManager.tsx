import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { TimeOffType, TimeOffRequest } from '../../types/hr';
import {
  CalendarCheck,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Building,
  Check,
  X,
  FileText
} from 'lucide-react';

export const TimeOffManager: React.FC = () => {
  const {
    currentUser,
    currentRole,
    timeOffRequests,
    requestTimeOff,
    approveTimeOff,
    rejectTimeOff,
    attendanceRecords,
    isClockedIn,
    clockIn,
    clockOut,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'requests' | 'new_request' | 'attendance' | 'calendar'>('requests');

  // New Request Form State
  const [requestType, setRequestType] = useState<TimeOffType>('Vacaciones Legales');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [reason, setReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  // Calculate days roughly
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const totalDays = calculateDays(startDate, endDate);

    requestTimeOff({
      employeeId: currentUser.id,
      employeeName: `${currentUser.firstName} ${currentUser.lastName}`,
      employeeAvatar: currentUser.avatar,
      employeeDepartment: currentUser.department,
      type: requestType,
      startDate,
      endDate,
      totalDays,
      reason: reason || 'Solicitud de descanso reglamentario.',
    });

    setReason('');
    setActiveTab('requests');
  };

  const pendingRequests = timeOffRequests.filter((r) => r.status === 'Pendiente');
  const pastRequests = timeOffRequests.filter((r) => r.status !== 'Pendiente');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Control de Asistencia & Vacaciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de turnos, marcación en tiempo real y workflow de aprobación de permisos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new_request')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Solicitar Vacaciones o Permiso
          </button>
        </div>
      </div>

      {/* Hero: Live Attendance Terminal Widget */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
              <h2 className="text-base font-bold text-slate-900">
                Reloj de Marcaje EP Enterprise
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Trabajador: <span className="font-semibold text-slate-800">{currentUser.firstName} {currentUser.lastName}</span> · Sede Principal Bogotá
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Estado Actual
              </span>
              <p className="text-xs font-bold text-slate-800">
                {isClockedIn ? 'Jornada Ordinaria en Curso' : 'Sin turno activo'}
              </p>
            </div>

            <button
              onClick={isClockedIn ? clockOut : () => clockIn('Sede Principal')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                isClockedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isClockedIn ? 'Registrar Salida de Turno' : 'Registrar Entrada de Turno'}
            </button>
          </div>
        </div>

        {/* Vacation balance highlight bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-lg">
            <span className="text-teal-700 font-medium">Mis Días Disponibles</span>
            <p className="text-xl font-bold text-teal-900 font-mono mt-0.5 tabular-nums">
              {currentUser.vacationDaysAvailable} días
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 font-medium">Días Disfrutados</span>
            <p className="text-xl font-bold text-slate-800 font-mono mt-0.5 tabular-nums">
              {currentUser.vacationDaysTaken} días
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 font-medium">Solicitudes en Revisión</span>
            <p className="text-xl font-bold text-slate-800 font-mono mt-0.5 tabular-nums">
              {pendingRequests.length}
            </p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 font-medium">Marcajes Hoy</span>
            <p className="text-xl font-bold text-slate-800 font-mono mt-0.5 tabular-nums">
              {attendanceRecords.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-teal-600 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Bandeja de Solicitudes ({pendingRequests.length} pendientes)
        </button>
        <button
          onClick={() => setActiveTab('new_request')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'new_request'
              ? 'border-teal-600 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Crear Nueva Solicitud
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'attendance'
              ? 'border-teal-600 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registro Biométrico de Hoy
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'calendar'
              ? 'border-teal-600 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Calendario de Ausencias
        </button>
      </div>

      {/* TAB 1: Requests Approval Queue */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Pending Approvals */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Solicitudes Pendientes de Aprobación
            </h3>
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  ¡Al día! No hay solicitudes pendientes por revisar.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Las nuevas solicitudes de vacaciones o permisos aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-5 bg-white border border-amber-200 rounded-xl shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.employeeAvatar}
                          alt={req.employeeName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-100"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{req.employeeName}</p>
                          <p className="text-[11px] text-slate-500">{req.employeeDepartment}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Pendiente
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium">Tipo:</span>
                        <span className="font-semibold text-slate-900">{req.type}</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium">Fechas:</span>
                        <span className="font-mono tabular-nums">{req.startDate} al {req.endDate}</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium">Días solicitados:</span>
                        <span className="font-bold text-teal-800 font-mono">{req.totalDays} {req.totalDays === 1 ? 'día hábil' : 'días hábiles'}</span>
                      </div>
                      {req.reason && (
                        <p className="text-[11px] text-slate-500 pt-1 italic">
                          "{req.reason}"
                        </p>
                      )}
                    </div>

                    {/* Review notes input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Observación opcional para el trabajador..."
                        value={reviewNotes[req.id] || ''}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [req.id]: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => approveTimeOff(req.id, reviewNotes[req.id])}
                        className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => rejectTimeOff(req.id, reviewNotes[req.id])}
                        className="py-1.5 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Requests History */}
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Historial de Solicitudes Procesadas
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Trabajador</th>
                    <th className="py-3 px-4">Tipo de Permiso</th>
                    <th className="py-3 px-4">Periodo</th>
                    <th className="py-3 px-4">Días</th>
                    <th className="py-3 px-4">Revisado Por</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {req.employeeName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{req.type}</td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                        {req.startDate} al {req.endDate}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums font-medium text-slate-800">
                        {req.totalDays}d
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {req.reviewedBy || 'Jefatura'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          req.status === 'Aprobado'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: New Request Form */}
      {activeTab === 'new_request' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Formulario de Solicitud de Ausencia o Vacaciones
          </h3>
          <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tipo de Solicitud *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as TimeOffType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
              >
                <option value="Vacaciones Legales">Vacaciones Legales Reglamentarias</option>
                <option value="Permiso Remunerado">Permiso Remunerado (Estudio, grado, citas)</option>
                <option value="Día de la Familia">Día Semestral de la Familia (Ley 1857)</option>
                <option value="Incapacidad Médica">Incapacidad Médica (EPS)</option>
                <option value="Calamidad Doméstica">Calamidad Doméstica</option>
                <option value="Permiso No Remunerado">Permiso No Remunerado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Fecha de Finalización *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg flex items-center justify-between">
              <span className="text-teal-900 font-medium">Total Días Calculados:</span>
              <span className="text-base font-bold text-teal-900 font-mono">
                {calculateDays(startDate, endDate)} días
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Motivo / Justificación
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe brevemente el motivo de la solicitud o adjunta los detalles pertinentes..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
              >
                Enviar Solicitud a Mi Jefatura
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Biometric Attendance Log of Today */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">
              Registros Biométricos de Asistencia · Hoy {new Date().toLocaleDateString('es-CO')}
            </span>
            <span className="text-[11px] text-teal-700 font-semibold font-mono">
              {attendanceRecords.length} trabajadores registrados
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Trabajador</th>
                <th className="py-3 px-4">Hora Entrada</th>
                <th className="py-3 px-4">Hora Salida</th>
                <th className="py-3 px-4">Ubicación / Dispositivo</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {att.employeeName}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                    {att.clockIn}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                    {att.clockOut || '— (En turno)'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{att.location}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      att.status === 'Puntual'
                        ? 'bg-emerald-50 text-emerald-700'
                        : att.status === 'En turno'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Team Absence Calendar */}
      {activeTab === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Calendario de Ausencias del Equipo · Octubre 2026
            </h3>
            <span className="text-xs text-slate-500">
              Festivos colombianos y vacaciones programadas
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs pt-3">
            {/* Calendar grid mock for current month */}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isWeekend = (day % 7 === 6) || (day % 7 === 0);
              const isHoliday = day === 12; // Día de la Raza
              const isVacation = day >= 1 && day <= 6; // Andrés Gómez
              const isPermit = day === 5 || day === 16;

              return (
                <div
                  key={day}
                  className={`min-h-[70px] p-1.5 rounded-lg border text-left flex flex-col justify-between ${
                    isHoliday
                      ? 'bg-rose-50/60 border-rose-200'
                      : isVacation
                      ? 'bg-amber-50/60 border-amber-200'
                      : isPermit
                      ? 'bg-teal-50/60 border-teal-200'
                      : 'bg-slate-50/30 border-slate-200'
                  }`}
                >
                  <span className={`font-mono font-bold text-[11px] ${isHoliday ? 'text-rose-700' : 'text-slate-700'}`}>
                    {day}
                  </span>

                  <div>
                    {isHoliday && (
                      <span className="text-[10px] text-rose-800 font-semibold block leading-tight">
                        Festivo Oficial
                      </span>
                    )}
                    {isVacation && (
                      <span className="text-[10px] text-amber-900 font-medium block truncate leading-tight">
                        Andrés G. (Vac.)
                      </span>
                    )}
                    {day === 5 && (
                      <span className="text-[10px] text-teal-900 font-medium block truncate leading-tight">
                        Valentina O. (Permiso)
                      </span>
                    )}
                    {day === 16 && (
                      <span className="text-[10px] text-teal-900 font-medium block truncate leading-tight">
                        David V. (Fam.)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
