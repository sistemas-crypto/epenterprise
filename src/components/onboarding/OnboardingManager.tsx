import React, { useState, useEffect } from 'react';
import { useHR } from '../../context/HRContext';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ClipboardList,
  Laptop,
  CheckSquare,
  Plus,
  X,
  FileCheck,
  ShieldCheck,
  Users
} from 'lucide-react';

interface OnboardingTask {
  id: string;
  title: string;
  category: 'Documentos' | 'TI & Accesos' | 'Capacitación' | 'Cultura';
  completed: boolean;
}

interface OnboardingProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  startDate: string;
  mentorName: string;
  progress: number; // 0 to 100
  tasks: OnboardingTask[];
}

export const OnboardingManager: React.FC = () => {
  const { employees, showToast } = useHR();
  const [onboardings, setOnboardings] = useState<OnboardingProcess[]>(() => {
    const saved = localStorage.getItem('ep_onboardings');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ONB-201',
        employeeId: 'emp-1',
        employeeName: 'Mariana Giraldo Bedoya',
        jobTitle: 'Asesora de Ventas Institucionales',
        department: 'Operaciones',
        startDate: '2026-10-01',
        mentorName: 'Andrés Gómez',
        progress: 75,
        tasks: [
          { id: 't1', title: 'Firma de Contrato y Afiliaciones ARL/EPS', category: 'Documentos', completed: true },
          { id: 't2', title: 'Configuración de Laptop, Correo corporativo y Siigo', category: 'TI & Accesos', completed: true },
          { id: 't3', title: 'Inducción General sobre Políticas de Essential Pharma', category: 'Capacitación', completed: true },
          { id: 't4', title: 'Reunión de bienvenida e inducción al portafolio de productos', category: 'Cultura', completed: false }
        ]
      },
      {
        id: 'ONB-202',
        employeeId: 'emp-2',
        employeeName: 'Carlos Eduardo Restrepo',
        jobTitle: 'Analista de Tesorería Senior',
        department: 'Finanzas & Contabilidad',
        startDate: '2026-10-05',
        mentorName: 'Administrador General',
        progress: 25,
        tasks: [
          { id: 't1', title: 'Recepción de Soportes Académicos y Documentación', category: 'Documentos', completed: true },
          { id: 't2', title: 'Configuración de credenciales bancarias y SIIGO Nube', category: 'TI & Accesos', completed: false },
          { id: 't3', title: 'Curso virtual de Políticas Contables & Viáticos', category: 'Capacitación', completed: false },
          { id: 't4', title: 'Sesión 1 a 1 de alineación con Dirección General', category: 'Cultura', completed: false }
        ]
      }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [mentor, setMentor] = useState('');

  useEffect(() => {
    localStorage.setItem('ep_onboardings', JSON.stringify(onboardings));
  }, [onboardings]);

  const handleCreateOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    // Check if employee already has onboarding
    if (onboardings.some(o => o.employeeId === selectedEmpId)) {
      showToast('warning', 'Proceso Existente', 'Este colaborador ya tiene un proceso de inducción activo.');
      return;
    }

    const defaultTasks: OnboardingTask[] = [
      { id: 't1', title: 'Firma de Contrato Laboral & Afiliaciones de Ley', category: 'Documentos', completed: false },
      { id: 't2', title: 'Entrega de Equipo de Computo y Cuentas Oficiales', category: 'TI & Accesos', completed: false },
      { id: 't3', title: 'Capacitación en Sistemas de Gestión de Calidad ISO 9001', category: 'Capacitación', completed: false },
      { id: 't4', title: 'Almuerzo / Reunión de Bienvenida con el Equipo', category: 'Cultura', completed: false }
    ];

    const newProcess: OnboardingProcess = {
      id: `ONB-${Math.floor(203 + Math.random() * 899)}`,
      employeeId: selectedEmpId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      jobTitle: emp.jobTitle,
      department: emp.department,
      startDate: startDate || new Date().toISOString().split('T')[0],
      mentorName: mentor || 'Administrador General',
      progress: 0,
      tasks: defaultTasks,
    };

    setOnboardings([...onboardings, newProcess]);
    setShowAddModal(false);
    setSelectedEmpId('');
    setStartDate('');
    setMentor('');
    showToast('success', 'Onboarding Iniciado', `Se creó la hoja de ruta de inducción para ${newProcess.employeeName}.`);
  };

  const handleToggleTask = (processId: string, taskId: string) => {
    const updated = onboardings.map(o => {
      if (o.id === processId) {
        const updatedTasks = o.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const completedCount = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return { ...o, tasks: updatedTasks, progress };
      }
      return o;
    });
    setOnboardings(updated);
    showToast('info', 'Progreso Guardado', 'Se ha actualizado el estado de las actividades de inducción.');
  };

  const handleDeleteOnboarding = (id: string, name: string) => {
    if (window.confirm(`¿Deseas finalizar/archivar el onboarding de ${name}?`)) {
      setOnboardings(onboardings.filter(o => o.id !== id));
      showToast('info', 'Proceso Completado', 'El onboarding se ha archivado exitosamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            🚀 Incorporación & Onboarding Laboral
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Planes de acogida estructurados para garantizar que cada nuevo colaborador cuente con herramientas, inducción y acompañamiento.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Nueva Hoja de Ruta
        </button>
      </div>

      {/* Grid containing onboardings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {onboardings.length === 0 ? (
          <div className="lg:col-span-2 p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No hay procesos de inducción activos</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Inicia una nueva hoja de ruta para acompañar a los colaboradores en sus primeras semanas en Essential Pharma.
            </p>
          </div>
        ) : (
          onboardings.map((onb) => (
            <div key={onb.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {onb.id}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Inicia: {onb.startDate}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                      {onb.employeeName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {onb.jobTitle} · <strong className="text-slate-600">{onb.department}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteOnboarding(onb.id, onb.employeeName)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded"
                    title="Archivar proceso"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="my-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Progreso de Inducción
                    </span>
                    <span className="font-mono text-indigo-900 tabular-nums">{onb.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${onb.progress}%` }}
                    />
                  </div>
                </div>

                {/* Mentor Info */}
                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 mb-4 text-xs border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    M
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px]">Mentor Asignado (Acompañamiento)</p>
                    <p className="font-bold text-slate-800">{onb.mentorName}</p>
                  </div>
                </div>

                {/* Onboarding Checklist */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <ClipboardList className="w-4 h-4 text-indigo-500" />
                    Tareas y Hitos Requeridos
                  </p>
                  <div className="space-y-2 pl-1">
                    {onb.tasks.map((t) => (
                      <label
                        key={t.id}
                        className="flex items-start gap-2.5 text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => handleToggleTask(onb.id, t.id)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer w-4 h-4"
                        />
                        <div className="leading-tight">
                          <span className="font-semibold block">{t.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Categoría: {t.category}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {onb.progress === 100 && (
                <div className="mt-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-pulse">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="font-bold">¡Inducción Completada! Proceso listo para archivar.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Onboarding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Iniciar Proceso de Onboarding</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateOnboarding} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Seleccionar Colaborador *</label>
                <select
                  required
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">-- Elige un colaborador --</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fecha de Ingreso / Comienzo</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mentor / Líder de Acogida</label>
                <input
                  type="text"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  placeholder="Ej. Andrés Gómez / Mariana Giraldo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-start gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-700 mt-0.5 shrink-0" />
                <p>
                  <strong>Hoja de ruta estándar:</strong> Se generarán automáticamente 4 tareas claves relacionadas con documentos legales, equipos tecnológicos, inducción de calidad y cultura de la empresa.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-indigo-600 rounded-lg cursor-pointer"
                >
                  Crear Ruta de Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
