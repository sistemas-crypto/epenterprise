import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import {
  QualityDocument,
  QualityRisk,
  CAPARecord,
  InternalAudit,
  QualityDocumentType
} from '../../types/hr';
import {
  INITIAL_QUALITY_DOCUMENTS,
  INITIAL_QUALITY_RISKS,
  INITIAL_CAPAS,
  INITIAL_INTERNAL_AUDITS,
  ESSENTIAL_PHARMA_PROCESSES,
  ProcessMetadata
} from '../../data/qualityData';
import {
  Award,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  X,
  Download,
  Eye,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  BookOpen,
  HelpCircle,
  Activity,
  Calendar,
  Building,
  Paperclip,
  Check,
  Upload,
  ExternalLink,
  Shield,
  Folder,
  FolderOpen,
  ArrowLeft,
  Briefcase,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';

export const QualityManagementISO9001: React.FC = () => {
  const { showToast } = useHR();

  const [activeTab, setActiveTab] = useState<'processes' | 'docs' | 'risks' | 'capas' | 'audits' | 'policy'>('processes');
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<QualityDocument[]>(() => {
    const saved = localStorage.getItem('ep_quality_docs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((d: any) => d.id === 'doc-001' || d.id === 'doc-002')) {
          localStorage.removeItem('ep_quality_docs');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_QUALITY_DOCUMENTS;
  });
  const [risks, setRisks] = useState<QualityRisk[]>(() => {
    const saved = localStorage.getItem('ep_quality_risks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((r: any) => r.id === 'rsk-001' || r.id === 'rsk-002')) {
          localStorage.removeItem('ep_quality_risks');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_QUALITY_RISKS;
  });
  const [capas, setCapas] = useState<CAPARecord[]>(() => {
    const saved = localStorage.getItem('ep_quality_capas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((c: any) => c.id === 'capa-001' || c.id === 'capa-002')) {
          localStorage.removeItem('ep_quality_capas');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return INITIAL_CAPAS;
  });
  const [audits] = useState<InternalAudit[]>(INITIAL_INTERNAL_AUDITS);

  const handleDeleteDoc = (id: string, title: string) => {
    if (window.confirm(`¿Deseas eliminar el documento "${title}"?`)) {
      const updated = documents.filter((d) => d.id !== id);
      setDocuments(updated);
      localStorage.setItem('ep_quality_docs', JSON.stringify(updated));
      showToast('info', 'Documento Eliminado', `Se retiró el documento "${title}" del expediente.`);
    }
  };

  const handleDeleteRisk = (id: string, code: string) => {
    if (window.confirm(`¿Deseas eliminar el riesgo "${code}"?`)) {
      const updated = risks.filter((r) => r.id !== id);
      setRisks(updated);
      localStorage.setItem('ep_quality_risks', JSON.stringify(updated));
      showToast('info', 'Riesgo Eliminado', `Se retiró el riesgo ${code} de la matriz.`);
    }
  };

  const handleDeleteCapa = (id: string, code: string) => {
    if (window.confirm(`¿Deseas eliminar el registro CAPA "${code}"?`)) {
      const updated = capas.filter((c) => c.id !== id);
      setCapas(updated);
      localStorage.setItem('ep_quality_capas', JSON.stringify(updated));
      showToast('info', 'CAPA Eliminada', `Se retiró la no conformidad ${code}.`);
    }
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [processFilter, setProcessFilter] = useState('ALL');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('ALL');

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    code: string;
    filename: string;
    category: string;
    date: string;
    approver: string;
    process: string;
  } | null>(null);

  // Universal Modal for Uploading File to a Specific Process
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProcess, setUploadProcess] = useState<string>('Cadena de Suministro, Almacén & Cadena de Frío');
  const [uploadDocType, setUploadDocType] = useState<QualityDocumentType>('Procedimiento POE');
  const [uploadCode, setUploadCode] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadVersion, setUploadVersion] = useState(1);
  const [uploadEffectiveDate, setUploadEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadIsoClause, setUploadIsoClause] = useState('7.5 Información Documentada');
  const [uploadApprover, setUploadApprover] = useState('Dra. Mariana Morales Silva');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileSize, setSelectedFileSize] = useState<string>('');

  // Modal State for new CAPA
  const [showCapaModal, setShowCapaModal] = useState(false);
  const [capaTitle, setCapaTitle] = useState('');
  const [capaSource, setCapaSource] = useState<CAPARecord['source']>('Desviación en Proceso');
  const [capaProcess, setCapaProcess] = useState('Cadena de Suministro, Almacén & Cadena de Frío');
  const [capaDesc, setCapaDesc] = useState('');
  const [capaCause, setCapaCause] = useState('');
  const [capaPlan, setCapaPlan] = useState('');
  const [capaResp, setCapaResp] = useState('Dr. Carlos Eduardo Restrepo');
  const [capaDeadline, setCapaDeadline] = useState('2026-10-30');
  const [capaEvidenceType, setCapaEvidenceType] = useState<CAPARecord['evidenceType']>('Informe Técnico');
  const [capaEvidenceFile, setCapaEvidenceFile] = useState(false);

  // Modal State for new Risk (6.1)
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [riskProcess, setRiskProcess] = useState('Cadena de Suministro, Almacén & Cadena de Frío');
  const [riskDesc, setRiskDesc] = useState('');
  const [riskType, setRiskType] = useState<QualityRisk['riskType']>('Riesgo Operativo');
  const [riskProb, setRiskProb] = useState(3);
  const [riskImp, setRiskImp] = useState(3);
  const [riskTreatment, setRiskTreatment] = useState('');
  const [riskResp, setRiskResp] = useState('Dr. Carlos Eduardo Restrepo');

  // Handle file selection from local PC
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFileSize(`${sizeInMB} MB`);

      // Auto-suggest code if empty
      if (!uploadCode) {
        const prefix =
          uploadDocType === 'Procedimiento POE'
            ? 'POE'
            : uploadDocType === 'Ficha de Caracterización'
            ? 'FIC'
            : uploadDocType === 'Política / Manual'
            ? 'POL'
            : uploadDocType === 'Formato / Plantilla'
            ? 'FOR'
            : 'REG';
        const procCode = uploadProcess.substring(0, 3).toUpperCase();
        setUploadCode(`${prefix}-${procCode}-0${documents.length + 1}`);
      }
    }
  };

  // Save new uploaded Document
  const handleSaveUploadedDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;

    const finalCode = uploadCode || `DOC-${Math.floor(100 + Math.random() * 900)}`;
    const finalFilename = selectedFileName || `${finalCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;

    const newDoc: QualityDocument = {
      id: `doc-${Date.now()}`,
      code: finalCode.toUpperCase(),
      title: uploadTitle,
      process: uploadProcess,
      documentType: uploadDocType,
      version: Number(uploadVersion),
      status: 'Vigente',
      effectiveDate: uploadEffectiveDate,
      approvedBy: uploadApprover,
      isoClause: uploadIsoClause,
      fileAttachment: finalFilename,
      fileSize: selectedFileSize || '1.8 MB',
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    localStorage.setItem('ep_quality_docs', JSON.stringify(updated));
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadCode('');
    setSelectedFileName('');
    setSelectedFileSize('');
    showToast('success', 'Documento Custodiado', `El documento ${newDoc.code} ha sido incorporado al expediente del proceso ${newDoc.process}.`);
  };

  // Save CAPA
  const handleSaveCapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaTitle || !capaDesc) return;

    const codeNum = capas.length + 1;
    const newCapa: CAPARecord = {
      id: `capa-${Date.now()}`,
      code: `NC-2026-00${codeNum}`,
      title: capaTitle,
      source: capaSource,
      process: capaProcess,
      dateReported: new Date().toISOString().split('T')[0],
      findingDescription: capaDesc,
      rootCauseAnalysis: capaCause || 'En análisis mediante metodología 5 Porqués.',
      correctiveActionPlan: capaPlan || 'Plan de acción preventivo en estructuración.',
      responsible: capaResp,
      deadline: capaDeadline,
      status: 'Abierta',
      effectivenessVerified: false,
      evidenceAttachmentName: capaEvidenceFile
        ? `soporte_evidencia_nc_2026_00${codeNum}.pdf`
        : undefined,
      evidenceType: capaEvidenceType,
    };

    const updated = [newCapa, ...capas];
    setCapas(updated);
    localStorage.setItem('ep_quality_capas', JSON.stringify(updated));
    setShowCapaModal(false);
    setCapaTitle('');
    setCapaDesc('');
    setCapaCause('');
    setCapaPlan('');
    setCapaEvidenceFile(false);
    showToast('success', 'No Conformidad Registrada', `Se generó el registro ${newCapa.code} con soporte digital adjunto.`);
  };

  // Save Risk (6.1)
  const handleSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskDesc || !riskTreatment) return;

    const score = riskProb * riskImp;
    const level: QualityRisk['level'] =
      score >= 16 ? 'Extremo' : score >= 10 ? 'Alto' : score >= 6 ? 'Medio' : 'Bajo';

    const newRisk: QualityRisk = {
      id: `rsk-${Date.now()}`,
      code: `RSK-${riskProcess.substring(0, 3).toUpperCase()}-0${risks.length + 1}`,
      process: riskProcess,
      description: riskDesc,
      riskType,
      probability: riskProb,
      impact: riskImp,
      riskScore: score,
      level,
      treatmentPlan: riskTreatment,
      responsible: riskResp,
      status: 'Controlado',
    };

    const updated = [newRisk, ...risks];
    setRisks(updated);
    localStorage.setItem('ep_quality_risks', JSON.stringify(updated));
    setShowRiskModal(false);
    setRiskDesc('');
    setRiskTreatment('');
    showToast('success', 'Riesgo Registrado (6.1)', `Nuevo riesgo ${newRisk.code} valorado con nivel ${level}.`);
  };

  // Verify and Close CAPA
  const handleVerifyCapa = (id: string) => {
    const updated = capas.map((c) =>
      c.id === id
        ? {
            ...c,
            status: 'Cerrada con Eficacia Verificada' as const,
            effectivenessVerified: true,
            evidenceAttachmentName:
              c.evidenceAttachmentName || `informe_cierre_eficacia_${c.code.toLowerCase()}.pdf`,
          }
        : c
    );
    setCapas(updated);
    localStorage.setItem('ep_quality_capas', JSON.stringify(updated));
    showToast('success', 'CAPA Cerrada con Eficacia', 'Se verificó la eficacia del plan correctivo y se adjuntó el informe de cierre.');
  };

  const handleOpenUploadForProcess = (procName: string) => {
    setUploadProcess(procName);
    setShowUploadModal(true);
  };

  // Selected process object if any
  const currentProcess = ESSENTIAL_PHARMA_PROCESSES.find((p) => p.id === selectedProcessId);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Sistema de Gestión de Calidad
                </h1>
                <span className="text-[10px] font-mono font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  ISO 9001:2015
                </span>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full">
                  Expedientes por Proceso
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Essential Pharma S.A.S. · Carga y Custodia de POEs, Fichas de Caracterización, Políticas y Formatos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            + Subir Archivo al Proceso
          </button>

          {activeTab === 'risks' && (
            <button
              onClick={() => setShowRiskModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              + Identificar Riesgo (6.1)
            </button>
          )}

          {activeTab === 'capas' && (
            <button
              onClick={() => setShowCapaModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-700 rounded-lg hover:bg-amber-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              + Diligenciar CAPA
            </button>
          )}
        </div>
      </div>

      {/* Modelo Híbrido Banner */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-950">
              ¿Cómo cargar y custodiar archivos por proceso puntual?
            </span>
            <p className="text-[11px] text-emerald-900 mt-0.5">
              Haz clic en la pestaña <strong>«Mapa de Procesos & Expedientes»</strong>, selecciona el macroproceso (ej. <em>Cadena de Suministro</em> o <em>Calidad</em>) y pulsa en <strong>«+ Subir Archivo a este Proceso»</strong> para anexar POEs, Fichas, Políticas o Formatos oficiales en PDF/Excel.
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-300">
          Control de Información (7.5)
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('processes');
            setSelectedProcessId(null);
          }}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'processes'
              ? 'border-emerald-700 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Mapa de Procesos & Expedientes ({ESSENTIAL_PHARMA_PROCESSES.length})
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'docs'
              ? 'border-emerald-700 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Listado Maestro General ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('risks')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'risks'
              ? 'border-emerald-700 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Matriz de Riesgos & Oportunidades (6.1)
        </button>

        <button
          onClick={() => setActiveTab('capas')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'capas'
              ? 'border-emerald-700 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          No Conformidades & CAPAs (10.2)
        </button>

        <button
          onClick={() => setActiveTab('audits')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'audits'
              ? 'border-emerald-700 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Auditorías Internas (9.2)
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'policy'
              ? 'border-emerald-700 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Política de Calidad
        </button>
      </div>

      {/* TAB 0: MAPA DE PROCESOS & EXPEDIENTES POR PROCESO */}
      {activeTab === 'processes' && (
        <div className="space-y-6">
          {!selectedProcessId ? (
            /* Vista General de los 8 Procesos */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Mapa de Procesos de Essential Pharma S.A.S.
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selecciona una carpeta para ingresar al expediente documental con todos los POEs, políticas, fichas y registros de ese proceso.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {documents.length} archivos custodiados en total
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ESSENTIAL_PHARMA_PROCESSES.map((proc) => {
                  const procDocs = documents.filter((d) => d.process === proc.name);
                  const poeCount = procDocs.filter((d) => d.documentType === 'Procedimiento POE').length;
                  const polCount = procDocs.filter((d) => d.documentType === 'Política / Manual').length;

                  return (
                    <div
                      key={proc.id}
                      onClick={() => setSelectedProcessId(proc.id)}
                      className="p-5 bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-xl cursor-pointer transition-all space-y-3 flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            {proc.code}
                          </div>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              proc.category === 'Estratégico'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : proc.category === 'Misional'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {proc.category}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-emerald-800 transition-colors">
                          {proc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {proc.objective}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Total Documentos:</span>
                          <span className="font-bold text-slate-800 font-mono">{procDocs.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{poeCount} POEs</span>
                          <span>{polCount} Políticas</span>
                          <span>ISO: {proc.isoClauses}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Vista del Expediente del Proceso Seleccionado */
            <div className="space-y-5">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProcessId(null)}
                      className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                      title="Volver a todos los procesos"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-emerald-800 px-2 py-0.5 rounded">
                          {currentProcess?.code}
                        </span>
                        <h3 className="font-bold text-base text-slate-900">
                          {currentProcess?.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Líder del Proceso: <strong>{currentProcess?.leader}</strong> · Numerales ISO 9001: <span className="font-mono">{currentProcess?.isoClauses}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenUploadForProcess(currentProcess?.name || '')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    + Subir Archivo a este Proceso
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700">
                  <strong>Objetivo del Proceso:</strong> {currentProcess?.objective}
                </div>
              </div>

              {/* Categorías de Archivos del Proceso */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setDocTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    docTypeFilter === 'ALL'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Todos los Archivos ({documents.filter((d) => d.process === currentProcess?.name).length})
                </button>
                <button
                  onClick={() => setDocTypeFilter('Ficha de Caracterización')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    docTypeFilter === 'Ficha de Caracterización'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Fichas de Proceso ({documents.filter((d) => d.process === currentProcess?.name && d.documentType === 'Ficha de Caracterización').length})
                </button>
                <button
                  onClick={() => setDocTypeFilter('Procedimiento POE')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    docTypeFilter === 'Procedimiento POE'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Procedimientos POE ({documents.filter((d) => d.process === currentProcess?.name && d.documentType === 'Procedimiento POE').length})
                </button>
                <button
                  onClick={() => setDocTypeFilter('Política / Manual')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    docTypeFilter === 'Política / Manual'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Políticas & Manuales ({documents.filter((d) => d.process === currentProcess?.name && d.documentType === 'Política / Manual').length})
                </button>
                <button
                  onClick={() => setDocTypeFilter('Formato / Plantilla')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    docTypeFilter === 'Formato / Plantilla'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Formatos & Plantillas ({documents.filter((d) => d.process === currentProcess?.name && d.documentType === 'Formato / Plantilla').length})
                </button>
              </div>

              {/* Table of Documents in this Process */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Código & Versión</th>
                      <th className="py-3 px-4">Título del Documento</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Fecha Vigencia</th>
                      <th className="py-3 px-4">Archivo Custodiado</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents
                      .filter((d) => d.process === currentProcess?.name)
                      .filter((d) => docTypeFilter === 'ALL' || d.documentType === docTypeFilter)
                      .map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {doc.code}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-1.5 font-bold">
                              v{doc.version}.0
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-800">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.isoClause}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {doc.documentType || 'Procedimiento POE'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{doc.effectiveDate}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="truncate max-w-[140px]">{doc.fileAttachment}</span>
                              <span className="text-[10px] text-slate-400 font-sans">({doc.fileSize || '1.8 MB'})</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                doc.status === 'Vigente'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  setPreviewDoc({
                                    title: doc.title,
                                    code: doc.code,
                                    filename: doc.fileAttachment || `${doc.code.toLowerCase()}.pdf`,
                                    category: doc.documentType || 'Procedimiento POE',
                                    date: doc.effectiveDate,
                                    approver: doc.approvedBy,
                                    process: doc.process,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                Ver Archivo
                              </button>
                              <button
                                onClick={() =>
                                  showToast('info', 'Documento Descargado', `Descargando ${doc.fileAttachment}`)
                                }
                                className="inline-flex items-center p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Descargar copia"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.id, doc.title)}
                                className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Eliminar documento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {documents.filter((d) => d.process === currentProcess?.name).length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                              <FolderOpen className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-slate-800 text-sm">Expediente Listo para Custodia Documental</p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Aún no has custodiado documentos en <strong>{currentProcess?.name}</strong>. Adjunta los POEs, políticas, fichas o formatos oficiales de este proceso.
                            </p>
                            <button
                              onClick={() => handleOpenUploadForProcess(currentProcess?.name || '')}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              + Subir Primer Archivo a este Proceso
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: LISTADO MAESTRO GENERAL */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar documento por código, título o proceso..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
              >
                <option value="ALL">Todos los Procesos</option>
                {ESSENTIAL_PHARMA_PROCESSES.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código & Versión</th>
                    <th className="py-3 px-4">Título del Documento</th>
                    <th className="py-3 px-4">Proceso</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Fecha Vigencia</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents
                    .filter((d) => {
                      const matches =
                        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.process.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesProcess = processFilter === 'ALL' || d.process.includes(processFilter);
                      return matches && matchesProcess;
                    })
                    .map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {doc.code}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-1.5 font-bold">
                            v{doc.version}.0
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{doc.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.isoClause}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-700">{doc.process}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {doc.documentType || 'Procedimiento POE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{doc.effectiveDate}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              doc.status === 'Vigente'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                setPreviewDoc({
                                  title: doc.title,
                                  code: doc.code,
                                  filename: doc.fileAttachment || `${doc.code.toLowerCase()}.pdf`,
                                  category: doc.documentType || 'Procedimiento POE',
                                  date: doc.effectiveDate,
                                  approver: doc.approvedBy,
                                  process: doc.process,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Ver
                            </button>
                            <button
                              onClick={() =>
                                showToast('info', 'Documento Descargado', `Descargando ${doc.fileAttachment}`)
                              }
                              className="inline-flex items-center p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              title="Descargar archivo"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(doc.id, doc.title)}
                              className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Eliminar documento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATRIZ DE RIESGOS & OPORTUNIDADES (6.1) */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">
                Enfoque Basado en Riesgos (Numeral 6.1 ISO 9001:2015)
              </p>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                La plataforma calcula automáticamente la criticidad mediante la fórmula de matriz de riesgos ($P \times I$). Puedes registrar y actualizar el plan de tratamiento directamente en el sistema.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código & Proceso</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Descripción del Riesgo / Oportunidad</th>
                    <th className="py-3 px-4 text-center">P x I = Nivel</th>
                    <th className="py-3 px-4">Plan de Tratamiento / Mitigación</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {risks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {risk.code}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">{risk.process}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            risk.riskType === 'Oportunidad de Mejora'
                              ? 'bg-blue-100 text-blue-800'
                              : risk.riskType === 'Riesgo Regulatorio'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {risk.riskType}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <p className="text-slate-800 font-medium leading-relaxed">{risk.description}</p>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="text-slate-600 font-bold">
                          {risk.probability} x {risk.impact} = {risk.riskScore}
                        </span>
                        <span
                          className={`block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                            risk.level === 'Extremo'
                              ? 'bg-rose-100 text-rose-800'
                              : risk.level === 'Alto'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {risk.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-700">
                        <p className="leading-relaxed">{risk.treatmentPlan}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{risk.responsible}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            risk.status === 'Controlado'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {risk.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteRisk(risk.id, risk.code)}
                          className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Eliminar riesgo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {risks.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="max-w-md mx-auto space-y-3">
                          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                          <p className="font-bold text-slate-800 text-sm">Matriz de Riesgos Lista (0 Riesgos)</p>
                          <p className="text-xs text-slate-500">
                            No hay riesgos de prueba. Pulsa en «+ Identificar Riesgo (6.1)» para evaluar los riesgos de cada proceso conforme a ISO 9001.
                          </p>
                          <button
                            onClick={() => setShowRiskModal(true)}
                            className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                          >
                            + Registrar Primer Riesgo
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

      {/* TAB 3: NO CONFORMIDADES & CAPAS (10.2) */}
      {activeTab === 'capas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capas.map((capa) => (
              <div
                key={capa.id}
                className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {capa.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        capa.status === 'Cerrada con Eficacia Verificada'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {capa.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs leading-snug">{capa.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Origen: <span className="font-bold text-slate-700">{capa.source}</span> · Proceso: {capa.process}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg text-slate-700 text-xs space-y-1.5 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      Causa Raíz (5 Porqués):
                    </p>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">{capa.rootCauseAnalysis}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-lg text-slate-700 text-xs space-y-1.5 border border-emerald-100">
                    <p className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                      Plan de Acción Correctiva:
                    </p>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">{capa.correctiveActionPlan}</p>
                  </div>

                  {/* Evidence Attachment Section */}
                  <div className="pt-1">
                    {capa.evidenceAttachmentName ? (
                      <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-teal-950 text-[11px] block truncate">
                              {capa.evidenceAttachmentName}
                            </span>
                            <span className="text-[10px] text-teal-700">
                              Tipo: {capa.evidenceType || 'Evidencia Técnica'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setPreviewDoc({
                              title: `Evidencia de Cierre: ${capa.title}`,
                              code: capa.code,
                              filename: capa.evidenceAttachmentName!,
                              category: capa.evidenceType || 'Evidencia Técnica',
                              date: capa.dateReported,
                              approver: capa.responsible,
                              process: capa.process,
                            })
                          }
                          className="px-2 py-1 bg-white hover:bg-teal-100 text-teal-800 text-[10px] font-bold rounded border border-teal-300 shadow-2xs shrink-0 ml-2"
                        >
                          Ver Soporte
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">Sin archivo de soporte</span>
                        <button
                          onClick={() => {
                            const updated = capas.map((c) =>
                              c.id === capa.id
                                ? {
                                    ...c,
                                    evidenceAttachmentName: `soporte_tecnico_${c.code.toLowerCase()}_anexo.pdf`,
                                    evidenceType: 'Informe Técnico' as const,
                                  }
                                : c
                            );
                            setCapas(updated);
                            localStorage.setItem('ep_quality_capas', JSON.stringify(updated));
                            showToast('info', 'Evidencia Adjuntada', 'Se ha anexado el soporte documental digital.');
                          }}
                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          + Adjuntar Evidencia
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Resp: <strong>{capa.responsible}</strong></span>
                    <span className="font-mono">Límite: {capa.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {capa.status !== 'Cerrada con Eficacia Verificada' ? (
                      <button
                        onClick={() => handleVerifyCapa(capa.id)}
                        className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verificar y Cerrar
                      </button>
                    ) : (
                      <span className="flex-1 py-1 text-center font-bold text-[11px] text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                        ✓ Eficacia Comprobada
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteCapa(capa.id, capa.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                      title="Eliminar CAPA"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {capas.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
                <div className="max-w-md mx-auto space-y-3">
                  <Activity className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">Módulo CAPA Listo (0 Desviaciones)</p>
                  <p className="text-xs text-slate-500">
                    No hay registros de prueba. Pulsa en «+ Diligenciar CAPA» para registrar una no conformidad con análisis de 5 Porqués y plan de acción preventivo.
                  </p>
                  <button
                    onClick={() => setShowCapaModal(true)}
                    className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
                  >
                    + Diligenciar Primera CAPA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PROGRAMA DE AUDITORÍAS (9.2) */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{audit.code}</span>
                      <h3 className="font-bold text-sm text-slate-900">{audit.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fecha: <span className="font-mono font-semibold text-slate-700">{audit.date}</span> · Auditor Líder: {audit.leadAuditor}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      audit.status === 'Cerrada'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {audit.status}
                  </span>

                  {audit.auditReportAttachmentName && (
                    <button
                      onClick={() =>
                        setPreviewDoc({
                          title: audit.title,
                          code: audit.code,
                          filename: audit.auditReportAttachmentName!,
                          category: 'Informe Oficial de Auditoría Interna',
                          date: audit.date,
                          approver: audit.leadAuditor,
                          process: 'Dirección Estratégica & Calidad',
                        })
                      }
                      className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold shadow-2xs"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-purple-700" />
                      Ver Informe Firmado
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alcance de la Auditoría:</p>
                <p className="text-xs text-slate-600 leading-relaxed">{audit.scope}</p>
              </div>

              {/* Findings Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-bold">Conformidades</span>
                  <p className="text-xl font-black text-emerald-950 font-mono mt-0.5">
                    {audit.findings.conformities}
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg text-center border border-amber-200">
                  <span className="text-xs text-amber-800 font-bold">NC Menores</span>
                  <p className="text-xl font-black text-amber-950 font-mono mt-0.5">
                    {audit.findings.minorNC}
                  </p>
                </div>

                <div className="p-3 bg-rose-50 rounded-lg text-center border border-rose-200">
                  <span className="text-xs text-rose-800 font-bold">NC Mayores</span>
                  <p className="text-xl font-black text-rose-950 font-mono mt-0.5">
                    {audit.findings.majorNC}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
                  <span className="text-xs text-blue-800 font-bold">Oportunidades Mejora</span>
                  <p className="text-xl font-black text-blue-950 font-mono mt-0.5">
                    {audit.findings.opportunities}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: POLÍTICA DE CALIDAD & ALCANCE */}
      {activeTab === 'policy' && (
        <div className="max-w-4xl bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
              Numeral 5.2 ISO 9001:2015
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Política Integral de Calidad de Essential Pharma S.A.S.
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed text-justify">
            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              «En <strong>Essential Pharma S.A.S.</strong> nos comprometemos a comercializar y distribuir productos farmacéuticos y hospitalarios con los más altos estándares de calidad, seguridad y eficacia terapéutica, satisfaciendo los requerimientos de nuestros clientes institucionales y la normatividad sanitaria vigente del Invima, mediante la mejora continua de nuestros procesos y el desarrollo integral de nuestro talento humano.»
            </p>

            <h3 className="font-bold text-slate-900 text-sm pt-2">Objetivos de Calidad Corporativos:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 font-mono">OBJ-01</span>
                <p className="font-bold text-slate-900">Satisfacción del Cliente Institucional</p>
                <p className="text-[11px] text-slate-500">Mantener un índice de satisfacción superior al 95% en clínicas y hospitales.</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 font-mono">OBJ-02</span>
                <p className="font-bold text-slate-900">Aseguramiento de Cadena de Frío</p>
                <p className="text-[11px] text-slate-500">Garantizar el 100% de cumplimiento en temperaturas durante el transporte y correrías.</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 font-mono">OBJ-03</span>
                <p className="font-bold text-slate-900">Eficacia de Acciones Correctivas (CAPA)</p>
                <p className="text-[11px] text-slate-500">Cerrar el 90% de las no conformidades dentro del plazo estipulado con eficacia comprobada.</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 font-mono">OBJ-04</span>
                <p className="font-bold text-slate-900">Competencia del Personal</p>
                <p className="text-[11px] text-slate-500">Cumplir con más del 95% del plan anual de capacitación técnica y regulatoria.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL MODAL: SUBIR ARCHIVO AL PROCESO */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Cargar y Custodiar Archivo en el Proceso</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUploadedDoc} className="p-6 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Proceso Destino *</label>
                <select
                  value={uploadProcess}
                  onChange={(e) => setUploadProcess(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                >
                  {ESSENTIAL_PHARMA_PROCESSES.map((proc) => (
                    <option key={proc.id} value={proc.name}>
                      {proc.code} — {proc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Documento *</label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value as QualityDocumentType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Procedimiento POE">Procedimiento POE</option>
                    <option value="Ficha de Caracterización">Ficha de Caracterización</option>
                    <option value="Política / Manual">Política / Manual</option>
                    <option value="Formato / Plantilla">Formato / Plantilla</option>
                    <option value="Evidencia / Registro">Evidencia / Registro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Código del Documento</label>
                  <input
                    type="text"
                    value={uploadCode}
                    onChange={(e) => setUploadCode(e.target.value)}
                    placeholder="Ej. POE-CS-015"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre o Título Oficial del Documento *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Ej. Procedimiento de Cuarentena y Liberación Técnica de Lotes"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Versión</label>
                  <input
                    type="number"
                    min={1}
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fecha Vigencia</label>
                  <input
                    type="date"
                    required
                    value={uploadEffectiveDate}
                    onChange={(e) => setUploadEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Numeral ISO</label>
                  <input
                    type="text"
                    value={uploadIsoClause}
                    onChange={(e) => setUploadIsoClause(e.target.value)}
                    placeholder="Ej. 8.5 Operaciones"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Aprobado Por</label>
                <input
                  type="text"
                  value={uploadApprover}
                  onChange={(e) => setUploadApprover(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Selector Digital de Archivo */}
              <div className="p-4 bg-emerald-50/70 border border-dashed border-emerald-300 rounded-xl space-y-2">
                <span className="font-bold text-emerald-950 block text-xs">
                  Seleccionar Archivo Digital desde tu Computador
                </span>
                <p className="text-[11px] text-emerald-800">
                  Formatos soportados: PDF, Word (.docx), Excel (.xlsx) o Imágenes escaneadas con firmas.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg font-bold text-emerald-900 text-xs shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    Examinar Archivo...
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {selectedFileName ? (
                    <div className="text-[11px] text-emerald-950 font-bold flex items-center gap-1.5 truncate">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{selectedFileName}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({selectedFileSize})</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Ningún archivo seleccionado aún</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Guardar y Custodiar en Proceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA CAPA */}
      {showCapaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-amber-900 text-white">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Registro de No Conformidad / CAPA (10.2)</h3>
              </div>
              <button onClick={() => setShowCapaModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCapa} className="p-6 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Título de la Desviación / Hallazgo *</label>
                <input
                  type="text"
                  required
                  value={capaTitle}
                  onChange={(e) => setCapaTitle(e.target.value)}
                  placeholder="Ej. Discrepancia en conteo de inventario en lote de Ampicilina"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Origen del Hallazgo</label>
                  <select
                    value={capaSource}
                    onChange={(e) => setCapaSource(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Desviación en Proceso">Desviación en Proceso</option>
                    <option value="Auditoría Interna">Auditoría Interna</option>
                    <option value="Reclamo de Cliente / Farmacia">Reclamo de Cliente</option>
                    <option value="Inspección de Calidad">Inspección de Calidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Proceso Afectado</label>
                  <select
                    value={capaProcess}
                    onChange={(e) => setCapaProcess(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {ESSENTIAL_PHARMA_PROCESSES.map((proc) => (
                      <option key={proc.id} value={proc.name}>
                        {proc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Descripción del Hallazgo *</label>
                <textarea
                  required
                  rows={2}
                  value={capaDesc}
                  onChange={(e) => setCapaDesc(e.target.value)}
                  placeholder="Detallar lo observado, evidencia objetiva y requisito incumplido..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Análisis de Causa Raíz (5 Porqués)</label>
                <textarea
                  rows={2}
                  value={capaCause}
                  onChange={(e) => setCapaCause(e.target.value)}
                  placeholder="¿Por qué ocurrió? Falla en el método, mano de obra, maquinaria o material..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Plan de Acción Correctiva</label>
                <textarea
                  rows={2}
                  value={capaPlan}
                  onChange={(e) => setCapaPlan(e.target.value)}
                  placeholder="Acciones concretas para eliminar la causa raíz y evitar recurrencia..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Responsable</label>
                  <input
                    type="text"
                    value={capaResp}
                    onChange={(e) => setCapaResp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={capaDeadline}
                    onChange={(e) => setCapaDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Adjunto de Evidencia Técnica */}
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-950 block">Evidencia Digital de Soporte / Cierre</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-amber-900 text-[11px] mb-0.5">Tipo de Evidencia</label>
                    <select
                      value={capaEvidenceType}
                      onChange={(e) => setCapaEvidenceType(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white border border-amber-300 rounded text-xs"
                    >
                      <option value="Informe Técnico">Informe Técnico</option>
                      <option value="Certificado Calibración">Certificado Calibración</option>
                      <option value="Fotografía">Fotografía</option>
                      <option value="Acta de Reunión">Acta de Reunión</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold text-[11px]">
                      <Paperclip className="w-3 h-3 text-amber-700" />
                      {capaEvidenceFile ? 'Evidencia Lista' : 'Adjuntar Archivo'}
                      <input
                        type="file"
                        className="hidden"
                        onChange={() => setCapaEvidenceFile(true)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCapaModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Registrar CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO RIESGO (6.1) */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Valoración de Riesgo / Oportunidad (Numeral 6.1)</h3>
              </div>
              <button onClick={() => setShowRiskModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRisk} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Proceso</label>
                  <select
                    value={riskProcess}
                    onChange={(e) => setRiskProcess(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {ESSENTIAL_PHARMA_PROCESSES.map((proc) => (
                      <option key={proc.id} value={proc.name}>
                        {proc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo</label>
                  <select
                    value={riskType}
                    onChange={(e) => setRiskType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Riesgo Operativo">Riesgo Operativo</option>
                    <option value="Riesgo Regulatorio">Riesgo Regulatorio</option>
                    <option value="Riesgo de Calidad">Riesgo de Calidad</option>
                    <option value="Oportunidad de Mejora">Oportunidad de Mejora</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Descripción del Evento *</label>
                <textarea
                  required
                  rows={2}
                  value={riskDesc}
                  onChange={(e) => setRiskDesc(e.target.value)}
                  placeholder="¿Qué puede suceder y cómo afectaría la conformidad del producto o servicio?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Matriz P x I interactiva */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Evaluación de Criticidad (P x I)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Probabilidad (1 a 5): {riskProb}</label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={riskProb}
                      onChange={(e) => setRiskProb(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Impacto (1 a 5): {riskImp}</label>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={riskImp}
                      onChange={(e) => setRiskImp(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Puntaje: <strong>{riskProb * riskImp}</strong></span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs ${
                      riskProb * riskImp >= 16
                        ? 'bg-rose-100 text-rose-800'
                        : riskProb * riskImp >= 10
                        ? 'bg-orange-100 text-orange-800'
                        : riskProb * riskImp >= 6
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Nivel: {riskProb * riskImp >= 16 ? 'Extremo' : riskProb * riskImp >= 10 ? 'Alto' : riskProb * riskImp >= 6 ? 'Medio' : 'Bajo'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Plan de Tratamiento / Mitigación *</label>
                <textarea
                  required
                  rows={2}
                  value={riskTreatment}
                  onChange={(e) => setRiskTreatment(e.target.value)}
                  placeholder="Controles operacionales para eliminar o reducir el riesgo..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Responsable</label>
                <input
                  type="text"
                  value={riskResp}
                  onChange={(e) => setRiskResp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRiskModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Incorporar a Matriz 6.1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VISOR DE EVIDENCIAS & POEs */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm leading-tight">{previewDoc.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {previewDoc.code} · {previewDoc.filename}
                  </span>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-emerald-800 uppercase tracking-widest font-mono text-[10px]">
                    DOCUMENTO CONTROLADO · ESSENTIAL PHARMA S.A.S.
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Vigente ISO 9001
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <p><strong>Proceso:</strong> {previewDoc.process}</p>
                  <p><strong>Tipo Documento:</strong> {previewDoc.category}</p>
                  <p><strong>Fecha de Emisión:</strong> {previewDoc.date}</p>
                  <p><strong>Aprobado Por:</strong> {previewDoc.approver}</p>
                </div>
              </div>

              {/* Simulated Document Preview Page */}
              <div className="p-6 bg-white border border-slate-300 rounded-xl shadow-inner space-y-3 font-serif text-slate-800 leading-relaxed text-justify">
                <div className="text-center pb-3 border-b border-slate-200">
                  <h4 className="font-bold text-base text-slate-900 font-sans">{previewDoc.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Certificación de Conformidad Sanitaria y Calidad
                  </p>
                </div>

                <p>
                  El presente documento certifica la validez técnica y el cumplimiento de las directrices establecidas en el Sistema de Gestión de la Calidad bajo los lineamientos de la norma internacional ISO 9001:2015 y las Buenas Prácticas vigentes del Invima.
                </p>

                <p>
                  La información contenida ha sido revisada por la Dirección Técnica y el comité de aseguramiento de calidad, respaldando la trazabilidad de lotes, la preservación de la cadena de frío y el cierre de no conformidades.
                </p>

                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center text-center font-sans text-[11px] text-slate-500">
                  <div>
                    <div className="w-32 border-b border-slate-400 mb-1 mx-auto" />
                    <p className="font-bold text-slate-700">{previewDoc.approver}</p>
                    <p className="text-[10px]">Dirección de Calidad</p>
                  </div>
                  <div>
                    <div className="w-32 border-b border-slate-400 mb-1 mx-auto" />
                    <p className="font-bold text-slate-700">Essential Pharma S.A.S.</p>
                    <p className="text-[10px]">Firma Electrónica Válida</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Hash SHA-256: 7f89b...e21a (Custodiado en Nube)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast('info', 'Documento Descargado', `Descargando ${previewDoc.filename}`);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5"
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
