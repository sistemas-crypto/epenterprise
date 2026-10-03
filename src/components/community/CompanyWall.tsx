import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Recognition, CompanyAnnouncement } from '../../types/hr';
import {
  Sparkles,
  Award,
  Heart,
  MessageSquare,
  Pin,
  Plus,
  Send,
  Cake,
  Calendar,
  X,
  User
} from 'lucide-react';

export const CompanyWall: React.FC = () => {
  const {
    currentUser,
    currentRole,
    employees,
    recognitions,
    addRecognition,
    likeRecognition,
    announcements,
    addAnnouncement,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'wall' | 'announcements'>('wall');
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // New Recognition state
  const [recipientId, setRecipientId] = useState(employees[1]?.id || '');
  const [badge, setBadge] = useState<Recognition['badge']>('Trabajo en Equipo');
  const [message, setMessage] = useState('');

  // New Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<CompanyAnnouncement['category']>('Institucional');
  const [annPinned, setAnnPinned] = useState(false);

  const badges: Recognition['badge'][] = [
    'Innovación',
    'Trabajo en Equipo',
    'Liderazgo',
    'Pasión por la Calidad',
    'Servicio Excepcional',
  ];

  const handleSendRecognition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const recipient = employees.find((e) => e.id === recipientId);
    if (!recipient) return;

    addRecognition({
      fromEmployeeId: currentUser.id,
      fromEmployeeName: `${currentUser.firstName} ${currentUser.lastName}`,
      fromEmployeeAvatar: currentUser.avatar,
      toEmployeeId: recipient.id,
      toEmployeeName: `${recipient.firstName} ${recipient.lastName}`,
      toEmployeeAvatar: recipient.avatar,
      badge,
      message,
    });

    setShowRecognitionModal(false);
    setMessage('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle,
      content: annContent,
      author: `${currentUser.firstName} ${currentUser.lastName} · Gestión Humana`,
      category: annCategory,
      pinned: annPinned,
    });

    setShowAnnouncementModal(false);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Comunidad EP Enterprise & Muro Corporativo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Espacio social de reconocimientos entre pares, cultura organizacional y comunicados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecognitionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            <Award className="w-4 h-4" />
            Dar Reconocimiento ("Punto EP")
          </button>

          {currentRole === 'admin_hr' && (
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Publicar Comunicado
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('wall')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'wall'
              ? 'border-teal-600 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Muro de Reconocimientos ("Puntos EP")
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'announcements'
              ? 'border-teal-600 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Comunicados Oficiales ({announcements.length})
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* TAB 1: Recognitions Wall */}
          {activeTab === 'wall' && (
            <div className="space-y-4">
              {recognitions.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rec.fromEmployeeAvatar}
                        alt={rec.fromEmployeeName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {rec.fromEmployeeName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Reconoció a <strong className="text-slate-700">{rec.toEmployeeName}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      🏆 {rec.badge}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rec.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-mono text-[11px]">{rec.date}</span>
                    <button
                      onClick={() => likeRecognition(rec.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors font-semibold"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{rec.likesCount} Aplausos</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Announcements */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 bg-white rounded-xl shadow-xs space-y-3 ${
                    ann.pinned ? 'border-2 border-teal-500/50 ring-2 ring-teal-500/10' : 'border border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {ann.pinned && (
                        <span className="p-1 bg-teal-100 text-teal-800 rounded">
                          <Pin className="w-3 h-3" />
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {ann.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums">{ann.date}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {ann.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Publicado por: <strong className="text-slate-700">{ann.author}</strong></span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      {ann.commentsCount} comentarios
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Culture & Company Highlights */}
        <div className="space-y-6">
          {/* Values of the Company */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Pilares Culturales EP Enterprise</h3>
            </div>
            <div className="mt-3 space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900">🌟 Personas en el Centro</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Cuidamos el bienestar y crecimiento de cada trabajador.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900">🔬 Rigor y Calidad Farmacéutica</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Cumplimiento estricto de estándares BPM y ética científica.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900">🤝 Trabajo Colaborativo</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Reconocemos el esfuerzo colectivo y la comunicación abierta.
                </p>
              </div>
            </div>
          </div>

          {/* Quick recognition prompt */}
          <div className="p-5 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl shadow-sm">
            <Award className="w-6 h-6 text-teal-300 mb-2" />
            <h4 className="text-sm font-bold">¿Alguien te ayudó hoy?</h4>
            <p className="text-xs text-teal-100 mt-1 leading-relaxed">
              Tómate 30 segundos para enviar un reconocimiento y destacar la dedicación de tu compañero en el muro.
            </p>
            <button
              onClick={() => setShowRecognitionModal(true)}
              className="mt-4 w-full py-2 px-3 bg-white text-teal-950 font-bold text-xs rounded-lg hover:bg-teal-50 transition-colors shadow-xs"
            >
              Reconocer a un Compañero
            </button>
          </div>
        </div>
      </div>

      {/* Give Recognition Modal */}
      {showRecognitionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Dar un Reconocimiento ("Punto EP")</h3>
              </div>
              <button onClick={() => setShowRecognitionModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendRecognition} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ¿A quién deseas reconocer? *
                </label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {employees
                    .filter((e) => e.id !== currentUser.id)
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.jobTitle})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Insignia del Reconocimiento *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {badges.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBadge(b)}
                      className={`p-2 rounded-lg border text-left text-xs font-semibold transition-colors ${
                        badge === b
                          ? 'bg-teal-50 border-teal-600 text-teal-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mensaje público de felicitación *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="¡Gracias por tu apoyo incondicional en el cierre de la auditoría!..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecognitionModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 rounded-lg"
                >
                  Publicar en el Muro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Publicar Comunicado Oficial</h3>
              <button onClick={() => setShowAnnouncementModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título del Comunicado *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Ej. Nueva política de días de teletrabajo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Institucional">Institucional</option>
                  <option value="Beneficios">Beneficios</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Seguridad y Salud">Seguridad y Salud</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contenido del Comunicado *</label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Escribe la información detallada para todo el equipo..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={annPinned}
                  onChange={(e) => setAnnPinned(e.target.checked)}
                />
                <label htmlFor="pin" className="text-slate-700 font-medium">
                  Fijar en la parte superior del muro
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 rounded-lg"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
