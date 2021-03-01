import { Catalogo, Monto, Ubicacion } from './common.model';
import { TipoOperacion, TipoRelacion } from './types';

export interface ParticipacionTD {
  tipoOperacion?: TipoOperacion;
  tipoRelacion: TipoRelacion;
  tipoInstitucion: Catalogo;
  nombreInstitucion: string;
  rfc: string;
  puestoRol: string;
  fechaInicioParticipacion: string;
  recibeRemuneracion: boolean;
  montoMensual: Monto;
  ubicacion: Ubicacion;
}

export interface ParticipacionTomaDecisiones {
  ninguno?: boolean;
  participacion?: ParticipacionTD[];
  aclaracionesObservaciones?: string;
}
