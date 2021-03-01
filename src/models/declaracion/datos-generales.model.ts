import { Catalogo } from './common.model';

interface CorreoElectronico {
  institucional: string;
  personal: string;
}

interface RFC {
  rfc: string;
  homoClave: string;
}

interface Telefono {
  casa: string;
  celularPersonal: string;
}

export interface DatosGenerales {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  curp: string;
  rfc: RFC;
  correoElectronico: CorreoElectronico;
  telefono: Telefono;
  situacionPersonalEstadoCivil: Catalogo;
  regimenMatrimonial?: Catalogo;
  paisNacimiento: string;
  nacionalidad: string;
  aclaracionesObservaciones: string;
}
