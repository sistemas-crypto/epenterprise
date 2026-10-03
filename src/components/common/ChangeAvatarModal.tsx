import React, { useState, useRef } from 'react';
import { useHR } from '../../context/HRContext';
import { 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  X, 
  Trash2, 
  User, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmployeeId?: string; // If editing a specific employee, otherwise current user
  currentAvatarUrl: string;
  userName: string;
  onSave?: (newAvatar: string) => void;
}

const PRESET_AVATARS = [
  {
    id: 'corp-exec-1',
    label: 'Directora Corporativa',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'corp-exec-2',
    label: 'Director Ejecutivo',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'corp-pharma-3',
    label: 'Líder Farmacéutica',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'corp-pharma-4',
    label: 'Especialista Operaciones',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'corp-lead-5',
    label: 'Dirección Médica / Científica',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'corp-lead-6',
    label: 'Gerente Comercial',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  }
];

export const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  userName,
  onSave,
}) => {
  const { updateCurrentUserAvatar, showToast } = useHR();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatarUrl);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process uploaded image file (compress to crisp 256x256 canvas JPEG to keep storage fast)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('La imagen es demasiado pesada. Elige una menor a 10MB.');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 300;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Draw square crop centered
            const minSide = Math.min(img.width, img.height);
            const startX = (img.width - minSide) / 2;
            const startY = (img.height - minSide) / 2;

            ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, size, size);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setSelectedAvatar(dataUrl);
            setUploadError(null);
          } else {
            setSelectedAvatar(event.target?.result as string);
          }
        } catch {
          setSelectedAvatar(event.target?.result as string);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setUploadError('No se pudo leer la imagen seleccionada.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Error al leer el archivo.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedAvatar(customUrl.trim());
    setCustomUrl('');
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedAvatar);
    } else {
      updateCurrentUserAvatar(selectedAvatar);
    }
    onClose();
  };

  const handleResetToDefault = () => {
    // Generate clean SVG initials avatar
    const initials = userName
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'EP';

    const svg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23047857"/><text x="50%" y="54%" font-family="Arial, sans-serif" font-size="76" font-weight="bold" fill="white" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
    
    setSelectedAvatar(svg);
    setUploadError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Cambiar Foto de Perfil</h2>
              <p className="text-xs text-slate-500">Actualiza la foto visible en el sistema para {userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live Preview Area */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative group shrink-0">
              <img
                src={selectedAvatar}
                alt="Vista Previa"
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md bg-slate-200"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Vista Previa Actual
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">{userName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Así se verá tu imagen en el encabezado, expedientes, aprobaciones y portal.
              </p>
              <button
                onClick={handleResetToDefault}
                className="mt-2 text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                Usar iniciales corporativas
              </button>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center justify-between">
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Option 1: Upload from Computer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-700" />
              Opción 1: Subir imagen desde tu dispositivo (PC / Celular)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/40 rounded-xl p-4 text-center cursor-pointer transition-all group"
            >
              <Upload className="w-7 h-7 text-slate-400 group-hover:text-emerald-700 mx-auto mb-1 transition-colors" />
              <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
                Haz clic para seleccionar tu foto
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Archivos JPG, PNG o WEBP. Se ajustará automáticamente en formato circular.
              </p>
            </div>
          </div>

          {/* Option 2: Image URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-emerald-700" />
              Opción 2: O ingresa el enlace (URL) de una imagen
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-800"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!customUrl.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors disabled:opacity-50 shrink-0"
              >
                Cargar
              </button>
            </div>
          </div>

          {/* Option 3: Select from Professional Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Opción 3: O elige una foto ejecutiva sugerida
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PRESET_AVATARS.map((preset) => {
                const isCurrent = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatar(preset.url)}
                    className={`relative p-1 rounded-xl border transition-all text-center group ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover mx-auto"
                    />
                    {isCurrent && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              Guardar Foto de Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
