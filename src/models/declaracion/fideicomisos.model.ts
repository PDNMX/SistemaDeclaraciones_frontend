import { Catalogo, Tercero } from './common.model';
import { MexicoExtranjero, TipoFideicomiso, TipoOperacion, TipoParticipacionFideicomiso, TipoRelacion } from './types';

interface Fiduciario {
  nombreRazonSocial: string;
  rfc: string;
}

export interface Fideicomiso {
  tipoOperacion?: TipoOperacion;
  tipoRelacion: TipoRelacion;
  tipoFideicomiso: TipoFideicomiso;
  tipoParticipacion: TipoParticipacionFideicomiso;
  rfcFideicomiso: string;
  fideicomitente?: Tercero;
  fiduciario?: Fiduciario;
  fideicomisario?: Tercero;
  sector: Catalogo;
  extranjero: MexicoExtranjero;
}

export interface Fideicomisos {
  ninguno?: boolean;
  fideicomiso?: Fideicomiso[];
  aclaracionesObservaciones?: string;
}
