import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Employee } from '../../types/hr';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { EPLogo } from '../common/EPLogo';

interface LaborCertificateModalProps {
  employee: Employee;
  onClose: () => void;
}

export const LaborCertificateModal: React.FC<LaborCertificateModalProps> = ({ employee, onClose }) => {
  const { companyName, formatCurrency } = useHR();

  const [addressee, setAddressee] = useState<'A quien interese' | 'Entidad Financiera' | 'Misión Diplomática / Embajada'>('A quien interese');
  const [customAddressee, setCustomAddressee] = useState('');
  const [includeSalary, setIncludeSalary] = useState(true);

  const verificationCode = `CERT-EP-${employee.code}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const finalAddressee = addressee === 'A quien interese' ? 'A QUIEN INTERESE' : customAddressee ? customAddressee.toUpperCase() : addressee.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Controls Bar (Hidden on print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800">Parámetros del Certificado:</span>
            <select
              value={addressee}
              onChange={(e) => setAddressee(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1 font-medium"
            >
              <option value="A quien interese">A quien interese</option>
              <option value="Entidad Financiera">Entidad Financiera / Banco</option>
              <option value="Misión Diplomática / Embajada">Misión Diplomática / Embajada</option>
            </select>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSalary}
                onChange={(e) => setIncludeSalary(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
              <span className="font-medium">Incluir salario</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-12 overflow-y-auto flex-1 font-serif text-slate-900 bg-white leading-relaxed print:p-0">
          {/* Official Letterhead with EP Logo */}
          <div className="flex flex-col items-center pb-8 border-b-2 border-slate-800">
            <EPLogo size="lg" showSubtitle={true} className="mb-2" />
            <p className="text-xs font-sans text-slate-500 uppercase tracking-widest mt-1">
              NIT 901.428.910-4 · Dirección de Gestión del Talento Humano & Financiero
            </p>
            <p className="text-xs font-sans text-slate-400 mt-0.5">
              Bogotá D.C., Colombia · Sede Administrativa & Operativa
            </p>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-10">
            <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-slate-800">
              LA SUSCRITA DIRECTORA DE TALENTO HUMANO Y CULTURA
            </h2>
            <h3 className="text-lg font-sans font-extrabold uppercase tracking-widest text-slate-900 mt-2">
              CERTIFICA:
            </h3>
          </div>

          {/* Body Text */}
          <div className="space-y-6 text-sm text-justify font-sans text-slate-800 leading-loose">
            <p>
              Que el(la) señor(a) <strong className="font-bold text-slate-950 uppercase">{employee.firstName} {employee.lastName}</strong>, 
              identificado(a) con {employee.documentType} número <strong className="font-mono font-bold text-slate-950">{employee.documentNumber}</strong>, 
              labora para nuestra compañía bajo un contrato laboral a <strong className="font-bold text-slate-950">{employee.contractType.toLowerCase()}</strong> desde el día <strong className="font-mono font-bold text-slate-950">{employee.hireDate}</strong> hasta la fecha, encontrándose actualmente con vinculación activa.
            </p>

            <p>
              En la actualidad, desempeña a entera satisfacción el cargo de <strong className="font-bold text-slate-950 uppercase">{employee.jobTitle}</strong> en el área de <strong className="font-bold text-slate-950">{employee.department}</strong>, demostrando un alto compromiso ético y profesional en el cumplimiento de sus funciones corporativas.
            </p>

            {includeSalary ? (
              <p>
                Por concepto de contraprestación de sus servicios laborales, percibe un salario básico mensual de <strong className="font-mono font-bold text-slate-950">{formatCurrency(employee.baseSalary)}</strong>, más las prestaciones sociales y acreencias consagradas en la legislación laboral colombiana vigente.
              </p>
            ) : (
              <p>
                El trabajador percibe las prestaciones sociales legales ordinarias correspondientes a su nivel de contratación.
              </p>
            )}

            <p>
              Para constancia y a solicitud del interesado, se expide la presente certificación con destino a <strong className="font-bold text-slate-950">{finalAddressee}</strong>, en la ciudad de Bogotá D.C., a los {new Date().getDate()} días del mes de {new Date().toLocaleDateString('es-CO', { month: 'long' })} del año {new Date().getFullYear()}.
            </p>
          </div>

          {/* Signatures & Security Seals */}
          <div className="mt-16 pt-8 flex justify-between items-end">
            <div>
              <div className="w-48 border-b-2 border-slate-900 pb-1 mb-2">
                <span className="font-serif italic text-base text-emerald-950 block select-none">
                  Mariana Morales S.
                </span>
              </div>
              <p className="font-sans font-bold text-xs text-slate-900 uppercase">
                Mariana Morales Silva
              </p>
              <p className="font-sans text-xs text-slate-600">
                Directora de Talento Humano & Cultura
              </p>
              <p className="font-sans text-[11px] text-slate-400">
                {companyName}
              </p>
            </div>

            <div className="text-right font-sans">
              <div className="inline-flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-left">
                <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
                <div className="text-[10px]">
                  <p className="font-bold text-slate-800">Certificado Autenticado</p>
                  <p className="text-slate-500 font-mono">{verificationCode}</p>
                  <p className="text-slate-400">EP ENTERPRISE Security Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

