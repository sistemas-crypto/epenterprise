import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { JobOpening, Candidate, CandidateStage } from '../../types/hr';
import {
  Briefcase,
  Users,
  Plus,
  Star,
  Phone,
  Mail,
  CheckCircle,
  X,
  ArrowRight,
  UserCheck,
  Building,
  DollarSign
} from 'lucide-react';

export const RecruitmentATS: React.FC = () => {
  const {
    jobOpenings,
    candidates,
    addJobOpening,
    addCandidate,
    moveCandidateStage,
    hireCandidate,
    formatCurrency,
    currentRole,
  } = useHR();

  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [showNewCandidateModal, setShowNewCandidateModal] = useState(false);

  // New Job form
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Investigación y Desarrollo');
  const [jobLocation, setJobLocation] = useState('Bogotá D.C. - Planta');
  const [jobType, setJobType] = useState<'Tiempo Completo' | 'Híbrido' | 'Remoto'>('Tiempo Completo');
  const [jobVacancies, setJobVacancies] = useState(1);
  const [jobSalaryRange, setJobSalaryRange] = useState('$5.000.000 - $6.500.000 COP');

  // New Candidate form
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candJobId, setCandJobId] = useState(jobOpenings[0]?.id || '');
  const [candExp, setCandExp] = useState(3);
  const [candSalary, setCandSalary] = useState(5500000);
  const [candNotes, setCandNotes] = useState('');

  const stages: CandidateStage[] = ['Postulado', 'En Revisión', 'Entrevista', 'Oferta', 'Contratado'];

  const filteredCandidates = candidates.filter((c) =>
    selectedJobId === 'ALL' ? true : c.jobOpeningId === selectedJobId
  );

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;

    addJobOpening({
      title: jobTitle,
      department: jobDept,
      location: jobLocation,
      type: jobType,
      vacancies: Number(jobVacancies),
      salaryRange: jobSalaryRange,
      status: 'Abierta',
      requirements: ['Experiencia comprobable en la industria', 'Título universitario correspondiente'],
    });

    setShowNewJobModal(false);
    setJobTitle('');
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail) return;

    addCandidate({
      jobOpeningId: candJobId || jobOpenings[0]?.id || 'job-01',
      name: candName,
      email: candEmail,
      phone: candPhone || '+57 300 123 4567',
      experienceYears: Number(candExp),
      currentSalaryExpectation: Number(candSalary),
      stage: 'Postulado',
      rating: 4,
      notes: candNotes || 'Postulación ingresada manualmente en el ATS.',
    });

    setShowNewCandidateModal(false);
    setCandName('');
    setCandEmail('');
    setCandPhone('');
    setCandNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Atracción de Talento & ATS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pipeline Kanban de selección, vacantes activas y contratación directa a la plantilla.
          </p>
        </div>

        {currentRole === 'admin_hr' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewCandidateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Postular Candidato
            </button>
            <button
              onClick={() => setShowNewJobModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Nueva Vacante
            </button>
          </div>
        )}
      </div>

      {/* Vacancy Selector Filter */}
      <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xs overflow-x-auto text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap pl-1">
          Vacante:
        </span>
        <button
          onClick={() => setSelectedJobId('ALL')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
            selectedJobId === 'ALL'
              ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Todas ({candidates.length} candidatos)
        </button>

        {jobOpenings.map((job) => {
          const count = candidates.filter((c) => c.jobOpeningId === job.id).length;
          return (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedJobId === job.id
                  ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {job.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);

          return (
            <div
              key={stage}
              className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 flex flex-col min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">{stage}</span>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded shadow-2xs">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Candidates in this column */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageCandidates.map((cand) => {
                  const job = jobOpenings.find((j) => j.id === cand.jobOpeningId);

                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="p-3 bg-white border border-slate-200 rounded-lg hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer text-xs space-y-2 group shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {cand.name}
                        </h4>
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="text-[10px] ml-0.5 font-bold font-mono">{cand.rating}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-teal-700 font-medium truncate">
                        {job?.title || 'Vacante'}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>{cand.experienceYears} años exp.</span>
                        <span className="font-mono tabular-nums text-slate-600 font-semibold">
                          {formatCurrency(cand.currentSalaryExpectation)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {stageCandidates.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-[11px]">
                    Sin candidatos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedCandidate.name}</h3>
                <p className="text-xs text-teal-700 font-medium mt-0.5">
                  {jobOpenings.find((j) => j.id === selectedCandidate.jobOpeningId)?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Correo Electrónico</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedCandidate.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Teléfono Móvil</span>
                  <p className="font-semibold text-slate-800 mt-0.5 font-mono">{selectedCandidate.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Años de Experiencia</span>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">{selectedCandidate.experienceYears} años</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Aspiración Salarial</span>
                  <p className="font-bold text-teal-800 mt-0.5 font-mono">
                    {formatCurrency(selectedCandidate.currentSalaryExpectation)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notas de Entrevista / Evaluación Técnica</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed italic">
                  "{selectedCandidate.notes}"
                </div>
              </div>

              {/* Move Stage Selector */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">
                  Cambiar Etapa en el Pipeline
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {stages.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        moveCandidateStage(selectedCandidate.id, st);
                        setSelectedCandidate({ ...selectedCandidate, stage: st });
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        selectedCandidate.stage === st
                          ? 'bg-teal-600 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1-Click Hire Button */}
              {selectedCandidate.stage !== 'Contratado' && (
                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      hireCandidate(selectedCandidate.id);
                      setSelectedCandidate(null);
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    ¡Contratar e incorporar como Trabajador Activo!
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    Creará la ficha de personal en el directorio y lo habilitará para nómina.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Publicar Nueva Vacante</h3>
              <button onClick={() => setShowNewJobModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título de la Posición *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ej. Químico de Estabilidades"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Área / Departamento</label>
                <select
                  value={jobDept}
                  onChange={(e) => setJobDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Investigación y Desarrollo">Investigación y Desarrollo</option>
                  <option value="Control de Calidad">Control de Calidad</option>
                  <option value="Producción">Producción</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Talento Humano">Talento Humano</option>
                  <option value="Asuntos Regulatorios">Asuntos Regulatorios</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Modalidad</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Tiempo Completo">Tiempo Completo</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Remoto">Remoto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vacantes</label>
                  <input
                    type="number"
                    min="1"
                    value={jobVacancies}
                    onChange={(e) => setJobVacancies(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rango Salarial Ofrecido</label>
                <input
                  type="text"
                  value={jobSalaryRange}
                  onChange={(e) => setJobSalaryRange(e.target.value)}
                  placeholder="$5.000.000 - $6.500.000 COP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 rounded-lg"
                >
                  Publicar Vacante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Candidate Modal */}
      {showNewCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Registrar Nuevo Postulante</h3>
              <button onClick={() => setShowNewCandidateModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCandidate} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="Ej. Mateo Gómez"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    placeholder="mateo@correo.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vacante Aplicada</label>
                <select
                  value={candJobId}
                  onChange={(e) => setCandJobId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {jobOpenings.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Años Exp.</label>
                  <input
                    type="number"
                    value={candExp}
                    onChange={(e) => setCandExp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Aspiración Salarial</label>
                  <input
                    type="number"
                    value={candSalary}
                    onChange={(e) => setCandSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notas Iniciales</label>
                <textarea
                  rows={2}
                  value={candNotes}
                  onChange={(e) => setCandNotes(e.target.value)}
                  placeholder="Resumen del CV o recomendaciones..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewCandidateModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 rounded-lg"
                >
                  Registrar Candidato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
