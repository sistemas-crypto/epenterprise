/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { HRProvider, useHR } from './context/HRContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HRDashboard } from './components/dashboard/HRDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { PayrollManager } from './components/payroll/PayrollManager';
import { TimeOffManager } from './components/timeoff/TimeOffManager';
import { EmployeePortal } from './components/portal/EmployeePortal';
import { RecruitmentATS } from './components/recruitment/RecruitmentATS';
import { PerformanceAndClimate } from './components/performance/PerformanceAndClimate';
import { CompanyWall } from './components/community/CompanyWall';
import { OnboardingManager } from './components/onboarding/OnboardingManager';
import { OffboardingManager } from './components/offboarding/OffboardingManager';
import { AssetsManager } from './components/assets/AssetsManager';
import { DigitalSignatureManager } from './components/documents/DigitalSignatureManager';
import { AccountingManager } from './components/accounting/AccountingManager';
import { AdminPanel } from './components/admin/AdminPanel';
import { QualityManagementISO9001 } from './components/quality/QualityManagementISO9001';
import { SSTManagerPHVA } from './components/sst/SSTManagerPHVA';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toasts, dismissToast } = useHR();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HRDashboard />;
      case 'portal':
        return <EmployeePortal />;
      case 'accounting':
        return <AccountingManager />;
      case 'admin':
        return <AdminPanel />;
      case 'quality':
        return <QualityManagementISO9001 />;
      case 'sst':
        return <SSTManagerPHVA />;
      case 'employees':
        return <EmployeeDirectory />;
      case 'payroll':
        return <PayrollManager />;
      case 'timeoff':
        return <TimeOffManager />;
      case 'recruitment':
        return <RecruitmentATS />;
      case 'performance':
        return <PerformanceAndClimate />;
      case 'community':
        return <CompanyWall />;
      case 'onboarding':
        return <OnboardingManager />;
      case 'offboarding':
        return <OffboardingManager />;
      case 'assets':
        return <AssetsManager />;
      case 'documents':
        return <DigitalSignatureManager />;
      default:
        return <HRDashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:static md:transform-none ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
          <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        </div>
        
        {/* Overlay for mobile when sidebar is open */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveTab()}
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-xs transition-all animate-in slide-in-from-bottom-3 duration-200 bg-white ${
              toast.type === 'success'
                ? 'border-emerald-300 text-slate-800 ring-1 ring-emerald-500/20'
                : toast.type === 'warning'
                ? 'border-amber-300 text-slate-800 ring-1 ring-amber-500/20'
                : toast.type === 'error'
                ? 'border-rose-300 text-slate-800 ring-1 ring-rose-500/20'
                : 'border-teal-300 text-slate-800 ring-1 ring-teal-500/20'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <p className="font-bold text-slate-900">{toast.title}</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HRProvider>
      <MainLayout />
    </HRProvider>
  );
}
