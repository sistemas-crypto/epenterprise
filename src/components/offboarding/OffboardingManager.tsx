import React, { useState, useEffect } from 'react';
import { useHR } from '../../context/HRContext';
import {
  LogOut,
  UserX,
  FileCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Filter
} from 'lucide-react';

interface OffboardingProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  separationDate: string;
  reason: 'Renuncia Voluntaria' | 'Terminación Contrato' | 'Finalización Obra o Labor' | 'Mutuo Acuerdo' | 'Jubilación';
  status: 'Iniciado' | 'Procesando' | 'Finalizado';
  checklist: { id: string; task: string; completed: boolean }[];
}

export const OffboardingManager: React.FC = () => {
  const { employees, updateEmployee, showToast, addAuditLog } = useHR();
  const [offboardings, setOffboardings] = useState<OffboardingProcess[]>(() => {
    const saved = localStorage.getItem('ep_offboardings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ep_offboardings', JSON.stringify(offboardings));
  }, [offboardings]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [separationDate, setSeparationDate] = useState('');
  const [reason, setReason] = useState<OffboardingProcess['reason']>('Renuncia Voluntaria');

  const handleInitiateOffboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    const newProcess: OffboardingProcess = {
      id: `OFF-${Math.floor(800 + Math.random() * 200)}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      jobTitle: emp.jobTitle,
      separationDate,
      reason,
      status: 'Iniciado',
      checklist: [
        { id: '1', task: 'Entrevista de salida', completed: false },
        { id: '2', task: 'Recolección de activos (Laptop, Celular, ID)', completed: false },
        { id: '3', task: 'Revocación de accesos (Correo, SIIGO, CRM)', completed: false },
        { id: '4', task: 'Firma de documento de paz y salvo', completed: false },
        { id: '5', task: 'Liquidación de prestaciones sociales', completed: false },
      ]
    };

    setOffboardings([...offboardings, newProcess]);
    setShowAddModal(false);
    showToast('info', 'Proceso de Salida Iniciado', `El proceso para ${emp.firstName} ${emp.lastName} ha comenzado.`);
  };

  const updateTask = (procId: string, taskId: string) => {
    setOffboardings(offboardings.map(o => {
      if (o.id === procId) {
        return {
          ...o,
          checklist: o.checklist.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return o;
    }));
  };

  const finalizeProcess = (procId: string) => {
    const proc = offboardings.find(o => o.id === procId);
    if (!proc) return;

    updateEmployee(proc.employeeId, { status: 'Inactivo' });
    setOffboardings(offboardings.map(o => o.id === procId ? { ...o, status: 'Finalizado' } : o));
    
    addAuditLog({
      actorName: 'Administrador HR',
      actorRole: 'admin_hr',
      action: 'Desvinculación Finalizada',
      details: `Proceso de salida finalizado para ${proc.employeeName} (${proc.reason}).`,
      category: 'Personal'
    });
    
    showToast('success', 'Colaborador Desvinculado', 'El colaborador ha sido marcado como inactivo y el proceso de salida cerrado.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LogOut className="text-rose-600" /> Desvinculación & Offboarding
          </h1>
          <p className="text-xs text-slate-500 mt-1">Gestión documental y checklist de salida de colaboradores.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center gap-2"
        >
          <UserX className="w-4 h-4" /> Iniciar Proceso de Salida
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offboardings.map(o => (
          <div key={o.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-sm">{o.employeeName}</h3>
                <p className="text-[11px] text-slate-500">{o.jobTitle} - {o.department}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${o.status === 'Finalizado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {o.status}
              </span>
            </div>
            
            <div className="space-y-2">
              {o.checklist.map(t => (
                <label key={t.id} className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={t.completed} onChange={() => updateTask(o.id, t.id)} className="rounded" />
                  <span className={t.completed ? 'line-through text-slate-400' : ''}>{t.task}</span>
                </label>
              ))}
            </div>
            
            {o.status !== 'Finalizado' && o.checklist.every(t => t.completed) && (
              <button onClick={() => finalizeProcess(o.id)} className="w-full bg-emerald-600 text-white py-2 rounded text-xs font-bold">
                Finalizar Proceso y Desvincular
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">
            <h2 className="font-bold text-sm">Iniciar Proceso de Salida</h2>
            <form onSubmit={handleInitiateOffboarding} className="space-y-3">
              <select required className="w-full border p-2 rounded text-xs" onChange={(e) => setSelectedEmpId(e.target.value)}>
                <option value="">Seleccionar empleado...</option>
                {employees.filter(e => e.status === 'Activo').map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
              <input type="date" required className="w-full border p-2 rounded text-xs" onChange={(e) => setSeparationDate(e.target.value)} />
              <select className="w-full border p-2 rounded text-xs" onChange={(e) => setReason(e.target.value as any)}>
                <option>Renuncia Voluntaria</option>
                <option>Terminación Contrato</option>
                <option>Finalización Obra o Labor</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 p-2 border rounded text-xs">Cancelar</button>
                <button type="submit" className="flex-1 p-2 bg-rose-600 text-white rounded text-xs">Iniciar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
