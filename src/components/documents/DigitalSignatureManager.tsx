import React, { useState, useEffect, useRef } from 'react';
import { useHR } from '../../context/HRContext';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  X,
  FileCheck,
  Search,
  PenTool,
  Download,
  Eye,
  Trash2,
  Calendar,
  Lock,
  Stamp
} from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  category: 'Contrato Laboral' | 'Anexo / Otrosí' | 'Políticas Internas' | 'Acuerdo Confidencialidad';
  employeeId: string;
  employeeName: string;
  status: 'Firmado' | 'Pendiente Firma Colaborador' | 'Pendiente Firma Empresa';
  createdDate: string;
  signedDate?: string;
  fileSize: string;
  hasDianHash: boolean;
  dianHash?: string;
}

export const DigitalSignatureManager: React.FC = () => {
  const { employees, showToast } = useHR();

  const [documents, setDocuments] = useState<LegalDocument[]>(() => {
    const saved = localStorage.getItem('ep_legal_documents');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'DOC-901',
        title: 'Contrato de Trabajo a Término Indefinido - Mariana Giraldo',
        category: 'Contrato Laboral',
        employeeId: 'emp-1',
        employeeName: 'Mariana Giraldo Bedoya',
        status: 'Firmado',
        createdDate: '2026-09-20',
        signedDate: '2026-09-21',
        fileSize: '1.4 MB',
        hasDianHash: true,
        dianHash: 'sha256-8f3a8820c78a06f3a8b273ce96f12ab',
      },
      {
        id: 'DOC-902',
        title: 'Acuerdo de Confidencialidad y No Competencia (NDA)',
        category: 'Acuerdo Confidencialidad',
        employeeId: 'emp-1',
        employeeName: 'Mariana Giraldo Bedoya',
        status: 'Firmado',
        createdDate: '2026-09-20',
        signedDate: '2026-09-22',
        fileSize: '840 KB',
        hasDianHash: true,
        dianHash: 'sha256-4aa2c11a91e4a02c918bb1c7a82fb0',
      },
      {
        id: 'DOC-903',
        title: 'Políticas Internas de Trabajo & Viáticos v4',
        category: 'Políticas Internas',
        employeeId: 'emp-2',
        employeeName: 'Carlos Eduardo Restrepo',
        status: 'Pendiente Firma Colaborador',
        createdDate: '2026-10-01',
        fileSize: '2.1 MB',
        hasDianHash: false,
      },
      {
        id: 'DOC-904',
        title: 'Otrosí de Ajuste de Jornada de Trabajo y Compensaciones',
        category: 'Anexo / Otrosí',
        employeeId: 'emp-2',
        employeeName: 'Carlos Eduardo Restrepo',
        status: 'Pendiente Firma Empresa',
        createdDate: '2026-10-02',
        fileSize: '512 KB',
        hasDianHash: false,
      }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedDocToSign, setSelectedDocToSign] = useState<LegalDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');

  // New Doc Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LegalDocument['category']>('Contrato Laboral');
  const [empId, setEmpId] = useState('');

  // Signature Form Mock Canvas / Box
  const [signName, setSignName] = useState('');
  const [signOtp, setSignOtp] = useState('');
  const [signConsent, setSignConsent] = useState(false);

  useEffect(() => {
    localStorage.setItem('ep_legal_documents', JSON.stringify(documents));
  }, [documents]);

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !empId) return;

    const found = employees.find(e => e.id === empId);
    if (!found) return;

    const newDoc: LegalDocument = {
      id: `DOC-${Math.floor(905 + Math.random() * 90)}`,
      title,
      category,
      employeeId: empId,
      employeeName: `${found.firstName} ${found.lastName}`,
      status: 'Pendiente Firma Colaborador',
      createdDate: new Date().toISOString().split('T')[0],
      fileSize: `${(1 + Math.random() * 2).toFixed(1)} MB`,
      hasDianHash: false,
    };

    setDocuments([newDoc, ...documents]);
    setShowAddModal(false);
    setTitle('');
    setEmpId('');
    showToast('success', 'Documento Registrado', `Se creó el documento. Se ha notificado al colaborador para su firma digital.`);
  };

  const handleOpenSignModal = (doc: LegalDocument) => {
    setSelectedDocToSign(doc);
    setSignName('');
    setSignOtp('');
    setSignConsent(false);
    setShowSignModal(true);
  };

  const handleCompleteSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocToSign || !signConsent) return;

    const randomHash = 'sha256-' + Math.floor(100000 + Math.random() * 900000).toString(16) + 'f03ab' + Math.floor(10000 + Math.random() * 90000).toString(16);

    const updated = documents.map(d => {
      if (d.id === selectedDocToSign.id) {
        return {
          ...d,
          status: 'Firmado' as const,
          signedDate: new Date().toISOString().split('T')[0],
          hasDianHash: true,
          dianHash: randomHash
        };
      }
      return d;
    });

    setDocuments(updated);
    setShowSignModal(false);
    setSelectedDocToSign(null);
    showToast('success', 'Firma Digital Completada', 'El documento se firmó con criptografía digital legal.');
  };

  const handleDeleteDocument = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el documento "${name}"?`)) {
      setDocuments(documents.filter(d => d.id !== id));
      showToast('info', 'Documento Eliminado', 'Se ha retirado el archivo de la bóveda digital.');
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            ✒️ Firma Electrónica & Gestión Documental
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Plataforma segura para digitalizar, almacenar y firmar de manera ágil contratos laborales, NDA y otrosís con firma digital verificable.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cargar Documento para Firma
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Documentos Firmados</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
              {documents.filter(d => d.status === 'Firmado').length}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            !
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pendientes de Firma</p>
            <p className="text-2xl font-extrabold text-amber-600 font-mono mt-0.5">
              {documents.filter(d => d.status.startsWith('Pendiente')).length}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            📁
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Almacenamiento Total</p>
            <p className="text-2xl font-extrabold text-indigo-700 font-mono mt-0.5">
              {(documents.reduce((acc, d) => acc + parseFloat(d.fileSize), 0)).toFixed(1)} MB
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título de documento o colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Filtrar Documento:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="todos">Todos los Documentos</option>
            <option value="Contrato Laboral">Contratos Laborales</option>
            <option value="Anexo / Otrosí">Otrosís / Anexos</option>
            <option value="Políticas Internas">Políticas Internas</option>
            <option value="Acuerdo Confidencialidad">Acuerdos (NDAs)</option>
          </select>
        </div>
      </div>

      {/* Vault document grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                <th className="px-5 py-3">Código & Archivo</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Asociado a</th>
                <th className="px-5 py-3">Fecha de Carga</th>
                <th className="px-5 py-3 text-center">Estado Firma</th>
                <th className="px-5 py-3 text-center">Hash Criptográfico</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No se encontraron archivos en la bóveda digital.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-indigo-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block font-mono text-[10px] text-slate-400 font-bold">{doc.id} · {doc.fileSize}</span>
                          <span className="font-semibold text-slate-900">{doc.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-600">{doc.category}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{doc.employeeName}</td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono flex items-center gap-1 pt-4">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {doc.createdDate}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Firmado' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        doc.status === 'Pendiente Firma Colaborador' ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' :
                        'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-[10px] text-slate-500">
                      {doc.hasDianHash ? (
                        <div className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-100 p-1 rounded font-bold">
                          <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[80px]" title={doc.dianHash}>{doc.dianHash}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-sans">Sin firma digital</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {doc.status.startsWith('Pendiente') && (
                          <button
                            onClick={() => handleOpenSignModal(doc)}
                            className="flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded font-bold text-[10px] transition-all cursor-pointer"
                            title="Completar firma"
                          >
                            <PenTool className="w-3 h-3" />
                            Firmar
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateStatus}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          title="Descargar PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Borrar documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Cargar Documento para Bóveda & Firma</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDocument} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título del Documento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Contrato de Trabajo Indefinido - Andrés Felipe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría Documental</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="Contrato Laboral">Contrato Laboral</option>
                    <option value="Anexo / Otrosí">Anexo / Otrosí</option>
                    <option value="Políticas Internas">Políticas Internas</option>
                    <option value="Acuerdo Confidencialidad">Acuerdo Confidencialidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Colaborador Destinatario *</label>
                  <select
                    required
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">-- Seleccionar --</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} ({e.jobTitle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-indigo-700 mt-0.5 shrink-0" />
                <p>
                  <strong>Firma Electrónica Avanzada:</strong> El colaborador recibirá una alerta de firma digital. La firma quedará sellada digitalmente con un hash criptográfico único, asegurando su validez legal.
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
                  Cargar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Signature Modal with Draw mockup */}
      {showSignModal && selectedDocToSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-indigo-600" />
                Firmar Digitalmente Documento Laboral
              </h3>
              <button onClick={() => setShowSignModal(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCompleteSignature} className="p-5 space-y-4 text-xs">
              <div>
                <p className="text-slate-500 mb-1">Documento a firmar:</p>
                <p className="font-extrabold text-slate-900 text-sm">{selectedDocToSign.title}</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">Categoría: {selectedDocToSign.category}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Escribe tu nombre completo para firmar *</label>
                <input
                  type="text"
                  required
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  placeholder="Ej. Carlos Eduardo Restrepo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* MOCK DIGITAL SIGNATURE CANVAS CONTAINER */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trazo de Firma Digital (Dibuja aquí)</label>
                <div className="w-full h-32 border border-dashed border-indigo-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center relative cursor-crosshair hover:bg-slate-50/80 transition-all group">
                  <Stamp className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Haz clic y arrastra para simular tu firma</p>
                  
                  {/* Mock drawn paths as nice SVG background */}
                  {signName && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <span className="font-mono text-2xl tracking-widest text-indigo-800 select-none">
                        {signName.substring(0, 3).toUpperCase()}-9921-X
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={signConsent}
                    onChange={(e) => setSignConsent(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                  />
                  <span className="text-[11px] text-slate-500 leading-normal">
                    Acepto que esta es una <strong>firma electrónica válida y vinculante</strong> en los términos de la legislación colombiana (Ley 527 de 1999) para el contrato o documento laboral de Essential Pharma.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!signConsent}
                  className={`px-4 py-1.5 font-semibold text-white bg-indigo-600 rounded-lg shadow-xs cursor-pointer ${
                    !signConsent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                  }`}
                >
                  Firmar Digitalmente ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
