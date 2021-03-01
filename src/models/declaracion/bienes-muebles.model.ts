import { Catalogo, Monto, Tercero, Transmisor } from './common.model';
import { FormaPago } from './types';

export interface BienMueble {
  titular: Catalogo[];
  tipoBien: Catalogo;
  transmisor: Transmisor[];
  tercero: Tercero[];
  descripcionGeneralBien: string;
  formaAdquisicion: Catalogo;
  formaPago: FormaPago;
  valorAdquisicion: Monto;
  fechaAdquisicion: string;
  motivoBaja?: Catalogo;
}

export interface BienesMuebles {
  ninguno?: boolean;
  bienMueble?: BienMueble[];
  aclaracionesObservaciones?: string;
}
