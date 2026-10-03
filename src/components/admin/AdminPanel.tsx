import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { AppAccountUser, UserRole, UserPermissions } from '../../types/hr';
import {
  ShieldAlert,
  Users,
  UserPlus,
  Key,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building,
  DollarSign,
  CloudCheck,
  FileSpreadsheet,
  Calendar,
  Layers,
  ShieldCheck,
  History,
  X,
  RefreshCw
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    appUsers,
    addAppUser,
    updateAppUser,
    deleteAppUser,
    securityCriteria,
    updateSecurityCriteria,
    auditLogs,
    employees,
    formatCurrency,
    currentRole,
    currentUser,
    showToast,
  } = useHR();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'policies' | 'audit'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('employee');
  const [formRoleName, setFormRoleName] = useState('Asesor Comercial / Trabajador');
  const [formDepartment, setFormDepartment] = useState('Comercial y Ventas');
  const [formStatus, setFormStatus] = useState<'Activo' | 'Suspendido' | 'Inactivo'>('Activo');
  const [formLinkedEmpId, setFormLinkedEmpId] = useState('');
  const [formMaxAdvance, setFormMaxAdvance] = useState(4000000);
  const [formTwoFactor, setFormTwoFactor] = useState(false);
  const [formTempPassword, setFormTempPassword] = useState('EP-Temp2026!');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Permissions state
  const [formPermissions, setFormPermissions] = useState<UserPermissions>({
    canApproveCorrerias: false,
    canDisburseAdvances: false,
    canLegalizeExpenses: true,
    canApproveLegalizations: false,
    canSyncSiigoNube: false,
    canManagePayroll: false,
    canManageEmployees: false,
    canManageTimeOff: false,
    canManageAdminUsers: false,
  });

  // Local policies edit state
  const [highAdvanceThreshold, setHighAdvanceThreshold] = useState(securityCriteria.highAdvanceThreshold);
  const [maxDailyLodging, setMaxDailyLodging] = useState(securityCriteria.maxDailyExpenseLodging);
  const [maxDailyFood, setMaxDailyFood] = useState(securityCriteria.maxDailyExpenseFood);
  const [requireTwoFactor, setRequireTwoFactor] = useState(securityCriteria.requireTwoFactorForHighAdvances);
  const [autoSyncSiigo, setAutoSyncSiigo] = useState(securityCriteria.autoSyncSiigoOnApproval);
  const [allowSelfApproval, setAllowSelfApproval] = useState(securityCriteria.allowSelfApproval);

  // Filtered users
  const filteredUsers = appUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roleName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingUserId(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('employee');
    setFormRoleName('Asesor Comercial / Trabajador');
    setFormDepartment('Comercial y Ventas');
    setFormStatus('Activo');
    setFormLinkedEmpId('');
    setFormMaxAdvance(4000000);
    setFormTwoFactor(false);
    setFormTempPassword(`EP-${Math.floor(1000 + Math.random() * 9000)}!`);
    setFormPermissions({
      canApproveCorrerias: false,
      canDisburseAdvances: false,
      canLegalizeExpenses: true,
      canApproveLegalizations: false,
      canSyncSiigoNube: false,
      canManagePayroll: false,
      canManageEmployees: false,
      canManageTimeOff: false,
      canManageAdminUsers: false,
    });
    setShowUserModal(true);
  };

  const openEditModal = (user: AppAccountUser) => {
    setEditingUserId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone || '');
    setFormRole(user.role);
    setFormRoleName(user.roleName);
    setFormDepartment(user.department);
    setFormStatus(user.status);
    setFormLinkedEmpId(user.linkedEmployeeId || '');
    setFormMaxAdvance(user.maxAdvanceLimit || 4000000);
    setFormTwoFactor(user.twoFactorEnabled);
    setFormTempPassword(user.temporaryPassword || 'EP-Security2026!');
    setFormPermissions(user.permissions);
    setShowUserModal(true);
  };

  const handleRoleSelectChange = (newRole: UserRole) => {
    setFormRole(newRole);
    if (newRole === 'admin_hr') {
      setFormRoleName('Dirección General / Contabilidad');
      setFormPermissions({
        canApproveCorrerias: true,
        canDisburseAdvances: true,
        canLegalizeExpenses: true,
        canApproveLegalizations: true,
        canSyncSiigoNube: true,
        canManagePayroll: true,
        canManageEmployees: true,
        canManageTimeOff: true,
        canManageAdminUsers: true,
      });
    } else if (newRole === 'team_lead') {
      setFormRoleName('Dirección de Proyecto / Jefatura');
      setFormPermissions({
        canApproveCorrerias: true,
        canDisburseAdvances: false,
        canLegalizeExpenses: true,
        canApproveLegalizations: false,
        canSyncSiigoNube: false,
        canManagePayroll: false,
        canManageEmployees: false,
        canManageTimeOff: true,
        canManageAdminUsers: false,
      });
    } else {
      setFormRoleName('Asesor Comercial / Trabajador');
      setFormPermissions({
        canApproveCorrerias: false,
        canDisburseAdvances: false,
        canLegalizeExpenses: true,
        canApproveLegalizations: false,
        canSyncSiigoNube: false,
        canManagePayroll: false,
        canManageEmployees: false,
        canManageTimeOff: false,
        canManageAdminUsers: false,
      });
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('error', 'Campos Incompletos', 'Ingresa al menos el nombre y correo corporativo.');
      return;
    }

    if (editingUserId) {
      updateAppUser(editingUserId, {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        roleName: formRoleName,
        department: formDepartment,
        status: formStatus,
        linkedEmployeeId: formLinkedEmpId || undefined,
        maxAdvanceLimit: formMaxAdvance,
        twoFactorEnabled: formTwoFactor,
        temporaryPassword: formTempPassword,
        permissions: formPermissions,
      });
    } else {
      addAppUser({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        roleName: formRoleName,
        department: formDepartment,
        status: formStatus,
        linkedEmployeeId: formLinkedEmpId || undefined,
        maxAdvanceLimit: formMaxAdvance,
        twoFactorEnabled: formTwoFactor,
        temporaryPassword: formTempPassword,
        permissions: formPermissions,
      });
    }
    setShowUserModal(false);
  };

  const handleCopyPassword = (pwd: string, id: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
    showToast('info', 'Contraseña Copiada', 'Clave temporal copiada al portapapeles.');
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecurityCriteria({
      highAdvanceThreshold: Number(highAdvanceThreshold),
      maxDailyExpenseLodging: Number(maxDailyLodging),
      maxDailyExpenseFood: Number(maxDailyFood),
      requireTwoFactorForHighAdvances: requireTwoFactor,
      autoSyncSiigoOnApproval: autoSyncSiigo,
      allowSelfApproval: allowSelfApproval,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Panel de Administración & Seguridad
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de usuarios del sistema, asignación de roles corporativos, criterios de viáticos y auditoría de EP Enterprise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Crear Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'users'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuarios & Permisos ({appUsers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'roles'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Matriz de Roles & Criterios
        </button>
        <button
          onClick={() => setActiveSubTab('policies')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'policies'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Políticas de Viáticos & Seguridad
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'audit'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Registro de Auditoría ({auditLogs.length})
        </button>
      </div>

      {/* SUB-TAB 1: USUARIOS & PERMISOS */}
      {activeSubTab === 'users' && (
        <div className="space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Usuarios Registrados</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{appUsers.length}</p>
              <span className="text-[11px] text-emerald-600 font-medium">100% corporativos Essential Pharma</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Usuarios Activos</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {appUsers.filter((u) => u.status === 'Activo').length}
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Habilitados para operar</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Dirección & Contabilidad</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {appUsers.filter((u) => u.role === 'admin_hr' || u.role === 'team_lead').length}
              </p>
              <span className="text-[11px] text-teal-700 font-medium">Con autorización de anticipos</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Asesores Comerciales</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {appUsers.filter((u) => u.role === 'employee').length}
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Radicadores de correrías</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar usuario por nombre, correo, cargo o departamento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-700"
              >
                <option value="ALL">Todos los Roles</option>
                <option value="admin_hr">Dirección / Contabilidad</option>
                <option value="team_lead">Dirección de Proyecto</option>
                <option value="employee">Asesor / Trabajador</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-700"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="Activo">Activos</option>
                <option value="Suspendido">Suspendidos</option>
                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Usuario & Credenciales</th>
                    <th className="py-3 px-4">Rol & Departamento</th>
                    <th className="py-3 px-4">Criterios & Permisos Clave</th>
                    <th className="py-3 px-4 text-right">Límite Viático</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No se encontraron usuarios con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-300">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {user.phone && (
                                  <span className="text-[10px] text-slate-400">{user.phone}</span>
                                )}
                                {user.twoFactorEnabled && (
                                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                                    2FA Activo
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${
                                user.role === 'admin_hr'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : user.role === 'team_lead'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              {user.roleName}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              {user.department}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.canApproveCorrerias && (
                              <span className="text-[9px] bg-blue-100/70 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                                Autoriza Anticipos
                              </span>
                            )}
                            {user.permissions.canDisburseAdvances && (
                              <span className="text-[9px] bg-teal-100/70 text-teal-800 font-semibold px-1.5 py-0.5 rounded">
                                Tesorería
                              </span>
                            )}
                            {user.permissions.canLegalizeExpenses && (
                              <span className="text-[9px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                                Radica Gastos
                              </span>
                            )}
                            {user.permissions.canApproveLegalizations && (
                              <span className="text-[9px] bg-emerald-100/70 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                                Aprueba Egresos
                              </span>
                            )}
                            {user.permissions.canSyncSiigoNube && (
                              <span className="text-[9px] bg-teal-800 text-white font-semibold px-1.5 py-0.5 rounded">
                                Siigo Nube API
                              </span>
                            )}
                            {user.permissions.canManagePayroll && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                                Nómina
                              </span>
                            )}
                            {user.permissions.canManageAdminUsers && (
                              <span className="text-[9px] bg-rose-100 text-rose-800 font-semibold px-1.5 py-0.5 rounded">
                                Super Admin
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                          {user.maxAdvanceLimit ? formatCurrency(user.maxAdvanceLimit) : 'Sin límite'}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              user.status === 'Activo'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : user.status === 'Suspendido'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.status === 'Activo'
                                  ? 'bg-emerald-500'
                                  : user.status === 'Suspendido'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyPassword(user.temporaryPassword || 'EP-2026!', user.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Copiar contraseña temporal"
                            >
                              {copiedKey === user.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Key className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Editar usuario y criterios"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {user.id !== 'user-001' && (
                              <button
                                onClick={() => deleteAppUser(user.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MATRIZ DE ROLES & CRITERIOS */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dirección General & Contabilidad */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dirección General & Contabilidad</h3>
                  <span className="text-[10px] font-mono text-purple-700 font-semibold">Rol: admin_hr</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Control contable, tesorería, nómina y sincronización con Siigo Nube API.
              </p>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Criterios Habilitados:</p>
                <div className="space-y-1.5 text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Aprobar y pagar nómina mensual
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Desembolsar anticipos autorizados
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Aprobar egresos y liquidación contable
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Causar comprobantes en Siigo Nube API
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Crear y configurar usuarios y roles
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Dirección de Proyecto */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dirección de Proyecto / Jefatura</h3>
                  <span className="text-[10px] font-mono text-blue-700 font-semibold">Rol: team_lead</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Supervisión de planes de trabajo y autorización de presupuestos de viaje para asesores.
              </p>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Criterios Habilitados:</p>
                <div className="space-y-1.5 text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Autorizar presupuestos de correrías
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Aprobar anticipos a solicitar a tesorería
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Autorizar permisos y licencias de equipo
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    Sin acceso a dispersión de nómina
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    Sin acceso a emisión de comprobantes Siigo
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Asesor Comercial / Trabajador */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Asesor Comercial / Trabajador</h3>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">Rol: employee</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ejecución comercial en campo, radicación de planeador y legalización de gastos.
              </p>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Criterios Habilitados:</p>
                <div className="space-y-1.5 text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Crear y enviar planeador de correría
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Radicar facturas con NIT y concepto
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Solicitar liquidación final de egresos
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Portal de autoservicio y desprendibles
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    Sin auto-aprobación de anticipos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: POLÍTICAS DE VIÁTICOS & SEGURIDAD */}
      {activeSubTab === 'policies' && (
        <div className="max-w-3xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Criterios y Parámetros de Control para Correrías
            </h3>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Monto Umbral para Doble Autorización (COP)
                </label>
                <input
                  type="number"
                  step="100000"
                  value={highAdvanceThreshold}
                  onChange={(e) => setHighAdvanceThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Anticipos por encima de este valor requerirán validación obligatoria de Dirección General.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Tope Diario Sugerido de Hospedaje (COP)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={maxDailyLodging}
                  onChange={(e) => setMaxDailyLodging(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Límite máximo por noche para asesores en ciudades capitales.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Tope Diario de Alimentación (COP)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={maxDailyFood}
                  onChange={(e) => setMaxDailyFood(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Desayuno, almuerzo y cena en correrías comerciales.
                </p>
              </div>

              <div className="flex flex-col justify-center space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncSiigo}
                    onChange={(e) => setAutoSyncSiigo(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Sincronización Automática con Siigo Nube API
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6">
                  Genera el comprobante contable en la nube inmediatamente tras la aprobación contable.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs"
              >
                Guardar Criterios & Políticas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: REGISTRO DE AUDITORÍA */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">Registro de Eventos y Auditoría</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Últimas {auditLogs.length} acciones registradas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Usuario Responsable</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Acción Realizada</th>
                  <th className="py-3 px-4">Detalle / Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{log.actorName}</p>
                      <p className="text-[10px] text-slate-400">{log.actorRole}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          log.category === 'Seguridad'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : log.category === 'Contabilidad'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : log.category === 'Nómina'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">
                  {editingUserId ? 'Editar Usuario & Criterios' : 'Crear Nuevo Usuario del Sistema'}
                </h3>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 text-white/70 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Dr. Mauricio Pardo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Correo Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="usuario@essentialpharma.com.co"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+57 310..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rol en el Sistema *</label>
                  <select
                    value={formRole}
                    onChange={(e) => handleRoleSelectChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium"
                  >
                    <option value="admin_hr">Dirección / Contabilidad</option>
                    <option value="team_lead">Dirección de Proyecto</option>
                    <option value="employee">Asesor Comercial / Trabajador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Departamento</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Comercial y Ventas">Comercial y Ventas</option>
                    <option value="Operaciones y Producción">Operaciones y Producción</option>
                    <option value="Finanzas y Contabilidad">Finanzas y Contabilidad</option>
                    <option value="Talento Humano">Talento Humano</option>
                    <option value="Tecnología e Infraestructura">Tecnología e Infraestructura</option>
                    <option value="Calidad y Regulatorio">Calidad y Regulatorio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vincular con Trabajador</label>
                  <select
                    value={formLinkedEmpId}
                    onChange={(e) => setFormLinkedEmpId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">(Sin vincular)</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Límite Anticipo (COP)</label>
                  <input
                    type="number"
                    step="500000"
                    value={formMaxAdvance}
                    onChange={(e) => setFormMaxAdvance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estado de Acceso</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Activo">Activo (Habilitado)</option>
                    <option value="Suspendido">Suspendido (Temporal)</option>
                    <option value="Inactivo">Inactivo (Bloqueado)</option>
                  </select>
                </div>
              </div>

              {/* Temporary password preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-600">Contraseña Provisional de Acceso:</span>
                  <p className="font-mono text-xs font-bold text-emerald-800">{formTempPassword}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormTempPassword(`EP-${Math.floor(1000 + Math.random() * 9000)}!`)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerar
                </button>
              </div>

              {/* Criterios y Permisos Checkboxes */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Criterios y Permisos Específicos
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canApproveCorrerias}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canApproveCorrerias: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Autorizar anticipos de correría</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canDisburseAdvances}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canDisburseAdvances: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Desembolsar anticipos (Tesorería)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canLegalizeExpenses}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canLegalizeExpenses: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Radicar facturas de egresos</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canApproveLegalizations}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canApproveLegalizations: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Aprobar liquidación contable</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canSyncSiigoNube}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canSyncSiigoNube: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Sincronizar con Siigo Nube API</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canManagePayroll}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canManagePayroll: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Gestionar y pagar nómina</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canManageEmployees}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canManageEmployees: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700">Crear y editar trabajadores</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPermissions.canManageAdminUsers}
                      onChange={(e) =>
                        setFormPermissions({ ...formPermissions, canManageAdminUsers: e.target.checked })
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-slate-700 font-bold text-rose-700">Administrador de usuarios</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs"
                >
                  {editingUserId ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
