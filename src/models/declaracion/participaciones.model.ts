import { Catalogo, Monto, Ubicacion } from './common.model';
import { TipoOperacion, TipoRelacion } from './types';

export interface Participacion {
  tipoOperacion?: TipoOperacion;
  tipoRelacion: TipoRelacion;
  nombreEmpresaSociedadAsociacion: string;
  rfc: string;
  porcentajeParticipacion: number;
  tipoParticipacion: Catalogo;
  recibeRemuneracion: boolean;
  montoMensual: Monto;
  ubicacion: Ubicacion;
  sector: Catalogo;
}

export interface Participaciones {
  ninguno?: boolean;
  participacion?: Participacion[];
  aclaracionesObservaciones?: string;
}
