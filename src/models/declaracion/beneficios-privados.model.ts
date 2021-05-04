import { Catalogo, Monto, Tercero } from './common.model';
import { FormaRecepcion, TipoOperacion, TipoPersona } from './types';

export interface Beneficio {
  tipoOperacion?: TipoOperacion;
  tipoBeneficio: Catalogo;
  beneficiario: Catalogo;
  otorgante: Tercero;
  formaRecepcion: FormaRecepcion;
  especifiqueBeneficio: string;
  montoMensualAproximado: Monto;
  sector: Catalogo;
}

export interface BeneficiosPrivados {
  ninguno?: boolean;
  beneficio?: Beneficio[];
  aclaracionesObservaciones?: string;
}
