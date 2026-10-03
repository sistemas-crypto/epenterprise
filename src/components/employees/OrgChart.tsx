import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Employee } from '../../types/hr';
import { Users, ChevronDown, ChevronRight, Mail, Phone, Building2 } from 'lucide-react';

export const OrgChart: React.FC = () => {
  const { employees, setSelectedEmployee } = useHR();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'emp-1': true,
    'emp-2': true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Find root leaders (Mariana Morales, Carlos Restrepo, David Vargas)
  const directors = employees.filter((e) => !e.managerId);
  
  // Find reportees of a given employee
  const getSubordinates = (managerId: string) => {
    return employees.filter((e) => e.managerId === managerId);
  };

  const renderCard = (emp: Employee, isDirector = false) => {
    const subordinates = getSubordinates(emp.id);
    const hasSubordinates = subordinates.length > 0;
    const isExpanded = expandedNodes[emp.id] ?? false;

    return (
      <div key={emp.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div
          onClick={() => setSelectedEmployee(emp)}
          className={`group relative p-4 rounded-xl border transition-all cursor-pointer w-72 text-left bg-white shadow-xs hover:shadow-md ${
            isDirector ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-teal-400'
          }`}
        >
          <div className="flex items-start gap-3">
            <img
              src={emp.avatar}
              alt={emp.firstName}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {emp.firstName} {emp.lastName.split(' ')[0]}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  emp.status === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {emp.status}
                </span>
              </div>
              <p className="text-[11px] font-medium text-teal-700 truncate mt-0.5">
                {emp.jobTitle}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{emp.department}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-mono tabular-nums">{emp.code}</span>
            <span className="text-teal-600 font-semibold group-hover:underline">Ver Ficha</span>
          </div>

          {/* Toggle subordinates button */}
          {hasSubordinates && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(emp.id);
              }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 z-10"
              title={isExpanded ? 'Ocultar equipo' : 'Ver equipo'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Child Subordinates Branch */}
        {hasSubordinates && isExpanded && (
          <div className="flex flex-col items-center mt-6 relative">
            {/* Vertical connector line */}
            <div className="w-px h-6 bg-slate-300 -mt-3 mb-3"></div>

            {/* Subordinates container */}
            <div className="flex flex-wrap justify-center gap-6 relative">
              {subordinates.map((sub) => renderCard(sub, false))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50/50 border border-slate-200 rounded-xl overflow-x-auto min-h-[500px]">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-base font-bold text-slate-900">
          Organigrama Corporativo de Estructura y Liderazgo
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Mapa jerárquico interactivo de líneas de reporte, jefaturas y áreas funcionales.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 items-start pb-12">
        {directors.map((dir) => renderCard(dir, true))}
      </div>
    </div>
  );
};
