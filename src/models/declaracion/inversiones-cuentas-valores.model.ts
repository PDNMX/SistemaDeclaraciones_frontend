import { Catalogo, Monto, Tercero } from './common.model';

interface LocalizacionInversion {
  pais: string;
  institucionRazonSocial: string;
  rfc: string;
}

export interface Inversion {
  tipoInversion: Catalogo;
  subTipoInversion: Catalogo;
  titular: Catalogo[];
  tercero: Tercero[];
  numeroCuentaContrato: string;
  localizacionInversion: LocalizacionInversion;
  saldoSituacionActual: Monto;
}

export interface InversionesCuentasValores {
  ninguno?: boolean;
  inversion?: Inversion[];
  aclaracionesObservaciones?: string;
}
