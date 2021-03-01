import { Catalogo, Monto } from './common.model';
import { FormaRecepcion, NivelOrdenGobierno, TipoOperacion, TipoPersona } from './types';

export interface Apoyo {
  tipoOperacion?: TipoOperacion;
  tipoPersona: TipoPersona;
  beneficiarioPrograma: Catalogo;
  nombrePrograma: string;
  institucionOtorgante: string;
  nivelOrdenGobierno: NivelOrdenGobierno;
  tipoApoyo: Catalogo;
  formaRecepcion: FormaRecepcion;
  montoApoyoMensual: Monto;
  especifiqueApoyo: string;
}

export interface Apoyos {
  ninguno?: boolean;
  apoyo?: Apoyo[];
  aclaracionesObservaciones?: string;
}
