import { Catalogo, Monto, Tercero, Transmisor, Ubicacion } from './common.model';
import { FormaPago } from './types';

export interface Vehiculo {
  tipoVehiculo: Catalogo;
  titular: Catalogo[];
  transmisor: Transmisor[];
  marca: string;
  modelo: string;
  anio: number;
  numeroSerieRegistro: string;
  tercero: Tercero[];
  lugarRegistro: Ubicacion;
  formaAdquisicion: Catalogo;
  formaPago: FormaPago;
  valorAdquisicion: Monto;
  fechaAdquisicion: string;
  motivoBaja?: Catalogo;
}

export interface Vehiculos {
  ninguno?: boolean;
  vehiculo?: Vehiculo[];
  aclaracionesObservaciones?: string;
}
