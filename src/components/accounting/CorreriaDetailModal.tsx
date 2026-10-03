import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { CorreriaPlanner, ExpenseConcept, ExpenseReceipt, ExpenseDocumentType } from '../../types/hr';
import {
  X,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  Upload,
  Send,
  CloudCheck,
  AlertTriangle,
  Receipt,
  Printer,
  Trash2,
  Check,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { PUC_ACCOUNTS } from '../../data/accountingData';

interface CorreriaDetailModalProps {
  correria: CorreriaPlanner;
  onClose: () => void;
}

export const CorreriaDetailModal: React.FC<CorreriaDetailModalProps> = ({ correria, onClose }) => {
  const {
    formatCurrency,
    currentUser,
    currentRole,
    authorizeCorreriaAdvance,
    disburseAdvance,
    addExpenseToCorreria,
    removeExpenseFromCorreria,
    submitLegalization,
    approveLegalization,
    syncWithSiigoNube,
    siigoConfig,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'planner' | 'expenses' | 'siigo'>('planner');

  // Dirección authorization form
  const [approvedAmount, setApprovedAmount] = useState(
    correria.totalAdvanceApproved || correria.totalAdvanceRequested
  );
  const [directorNotes, setDirectorNotes] = useState(correria.directorNotes || '');

  // Tesorería disbursement form
  const [disbursementRef, setDisbursementRef] = useState(correria.advanceDisbursementRef || 'TR-BCOL-994120');
  const [bankName, setBankName] = useState(correria.advanceBankName || 'Bancolombia Cta Cte');

  // New Expense form
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [docType, setDocType] = useState<ExpenseDocumentType>('Factura Electrónica');
  const [concept, setConcept] = useState<ExpenseConcept>('Transporte Aéreo / Terrestre');
  const [providerName, setProviderName] = useState('');
  const [providerNit, setProviderNit] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [expenseDate, setExpenseDate] = useState('2026-09-22');
  const [subtotal, setSubtotal] = useState(150000);
  const [tax, setTax] = useState(28500);
  const [notes, setNotes] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAuthorize = () => {
    authorizeCorreriaAdvance(correria.id, Number(approvedAmount), directorNotes);
  };

  const handleDisburse = () => {
    disburseAdvance(correria.id, disbursementRef, bankName);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName || !invoiceNumber) return;

    const pucMap: Record<ExpenseConcept, string> = {
      'Transporte Aéreo / Terrestre': '515515 - Pasajes Aéreos y Taxis',
      'Alojamiento / Hotel': '515505 - Alojamiento y Hoteles',
      'Alimentación': '515510 - Alimentación y Viáticos',
      'Movilidad Local / Taxis': '515515 - Pasajes Aéreos y Taxis',
      'Peajes y Combustible': '515595 - Peajes, Combustible y Parqueaderos',
      'Muestras Médicas y Representación': '515525 - Gastos de Representación',
      'Imprevistos y Logística': '515595 - Gastos Varios de Viaje',
    };

    addExpenseToCorreria(correria.id, {
      concept,
      documentType: docType,
      providerName,
      providerNit: providerNit || '900.123.456-7',
      invoiceNumber,
      date: expenseDate,
      amountSubtotal: Number(subtotal),
      amountTax: Number(tax),
      amountTotal: Number(subtotal) + Number(tax),
      paymentMethod: 'Efectivo Anticipo',
      pucAccount: pucMap[concept] || '515505',
      status: docType === 'Talonario Físico' ? 'En Revisión' : 'Válido DIAN',
      requiresDocumentoSoporte: docType === 'Talonario Físico',
      documentoSoporteStatus: docType === 'Talonario Físico' ? 'Pendiente DS' : 'No Aplica',
      receiptAttachmentName: `soporte_${docType === 'Talonario Físico' ? 'talonario' : 'factura'}_${invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      notes,
    });

    setShowAddExpenseForm(false);
    setProviderName('');
    setInvoiceNumber('');
    setNotes('');
    setDocType('Factura Electrónica');
  };

  const handleSyncSiigo = async () => {
    setIsSyncing(true);
    await syncWithSiigoNube(correria.id);
    setIsSyncing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const statusColors: Record<CorreriaPlanner['status'], string> = {
    'Borrador': 'bg-slate-100 text-slate-700',
    'Enviado a Dirección': 'bg-amber-100 text-amber-900 border border-amber-300',
    'Autorizado por Dirección': 'bg-blue-100 text-blue-900 border border-blue-300',
    'Anticipo Desembolsado': 'bg-teal-100 text-teal-900 border border-teal-300',
    'En Ejecución': 'bg-indigo-100 text-indigo-900',
    'Legalización Radicada': 'bg-purple-100 text-purple-900 border border-purple-300',
    'Legalizado por Contabilidad': 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    'Contabilizado en Siigo Nube': 'bg-teal-800 text-white font-bold',
    'Rechazado': 'bg-rose-100 text-rose-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded text-emerald-200 font-bold">
                {correria.code}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColors[correria.status]}`}>
                {correria.status}
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-1 text-white">
              {correria.projectName}
            </h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Asesor: <strong className="text-white">{correria.adviserName}</strong> · Ruta: {correria.targetCities.join(' → ')}
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Imprimir planilla de legalización"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50 text-xs font-semibold no-print">
          <button
            onClick={() => setActiveTab('planner')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'planner'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Planeador & Autorización Dirección
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'expenses'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Legalización de Egresos & Facturas ({correria.expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('siigo')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'siigo'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Integración Siigo Nube API
            {correria.siigoSyncStatus === 'Sincronizado Exitoso' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          {/* TAB 1: Planeador & Autorización */}
          {activeTab === 'planner' && (
            <div className="space-y-6">
              {/* Trip details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-400 font-medium">Itinerario y Fechas</span>
                  <p className="font-bold text-slate-900">
                    {correria.startDate} al {correria.endDate}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold font-mono">
                    {correria.totalDays} días de viaje
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-400 font-medium">Ruta Autorizada</span>
                  <p className="font-bold text-slate-900">
                    {correria.targetCities.join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {correria.clientsToVisit.length} instituciones / clientes
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-emerald-800 font-medium">Anticipo Solicitado</span>
                  <p className="text-xl font-bold text-emerald-950 font-mono tabular-nums">
                    {formatCurrency(correria.totalAdvanceRequested)}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Aprobado: {formatCurrency(correria.totalAdvanceApproved || 0)}
                  </p>
                </div>
              </div>

              {/* Objectives & Client list */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">Objetivos de la Correría</h4>
                <p className="text-slate-700 leading-relaxed italic">
                  "{correria.objectives}"
                </p>

                <h4 className="font-bold text-slate-900 text-xs pt-2 border-t border-slate-100">
                  Instituciones & Clientes Programados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {correria.clientsToVisit.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800">
                  Presupuesto Proyectado para Viáticos
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Transporte Aéreo/Terrestre</span>
                    <strong className="font-mono text-slate-900 text-xs">{formatCurrency(correria.projectedTransport)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alojamiento / Hoteles</span>
                    <strong className="font-mono text-slate-900 text-xs">{formatCurrency(correria.projectedLodging)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alimentación</span>
                    <strong className="font-mono text-slate-900 text-xs">{formatCurrency(correria.projectedFood)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Movilidad Local / Taxis</span>
                    <strong className="font-mono text-slate-900 text-xs">{formatCurrency(correria.projectedLocalMobility)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Imprevistos</span>
                    <strong className="font-mono text-slate-900 text-xs">{formatCurrency(correria.projectedContingency)}</strong>
                  </div>
                </div>
              </div>

              {/* Dirección del Proyecto: Workflow Action Area */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-slate-900">
                      Flujo de Autorización · Dirección del Proyecto
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Estado: {correria.status}
                  </span>
                </div>

                {correria.authorizedBy && (
                  <div className="p-3 bg-white border border-emerald-200 rounded-lg text-[11px] text-emerald-900 space-y-1">
                    <p>
                      <strong>Autorizado por:</strong> {correria.authorizedBy} · {correria.authorizedAt}
                    </p>
                    {correria.directorNotes && (
                      <p className="text-slate-600 italic">"{correria.directorNotes}"</p>
                    )}
                  </div>
                )}

                {/* If submitted to Direction */}
                {correria.status === 'Enviado a Dirección' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Monto de Anticipo a Autorizar (COP) *
                        </label>
                        <input
                          type="number"
                          value={approvedAmount}
                          onChange={(e) => setApprovedAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-emerald-500 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Observaciones de la Dirección
                        </label>
                        <input
                          type="text"
                          value={directorNotes}
                          onChange={(e) => setDirectorNotes(e.target.value)}
                          placeholder="Aprobado conforme a agenda comercial..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleAuthorize}
                        className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Autorizar Anticipo de Viáticos
                      </button>
                    </div>
                  </div>
                )}

                {/* If Authorized by Direction, allow Treasury Disbursement */}
                {correria.status === 'Autorizado por Dirección' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <h5 className="font-bold text-slate-800 text-xs">
                      Desembolso Bancario de Tesorería
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Número de Transacción / Comprobante</label>
                        <input
                          type="text"
                          value={disbursementRef}
                          onChange={(e) => setDisbursementRef(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Banco Origen</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleDisburse}
                        className="px-4 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
                      >
                        Registrar Desembolso de Anticipo ({formatCurrency(correria.totalAdvanceApproved)})
                      </button>
                    </div>
                  </div>
                )}

                {correria.advanceDisbursementDate && (
                  <div className="p-3 bg-white border border-teal-200 rounded-lg text-[11px] text-slate-700 flex items-center justify-between">
                    <div>
                      <strong className="text-teal-900">Anticipo Desembolsado:</strong> {formatCurrency(correria.totalAdvanceApproved)}
                      <span className="text-slate-400 ml-2">Ref: {correria.advanceDisbursementRef} · {correria.advanceBankName}</span>
                    </div>
                    <span className="font-mono text-slate-500">{correria.advanceDisbursementDate}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Legalización de Gastos & Facturas */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              {/* Financial Balance Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 font-medium text-[11px]">1. Anticipo Girado</span>
                  <p className="text-xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
                    {formatCurrency(correria.totalAdvanceApproved)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Autorizado por Dirección</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 font-medium text-[11px]">2. Total Gastos Legalizados</span>
                  <p className="text-xl font-bold text-emerald-800 font-mono mt-1 tabular-nums">
                    {formatCurrency(correria.totalExpensesLegalized)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{correria.expenses.length} facturas registradas</p>
                </div>

                <div className={`p-4 border rounded-xl ${
                  correria.balanceDue >= 0
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-blue-50/70 border-blue-200'
                }`}>
                  <span className="font-bold text-[11px] block">
                    {correria.balanceDue >= 0
                      ? '3. Saldo a Reintegrar por Asesor'
                      : '3. Saldo a Reembolsar al Asesor'}
                  </span>
                  <p className="text-xl font-bold font-mono mt-1 tabular-nums">
                    {formatCurrency(Math.abs(correria.balanceDue))}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {correria.balanceDue >= 0
                      ? 'Trabajador debe consignar sobrante'
                      : 'Empresa cubre mayor valor gastado'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddExpenseForm(!showAddExpenseForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    + Agregar Factura / Soporte DIAN
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {correria.status !== 'Legalización Radicada' && correria.status !== 'Legalizado por Contabilidad' && correria.status !== 'Contabilizado en Siigo Nube' && (
                    <button
                      onClick={() => submitLegalization(correria.id)}
                      disabled={correria.expenses.length === 0}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Radicar Legalización a Contabilidad
                    </button>
                  )}

                  {correria.status === 'Legalización Radicada' && (
                    <button
                      onClick={() => approveLegalization(correria.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprobar Legalización Contable
                    </button>
                  )}
                </div>
              </div>

              {/* Classification of Expenses KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">Facturas Electrónicas DIAN</span>
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                      CUFE DIAN
                    </span>
                  </div>
                  <p className="text-base font-black text-slate-900 mt-1 font-mono">
                    {formatCurrency(
                      correria.expenses
                        .filter((e) => !e.documentType || e.documentType === 'Factura Electrónica')
                        .reduce((acc, curr) => acc + curr.amountTotal, 0)
                    )}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {correria.expenses.filter((e) => !e.documentType || e.documentType === 'Factura Electrónica').length} facturas validadas
                  </span>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900">Talonarios / Recibos Papel</span>
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                      Doc. Soporte Siigo
                    </span>
                  </div>
                  <p className="text-base font-black text-amber-950 mt-1 font-mono">
                    {formatCurrency(
                      correria.expenses
                        .filter((e) => e.documentType === 'Talonario Físico' || e.requiresDocumentoSoporte)
                        .reduce((acc, curr) => acc + curr.amountTotal, 0)
                    )}
                  </p>
                  <span className="text-[10px] text-amber-800 font-medium">
                    {correria.expenses.filter((e) => e.documentType === 'Talonario Físico' || e.requiresDocumentoSoporte).length} a emitir con DS
                  </span>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900">Movilidad & Gastos Menores</span>
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-300">
                      Planilla Viáticos
                    </span>
                  </div>
                  <p className="text-base font-black text-blue-950 mt-1 font-mono">
                    {formatCurrency(
                      correria.expenses
                        .filter((e) => e.documentType === 'Recibo Menor / Planilla')
                        .reduce((acc, curr) => acc + curr.amountTotal, 0)
                    )}
                  </p>
                  <span className="text-[10px] text-blue-700 font-medium">
                    {correria.expenses.filter((e) => e.documentType === 'Recibo Menor / Planilla').length} gastos menores
                  </span>
                </div>
              </div>

              {/* Form to add an expense */}
              {showAddExpenseForm && (
                <form onSubmit={handleAddExpense} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800 text-xs">Registro de Gasto y Soporte Contable</span>
                    <button type="button" onClick={() => setShowAddExpenseForm(false)} className="text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selector de Tipo de Documento */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                      Tipo de Soporte Fiscal / Documento *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDocType('Factura Electrónica')}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          docType === 'Factura Electrónica'
                            ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600 text-emerald-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${docType === 'Factura Electrónica' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className="text-xs">Factura Electrónica</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-normal">Con CUFE y validación previa DIAN</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDocType('Talonario Físico');
                          setTax(0);
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          docType === 'Talonario Físico'
                            ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600 text-amber-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Receipt className={`w-3.5 h-3.5 ${docType === 'Talonario Físico' ? 'text-amber-600' : 'text-slate-400'}`} />
                          <span className="text-xs">Talonario / Papel</span>
                        </div>
                        <p className="text-[10px] text-amber-800 mt-0.5 font-normal">Requiere Documento Soporte Siigo</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDocType('Recibo Menor / Planilla');
                          setTax(0);
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          docType === 'Recibo Menor / Planilla'
                            ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600 text-blue-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <FileText className={`w-3.5 h-3.5 ${docType === 'Recibo Menor / Planilla' ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs">Planilla de Movilidad</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-normal">Taxis, peajes y gastos menores</p>
                      </button>
                    </div>
                  </div>

                  {/* Informative alert if Talonario */}
                  {docType === 'Talonario Físico' && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Normativa DIAN (Res. 000167) - Proveedor No Obligado a Facturar:</span>
                        <p className="mt-0.5 text-amber-800">
                          Este recibo de papel se legalizará en Siigo Nube mediante la generación del <strong>Documento Soporte Electrónico (DS)</strong> a nombre del emisor (persona natural o negocio). En compras a no obligados a facturar, el IVA sugerido es $0.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Concepto del Gasto *</label>
                      <select
                        value={concept}
                        onChange={(e) => setConcept(e.target.value as ExpenseConcept)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      >
                        <option value="Transporte Aéreo / Terrestre">Transporte Aéreo / Terrestre</option>
                        <option value="Alojamiento / Hotel">Alojamiento / Hotel</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Movilidad Local / Taxis">Movilidad Local / Taxis</option>
                        <option value="Peajes y Combustible">Peajes y Combustible</option>
                        <option value="Muestras Médicas y Representación">Muestras Médicas y Representación</option>
                        <option value="Imprevistos y Logística">Imprevistos y Logística</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-0.5">
                        {docType === 'Talonario Físico' ? 'Nombre o Razón Social del Emisor *' : 'Proveedor / Razón Social *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={providerName}
                        onChange={(e) => setProviderName(e.target.value)}
                        placeholder={docType === 'Talonario Físico' ? 'Ej. Restaurante El Paisa / Juan Pérez' : 'Ej. Hotel Dann / Taxis Cúcuta'}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-0.5">
                        {docType === 'Talonario Físico' ? 'Cédula o NIT del Emisor *' : 'NIT del Proveedor *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={providerNit}
                        onChange={(e) => setProviderNit(e.target.value)}
                        placeholder="Ej. 1.098.421.390 ó 804.015.632-1"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-0.5">
                        {docType === 'Talonario Físico'
                          ? 'Nº de Talonario / Recibo *'
                          : docType === 'Recibo Menor / Planilla'
                          ? 'ID de Movilidad / Recibo *'
                          : 'Número de Factura *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder={docType === 'Talonario Físico' ? 'Ej. TAL-0048 o REC-102' : 'Ej. FE-99214'}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Fecha del Soporte *</label>
                      <input
                        type="date"
                        required
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Subtotal (COP)</label>
                      <input
                        type="number"
                        value={subtotal}
                        onChange={(e) => setSubtotal(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">IVA / Impoconsumo</label>
                      <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-0.5">Detalle / Justificación Comercial</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        docType === 'Talonario Físico'
                          ? 'Ej. Consumo almuerzo en carretera ruta San Gil - No obligado a facturar electrónicamente'
                          : 'Ej. 2 noches de alojamiento para visitas a Clínica Foscal...'
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-800">
                      Total Soporte: {formatCurrency(Number(subtotal) + Number(tax))}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddExpenseForm(false)}
                        className="px-3 py-1 text-slate-600"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                      >
                        Guardar Gasto
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Table of Expenses */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Concepto & Cuenta PUC</th>
                      <th className="py-2.5 px-3">Proveedor / NIT</th>
                      <th className="py-2.5 px-3">Factura</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-3 text-right">IVA</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Soporte</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {correria.expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{exp.concept}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{exp.pucAccount}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-slate-800">{exp.providerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">NIT: {exp.providerNit}</p>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">
                          {exp.invoiceNumber}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                          {exp.date}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                          {formatCurrency(exp.amountSubtotal)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500">
                          {formatCurrency(exp.amountTax)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                          {formatCurrency(exp.amountTotal)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {exp.documentType === 'Talonario Físico' || exp.requiresDocumentoSoporte ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-2xs">
                              <Receipt className="w-3 h-3 text-amber-700" />
                              Talonario · Req. DS
                            </span>
                          ) : exp.documentType === 'Recibo Menor / Planilla' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded shadow-2xs">
                              <FileText className="w-3 h-3 text-blue-700" />
                              Movilidad Menor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-teal-600" />
                              Factura DIAN OK
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => removeExpenseFromCorreria(correria.id, exp.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Eliminar gasto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {correria.expenses.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          Aún no se han ingresado facturas o soportes de egresos para esta correría.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Integración Siigo Nube API */}
          {activeTab === 'siigo' && (
            <div className="space-y-6">
              {/* Siigo Header Connection Card */}
              <div className="p-5 bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg font-mono">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm tracking-tight">
                        Integración Siigo Nube API v1
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded">
                        API Cloud Conectada
                      </span>
                    </div>
                    <p className="text-xs text-teal-100 mt-0.5">
                      Partner-ID: <span className="font-mono">{siigoConfig.partnerId}</span> · Centro de Costos: <span className="font-mono">{correria.siigoCostCenter}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleSyncSiigo}
                    disabled={isSyncing || correria.expenses.length === 0}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-teal-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 text-xs"
                  >
                    <CloudCheck className="w-4 h-4 text-emerald-700" />
                    {isSyncing
                      ? 'Sincronizando con Siigo...'
                      : correria.siigoVoucherNumber
                      ? 'Re-sincronizar con Siigo'
                      : 'Sincronizar y Contabilizar en Siigo'}
                  </button>
                </div>
              </div>

              {/* Sync Status Box */}
              {correria.siigoVoucherNumber ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Comprobante de Egreso Contabilizado Exitosamente</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-950 bg-white px-2.5 py-1 rounded shadow-2xs border border-emerald-200">
                      {correria.siigoVoucherNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Sincronizado el {correria.siigoSyncDate} · Documento fiscal asentado en el libro diario de Essential Pharma en Siigo Nube.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <p className="font-bold">Pendiente de Sincronización Contable</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Al pulsar "Sincronizar con Siigo", la plataforma transmitirá las partidas contables con cuentas PUC, cruce del anticipo del trabajador y contrapartida bancaria.
                  </p>
                </div>
              )}

              {/* Accounting Entry Breakdown (PUC Débito / Crédito) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                  <span>Asiento Contable Generado para Siigo Nube</span>
                  <span className="text-[11px] text-slate-400">Plan Único de Cuentas (PUC)</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Cuenta PUC</th>
                      <th className="py-2 px-3">Descripción de la Partida</th>
                      <th className="py-2 px-3 text-right">Débito (COP)</th>
                      <th className="py-2 px-3 text-right">Crédito (COP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {correria.expenses.map((e, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-emerald-800 font-bold">{e.pucAccount.split(' ')[0]}</td>
                        <td className="py-2 px-3 font-sans text-slate-700">
                          {e.concept} · {e.providerName} (
                          {e.documentType === 'Talonario Físico' || e.requiresDocumentoSoporte
                            ? `Doc. Soporte DS: ${e.invoiceNumber}`
                            : `Fac. ${e.invoiceNumber}`}
                          )
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(e.amountTotal)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400">—</td>
                      </tr>
                    ))}

                    {/* Anticipo offset (Crédito) */}
                    <tr className="bg-slate-50/40">
                      <td className="py-2 px-3 text-teal-800 font-bold">133005</td>
                      <td className="py-2 px-3 font-sans text-slate-700">
                        Cruce de Anticipo a Trabajador · {correria.adviserName}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">—</td>
                      <td className="py-2 px-3 text-right font-bold text-teal-900">
                        {formatCurrency(correria.totalAdvanceApproved)}
                      </td>
                    </tr>

                    {/* Reintegro or Reembolso */}
                    {correria.balanceDue !== 0 && (
                      <tr className="bg-slate-50/70 font-semibold">
                        <td className="py-2 px-3 text-teal-800 font-bold">111005</td>
                        <td className="py-2 px-3 font-sans text-slate-700">
                          {correria.balanceDue > 0
                            ? 'Reintegro sobrante viáticos a Banco'
                            : 'Cuentas por pagar / Reembolso al trabajador'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {correria.balanceDue < 0 ? formatCurrency(Math.abs(correria.balanceDue)) : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {correria.balanceDue > 0 ? formatCurrency(correria.balanceDue) : '—'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Siigo API Payload Viewer */}
              {correria.siigoPayloadLog && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      Respuesta JSON de Siigo Nube API
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono">Status: 201 Created</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-48 leading-relaxed">
                    {correria.siigoPayloadLog}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-[11px] text-slate-400">
            Módulo Contable de Correrías y Viáticos · Essential Pharma EP Enterprise
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
