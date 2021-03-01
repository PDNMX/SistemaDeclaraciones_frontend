import { Catalogo } from './common.model';
import { DocumentoObtenido, Estatus } from './types';

interface InstitucionEducativa {
  nombre: string;
  ubicacion: string;
}

export interface Escolaridad {
  tipoOperacion?: string;
  nivel: Catalogo;
  institucionEducativa: InstitucionEducativa;
  carreraAreaConocimiento: string;
  estatus: Estatus;
  documentoObtenido: DocumentoObtenido;
  fechaObtencion: string;
}

export interface DatosCurricularesDeclarante {
  escolaridad: Escolaridad[];
  aclaracionesObservaciones?: string;
}
