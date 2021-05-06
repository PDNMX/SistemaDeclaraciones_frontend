import { DomicilioExtranjero, DomicilioMexico } from './common.model';
import { AmbitoPublico, NivelOrdenGobierno, TipoOperacion } from './types';

interface TelefonoOficina {
  telefono: string;
  extension: string;
}

export interface DatosEmpleoCargoComision {
  tipoOperacion?: TipoOperacion;
  nivelOrdenGobierno: NivelOrdenGobierno;
  ambitoPublico?: AmbitoPublico;
  nombreEntePublico?: string;
  areaAdscripcion: string;
  empleoCargoComision: string;
  contratadoPorHonorarios: boolean;
  nivelEmpleoCargoComision: string;
  funcionPrincipal: string;
  fechaTomaPosesion: string;
  telefonoOficina: TelefonoOficina;
  domicilioMexico?: DomicilioMexico;
  domicilioExtranjero?: DomicilioExtranjero;
  aclaracionesObservaciones?: string;
  cuentaConOtroCargoPublico?: boolean;
}
