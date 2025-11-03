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
  // Se actualiza la interfaz para que coincida con la respuesta de paginación del backend (mongoose-paginate-v2).
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  hasMore: boolean;
}