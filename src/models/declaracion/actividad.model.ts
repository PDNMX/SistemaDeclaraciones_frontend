import { Catalogo, Monto } from './common.model';

export interface ActividadFinanciera {
  remuneracion: Monto;
  tipoInstrumento: Catalogo;
}

export interface ActividadIndustrial {
  remuneracion: Monto;
  nombreRazonSocial: string;
  tipoNegocio: string;
}

export interface EnajenacionBienes {
  remuneracion: Monto;
  tipoBienEnajenado: string;
}

export interface OtrosIngresos {
  remuneracion: Monto;
  tipoIngreso: string;
}

export interface ServiciosProfesionales {
  remuneracion: Monto;
  tipoServicio: string;
}

export interface ActividadFinancieraTotal {
  remuneracionTotal: Monto;
  actividades: ActividadFinanciera[];
}

export interface ActividadIndustrialTotal {
  remuneracionTotal: Monto;
  actividades: ActividadIndustrial[];
}

export interface EnajenacionBienesTotal {
  remuneracionTotal: Monto;
  bienes: EnajenacionBienes[];
}

export interface OtrosIngresosTotal {
  remuneracionTotal: Monto;
  ingresos: OtrosIngresos[];
}

export interface ServiciosProfesionalesTotal {
  remuneracionTotal: Monto;
  servicios: ServiciosProfesionales[];
}
