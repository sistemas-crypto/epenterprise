import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { 
  Building2, 
  Bell, 
  Search, 
  Clock, 
  DollarSign, 
  UserCheck, 
  ShieldCheck, 
  Users,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  ShieldAlert,
  Camera,
  LogOut
} from 'lucide-react';
import { UserRole, Currency } from '../../types/hr';
import { EPLogo } from '../common/EPLogo';
import { ChangeAvatarModal } from '../common/ChangeAvatarModal';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    companyName,
    setCompanyName,
    currency,
    setCurrency,
    isClockedIn,
    clockIn,
    clockOut,
    timeOffRequests,
    correrias,
    setActiveTab,
    resetAllData,
    logout,
  } = useHR();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [tempCompanyName, setTempCompanyName] = useState(companyName);

  const pendingRequestsCount = timeOffRequests.filter((r) => r.status === 'Pendiente').length;
  const pendingCorreriasCount = correrias.filter((c) => c.status === 'Enviado a Dirección').length;
  const totalNotifications = pendingRequestsCount + pendingCorreriasCount;

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: React.ReactNode }> = {
    admin_hr: {
      title: 'Dirección General / Contabilidad',
      subtitle: 'Acceso total Talento, Nómina y Viáticos',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />,
    },
    team_lead: {
      title: 'Dirección de Proyecto / Jefatura',
      subtitle: 'Autoriza anticipos de correría y permisos',
      icon: <UserCheck className="w-4 h-4 text-teal-700" />,
    },
    employee: {
      title: 'Trabajador / Asesor Comercial',
      subtitle: 'Mi portal, viáticos y correrías',
      icon: <Users className="w-4 h-4 text-lime-700" />,
    },
  };

  const handleSaveCompany = () => {
    if (tempCompanyName.trim()) {
      setCompanyName(tempCompanyName.trim());
    }
    setIsEditingCompany(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Official EP ENTERPRISE Logo & Company Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          aria-label="Abrir menú"
        >
          <div className="w-5 h-0.5 bg-slate-600 mb-1.5 rounded"></div>
          <div className="w-5 h-0.5 bg-slate-600 mb-1.5 rounded"></div>
          <div className="w-5 h-0.5 bg-slate-600 rounded"></div>
        </button>
        <div className="flex items-center gap-3">
          <EPLogo size="sm" showSubtitle={true} />
          
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
            {isEditingCompany ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempCompanyName}
                  onChange={(e) => setTempCompanyName(e.target.value)}
                  className="px-2 py-0.5 text-xs font-medium border border-emerald-600 rounded outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCompany()}
                  onBlur={handleSaveCompany}
                />
                <button
                  onClick={handleSaveCompany}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingCompany(true)}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors flex items-center gap-1 max-w-[200px] truncate"
                title="Clic para cambiar nombre de la empresa"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{companyName}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zone 2: Search shortcut & quick attendance status */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar trabajador, nómina, correría o viáticos..."
            onClick={() => setActiveTab('employees')}
            className="w-72 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-700 placeholder-slate-400 transition-all cursor-pointer"
            readOnly
          />
        </div>

        {/* Quick Attendance Pill Button */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
          <Clock className={`w-3.5 h-3.5 ${isClockedIn ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="text-xs font-medium text-slate-600">
            {isClockedIn ? 'En turno activo' : 'Turno cerrado'}
          </span>
          <button
            onClick={isClockedIn ? clockOut : () => clockIn('Sede Principal')}
            className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
              isClockedIn
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isClockedIn ? 'Marcar Salida' : 'Marcar Entrada'}
          </button>
        </div>
      </div>

      {/* Zone 3: Primary Actions, Currency, Role Switcher & Profile */}
      <div className="flex items-center gap-3">
        {/* Admin Panel Quick Shortcut */}
        <button
          onClick={() => setActiveTab('admin')}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          title="Panel de Administración y Creación de Usuarios"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
          <span>Panel Admin</span>
        </button>

        {/* Currency Switcher */}
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            aria-label="Moneda de visualización"
            className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="COP">COP ($)</option>
            <option value="USD">USD ($)</option>
            <option value="CLP">CLP ($)</option>
            <option value="MXN">MXN ($)</option>
          </select>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificaciones del sistema"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notificaciones EP Enterprise</span>
                <span className="text-[11px] text-emerald-700 font-semibold">{totalNotifications} pendientes</span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {correrias.filter(c => c.status === 'Enviado a Dirección').map((corr) => (
                  <div
                    key={corr.id}
                    onClick={() => {
                      setActiveTab('accounting');
                      setShowNotifications(false);
                    }}
                    className="p-2 text-xs bg-amber-50/60 hover:bg-amber-100/60 rounded-lg cursor-pointer transition-colors border border-amber-200/50"
                  >
                    <p className="font-bold text-amber-950 flex items-center justify-between">
                      <span>{corr.code} · Correría</span>
                      <span className="text-[10px] text-amber-800 font-mono">Anticipo</span>
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {corr.adviserName} solicitó {corr.targetCities.join(', ')}
                    </p>
                  </div>
                ))}

                {timeOffRequests.filter(r => r.status === 'Pendiente').slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    onClick={() => {
                      setActiveTab('timeoff');
                      setShowNotifications(false);
                    }}
                    className="p-2 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-slate-800">{req.employeeName}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Solicitó {req.type} ({req.totalDays} {req.totalDays === 1 ? 'día' : 'días'})
                    </p>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <p className="py-4 text-center text-xs text-slate-400">
                    No tienes solicitudes ni correrías pendientes de revisión.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Display (No Dropdown Switcher) */}
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg select-none">
          {roleLabels[currentRole].icon}
          <div className="text-left hidden sm:block">
            <p className="font-bold text-slate-800 leading-tight">
              {currentRole === 'admin_hr' ? 'Dirección General' : currentRole === 'team_lead' ? 'Líder Proyecto' : 'Asesor Comercial'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-1 hover:bg-rose-100 rounded-full text-slate-400 hover:text-rose-600 transition-colors ml-2"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar with Profile trigger & Direct Change Photo button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
            title="Haz clic para cambiar la foto de la persona"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.firstName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-emerald-600 transition-all shadow-2xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4 text-white drop-shadow-sm" />
            </div>
            <span
              className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-700 text-white rounded-full ring-2 ring-white shadow-xs group-hover:bg-emerald-800 transition-colors"
              title="Cambiar Foto"
            >
              <Camera className="w-2.5 h-2.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveTab('portal')}
            className="hidden xl:block text-left cursor-pointer group"
            title="Ir a mi portal de trabajador"
          >
            <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-emerald-800 transition-colors">
              {currentUser.firstName} {currentUser.lastName.split(' ')[0]}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAvatarModal(true);
              }}
              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold block transition-colors"
            >
              Cambiar foto 📷
            </button>
          </div>
        </div>

        {/* Change Avatar Modal */}
        <ChangeAvatarModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          currentAvatarUrl={currentUser.avatar}
          userName={`${currentUser.firstName} ${currentUser.lastName}`}
        />
      </div>
    </header>
  );
};
