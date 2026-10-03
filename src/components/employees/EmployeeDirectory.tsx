import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Employee, ContractType, EmployeeStatus } from '../../types/hr';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  GitFork,
  Mail,
  Phone,
  Building2,
  Calendar,
  CreditCard,
  X,
  UserPlus,
  Trash2,
  Camera
} from 'lucide-react';
import { OrgChart } from './OrgChart';
import { EmployeeDetailModal } from './EmployeeDetailModal';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    addEmployee,
    deleteEmployee,
    clearAllMockEmployees,
    selectedEmployee,
    setSelectedEmployee,
    formatCurrency,
    currentRole,
  } = useHR();

  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'orgchart'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new employee
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Talento Humano');
  const [baseSalary, setBaseSalary] = useState(4500000);
  const [contractType, setContractType] = useState<ContractType>('Término Indefinido');
  const [healthProvider, setHealthProvider] = useState('Sura EPS');
  const [pensionProvider, setPensionProvider] = useState('Protección AFP');
  const [bankName, setBankName] = useState('Bancolombia');
  const [accountNumber, setAccountNumber] = useState('');

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const filteredEmployees = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      e.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || e.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !jobTitle) return;

    addEmployee({
      firstName,
      lastName,
      email,
      phone: phone || '+57 300 000 0000',
      documentType: 'CC',
      documentNumber: documentNumber || '1.020.999.888',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      jobTitle,
      department,
      hireDate: '2026-09-30',
      birthDate: '1995-06-15',
      status: 'Activo',
      contractType,
      baseSalary: Number(baseSalary),
      bankName,
      accountNumber: accountNumber || '123-456789-01',
      healthProvider,
      pensionProvider,
      arlProvider: 'Seguros Bolívar (Riesgo I)',
      emergencyContact: {
        name: 'Contacto Primario',
        relationship: 'Familiar',
        phone: phone || '+57 300 000 0000',
      },
    });

    setShowAddModal(false);
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDocumentNumber('');
    setJobTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Directorio de Trabajadores
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión centralizada de expedientes, contratos, remuneraciones y organigrama.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Segmented Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista tabular"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('orgchart')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'orgchart'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Organigrama interactivo"
            >
              <GitFork className="w-4 h-4" />
            </button>
          </div>

          {currentRole === 'admin_hr' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Nuevo Trabajador
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar (Only shown in cards & table views) */}
      {viewMode !== 'orgchart' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, código, cargo o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              aria-label="Filtrar por departamento"
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700"
            >
              <option value="ALL">Todos los departamentos</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar por estado del trabajador"
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700"
            >
              <option value="ALL">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Vacaciones">En Vacaciones</option>
              <option value="Licencia">Licencia</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      )}

      {/* VIEW 1: Cards Grid */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={emp.avatar}
                    alt={emp.firstName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-teal-500 transition-all shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    emp.status === 'Activo'
                      ? 'bg-emerald-50 text-emerald-700'
                      : emp.status === 'Vacaciones'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {emp.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p className="text-xs text-teal-700 font-medium truncate mt-0.5">
                    {emp.jobTitle}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {emp.department}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono tabular-nums">{emp.code}</span>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-semibold group-hover:underline">Ver Expediente</span>
                  {currentRole === 'admin_hr' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Deseas eliminar al empleado ${emp.firstName} ${emp.lastName}?`)) {
                          deleteEmployee(emp.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Eliminar este trabajador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-12 px-6 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {employees.length === 0
                  ? 'Directorio en 0 — Listo para registrar personal'
                  : 'No se encontraron trabajadores con los filtros actuales'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {employees.length === 0
                  ? 'El directorio está vacío. Puedes comenzar a registrar a los colaboradores de Essential Pharma haciendo clic en el botón a continuación.'
                  : 'Prueba cambiando los filtros de búsqueda o departamento.'}
              </p>
              {employees.length === 0 && currentRole === 'admin_hr' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  + Registrar Primer Trabajador
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Tabular List */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Trabajador</th>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Cargo / Área</th>
                  <th className="py-3 px-4">Contrato</th>
                  <th className="py-3 px-4">Salario Base</th>
                  <th className="py-3 px-4">Vacaciones</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.firstName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {emp.code}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{emp.jobTitle}</p>
                      <p className="text-[11px] text-slate-400">{emp.department}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{emp.contractType}</td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                      {formatCurrency(emp.baseSalary)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono tabular-nums font-medium text-teal-800">
                        {emp.vacationDaysAvailable} días
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        emp.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700'
                          : emp.status === 'Vacaciones'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(emp);
                          }}
                          className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                        >
                          Ver Ficha
                        </button>
                        {currentRole === 'admin_hr' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`¿Deseas eliminar al empleado ${emp.firstName} ${emp.lastName}?`)) {
                                deleteEmployee(emp.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Eliminar este trabajador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 px-6 text-center text-slate-500">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700">
                        {employees.length === 0
                          ? 'Directorio en 0 — Listo para registrar personal'
                          : 'No se encontraron trabajadores con los filtros seleccionados'}
                      </p>
                      {employees.length === 0 && currentRole === 'admin_hr' && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Registrar Trabajador
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Organigrama */}
      {viewMode === 'orgchart' && <OrgChart />}

      {/* Selected Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">Registrar Nuevo Trabajador</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ej. Juan Carlos"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ej. Pérez Salazar"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Institucional *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan.perez@essentialpharma.com.co"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teléfono Móvil</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 310 123 4567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ej. Analista de Calidad"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departamento</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Talento Humano">Talento Humano</option>
                    <option value="Investigación y Desarrollo">Investigación y Desarrollo</option>
                    <option value="Control de Calidad">Control de Calidad</option>
                    <option value="Producción">Producción</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Asuntos Regulatorios">Asuntos Regulatorios</option>
                    <option value="Ventas y Comercial">Ventas y Comercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salario Base Mensual</label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipo de Contrato</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as ContractType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Término Indefinido">Término Indefinido</option>
                    <option value="Término Fijo">Término Fijo</option>
                    <option value="Obra o Labor">Obra o Labor</option>
                    <option value="Prestación de Servicios">Prestación de Servicios</option>
                    <option value="Aprendizaje">Aprendizaje SENA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">EPS</label>
                  <input
                    type="text"
                    value={healthProvider}
                    onChange={(e) => setHealthProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">AFP</label>
                  <input
                    type="text"
                    value={pensionProvider}
                    onChange={(e) => setPensionProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Banco</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Registrar Trabajador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
