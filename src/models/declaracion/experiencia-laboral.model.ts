import { Catalogo } from './common.model';
import { AmbitoPublico, MexicoExtranjero, NivelOrdenGobierno } from './types';

export interface Experiencia {
  ambitoSector: Catalogo;
  nivelOrdenGobierno: NivelOrdenGobierno;
  ambitoPublico: AmbitoPublico;
  nombreEntePublico: string;
  areaAdscripcion: string;
  empleoCargoComision: string;
  funcionPrincipal: string;
  fechaIngreso: string;
  fechaEgreso: string;
  ubicacion: MexicoExtranjero;
  nombreEmpresaSociedadAsociacion?: string;
  rfc?: string;
  area?: string;
  puesto?: string;
  sector?: Catalogo;
}

export interface ExperienciaLaboral {
  ninguno?: boolean;
  experiencia?: Experiencia[];
  aclaracionesObservaciones?: string;
}
