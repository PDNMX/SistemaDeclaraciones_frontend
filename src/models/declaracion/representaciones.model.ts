import { Catalogo, Monto, Ubicacion } from './common.model';
import { TipoOperacion, TipoPersona, TipoRelacion, TipoRepresentacion } from './types';

export interface Representacion {
  tipoOperacion?: TipoOperacion;
  tipoRelacion: TipoRelacion;
  tipoRepresentacion: TipoRepresentacion;
  tipoPersona: TipoPersona;
  nombreRazonSocial: string;
  rfc: string;
  recibeRemuneracion: boolean;
  montoMensual: Monto;
  fechaInicioRepresentacion: string;
  ubicacion: Ubicacion;
  sector: Catalogo;
}

export interface Representaciones {
  ninguno?: boolean;
  representacion?: Representacion[];
  aclaracionesObservaciones?: string;
}
