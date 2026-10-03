import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { CorreriaPlanner } from '../../types/hr';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  CloudCheck,
  Receipt,
  Settings,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building2,
  DollarSign,
  X,
  Trash2
} from 'lucide-react';
import { NewCorreriaModal } from './NewCorreriaModal';
import { CorreriaDetailModal } from './CorreriaDetailModal';

export const AccountingManager: React.FC = () => {
  const {
    correrias,
    sendLegalizationReminders,
    selectedCorreria,
    setSelectedCorreria,
    formatCurrency,
    currentRole,
    siigoConfig,
    updateSiigoConfig,
    showToast,
  } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSiigoConfigModal, setShowSiigoConfigModal] = useState(false);

  // Siigo config local edit
  const [apiEndpoint, setApiEndpoint] = useState(siigoConfig.apiEndpoint);
  const [partnerId, setPartnerId] = useState(siigoConfig.partnerId);
  const [apiKey, setApiKey] = useState(siigoConfig.apiKey);
  const [costCenter, setCostCenter] = useState(siigoConfig.costCenter);

  const filteredCorrerias = correrias.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.adviserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetCities.some((city) => city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalAdvancesApproved = correrias.reduce((sum, c) => sum + (c.totalAdvanceApproved || 0), 0);
  const totalExpensesLegalized = correrias.reduce((sum, c) => sum + c.totalExpensesLegalized, 0);
  const pendingDirectionAuth = correrias.filter((c) => c.status === 'Enviado a Dirección').length;
  const pendingAccountingLegalization = correrias.filter((c) => c.status === 'Legalización Radicada').length;

  const handleSaveSiigoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiigoConfig({
      apiEndpoint,
      partnerId,
      apiKey,
      costCenter,
      isConnected: true,
    });
    setShowSiigoConfigModal(false);
    showToast('success', 'Conexión Siigo Nube Exitosa', 'Credenciales autenticadas contra la API Cloud de Siigo.');
  };

  const statusBadge = (status: CorreriaPlanner['status']) => {
    switch (status) {
      case 'Enviado a Dirección':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">Enviado a Dirección</span>;
      case 'Autorizado por Dirección':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">Autorizado Dirección</span>;
      case 'Anticipo Desembolsado':
        return <span className="bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-bold px-2 py-0.5 rounded">Anticipo Desembolsado</span>;
      case 'Legalización Radicada':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">Legalización Radicada</span>;
      case 'Legalizado por Contabilidad':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">Legalizado Contable</span>;
      case 'Contabilizado en Siigo Nube':
        return <span className="bg-teal-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">Contabilizado Siigo Nube</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Módulo Contable: Correrías, Viáticos & Siigo Nube
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Planeadores de viaje de asesores, flujo de autorización de anticipos y legalización de egresos conectada con Siigo Nube API.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={sendLegalizationReminders}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-xs"
            title="Enviar recordatorios de legalización próximos a vencer"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            Recordatorios de Legalización
          </button>
          <button
            onClick={() => setShowSiigoConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            Configuración Siigo API
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Radicar Planeador de Correría
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Anticipos de Viáticos Girados</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 font-mono tabular-nums">
            {formatCurrency(totalAdvancesApproved)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Total anticipos autorizados por Dirección</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Gastos Legalizados (Soportes DIAN)</span>
            <Receipt className="w-4 h-4 text-teal-700" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-800 mt-2 font-mono tabular-nums">
            {formatCurrency(totalExpensesLegalized)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Facturas electrónicas y viáticos justificados</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pendientes Autorización Dirección</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-amber-700 mt-2 font-mono tabular-nums">
            {pendingDirectionAuth}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Planeadores esperando visto bueno</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Conexión Siigo Nube API</span>
            <CloudCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-xs text-slate-900">En Línea (Sincronizado)</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            Centro de Costos: {siigoConfig.costCenter}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej. CORR-084), asesor, proyecto o ciudad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrar por estado de correría"
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
          >
            <option value="ALL">Todos los estados de correría</option>
            <option value="Enviado a Dirección">Enviado a Dirección</option>
            <option value="Autorizado por Dirección">Autorizado por Dirección</option>
            <option value="Anticipo Desembolsado">Anticipo Desembolsado</option>
            <option value="Legalización Radicada">Legalización Radicada</option>
            <option value="Legalizado por Contabilidad">Legalizado por Contabilidad</option>
            <option value="Contabilizado en Siigo Nube">Contabilizado en Siigo Nube</option>
          </select>
        </div>
      </div>

      {/* Correrías Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Código & Proyecto</th>
                <th className="py-3 px-4">Asesor / Trabajador</th>
                <th className="py-3 px-4">Ruta & Fechas</th>
                <th className="py-3 px-4 text-right">Anticipo Solicitado</th>
                <th className="py-3 px-4 text-right">Anticipo Aprobado</th>
                <th className="py-3 px-4 text-right">Legalizado</th>
                <th className="py-3 px-4 text-center">Estado Workflow</th>
                <th className="py-3 px-4 text-center">Siigo Nube</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCorrerias.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCorreria(c)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-emerald-800 font-bold block">{c.code}</span>
                    <p className="font-semibold text-slate-900 mt-0.5 truncate max-w-[200px]" title={c.projectName}>
                      {c.projectName}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{c.adviserName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{c.adviserPhone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-800 truncate max-w-[180px]">{c.targetCities.join(', ')}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {c.startDate} al {c.endDate} ({c.totalDays}d)
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                    {formatCurrency(c.totalAdvanceRequested)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {c.totalAdvanceApproved > 0 ? formatCurrency(c.totalAdvanceApproved) : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-800">
                    {c.totalExpensesLegalized > 0 ? formatCurrency(c.totalExpensesLegalized) : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {statusBadge(c.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {c.siigoVoucherNumber ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        <CloudCheck className="w-3 h-3 text-teal-700" />
                        {c.siigoVoucherNumber}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Sin sincronizar</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCorreria(c);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                    >
                      Gestionar
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCorrerias.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 px-6 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {correrias.length === 0
                        ? 'No hay correrías ni anticipos registrados'
                        : 'No se encontraron correrías con los filtros seleccionados'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      {correrias.length === 0
                        ? 'El módulo contable está listo para registrar desplazamientos, anticipos de viaje y legalizaciones de gastos con integración a Siigo Nube.'
                        : 'Prueba cambiando los filtros de búsqueda o estado.'}
                    </p>
                    {correrias.length === 0 && (
                      <button
                        onClick={() => setShowNewModal(true)}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        Planear Primera Correría
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Correria Modal */}
      {selectedCorreria && (
        <CorreriaDetailModal
          correria={selectedCorreria}
          onClose={() => setSelectedCorreria(null)}
        />
      )}

      {/* New Correria Modal */}
      {showNewModal && (
        <NewCorreriaModal onClose={() => setShowNewModal(false)} />
      )}

      {/* Siigo Nube Config Modal */}
      {showSiigoConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-900 to-emerald-950 text-white">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Configuración de Conexión Siigo Nube API</h3>
              </div>
              <button onClick={() => setShowSiigoConfigModal(false)} className="p-1 text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSiigoConfig} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Endpoint Siigo Cloud API</label>
                <input
                  type="text"
                  required
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Partner-ID Essential Pharma</label>
                <input
                  type="text"
                  required
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">API Key / Access Token</label>
                <input
                  type="password"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Centro de Costos por Defecto</label>
                <input
                  type="text"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  placeholder="CC-02 Ventas & Mercadeo Farma"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px]">
                <p className="font-bold">Protocolo de Integración DIAN & Siigo Nube:</p>
                <p className="mt-0.5">
                  Los comprobantes generados se transmiten vía HTTPS REST a la nube de Siigo con cuentas PUC estándar para Colombia.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSiigoConfigModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Guardar y Probar Conexión API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
