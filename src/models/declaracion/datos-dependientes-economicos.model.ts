import {
  ActividadLaboralSectorPrivadoOtro,
  ActividadLaboralSectorPublico,
  Catalogo,
  DomicilioExtranjero,
  DomicilioMexico,
} from './common.model';
import { LugarResidencia } from './types';

export interface DependienteEconomico {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  rfc: string;
  parentescoRelacion: Catalogo;
  extranjero: boolean;
  curp: string;
  habitaDomicilioDeclarante: boolean;
  lugarDondeReside: LugarResidencia;
  domicilioMexico?: DomicilioMexico;
  domicilioExtranjero?: DomicilioExtranjero;
  actividadLaboralSectorPublico?: ActividadLaboralSectorPublico;
  actividadLaboralSectorPrivadoOtro?: ActividadLaboralSectorPrivadoOtro;
  aclaracionesObservaciones?: string;
}

export interface DatosDependientesEconomicos {
  ninguno?: boolean;
  dependienteEconomico?: DependienteEconomico[];
  aclaracionesObservaciones?: string;
}
