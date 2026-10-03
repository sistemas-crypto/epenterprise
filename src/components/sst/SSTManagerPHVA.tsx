import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import {
  HazardRiskGTC45,
  AnnualWorkPlanItem,
  AccidentReport,
  CopasstRecord,
  SSTIndicator,
  PHVAPhase
} from '../../types/hr';
import {
  INITIAL_HAZARDS,
  INITIAL_ANNUAL_WORK_PLAN,
  INITIAL_ACCIDENT_REPORTS,
  INITIAL_COPASST_RECORDS,
  INITIAL_SST_INDICATORS
} from '../../data/sstData';
import {
  HeartPulse,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  FileText,
  Activity,
  Plus,
  X,
  FileCheck,
  TrendingDown,
  Building,
  Target,
  Sparkles,
  HelpCircle,
  Stethoscope,
  HardHat,
  Search,
  Filter,
  Paperclip,
  Upload,
  Download,
  Eye,
  Camera,
  Layers,
  Check,
  Trash2,
  FolderOpen
} from 'lucide-react';

export const SSTManagerPHVA: React.FC = () => {
  const { showToast, formatCurrency } = useHR();

  const [activePhase, setActivePhase] = useState<PHVAPhase>('Planear');
  const [hazards, setHazards] = useState<HazardRiskGTC45[]>(() => {
    const saved = localStorage.getItem('ep_sst_hazards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((h: any) => h.id === 'pel-001' || h.id === 'pel-002')) {
          localStorage.removeItem('ep_sst_hazards');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_HAZARDS;
  });
  const [workPlan, setWorkPlan] = useState<AnnualWorkPlanItem[]>(() => {
    const saved = localStorage.getItem('ep_sst_workplan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((w: any) => w.id === 'wp-001' || w.id === 'wp-002')) {
          localStorage.removeItem('ep_sst_workplan');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_ANNUAL_WORK_PLAN;
  });
  const [accidents, setAccidents] = useState<AccidentReport[]>(() => {
    const saved = localStorage.getItem('ep_sst_accidents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a: any) => a.id === 'at-001' || a.id === 'at-002')) {
          localStorage.removeItem('ep_sst_accidents');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_ACCIDENT_REPORTS;
  });
  const [copasstRecords, setCopasstRecords] = useState<CopasstRecord[]>(() => {
    const saved = localStorage.getItem('ep_sst_copasst');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((c: any) => c.id === 'cop-001' || c.id === 'cop-002')) {
          localStorage.removeItem('ep_sst_copasst');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_COPASST_RECORDS;
  });
  const [indicators] = useState<SSTIndicator[]>(INITIAL_SST_INDICATORS);

  const handleDeleteHazard = (id: string, code: string) => {
    if (window.confirm(`¿Deseas eliminar el peligro "${code}" de la matriz GTC 45?`)) {
      const updated = hazards.filter((h) => h.id !== id);
      setHazards(updated);
      localStorage.setItem('ep_sst_hazards', JSON.stringify(updated));
      showToast('info', 'Peligro Eliminado', `Se retiró ${code} de la matriz.`);
    }
  };

  const handleDeleteAccident = (id: string, code: string) => {
    if (window.confirm(`¿Deseas eliminar el reporte "${code}"?`)) {
      const updated = accidents.filter((a) => a.id !== id);
      setAccidents(updated);
      localStorage.setItem('ep_sst_accidents', JSON.stringify(updated));
      showToast('info', 'Reporte Eliminado', `Se retiró el reporte ${code}.`);
    }
  };

  const handleDeleteCopasst = (id: string) => {
    if (window.confirm('¿Deseas eliminar esta acta del COPASST?')) {
      const updated = copasstRecords.filter((c) => c.id !== id);
      setCopasstRecords(updated);
      localStorage.setItem('ep_sst_copasst', JSON.stringify(updated));
      showToast('info', 'Acta Eliminada', 'Se retiró el acta del COPASST.');
    }
  };

  const handleDeleteWorkPlanItem = (id: string, activity: string) => {
    if (window.confirm(`¿Deseas eliminar la actividad "${activity}" del plan de trabajo?`)) {
      const updated = workPlan.filter((w) => w.id !== id);
      setWorkPlan(updated);
      localStorage.setItem('ep_sst_workplan', JSON.stringify(updated));
      showToast('info', 'Actividad Eliminada', 'Se retiró la actividad del plan anual.');
    }
  };

  // Preview Document / Evidence Modal
  const [previewSSTDoc, setPreviewSSTDoc] = useState<{
    title: string;
    code: string;
    filename: string;
    category: string;
    date: string;
    entity: string;
  } | null>(null);

  // Modal State for new Accident / Incident Report
  const [showAccidentModal, setShowAccidentModal] = useState(false);
  const [reportType, setReportType] = useState<AccidentReport['reportType']>('Incidente');
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState('Comercial y Ventas');
  const [accDate, setAccDate] = useState(new Date().toISOString().split('T')[0]);
  const [accLocation, setAccLocation] = useState('');
  const [accDesc, setAccDesc] = useState('');
  const [accSeverity, setAccSeverity] = useState<AccidentReport['severity']>('Sin Incapacidad');
  const [accDays, setAccDays] = useState(0);
  const [accFurat, setAccFurat] = useState(false);
  const [accRootCause, setAccRootCause] = useState('');
  const [accAction, setAccAction] = useState('');
  const [hasPhotoUpload, setHasPhotoUpload] = useState(false);

  // Modal State for new COPASST Meeting
  const [showCopasstModal, setShowCopasstModal] = useState(false);
  const [copSessionType, setCopSessionType] = useState<CopasstRecord['sessionType']>('Reunión Ordinaria Mensual');
  const [copDate, setCopDate] = useState(new Date().toISOString().split('T')[0]);
  const [copAttendees, setCopAttendees] = useState(6);
  const [copTopic1, setCopTopic1] = useState('');
  const [copTopic2, setCopTopic2] = useState('');
  const [copCommitment, setCopCommitment] = useState('');
  const [copActUploaded, setCopActUploaded] = useState(false);

  // Modal State for new Hazard (GTC 45)
  const [showHazardModal, setShowHazardModal] = useState(false);
  const [hazardProcess, setHazardProcess] = useState('Comercial & Correrías');
  const [hazardActivity, setHazardActivity] = useState('');
  const [hazardClass, setHazardClass] = useState<HazardRiskGTC45['dangerClassification']>('Biomecánico / Ergonómico');
  const [hazardDesc, setHazardDesc] = useState('');
  const [hazardEffects, setHazardEffects] = useState('');
  const [hazardExposed, setHazardExposed] = useState(6);
  const [hazardControls, setHazardControls] = useState('');
  const [hazardIntervention, setHazardIntervention] = useState('');

  // Toggle Work Plan Item completion
  const toggleWorkPlanItem = (id: string) => {
    const updated = workPlan.map((item) =>
      item.id === id ? { ...item, completed: !item.completed, status: !item.completed ? 'Completada' : 'En Proceso' } : item
    );
    setWorkPlan(updated as any);
    localStorage.setItem('ep_sst_workplan', JSON.stringify(updated));
    showToast('info', 'Estado Actualizado', 'Se actualizó el avance de la actividad del Plan Anual de SST.');
  };

  const handleSaveAccident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !accDesc) return;

    const codeNum = accidents.length + 1;
    const newReport: AccidentReport = {
      id: `at-${Date.now()}`,
      code: `${reportType === 'Accidente de Trabajo' ? 'AT' : 'INC'}-2026-00${codeNum}`,
      reportType,
      employeeName: empName,
      employeeDepartment: empDept,
      date: accDate,
      location: accLocation || 'Sede Principal / Ruta Comercial',
      description: accDesc,
      severity: accSeverity,
      daysLost: Number(accDays),
      furatSubmitted: accFurat,
      furatNumber: accFurat ? `FURAT-ARL-2026-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      furatAttachmentName: accFurat ? `radicado_furat_arl_2026_00${codeNum}.pdf` : undefined,
      photoEvidenceName: hasPhotoUpload ? `registro_fotografico_evento_00${codeNum}.jpg` : undefined,
      rootCause: accRootCause || 'En proceso de investigación por equipo COPASST.',
      correctiveAction: accAction || 'Medidas preventivas inmediatas implementadas.',
      status: reportType === 'Accidente de Trabajo' ? 'Reportado' : 'Medidas Implementadas',
    };

    const updated = [newReport, ...accidents];
    setAccidents(updated);
    localStorage.setItem('ep_sst_accidents', JSON.stringify(updated));
    setShowAccidentModal(false);
    setEmpName('');
    setAccDesc('');
    setAccLocation('');
    setAccRootCause('');
    setAccAction('');
    setHasPhotoUpload(false);
    showToast('warning', 'Reporte Registrado', `Se ha generado el radicado ${newReport.code} con soporte adjunto para ARL.`);
  };

  const handleSaveCopasst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copTopic1) return;

    const newRecord: CopasstRecord = {
      id: `cop-${Date.now()}`,
      sessionType: copSessionType,
      date: copDate,
      attendeesCount: Number(copAttendees),
      mainTopics: [copTopic1, ...(copTopic2 ? [copTopic2] : [])],
      commitments: [copCommitment || 'Verificación en próxima sesión ordinaria.'],
      status: 'Acta Firmada',
      signedActAttachmentName: copActUploaded
        ? `acta_copasst_${copDate.replace(/-/g, '_')}_firmada.pdf`
        : `acta_copasst_${copDate.replace(/-/g, '_')}_digital.pdf`,
    };

    const updated = [newRecord, ...copasstRecords];
    setCopasstRecords(updated);
    localStorage.setItem('ep_sst_copasst', JSON.stringify(updated));
    setShowCopasstModal(false);
    setCopTopic1('');
    setCopTopic2('');
    setCopCommitment('');
    setCopActUploaded(false);
    showToast('success', 'Acta Radicada', 'El acta del COPASST ha sido custodiada con su archivo digital.');
  };

  const handleSaveHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardActivity || !hazardDesc) return;

    const newHazard: HazardRiskGTC45 = {
      id: `pel-${Date.now()}`,
      code: `PEL-${hazardClass.substring(0, 3).toUpperCase()}-0${hazards.length + 1}`,
      process: hazardProcess,
      activity: hazardActivity,
      dangerClassification: hazardClass,
      description: hazardDesc,
      possibleEffects: hazardEffects || 'Efectos en evaluación.',
      exposedCount: Number(hazardExposed),
      riskEvaluation: 'Aceptable con Control Específico',
      controlsInPlace: hazardControls || 'Controles estándar en uso.',
      interventionPlan: hazardIntervention || 'Plan de mejora continua en seguimiento.',
      responsible: 'Coordinador SST & COPASST',
    };

    const updated = [newHazard, ...hazards];
    setHazards(updated);
    localStorage.setItem('ep_sst_hazards', JSON.stringify(updated));
    setShowHazardModal(false);
    setHazardActivity('');
    setHazardDesc('');
    setHazardEffects('');
    setHazardControls('');
    setHazardIntervention('');
    showToast('success', 'Peligro Incorporado', `Se agregó el peligro ${newHazard.code} a la matriz GTC 45.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Seguridad y Salud en el Trabajo (SG-SST)
                </h1>
                <span className="text-[10px] font-mono font-bold bg-rose-700 text-white px-2 py-0.5 rounded-full">
                  Ciclo PHVA
                </span>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full">
                  Modelo Híbrido
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Decreto 1072 de 2015 & Res. 0312 de 2019 · Gestión Transaccional + Custodia Legal de FURAT, Actas y Evidencias.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activePhase === 'Planear' && (
            <button
              onClick={() => setShowHazardModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              + Identificar Peligro GTC 45
            </button>
          )}

          {activePhase === 'Hacer' && (
            <button
              onClick={() => setShowAccidentModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-700 rounded-lg hover:bg-rose-800 transition-colors shadow-xs"
            >
              <ShieldAlert className="w-4 h-4" />
              + Reportar Accidente / FURAT
            </button>
          )}

          {activePhase === 'Verificar' && (
            <button
              onClick={() => setShowCopasstModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              + Radicar Acta COPASST
            </button>
          )}
        </div>
      </div>

      {/* Modelo Híbrido Banner */}
      <div className="p-3.5 bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-rose-700 text-white rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-rose-950">
              Arquitectura Híbrida de SST: Gestión Operativa PHVA + Repositorio Legal de Soportes
            </span>
            <p className="text-[11px] text-rose-900 mt-0.5">
              Registra en línea los incidentes, peligros e inspecciones para el cálculo de indicadores de ley, y almacena las copias firmadas del FURAT de ARL y actas del COPASST para auditorías de MinTrabajo.
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-mono font-bold text-rose-900 bg-white px-2 py-1 rounded border border-rose-300">
          Decreto 1072 / Res. 0312
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Días Sin Accidentes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-800 mt-1 font-mono">
            {accidents.filter((a) => a.reportType === 'Accidente de Trabajo').length === 0 ? '0 Eventos' : `${accidents.filter((a) => a.reportType === 'Accidente de Trabajo').length} Registrado(s)`}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Meta Anual: Cero Accidentes Graves</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Frecuencia Accidentalidad</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {accidents.filter((a) => a.reportType === 'Accidente de Trabajo').length === 0 ? '0.00' : (accidents.filter((a) => a.reportType === 'Accidente de Trabajo').length * 240000 / 250000).toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Fórmula legal IFA (Res. 0312)</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peligros Valorados (GTC 45)</span>
            <HardHat className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{hazards.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">{hazards.length === 0 ? 'Matriz lista para nuevos registros' : 'Controles en fuente, medio y persona'}</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avance Plan Anual SST</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-1 font-mono">
            {workPlan.length > 0 ? Math.round((workPlan.filter((w) => w.completed).length / workPlan.length) * 100) : 0}%
          </p>
          <span className="text-[11px] text-purple-700 font-medium">
            {workPlan.length > 0 ? `${workPlan.filter((w) => w.completed).length} de ${workPlan.length} actividades ejecutadas` : 'Plan listo para programación de actividades'}
          </span>
        </div>
      </div>

      {/* Ciclo PHVA Phase Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => setActivePhase('Planear')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activePhase === 'Planear'
              ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              FASE P
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Paso 1</span>
          </div>
          <p className="text-sm font-bold mt-1 text-slate-900">PLANEAR</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Política, Objetivos y Matriz GTC 45</p>
        </button>

        <button
          onClick={() => setActivePhase('Hacer')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activePhase === 'Hacer'
              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              FASE H
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Paso 2</span>
          </div>
          <p className="text-sm font-bold mt-1 text-slate-900">HACER</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Capacitaciones, FURAT y COPASST</p>
        </button>

        <button
          onClick={() => setActivePhase('Verificar')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activePhase === 'Verificar'
              ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500/20 text-amber-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              FASE V
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Paso 3</span>
          </div>
          <p className="text-sm font-bold mt-1 text-slate-900">VERIFICAR</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Indicadores Res. 0312 y Auditoría</p>
        </button>

        <button
          onClick={() => setActivePhase('Actuar')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activePhase === 'Actuar'
              ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-500/20 text-purple-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              FASE A
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Paso 4</span>
          </div>
          <p className="text-sm font-bold mt-1 text-slate-900">ACTUAR</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Planes de Mejora y Revisión Gerencial</p>
        </button>
      </div>

      {/* FASE P: PLANEAR */}
      {activePhase === 'Planear' && (
        <div className="space-y-6">
          {/* Política de SST */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Política de Seguridad y Salud en el Trabajo (SG-SST)
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed text-justify bg-slate-50 p-4 rounded-xl border border-slate-200">
              «<strong>Essential Pharma S.A.S.</strong>, comprometida con la protección integral de la seguridad y salud de todos sus trabajadores directos, asesores comerciales en correrías, contratistas y visitantes, destina los recursos humanos, técnicos y financieros requeridos para identificar los peligros, evaluar y valorar los riesgos, promoviendo ambientes de trabajo seguros y saludables, cumpliendo con la legislación colombiana (Decreto 1072/2015 y Resolución 0312/2019) y mejorando continuamente el SG-SST.»
            </p>
          </div>

          {/* Matriz GTC 45 */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Matriz de Identificación de Peligros y Valoración de Riesgos (Guía GTC 45)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluación de condiciones biomecánicas, viales, químicas, locativas y psicosociales.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código & Proceso</th>
                    <th className="py-3 px-4">Clasificación Peligro</th>
                    <th className="py-3 px-4">Descripción & Efectos Posibles</th>
                    <th className="py-3 px-4 text-center">Expuestos</th>
                    <th className="py-3 px-4">Controles Actuales</th>
                    <th className="py-3 px-4">Plan de Intervención</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hazards.map((hazard) => (
                    <tr key={hazard.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {hazard.code}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">{hazard.process}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            hazard.dangerClassification === 'Biomecánico / Ergonómico'
                              ? 'bg-blue-100 text-blue-800'
                              : hazard.dangerClassification === 'Locativo / Mecánico'
                              ? 'bg-amber-100 text-amber-800'
                              : hazard.dangerClassification === 'Químico'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {hazard.dangerClassification}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-semibold text-slate-900">{hazard.description}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">{hazard.possibleEffects}</p>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {hazard.exposedCount} pers.
                      </td>

                      <td className="py-3 px-4 max-w-xs text-slate-600 leading-relaxed">
                        {hazard.controlsInPlace}
                      </td>

                      <td className="py-3 px-4 max-w-xs text-slate-700 leading-relaxed font-medium">
                        {hazard.interventionPlan}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteHazard(hazard.id, hazard.code)}
                          className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Eliminar peligro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {hazards.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <div className="max-w-md mx-auto space-y-3">
                          <HardHat className="w-8 h-8 text-amber-600 mx-auto" />
                          <p className="font-bold text-slate-800 text-sm">Matriz GTC 45 Lista (0 Peligros)</p>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            No hay peligros de prueba. Pulsa en «+ Identificar Peligro GTC 45» para evaluar los peligros biomecánicos, viales o químicos de Essential Pharma.
                          </p>
                          <button
                            onClick={() => setShowHazardModal(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            + Identificar Primer Peligro
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FASE H: HACER */}
      {activePhase === 'Hacer' && (
        <div className="space-y-6">
          {/* Plan Anual de Trabajo */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Plan Anual de Trabajo en SST (Vigencia 2026)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seguimiento de cumplimiento por fases PHVA, fechas y presupuesto asignado.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {workPlan.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleWorkPlanItem(item.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 hover:border-emerald-600 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <p
                        className={`font-semibold ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.activity}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                          Fase {item.phase}
                        </span>
                        <span>· Mes: {item.targetMonth}</span>
                        <span>· Responsable: {item.responsible}</span>
                        <span className="font-mono">· Presupuesto: {formatCurrency(item.budgetAllocated)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.completed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.completed ? 'Completada' : 'Pendiente'}
                    </span>

                    <button
                      onClick={() => handleDeleteWorkPlanItem(item.id, item.activity)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Eliminar actividad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {workPlan.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <div className="max-w-md mx-auto space-y-2">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto" />
                    <p className="font-bold text-slate-800 text-sm">Plan Anual de Trabajo Listo (0 Actividades)</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      No hay actividades de prueba. El plan anual está preparado para recibir la programación de actividades del SG-SST de la empresa.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registro de Accidentes e Incidentes con Evidencias */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Registro de Accidentes de Trabajo & Incidentes (FURAT ARL)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diligenciamiento del evento + Custodia del radicado oficial de ARL y registro fotográfico.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código & Tipo</th>
                    <th className="py-3 px-4">Trabajador & Área</th>
                    <th className="py-3 px-4">Fecha & Lugar</th>
                    <th className="py-3 px-4">Descripción del Evento</th>
                    <th className="py-3 px-4 text-center">Incapacidad</th>
                    <th className="py-3 px-4">Soporte ARL / Evidencia</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accidents.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {acc.code}
                        </span>
                        <p className="text-[10px] text-rose-700 font-bold mt-1">{acc.reportType}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800">{acc.employeeName}</p>
                        <p className="text-[10px] text-slate-400">{acc.employeeDepartment}</p>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {acc.date}
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">{acc.location}</p>
                      </td>

                      <td className="py-3 px-4 max-w-xs text-slate-700 leading-relaxed">
                        <p className="font-medium text-slate-800">{acc.description}</p>
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Causa: {acc.rootCause}
                        </p>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {acc.daysLost > 0 ? `${acc.daysLost} días` : '0 días'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {acc.furatAttachmentName ? (
                            <button
                              onClick={() =>
                                setPreviewSSTDoc({
                                  title: `Radicado Oficial FURAT: ${acc.furatNumber || acc.code}`,
                                  code: acc.furatNumber || 'FURAT-ARL',
                                  filename: acc.furatAttachmentName!,
                                  category: 'Informe de Accidente de Trabajo FURAT (Positiva ARL)',
                                  date: acc.date,
                                  entity: 'ARL Positiva Compañía de Seguros / MinTrabajo',
                                })
                              }
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded shadow-2xs"
                            >
                              <Paperclip className="w-3 h-3 text-rose-700" />
                              Ver FURAT ARL
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 block">Sin FURAT (Incidente)</span>
                          )}

                          {acc.photoEvidenceName && (
                            <button
                              onClick={() =>
                                setPreviewSSTDoc({
                                  title: `Registro Fotográfico: ${acc.code}`,
                                  code: acc.code,
                                  filename: acc.photoEvidenceName!,
                                  category: 'Evidencia Fotográfica de Inspección',
                                  date: acc.date,
                                  entity: 'Comité de Investigación COPASST',
                                })
                              }
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded shadow-2xs"
                            >
                              <Camera className="w-3 h-3 text-blue-700" />
                              Ver Foto
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {acc.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteAccident(acc.id, acc.code)}
                          className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Eliminar reporte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {accidents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="max-w-md mx-auto space-y-3">
                          <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
                          <p className="font-bold text-slate-800 text-sm">Registro de Accidentalidad al Día (0 Reportes)</p>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            No hay accidentes ni incidentes cargados. Cuando ocurra una novedad o evento laboral, pulsa en «+ Reportar Accidente / FURAT» para custodiar el radicado ante ARL.
                          </p>
                          <button
                            onClick={() => setShowAccidentModal(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            + Registrar Reporte
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FASE V: VERIFICAR */}
      {activePhase === 'Verificar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators.map((ind) => (
              <div
                key={ind.id}
                className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Indicador de {ind.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {ind.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{ind.name}</h3>

                <div className="p-3 bg-slate-50 rounded-lg text-slate-600 text-xs font-mono border border-slate-100">
                  {ind.formula}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400">Meta:</span>
                    <span className="font-bold font-mono text-slate-700 ml-1.5">{ind.target}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Resultado Actual:</span>
                    <span className="font-black font-mono text-emerald-800 text-sm ml-1.5">
                      {ind.current}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actas de COPASST con soporte firmado */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Comité Paritario de Seguridad y Salud en el Trabajo (COPASST)
                </h3>
              </div>
              <button
                onClick={() => setShowCopasstModal(true)}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg"
              >
                + Radicar Nueva Acta Mensual
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {copasstRecords.map((cop) => (
                <div key={cop.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cop.sessionType}</span>
                    <span className="font-mono text-slate-500 font-semibold">{cop.date}</span>
                  </div>
                  <p className="text-slate-500 font-medium">Asistencia: {cop.attendeesCount} miembros delegados</p>

                  <div className="space-y-1 pt-1">
                    <p className="font-bold text-slate-700 text-[11px] uppercase">Temas Principales:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {cop.mainTopics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {cop.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {cop.signedActAttachmentName && (
                        <button
                          onClick={() =>
                            setPreviewSSTDoc({
                              title: `Acta Oficial COPASST: ${cop.date}`,
                              code: 'ACT-COPASST',
                              filename: cop.signedActAttachmentName!,
                              category: 'Acta de Reunión con Firmas de Delegados',
                              date: cop.date,
                              entity: 'Essential Pharma S.A.S. - COPASST',
                            })
                          }
                          className="flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-white hover:bg-blue-50 px-2.5 py-1 rounded border border-blue-300 shadow-2xs"
                        >
                          <Paperclip className="w-3 h-3 text-blue-600" />
                          Ver Acta Firmada
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteCopasst(cop.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Eliminar acta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {copasstRecords.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500">
                  <div className="max-w-md mx-auto space-y-2">
                    <Users className="w-8 h-8 text-blue-600 mx-auto" />
                    <p className="font-bold text-slate-800 text-sm">Libro de Actas del COPASST Listo (0 Actas)</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      No hay actas de prueba. Pulsa en «+ Radicar Nueva Acta Mensual» para custodiar las actas ordinarias o extraordinarias de Essential Pharma con su soporte en PDF.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FASE A: ACTUAR */}
      {activePhase === 'Actuar' && (
        <div className="max-w-4xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <TrendingDown className="w-5 h-5 text-purple-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Planes de Mejora Continua & Revisión Anual por la Alta Dirección
            </h3>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <p>
              Conforme al ciclo PHVA (Decreto 1072/2015), la Alta Dirección de <strong>Essential Pharma S.A.S.</strong> revisa periódicamente los resultados de auditorías, inspecciones del COPASST e indicadores para aprobar planes de mejora y asignación de recursos:
            </p>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Módulo de Mejora Continua en Limpio y Operativo</span>
              </div>
              <p className="text-emerald-900 text-xs leading-relaxed">
                El sistema está preparado para recibir y documentar las acciones correctivas, preventivas y planes de intervención que se aprueben en las reuniones de gerencia y comités de SST de la organización.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPORTAR ACCIDENTE / INCIDENTE */}
      {showAccidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-rose-900 text-white">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-300" />
                <h3 className="font-bold text-sm">Reporte de Accidente o Incidente de Trabajo</h3>
              </div>
              <button onClick={() => setShowAccidentModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccident} className="p-6 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Evento *</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium"
                  >
                    <option value="Accidente de Trabajo">Accidente de Trabajo</option>
                    <option value="Incidente">Incidente (Casi Accidente)</option>
                    <option value="Enfermedad Laboral">Enfermedad Laboral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fecha del Evento *</label>
                  <input
                    type="date"
                    required
                    value={accDate}
                    onChange={(e) => setAccDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre del Trabajador Involucrado *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="Ej. Andrés Felipe Gómez Meza"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Área / Departamento</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Comercial y Ventas">Comercial y Ventas</option>
                    <option value="Operaciones y Producción">Operaciones y Producción</option>
                    <option value="Finanzas y Contabilidad">Finanzas y Contabilidad</option>
                    <option value="Calidad y Regulatorio">Calidad y Regulatorio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lugar Exacto del Evento</label>
                  <input
                    type="text"
                    value={accLocation}
                    onChange={(e) => setAccLocation(e.target.value)}
                    placeholder="Ej. Bodega Principal / En Ruta Bucaramanga"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Descripción Detallada del Evento *</label>
                <textarea
                  required
                  rows={2}
                  value={accDesc}
                  onChange={(e) => setAccDesc(e.target.value)}
                  placeholder="¿Qué estaba haciendo el trabajador? ¿Cómo ocurrió el evento?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severidad</label>
                  <select
                    value={accSeverity}
                    onChange={(e) => setAccSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Sin Incapacidad">Sin Incapacidad</option>
                    <option value="Leve">Leve (&lt; 3 días)</option>
                    <option value="Grave">Grave (&gt;= 3 días o fractura)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Días de Incapacidad</label>
                  <input
                    type="number"
                    min={0}
                    value={accDays}
                    onChange={(e) => setAccDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Soportes Legales: FURAT y Registro Fotográfico */}
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-950 block">Radicación de FURAT ante ARL</span>
                    <p className="text-[11px] text-rose-800">Se reporta dentro de las 48h hábiles legales.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={accFurat}
                    onChange={(e) => setAccFurat(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </div>

                <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-100 border border-rose-300 rounded text-rose-900 font-bold text-[11px]">
                    <Camera className="w-3.5 h-3.5 text-rose-700" />
                    Adjuntar Foto del Evento / Puesto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => setHasPhotoUpload(true)}
                    />
                  </label>
                  {hasPhotoUpload && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Foto cargada
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAccidentModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Guardar Reporte & Soporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RADICAR ACTA COPASST */}
      {showCopasstModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Radicar Acta de Reunión COPASST</h3>
              </div>
              <button onClick={() => setShowCopasstModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCopasst} className="p-6 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Sesión</label>
                  <select
                    value={copSessionType}
                    onChange={(e) => setCopSessionType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Reunión Ordinaria Mensual">Reunión Ordinaria Mensual</option>
                    <option value="Extraordinaria por Accidente">Extraordinaria por Accidente</option>
                    <option value="Inspección de Puestos">Inspección de Puestos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fecha de la Sesión *</label>
                  <input
                    type="date"
                    required
                    value={copDate}
                    onChange={(e) => setCopDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Número de Asistentes Delegados</label>
                <input
                  type="number"
                  min={1}
                  value={copAttendees}
                  onChange={(e) => setCopAttendees(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tema Principal 1 *</label>
                <input
                  type="text"
                  required
                  value={copTopic1}
                  onChange={(e) => setCopTopic1(e.target.value)}
                  placeholder="Ej. Seguimiento a condiciones ergonómicas en puestos de digitación"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tema Principal 2 (Opcional)</label>
                <input
                  type="text"
                  value={copTopic2}
                  onChange={(e) => setCopTopic2(e.target.value)}
                  placeholder="Ej. Inspección de extintores y botiquines de correría"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Compromiso / Acuerdo Adquirido *</label>
                <textarea
                  required
                  rows={2}
                  value={copCommitment}
                  onChange={(e) => setCopCommitment(e.target.value)}
                  placeholder="Compromisos con responsable y fecha para la siguiente sesión..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Subir Acta Firmada en PDF */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">Custodia del Acta Firmada en PDF</span>
                <p className="text-[11px] text-emerald-800">Adjunta el escaneo o archivo PDF con las firmas del presidente y secretario del COPASST.</p>
                <div className="pt-2 flex items-center justify-between">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg font-bold text-emerald-900 text-xs shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    Seleccionar PDF Firmado
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={() => setCopActUploaded(true)}
                    />
                  </label>
                  {copActUploaded && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Acta cargada
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCopasstModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Guardar Acta COPASST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO PELIGRO (GTC 45) */}
      {showHazardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-blue-900 text-white">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-blue-300" />
                <h3 className="font-bold text-sm">Identificación de Peligro (Guía GTC 45)</h3>
              </div>
              <button onClick={() => setShowHazardModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHazard} className="p-6 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Proceso</label>
                  <select
                    value={hazardProcess}
                    onChange={(e) => setHazardProcess(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Comercial & Correrías">Comercial & Correrías</option>
                    <option value="Administrativo & Ventas">Administrativo & Ventas</option>
                    <option value="Calidad & Almacén">Calidad & Almacén</option>
                    <option value="Operaciones y Logística">Operaciones y Logística</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Clasificación GTC 45</label>
                  <select
                    value={hazardClass}
                    onChange={(e) => setHazardClass(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium"
                  >
                    <option value="Biomecánico / Ergonómico">Biomecánico / Ergonómico</option>
                    <option value="Locativo / Mecánico">Locativo / Mecánico (Vial)</option>
                    <option value="Químico">Químico</option>
                    <option value="Psicosocial">Psicosocial</option>
                    <option value="Físico">Físico</option>
                    <option value="Biológico">Biológico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Actividad o Puesto de Trabajo *</label>
                <input
                  type="text"
                  required
                  value={hazardActivity}
                  onChange={(e) => setHazardActivity(e.target.value)}
                  placeholder="Ej. Manejo de vehículo corporativo en traslados de correría intermunicipal"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Descripción del Peligro *</label>
                <textarea
                  required
                  rows={2}
                  value={hazardDesc}
                  onChange={(e) => setHazardDesc(e.target.value)}
                  placeholder="¿Cuál es la fuente de riesgo o condición insegura?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Efectos Posibles</label>
                  <input
                    type="text"
                    value={hazardEffects}
                    onChange={(e) => setHazardEffects(e.target.value)}
                    placeholder="Ej. Fatiga muscular, estrés térmico..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trabajadores Expuestos</label>
                  <input
                    type="number"
                    min={1}
                    value={hazardExposed}
                    onChange={(e) => setHazardExposed(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Controles Existentes (Fuente, Medio, Individuo)</label>
                <input
                  type="text"
                  value={hazardControls}
                  onChange={(e) => setHazardControls(e.target.value)}
                  placeholder="Ej. Mantenimiento vehicular preventivo, EPP y pausas activas"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Plan de Intervención Recomendado</label>
                <input
                  type="text"
                  value={hazardIntervention}
                  onChange={(e) => setHazardIntervention(e.target.value)}
                  placeholder="Ej. Capacitación en manejo defensivo y revisión con ARL"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHazardModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Guardar Peligro GTC 45
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VISOR DE EVIDENCIAS Y DOCUMENTOS SST */}
      {previewSSTDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="font-bold text-sm leading-tight">{previewSSTDoc.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {previewSSTDoc.code} · {previewSSTDoc.filename}
                  </span>
                </div>
              </div>
              <button onClick={() => setPreviewSSTDoc(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                  <span className="font-bold text-rose-900 uppercase tracking-widest font-mono text-[10px]">
                    SOPORTE LEGAL · SISTEMA DE GESTIÓN SST
                  </span>
                  <span className="bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    Decreto 1072 / Res. 0312
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <p><strong>Categoría:</strong> {previewSSTDoc.category}</p>
                  <p><strong>Fecha de Radicación:</strong> {previewSSTDoc.date}</p>
                  <p><strong>Entidad Receptora:</strong> {previewSSTDoc.entity}</p>
                  <p><strong>Empresa:</strong> Essential Pharma S.A.S. (NIT 900.xxx.xxx-x)</p>
                </div>
              </div>

              {/* Simulated Document Preview Page */}
              <div className="p-6 bg-white border border-slate-300 rounded-xl shadow-inner space-y-3 font-serif text-slate-800 leading-relaxed text-justify">
                <div className="text-center pb-3 border-b border-slate-200">
                  <h4 className="font-bold text-base text-slate-900 font-sans">{previewSSTDoc.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Ministerio del Trabajo de Colombia · ARL Positiva Compañía de Seguros
                  </p>
                </div>

                <p>
                  Por medio del presente documento se deja constancia formal de la radicación y archivo del soporte oficial correspondiente a las actividades del Sistema de Gestión de la Seguridad y Salud en el Trabajo de Essential Pharma S.A.S.
                </p>

                <p>
                  El registro cumple con los requerimientos técnicos de oportunidad, firmas autorizadas de los comités paritarios y notificación oportuna dentro de los términos establecidos por la normatividad laboral colombiana.
                </p>

                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center text-center font-sans text-[11px] text-slate-500">
                  <div>
                    <div className="w-32 border-b border-slate-400 mb-1 mx-auto" />
                    <p className="font-bold text-slate-700">Coordinador SG-SST</p>
                    <p className="text-[10px]">Licencia SST Vigente</p>
                  </div>
                  <div>
                    <div className="w-32 border-b border-slate-400 mb-1 mx-auto" />
                    <p className="font-bold text-slate-700">Comité COPASST</p>
                    <p className="text-[10px]">Delegados Trabajadores</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Radicado Oficial: Verificado ante ARL
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast('info', 'Documento Descargado', `Descargando ${previewSSTDoc.filename}`);
                    setPreviewSSTDoc(null);
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Copia Oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
