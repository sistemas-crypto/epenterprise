import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Employee, ContractType, EmployeeStatus } from '../../types/hr';
import {
  X,
  User,
  Briefcase,
  Shield,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  Building,
  CheckCircle,
  FileText,
  Edit2,
  Save,
  Clock,
  Camera,
  Trash2
} from 'lucide-react';
import { ChangeAvatarModal } from '../common/ChangeAvatarModal';

interface EmployeeDetailModalProps {
  employee: Employee;
  onClose: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, onClose }) => {
  const {
    formatCurrency,
    updateEmployee,
    deleteEmployee,
    currentRole,
    timeOffRequests,
    payslips,
    setSelectedPayslip,
    setActiveTab,
  } = useHR();

  const [activeTab, setActiveModalTab] = useState<'info' | 'contract' | 'security' | 'vacations' | 'payroll'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Form edit state
  const [phone, setPhone] = useState(employee.phone);
  const [jobTitle, setJobTitle] = useState(employee.jobTitle);
  const [department, setDepartment] = useState(employee.department);
  const [baseSalary, setBaseSalary] = useState(employee.baseSalary);
  const [status, setStatus] = useState<EmployeeStatus>(employee.status);
  const [contractType, setContractType] = useState<ContractType>(employee.contractType);

  const employeePayslips = payslips.filter((p) => p.employeeId === employee.id);
  const employeeRequests = timeOffRequests.filter((r) => r.employeeId === employee.id);

  const handleSave = () => {
    updateEmployee(employee.id, {
      phone,
      jobTitle,
      department,
      baseSalary: Number(baseSalary),
      status,
      contractType,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Banner */}
        <div className="relative p-6 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={employee.avatar}
                alt={employee.firstName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20 shadow-md cursor-pointer group-hover:ring-emerald-400 transition-all"
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
                title="Cambiar foto de este trabajador"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                Foto
              </button>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full ring-2 ring-white shadow-xs transition-colors"
                title="Cambiar Foto"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {employee.firstName} {employee.lastName}
                </h2>
                <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded text-teal-200">
                  {employee.code}
                </span>
                {currentRole === 'admin_hr' && (
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded text-teal-100 hover:text-white transition-colors ml-1"
                  >
                    <Camera className="w-3 h-3" />
                    Cambiar Foto
                  </button>
                )}
              </div>
              <p className="text-xs text-teal-100 mt-0.5">
                {employee.jobTitle} · <span className="text-white/80">{employee.department}</span>
              </p>
              <div className="flex items-center gap-3 text-xs text-white/70 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {employee.email}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {employee.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentRole === 'admin_hr' && (
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
              >
                {isEditing ? (
                  <>
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar Ficha
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50/70 text-xs font-medium">
          <button
            onClick={() => setActiveModalTab('info')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-teal-600 text-teal-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveModalTab('contract')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'contract'
                ? 'border-teal-600 text-teal-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contrato & Salario
          </button>
          <button
            onClick={() => setActiveModalTab('security')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-teal-600 text-teal-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Seguridad Social
          </button>
          <button
            onClick={() => setActiveModalTab('vacations')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'vacations'
                ? 'border-teal-600 text-teal-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Vacaciones ({employee.vacationDaysAvailable}d)
          </button>
          <button
            onClick={() => setActiveModalTab('payroll')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'payroll'
                ? 'border-teal-600 text-teal-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Recibos de Nómina ({employeePayslips.length})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: General Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium">Documento de Identidad</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {employee.documentType} {employee.documentNumber}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium">Fecha de Nacimiento</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1 font-mono tabular-nums">
                    {employee.birthDate}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium">Estado del Trabajador</span>
                  {isEditing ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                      className="mt-1 w-full bg-white border border-teal-500 rounded p-1 font-semibold text-xs text-slate-800"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Vacaciones">En Vacaciones</option>
                      <option value="Licencia">Licencia / Incapacidad</option>
                      <option value="Inactivo">Inactivo / Retirado</option>
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-emerald-700 mt-1">
                      {employee.status}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Contacto de Emergencia</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400">Nombre Completo</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{employee.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Parentesco</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{employee.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Teléfono</span>
                    <p className="font-semibold text-slate-800 mt-0.5 font-mono">{employee.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-teal-900">Edición Rápida de Datos</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">Teléfono Móvil</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">Cargo Oficial</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Contract & Salary */}
          {activeTab === 'contract' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-slate-400 font-medium">Salario Base Mensual</span>
                  {isEditing ? (
                    <div>
                      <input
                        type="number"
                        value={baseSalary}
                        onChange={(e) => setBaseSalary(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-teal-500 rounded-lg text-sm font-bold"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Equivale a {formatCurrency(Number(baseSalary))}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(employee.baseSalary)}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Sujeto a deducciones de ley (Salud 4%, Pensión 4%)
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-slate-400 font-medium">Modalidad Contractual</span>
                  {isEditing ? (
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value as ContractType)}
                      className="w-full px-2.5 py-1.5 bg-white border border-teal-500 rounded-lg text-xs font-semibold"
                    >
                      <option value="Término Indefinido">Término Indefinido</option>
                      <option value="Término Fijo">Término Fijo</option>
                      <option value="Obra o Labor">Obra o Labor</option>
                      <option value="Prestación de Servicios">Prestación de Servicios</option>
                      <option value="Aprendizaje">Aprendizaje SENA</option>
                    </select>
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{employee.contractType}</p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Fecha de ingreso: <span className="font-mono tabular-nums font-semibold">{employee.hireDate}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 mb-3">Datos Bancarios para Dispersión</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Entidad Bancaria</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{employee.bankName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Número de Cuenta</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 font-mono tabular-nums">
                      {employee.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Social Security */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 font-medium">Entidad Promotora de Salud (EPS)</span>
                  <p className="text-sm font-bold text-teal-900 mt-1">{employee.healthProvider}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Aporte trabajador: 4% · Empleador: 8.5%</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 font-medium">Fondo de Pensiones (AFP)</span>
                  <p className="text-sm font-bold text-teal-900 mt-1">{employee.pensionProvider}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Aporte trabajador: 4% · Empleador: 12%</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 font-medium">Riesgos Laborales (ARL)</span>
                  <p className="text-sm font-bold text-teal-900 mt-1">{employee.arlProvider}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Cobertura 100% asumida por empleador</p>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Caja de Compensación Familiar</h4>
                <p className="text-xs text-slate-600">
                  Afiliado a Compensar Caja de Compensación · Acceso a subsidio familiar, recreación y convenios de vivienda.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Vacations */}
          {activeTab === 'vacations' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center">
                  <span className="text-xs text-teal-800 font-medium">Días Hábiles Disponibles</span>
                  <p className="text-3xl font-bold text-teal-900 font-mono mt-1">
                    {employee.vacationDaysAvailable}
                  </p>
                  <p className="text-[11px] text-teal-700 mt-1">Acumulados por ley (15 días/año)</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs text-slate-500 font-medium">Días Ya Disfrutados</span>
                  <p className="text-3xl font-bold text-slate-700 font-mono mt-1">
                    {employee.vacationDaysTaken}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Aprobados históricamente</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Historial de Solicitudes</h4>
                {employeeRequests.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No tiene solicitudes registradas.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {employeeRequests.map((req) => (
                      <div key={req.id} className="p-3 flex items-center justify-between bg-white text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{req.type}</p>
                          <p className="text-slate-500 text-[11px]">
                            {req.startDate} al {req.endDate} · {req.totalDays} {req.totalDays === 1 ? 'día' : 'días'}
                          </p>
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          req.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Payslips History */}
          {activeTab === 'payroll' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Liquidaciones Generadas</h4>
              {employeePayslips.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No se han generado recibos para este periodo.</p>
              ) : (
                <div className="space-y-2">
                  {employeePayslips.map((slip) => (
                    <div
                      key={slip.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-teal-400 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">Septiembre 2026 - Mensual</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Total Devengado: {formatCurrency(slip.totalEarnings)} · Neto: {formatCurrency(slip.netPay)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPayslip(slip);
                            onClose();
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Ver Comprobante
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentRole === 'admin_hr' && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`¿Confirmas eliminar el registro del trabajador ${employee.firstName} ${employee.lastName}? Esta acción no se puede deshacer.`)) {
                    deleteEmployee(employee.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                title="Eliminar este trabajador del sistema"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Eliminar Trabajador
              </button>
            )}
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Expediente digital protegido bajo estándares EP Enterprise · Essential Pharma
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Change Avatar Modal for this employee */}
      <ChangeAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatarUrl={employee.avatar}
        userName={`${employee.firstName} ${employee.lastName}`}
        onSave={(newAvatar) => {
          updateEmployee(employee.id, { avatar: newAvatar });
        }}
      />
    </div>
  );
};
