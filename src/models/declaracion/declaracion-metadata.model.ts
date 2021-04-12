import { TipoDeclaracion } from './types';
import { User } from '@models/user';

export interface DeclaracionMetadata {
  firmada: boolean;
  declaracionCompleta: boolean;
  tipoDeclaracion: TipoDeclaracion;
  createdAt: string;
  updatedAt: string;
  owner: User;
}

export interface DeclaracionMetadataPage {
  docs: DeclaracionMetadata[];
  pageNumber: number;
}
