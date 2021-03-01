import { Catalogo, Monto, Tercero, Ubicacion } from './common.model';
import { TipoOperacion, TipoRelacion } from './types';

interface Empresa {
  nombreEmpresaServicio: string;
  rfc: string;
}

export interface Cliente {
  tipoOperacion?: TipoOperacion;
  realizaActividadLucrativa: boolean;
  tipoRelacion: TipoRelacion;
  empresa: Empresa;
  clientePrincipal: Tercero;
  sector: Catalogo;
  montoAproximadoGanancia: Monto;
  ubicacion: Ubicacion;
}

export interface ClientesPrincipales {
  ninguno?: boolean;
  cliente?: Cliente[];
  aclaracionesObservaciones?: string;
}
