import { Catalogo, Monto, Tercero } from './common.model';
import { MexicoExtranjero, TipoPersona } from './types';

interface OtorganteCredito {
  tipoPersona: TipoPersona;
  nombreInstitucion: string;
  rfc: string;
}

interface LocalizacionAdeudo {
  localizacion?: MexicoExtranjero;
  pais: string;
}

export interface Adeudo {
  titular: Catalogo[];
  tipoAdeudo: Catalogo;
  numeroCuentaContrato: string;
  fechaAdquisicion: string;
  montoOriginal: Monto;
  saldoInsolutoSituacionActual: Monto;
  tercero: Tercero[];
  otorganteCredito: OtorganteCredito;
  localizacionAdeudo: LocalizacionAdeudo;
}

export interface AdeudosPasivos {
  ninguno?: boolean;
  adeudo?: Adeudo[];
  aclaracionesObservaciones?: string;
}
