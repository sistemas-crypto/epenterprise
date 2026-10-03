import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { EPLogo } from '../common/EPLogo';

export const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast, setCurrentRole, setActiveTab } = useHR();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@essentialpharma.com.co' && password === 'admin123') {
      setCurrentRole('admin_hr');
      onLogin();
    } else if (email === 'lider@essentialpharma.com.co' && password === 'lider123') {
      setCurrentRole('team_lead');
      setActiveTab('dashboard');
      onLogin();
    } else if (email === 'asesor@essentialpharma.com.co' && password === 'asesor123') {
      setCurrentRole('employee');
      setActiveTab('portal');
      onLogin();
    } else {
      showToast('error', 'Error de acceso', 'Credenciales incorrectas para el rol seleccionado');
    }
  };

  const selectCredential = (u: string, p: string) => {
    setEmail(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-6">
          <EPLogo size="lg" />
          <h1 className="text-xl font-bold text-emerald-950 mt-4 text-center">Essential Pharma Enterprise</h1>
          <p className="text-slate-500 text-xs mt-1 text-center">Sistema de Gestión de Talento y Contabilidad</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico corporativo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
          />
          <button type="submit" className="w-full bg-emerald-700 text-white p-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <LogIn size={18} /> Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 mt-6">
          © 2026 Essential Pharma. Acceso autorizado solo para personal activo.
        </p>
      </div>
    </div>
  );
};
