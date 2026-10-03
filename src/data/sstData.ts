import { SSTDocument, HazardRiskGTC45, AnnualWorkPlanItem, AccidentReport, CopasstRecord, SSTIndicator } from '../types/hr';

export const INITIAL_SST_DOCUMENTS: SSTDocument[] = [];

export const INITIAL_HAZARDS: HazardRiskGTC45[] = [];

export const INITIAL_ANNUAL_WORK_PLAN: AnnualWorkPlanItem[] = [];

export const INITIAL_ACCIDENT_REPORTS: AccidentReport[] = [];

export const INITIAL_COPASST_RECORDS: CopasstRecord[] = [];

export const INITIAL_SST_INDICATORS: SSTIndicator[] = [
  {
    id: 'ind-01',
    name: 'Índice de Frecuencia de Accidentalidad (IFA)',
    category: 'Resultado',
    formula: '(Nº Accidentes en el año / Horas Hombre Trabajadas) * 240.000',
    target: '< 1.50',
    current: '0.00',
    status: 'Cumplido',
    periodicity: 'Mensual / Anual',
  },
  {
    id: 'ind-02',
    name: 'Índice de Severidad de Accidentalidad (ISA)',
    category: 'Resultado',
    formula: '(Días Perdidos por Incapacidad / Horas Hombre Trabajadas) * 240.000',
    target: '< 5.0 días',
    current: '0.00 días',
    status: 'Cumplido',
    periodicity: 'Mensual / Anual',
  },
  {
    id: 'ind-03',
    name: 'Tasa de Ausentismo por Causa Médica',
    category: 'Proceso',
    formula: '(Días de Ausencia Médica / Días Hombre Programados) * 100',
    target: '< 2.0 %',
    current: '0.00 %',
    status: 'Cumplido',
    periodicity: 'Mensual',
  },
  {
    id: 'ind-04',
    name: '% Cumplimiento del Plan Anual de Trabajo SG-SST',
    category: 'Estructura',
    formula: '(Actividades Ejecutadas / Actividades Programadas) * 100',
    target: '>= 85 %',
    current: '0.0 %',
    status: 'En Seguimiento',
    periodicity: 'Trimestral',
  },
  {
    id: 'ind-05',
    name: 'Cobertura de Evaluaciones Médicas Ocupacionales',
    category: 'Proceso',
    formula: '(Trabajadores Evaluados / Total Trabajadores) * 100',
    target: '100 %',
    current: '0.0 %',
    status: 'En Seguimiento',
    periodicity: 'Anual',
  },
];
