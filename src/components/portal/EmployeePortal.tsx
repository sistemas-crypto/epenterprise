import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import {
  UserCircle,
  FileText,
  Calendar,
  CreditCard,
  Award,
  Clock,
  Shield,
  Phone,
  Mail,
  Building,
  CheckCircle,
  ArrowRight,
  Printer,
  Camera
} from 'lucide-react';
import { LaborCertificateModal } from './LaborCertificateModal';
import { PayslipModal } from '../payroll/PayslipModal';
import { ChangeAvatarModal } from '../common/ChangeAvatarModal';

export const EmployeePortal: React.FC = () => {
  const {
    currentUser,
    payslips,
    timeOffRequests,
    recognitions,
    formatCurrency,
    setActiveTab,
    selectedPayslip,
    setSelectedPayslip,
    isClockedIn,
    clockIn,
    clockOut,
  } = useHR();

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const myPayslips = payslips.filter((p) => p.employeeId === currentUser.id);
  const myRequests = timeOffRequests.filter((r) => r.employeeId === currentUser.id);
  const myRecognitions = recognitions.filter((r) => r.toEmployeeId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.firstName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-white/20 shadow-md cursor-pointer group-hover:ring-emerald-400 transition-all"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
                onClick={() => setShowAvatarModal(true)}
              />
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-semibold cursor-pointer"
                title="Cambiar Foto"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                Cambiar
              </button>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full ring-2 ring-white shadow-xs transition-colors"
                title="Cambiar Foto de Perfil"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  ¡Hola, {currentUser.firstName}!
                </h1>
                <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded text-teal-100">
                  {currentUser.code}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-emerald-200 hover:text-white transition-colors ml-2"
                >
                  <Camera className="w-3 h-3" />
                  Cambiar Foto
                </button>
              </div>
              <p className="text-xs sm:text-sm text-teal-100 mt-1 font-medium">
                {currentUser.jobTitle} · <span className="text-white/80">{currentUser.department}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70 mt-2">
                <span>Vinculación: {currentUser.hireDate}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.contractType}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300 font-semibold">{currentUser.status}</span>
              </div>
            </div>
          </div>

          {/* Quick Certificate Generator Button */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-emerald-950 text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              Generar Certificado Laboral
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('accounting')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors border border-emerald-600"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Mis Correrías & Viáticos
              </button>
              <button
                onClick={() => setActiveTab('timeoff')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors border border-emerald-600"
              >
                <Calendar className="w-3.5 h-3.5" />
                Vacaciones
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Self-Service Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Vacations Card */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Mis Días de Vacaciones</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-teal-900 font-mono tabular-nums">
              {currentUser.vacationDaysAvailable}
            </span>
            <span className="text-xs text-slate-500 font-medium">días disponibles</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Disfrutados: <strong className="text-slate-700">{currentUser.vacationDaysTaken} días</strong></span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('timeoff')}
              className="text-teal-600 font-semibold hover:underline"
            >
              Solicitar
            </button>
          </div>
        </div>

        {/* Salary Card */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Mi Salario Básico Mensual</span>
            <CreditCard className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatCurrency(currentUser.baseSalary)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Pago en: <strong className="text-slate-700">{currentUser.bankName}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Cuenta de nómina activa</span>
          </div>
        </div>

        {/* Social Security */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Seguridad Social Activa</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <p className="text-slate-800">
              <span className="text-slate-400 font-medium">EPS:</span> <strong>{currentUser.healthProvider}</strong>
            </p>
            <p className="text-slate-800">
              <span className="text-slate-400 font-medium">AFP:</span> <strong>{currentUser.pensionProvider}</strong>
            </p>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Planillas PILA al día
          </div>
        </div>
      </div>

      {/* Main Self-Service Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Recibos de Nómina */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Mis Recibos de Pago (Colillas)</h3>
            </div>
            <span className="text-xs text-slate-500">
              {myPayslips.length} comprobantes disponibles
            </span>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {myPayslips.map((slip) => (
              <div key={slip.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-900">Septiembre 2026 - Mensual</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Neto: <span className="font-mono font-bold text-emerald-700">{formatCurrency(slip.netPay)}</span> · {slip.paymentDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayslip(slip)}
                  className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Descargar Recibo
                </button>
              </div>
            ))}

            {myPayslips.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">
                Aún no tienes comprobantes de nómina emitidos para este ciclo.
              </p>
            )}
          </div>
        </div>

        {/* Mis Solicitudes de Vacaciones Recientes */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Estado de Mis Solicitudes</h3>
            </div>
            <button
              onClick={() => setActiveTab('timeoff')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800"
            >
              Nueva Solicitud
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {myRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-900">{req.type}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {req.startDate} al {req.endDate} · {req.totalDays} {req.totalDays === 1 ? 'día' : 'días'}
                  </p>
                  {req.reviewerNotes && (
                    <p className="text-[11px] text-slate-600 italic mt-0.5">
                      "{req.reviewerNotes}"
                    </p>
                  )}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  req.status === 'Aprobado'
                    ? 'bg-emerald-50 text-emerald-700'
                    : req.status === 'Pendiente'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}

            {myRequests.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">
                No tienes solicitudes de tiempo libre registradas.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mis Reconocimientos Recibidos ("Puntos EP") */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Reconocimientos de Compañeros en Mi Ficha</h3>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
          >
            Dar un reconocimiento en el muro
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {myRecognitions.map((rec) => (
            <div key={rec.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                  {rec.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{rec.date}</span>
              </div>
              <p className="text-xs text-slate-700 italic mt-2 leading-relaxed">
                "{rec.message}"
              </p>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/60">
                <img
                  src={rec.fromEmployeeAvatar}
                  alt={rec.fromEmployeeName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-[11px] font-semibold text-slate-700">
                  {rec.fromEmployeeName}
                </span>
              </div>
            </div>
          ))}

          {myRecognitions.length === 0 && (
            <div className="col-span-full py-6 text-center text-xs text-slate-400">
              Aún no has recibido reconocimientos en este ciclo. ¡Sigue dando lo mejor de ti!
            </div>
          )}
        </div>
      </div>

      {/* Labor Certificate Modal */}
      {showCertificateModal && (
        <LaborCertificateModal
          employee={currentUser}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
      {/* Change Avatar Modal */}
      <ChangeAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatarUrl={currentUser.avatar}
        userName={`${currentUser.firstName} ${currentUser.lastName}`}
      />
    </div>
  );
};
