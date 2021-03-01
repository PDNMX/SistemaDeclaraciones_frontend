import { Catalogo, DomicilioExtranjero, DomicilioMexico, Ubicacion } from './common.model';
import { TipoPersona } from './types';

interface InmueblePrestamo {
  tipoInmueble: Catalogo;
  domicilioMexico?: DomicilioMexico;
  domicilioExtranjero?: DomicilioExtranjero;
}

interface VehiculoPrestamo {
  tipo: Catalogo;
  marca: string;
  modelo: string;
  anio: number;
  numeroSerieRegistro: string;
  lugarRegistro: Ubicacion;
}

interface TipoBienPrestamo {
  inmueble?: InmueblePrestamo;
  vehiculo?: VehiculoPrestamo;
}

interface DuenoTitularPrestamo {
  tipoDuenoTitular: TipoPersona;
  nombreTitular: string;
  rfc: string;
  relacionConTitular: string;
}

export interface Prestamo {
  tipoBien: TipoBienPrestamo;
  duenoTitular: DuenoTitularPrestamo;
}

export interface PrestamoComodato {
  ninguno?: boolean;
  prestamo?: Prestamo[];
  aclaracionesObservaciones?: string;
}
