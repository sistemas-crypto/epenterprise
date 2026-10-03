import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Payslip } from '../../types/hr';
import {
  CreditCard,
  Calculator,
  CheckCircle2,
  Download,
  Search,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PayslipModal } from './PayslipModal';

export const PayrollManager: React.FC = () => {
  const {
    currentPeriod,
    payslips,
    calculatePayroll,
    closePayroll,
    selectedPayslip,
    setSelectedPayslip,
    formatCurrency,
    currentRole,
    companyName,
    showToast,
  } = useHR();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayslips = payslips.filter((p) =>
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employeeDocument.includes(searchQuery)
  );

  const totalEarningsAll = payslips.reduce((sum, p) => sum + p.totalEarnings, 0);
  const totalDeductionsAll = payslips.reduce((sum, p) => sum + p.totalDeductions, 0);
  const totalNetPayAll = payslips.reduce((sum, p) => sum + p.netPay, 0);

  const handleExportCSV = () => {
    const headers = [
      'Documento',
      'Trabajador',
      'Cargo',
      'Departamento',
      'Salario Base',
      'Total Devengos',
      'Total Deducciones',
      'Neto a Pagar',
      'Banco',
      'Estado',
    ];

    const rows = payslips.map((p) => [
      `"${p.employeeDocument}"`,
      `"${p.employeeName}"`,
      `"${p.jobTitle}"`,
      `"${p.department}"`,
      p.baseSalary,
      p.totalEarnings,
      p.totalDeductions,
      p.netPay,
      `"Bancolombia"`,
      `"${p.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dispersion_nomina_${currentPeriod.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Archivo CSV Descargado', 'El archivo de dispersión bancaria para banca empresarial se generó exitosamente.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Nómina & Remuneraciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Periodo Activo: <span className="font-semibold text-slate-700">{currentPeriod.name}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Exportar Dispersión (CSV)
          </button>

          {currentRole === 'admin_hr' && (
            <>
              <button
                onClick={calculatePayroll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5 text-teal-600" />
                Recalcular Periodo
              </button>

              <button
                onClick={closePayroll}
                disabled={currentPeriod.status === 'Cerrada y Pagada'}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                  currentPeriod.status === 'Cerrada y Pagada'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentPeriod.status === 'Cerrada y Pagada' ? 'Nómina Pagada' : 'Aprobar y Pagar Nómina'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Costo Nómina</span>
            <CreditCard className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 font-mono tabular-nums">
            {formatCurrency(totalEarningsAll)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Sueldos base + aux. transporte + bonos</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Retenciones y Seguridad Social</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-rose-600 mt-2 font-mono tabular-nums">
            -{formatCurrency(totalDeductionsAll)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Salud (4%), Pensión (4%), FSP, Retefuente</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Neto Total a Dispersar</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-700 mt-2 font-mono tabular-nums">
            {formatCurrency(totalNetPayAll)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Valor transferido a cuentas de trabajadores</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Estado del Periodo</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              currentPeriod.status === 'Cerrada y Pagada'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentPeriod.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {payslips.length} trabajadores liquidados
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por trabajador, cargo o documento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <div className="text-xs text-slate-500">
          Mostrando <span className="font-semibold text-slate-800">{filteredPayslips.length}</span> de {payslips.length} liquidaciones
        </div>
      </div>

      {/* Payslips Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Trabajador</th>
                <th className="py-3 px-4">Cargo & Área</th>
                <th className="py-3 px-4 text-right">Salario Base</th>
                <th className="py-3 px-4 text-right">Total Devengos</th>
                <th className="py-3 px-4 text-right">Deducciones</th>
                <th className="py-3 px-4 text-right">Neto a Pagar</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayslips.map((slip) => (
                <tr key={slip.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{slip.employeeName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{slip.employeeDocument}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{slip.jobTitle}</p>
                    <p className="text-[11px] text-slate-400">{slip.department}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                    {formatCurrency(slip.baseSalary)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {formatCurrency(slip.totalEarnings)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-rose-600">
                    -{formatCurrency(slip.totalDeductions)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                    {formatCurrency(slip.netPay)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      slip.status === 'Pagado'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {slip.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPayslip(slip)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ver Colilla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </div>
  );
};
