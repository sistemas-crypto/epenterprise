import React from 'react';
import { useHR } from '../../context/HRContext';
import { Payslip } from '../../types/hr';
import { X, Printer, Download, CheckCircle, Building2, ShieldCheck } from 'lucide-react';
import { EPLogo } from '../common/EPLogo';

interface PayslipModalProps {
  payslip: Payslip;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ payslip, onClose }) => {
  const { companyName, formatCurrency } = useHR();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Comprobante Oficial de Nómina</span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {payslip.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-8 overflow-y-auto flex-1 text-slate-800 font-sans print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200">
            <div>
              <EPLogo size="md" showSubtitle={true} />
              <p className="text-xs text-slate-500 mt-2">
                NIT 901.428.910-4 · Sede Principal Cra. 45 # 108-27, Bogotá D.C.
              </p>
              <p className="text-xs text-slate-500">
                Sistema de Nómina Electrónica Certificado DIAN · EP ENTERPRISE
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Liquidación Individual de Salarios
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                {payslip.id.toUpperCase()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Periodo: <span className="font-semibold text-slate-700">Septiembre 2026</span>
              </p>
              <p className="text-xs text-slate-500">
                Fecha de Emisión: {payslip.paymentDate}
              </p>
            </div>
          </div>

          {/* Trabajador Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs bg-slate-50/50 p-3 rounded-lg mt-4">
            <div>
              <span className="text-slate-400 font-medium">Trabajador</span>
              <p className="font-bold text-slate-900 mt-0.5">{payslip.employeeName}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Documento</span>
              <p className="font-bold text-slate-900 mt-0.5 font-mono">{payslip.employeeDocument}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Cargo</span>
              <p className="font-bold text-slate-900 mt-0.5">{payslip.jobTitle}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Departamento</span>
              <p className="font-bold text-slate-900 mt-0.5">{payslip.department}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Fecha Ingreso</span>
              <p className="font-bold text-slate-900 mt-0.5 font-mono">{payslip.hireDate}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Días Liquidados</span>
              <p className="font-bold text-slate-900 mt-0.5 font-mono">{payslip.daysWorked} días</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Salario Base</span>
              <p className="font-bold text-slate-900 mt-0.5 font-mono">{formatCurrency(payslip.baseSalary)}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Estado Nómina</span>
              <p className="font-bold text-emerald-700 mt-0.5">{payslip.status}</p>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Devengos (Earnings) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-50/70 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Devengos (Ingresos)
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Total Ganado</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 text-xs">
                {payslip.earnings.map((e, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{e.concept}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{e.code}</p>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {formatCurrency(e.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                <span>Total Devengado:</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  {formatCurrency(payslip.totalEarnings)}
                </span>
              </div>
            </div>

            {/* Deducciones (Deductions) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-50/70 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Deducciones de Ley
                </span>
                <span className="text-[11px] font-semibold text-rose-700">Retenciones</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 text-xs">
                {payslip.deductions.map((d, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{d.concept}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{d.code}</p>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-rose-600">
                      -{formatCurrency(d.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                <span>Total Deducciones:</span>
                <span className="font-mono text-rose-700 tabular-nums">
                  -{formatCurrency(payslip.totalDeductions)}
                </span>
              </div>
            </div>
          </div>

          {/* NET PAY SUMMARY HERO */}
          <div className="mt-6 p-5 bg-emerald-950 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                Neto a Pagar al Trabajador
              </span>
              <p className="text-2xl font-bold font-mono tracking-tight mt-0.5 tabular-nums">
                {formatCurrency(payslip.netPay)}
              </p>
              <p className="text-xs text-emerald-100 mt-1">
                Dispersado mediante transferencia electrónica bancaria · EP ENTERPRISE
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[11px] text-emerald-200">Firma Digital Empleador</span>
              <p className="text-xs font-semibold mt-0.5">Mariana Morales Silva</p>
              <p className="text-[11px] text-emerald-300">Directora de Gestión Humana</p>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-400 leading-relaxed">
            Este comprobante de nómina constituye constancia legal del pago de las acreencias laborales del periodo estipulado conforme al Código Sustantivo del Trabajo de la República de Colombia.
          </div>
        </div>
      </div>
    </div>
  );
};
