import {
  ActividadFinancieraTotal,
  ActividadIndustrialTotal,
  EnajenacionBienesTotal,
  OtrosIngresosTotal,
  ServiciosProfesionalesTotal,
} from './actividad.model';
import { Monto } from './common.model';

export interface ActividadAnualAnterior {
  servidorPublicoAnioAnterior: boolean;
  fechaIngreso?: string;
  fechaConclusion?: string;
  remuneracionNetaCargoPublico?: Monto;
  otrosIngresosTotal?: Monto;
  actividadIndustrialComercialEmpresarial?: ActividadIndustrialTotal;
  actividadFinanciera?: ActividadFinancieraTotal;
  serviciosProfesionales?: ServiciosProfesionalesTotal;
  enajenacionBienes?: EnajenacionBienesTotal;
  otrosIngresos?: OtrosIngresosTotal;
  ingresoNetoAnualDeclarante?: Monto;
  ingresoNetoAnualParejaDependiente?: Monto;
  totalIngresosNetosAnuales?: Monto;
  aclaracionesObservaciones?: string;
}
