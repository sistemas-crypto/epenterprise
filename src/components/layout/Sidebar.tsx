import React from 'react';
import { useHR } from '../../context/HRContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  UserCircle,
  Briefcase,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  ShieldAlert,
  Award,
  HeartPulse,
  Rocket,
  Laptop,
  FileCheck,
  LogOut
} from 'lucide-react';
import { EPLogo } from '../common/EPLogo';
import dashboardIcon from '../../assets/images/dashboard_icon_1791063609823.jpg';
import portalIcon from '../../assets/images/portal_icon_1791063620873.jpg';
import accountingIcon from '../../assets/images/accounting_icon_v2_1791064116684.jpg';
import employeesIcon from '../../assets/images/employees_icon_v2_1791064126361.jpg';
import payrollIcon from '../../assets/images/payroll_icon_v2_1791064136621.jpg';
import attendanceIcon from '../../assets/images/attendance_icon_v2_1791064145680.jpg';
import recruitmentIcon from '../../assets/images/recruitment_icon_1791064382382.jpg';
import onboardingIcon from '../../assets/images/onboarding_icon_1791064392194.jpg';
import assetsIcon from '../../assets/images/assets_icon_1791064402311.jpg';
import documentsIcon from '../../assets/images/documents_icon_1791064412227.jpg';
import offboardingIcon from '../../assets/images/offboarding_icon_1791064421024.jpg';
import performanceIcon from '../../assets/images/performance_icon_1791064429909.jpg';
import communityIcon from '../../assets/images/community_icon_1791064439287.jpg';
import qualityIcon from '../../assets/images/quality_icon_1791064447845.jpg';
import sstIcon from '../../assets/images/sst_icon_1791064456777.jpg';
import adminIcon from '../../assets/images/admin_icon_1791064466087.jpg';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab, currentRole, timeOffRequests, jobOpenings, correrias } = useHR();

  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, iconColor: 'text-sky-500', imageUrl: dashboardIcon, roles: ['admin_hr', 'team_lead'] },
    { id: 'portal', label: 'Mi Portal', icon: UserCircle, iconColor: 'text-indigo-500', imageUrl: portalIcon, roles: ['admin_hr', 'team_lead', 'employee'] },
    { id: 'accounting', label: 'Contabilidad', icon: FileSpreadsheet, iconColor: 'text-emerald-500', imageUrl: accountingIcon, roles: ['admin_hr', 'team_lead', 'employee'] },
    { id: 'employees', label: 'Trabajadores', icon: Users, iconColor: 'text-sky-600', imageUrl: employeesIcon, roles: ['admin_hr', 'team_lead'] },
    { id: 'payroll', label: 'Nómina', icon: CreditCard, iconColor: 'text-rose-500', imageUrl: payrollIcon, roles: ['admin_hr'] },
    { id: 'timeoff', label: 'Asistencia', icon: CalendarCheck, iconColor: 'text-amber-500', imageUrl: attendanceIcon, roles: ['admin_hr', 'team_lead', 'employee'] },
    { id: 'recruitment', label: 'Selección', icon: Briefcase, iconColor: 'text-teal-500', imageUrl: recruitmentIcon, roles: ['admin_hr'] },
    { id: 'onboarding', label: 'Onboarding', icon: Rocket, iconColor: 'text-purple-500', imageUrl: onboardingIcon, roles: ['admin_hr'] },
    { id: 'assets', label: 'Activos', icon: Laptop, iconColor: 'text-cyan-500', imageUrl: assetsIcon, roles: ['admin_hr'] },
    { id: 'documents', label: 'Documentos', icon: FileCheck, iconColor: 'text-indigo-600', imageUrl: documentsIcon, roles: ['admin_hr', 'employee'] },
    { id: 'offboarding', label: 'Salidas', icon: LogOut, iconColor: 'text-rose-700', imageUrl: offboardingIcon, roles: ['admin_hr'] },
    { id: 'performance', label: 'Desempeño', icon: Target, iconColor: 'text-pink-500', imageUrl: performanceIcon, roles: ['admin_hr', 'team_lead'] },
    { id: 'community', label: 'Comunidad', icon: Sparkles, iconColor: 'text-amber-400', imageUrl: communityIcon, roles: ['admin_hr', 'team_lead', 'employee'] },
    { id: 'quality', label: 'Calidad', icon: Award, iconColor: 'text-emerald-600', imageUrl: qualityIcon, roles: ['admin_hr', 'team_lead'] },
    { id: 'sst', label: 'SST', icon: HeartPulse, iconColor: 'text-rose-500', imageUrl: sstIcon, roles: ['admin_hr', 'team_lead'] },
    { id: 'admin', label: 'Admin', icon: ShieldAlert, iconColor: 'text-slate-600', imageUrl: adminIcon, roles: ['admin_hr'] },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-200 select-none ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        {!collapsed ? <EPLogo size="sm" showSubtitle={false} /> : <div className="mx-auto"><EPLogo variant="compact" size="sm" /></div>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg" title={collapsed ? 'Expandir' : 'Colapsar'}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive ? 'bg-slate-100 text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title={collapsed ? item.label : undefined}>
              {item.imageUrl ? <img src={item.imageUrl} alt={item.label} className="w-6 h-6 object-cover rounded-lg shadow-sm border border-slate-100 shrink-0" /> : <Icon className={`w-5 h-5 shrink-0 ${item.iconColor}`} />}
              {!collapsed && <span className="truncate text-left flex-1">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <div className="p-3 m-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold text-slate-800">Essential Pharma</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">EP ENTERPRISE · Talento, Nómina y Contabilidad conectada a Siigo Nube.</p>
        </div>
      )}
    </aside>
  );
};
