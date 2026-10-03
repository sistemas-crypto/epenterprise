import React, { useState } from 'react';
import { LogIn, Key, Shield, User, Users } from 'lucide-react';
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

        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5 justify-center">
            <Key size={14} className="text-amber-600" />
            Credenciales de Acceso por Perfil:
          </p>
          <div className="space-y-2">
            <button
              onClick={() => selectCredential('admin@essentialpharma.com.co', 'admin123')}
              className="w-full text-left p-2.5 hover:bg-slate-50 border border-slate-100 hover:border-emerald-200 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-100">
                  <Shield size={14} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Dirección General / Admin</p>
                  <p className="text-[10px] text-slate-500">admin@essentialpharma.com.co</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">admin123</span>
            </button>

            <button
              onClick={() => selectCredential('lider@essentialpharma.com.co', 'lider123')}
              className="w-full text-left p-2.5 hover:bg-slate-50 border border-slate-100 hover:border-teal-200 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 bg-teal-50 text-teal-700 rounded-lg group-hover:bg-teal-100">
                  <User size={14} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Dirección de Proyecto / Lider</p>
                  <p className="text-[10px] text-slate-500">lider@essentialpharma.com.co</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">lider123</span>
            </button>

            <button
              onClick={() => selectCredential('asesor@essentialpharma.com.co', 'asesor123')}
              className="w-full text-left p-2.5 hover:bg-slate-50 border border-slate-100 hover:border-lime-200 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 bg-lime-50 text-lime-700 rounded-lg group-hover:bg-lime-100">
                  <Users size={14} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Asesor Comercial / Trabajador</p>
                  <p className="text-[10px] text-slate-500">asesor@essentialpharma.com.co</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">asesor123</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-6">
          © 2026 Essential Pharma. Acceso autorizado solo para personal activo.
        </p>
      </div>
    </div>
  );
};
