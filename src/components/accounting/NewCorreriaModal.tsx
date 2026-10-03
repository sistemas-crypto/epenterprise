import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { X, Send, MapPin, DollarSign, Calendar, FileText, Plus, Trash2 } from 'lucide-react';

interface NewCorreriaModalProps {
  onClose: () => void;
}

export const NewCorreriaModal: React.FC<NewCorreriaModalProps> = ({ onClose }) => {
  const { employees, currentUser, createCorreria, formatCurrency } = useHR();

  const [adviserId, setAdviserId] = useState(currentUser.id);
  const [projectName, setProjectName] = useState('');
  const [targetCitiesStr, setTargetCitiesStr] = useState('Bucaramanga, Floridablanca, Cúcuta');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-21');
  const [objectives, setObjectives] = useState('');
  const [clientsStr, setClientsStr] = useState('Clínica Foscal, Hospital Universitario, Droguerías Pasteur');

  // Presupuesto proyectado
  const [projectedTransport, setProjectedTransport] = useState<number>(650000);
  const [projectedLodging, setProjectedLodging] = useState<number>(850000);
  const [projectedFood, setProjectedFood] = useState<number>(550000);
  const [projectedLocalMobility, setProjectedLocalMobility] = useState<number>(200000);
  const [projectedContingency, setProjectedContingency] = useState<number>(150000);

  const totalAdvanceRequested =
    Number(projectedTransport) +
    Number(projectedLodging) +
    Number(projectedFood) +
    Number(projectedLocalMobility) +
    Number(projectedContingency);

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) ? 1 : diff;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const adviser = employees.find((e) => e.id === adviserId) || currentUser;
    const targetCities = targetCitiesStr.split(',').map((c) => c.trim()).filter(Boolean);
    const clientsToVisit = clientsStr.split(',').map((c) => c.trim()).filter(Boolean);

    createCorreria({
      adviserId: adviser.id,
      adviserName: `${adviser.firstName} ${adviser.lastName}`,
      adviserEmail: adviser.email,
      adviserPhone: adviser.phone,
      projectName,
      targetCities,
      startDate,
      endDate,
      totalDays: calculateDays(startDate, endDate),
      objectives: objectives || 'Gira comercial y visita técnica institucional autorizada.',
      clientsToVisit,
      projectedTransport: Number(projectedTransport),
      projectedLodging: Number(projectedLodging),
      projectedFood: Number(projectedFood),
      projectedLocalMobility: Number(projectedLocalMobility),
      projectedContingency: Number(projectedContingency),
      totalAdvanceRequested,
      totalAdvanceApproved: 0,
      siigoCostCenter: 'CC-02 Ventas & Mercadeo Farma',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
          <div>
            <h2 className="text-base font-bold tracking-tight">
              Radicar Planeador de Correría / Solicitud de Viáticos
            </h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Flujo de autorización para la Dirección del Proyecto · Essential Pharma
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Asesor / Trabajador Responsable *
              </label>
              <select
                value={adviserId}
                onChange={(e) => setAdviserId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.jobTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Nombre del Proyecto / Gira Comercial *
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ej. Apertura Hospitales Antioquia & Urabá"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fecha de Salida *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fecha de Regreso *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Duración Total</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
                {calculateDays(startDate, endDate)} días
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Ruta y Ciudades a Visitar (separadas por coma) *
            </label>
            <input
              type="text"
              required
              value={targetCitiesStr}
              onChange={(e) => setTargetCitiesStr(e.target.value)}
              placeholder="Ej. Medellín, Rionegro, Apartadó, Turbo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Instituciones, Clínicas o Clientes Objetivo
            </label>
            <input
              type="text"
              value={clientsStr}
              onChange={(e) => setClientsStr(e.target.value)}
              placeholder="Ej. Hospital San Vicente, Clínica Soma, Droguerías Cafam"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Objetivos de la Correría
            </label>
            <textarea
              rows={2}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Describe las metas de visita comercial, cobranza o presentación de productos farmacéuticos..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Presupuesto de Viáticos Solicitados */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Desglose Presupuestal de Viáticos & Anticipo
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold">
                Total Solicitado: {formatCurrency(totalAdvanceRequested)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-0.5">Transporte Aéreo / Terrestre</label>
                <input
                  type="number"
                  value={projectedTransport}
                  onChange={(e) => setProjectedTransport(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Alojamiento / Hotel</label>
                <input
                  type="number"
                  value={projectedLodging}
                  onChange={(e) => setProjectedLodging(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Alimentación</label>
                <input
                  type="number"
                  value={projectedFood}
                  onChange={(e) => setProjectedFood(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Movilidad Local / Taxis</label>
                <input
                  type="number"
                  value={projectedLocalMobility}
                  onChange={(e) => setProjectedLocalMobility(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-0.5">Imprevistos / Contingencia</label>
                <input
                  type="number"
                  value={projectedContingency}
                  onChange={(e) => setProjectedContingency(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-[10px] text-slate-400">Total a Girar</span>
                <p className="text-sm font-bold text-emerald-800 font-mono">
                  {formatCurrency(totalAdvanceRequested)}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Radicar Planeador a Dirección
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
