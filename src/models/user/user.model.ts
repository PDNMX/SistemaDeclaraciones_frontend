import { Role } from './types';

export interface User {
  _id: string;
  username: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  curp: string;
  rfc: string;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}
