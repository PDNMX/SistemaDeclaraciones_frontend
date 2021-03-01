import {
  ActividadLaboralSectorPrivadoOtro,
  ActividadLaboralSectorPublico,
  Catalogo,
  DomicilioExtranjero,
  DomicilioMexico,
} from './common.model';
import { LugarResidencia, RelacionConDeclarante } from './types';

export interface DatosPareja {
  ninguno?: boolean;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  fechaNacimiento?: string;
  rfc?: string;
  relacionConDeclarante?: RelacionConDeclarante;
  ciudadanoExtranjero?: boolean;
  curp?: string;
  esDependienteEconomico?: boolean;
  habitaDomicilioDeclarante?: boolean;
  lugarDondeReside?: LugarResidencia;
  domicilioMexico?: DomicilioMexico;
  domicilioExtranjero?: DomicilioExtranjero;
  actividadLaboral?: Catalogo;
  actividadLaboralSectorPublico?: ActividadLaboralSectorPublico;
  actividadLaboralSectorPrivadoOtro?: ActividadLaboralSectorPrivadoOtro;
  aclaracionesObservaciones?: string;
}
