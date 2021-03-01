import { DomicilioExtranjero, DomicilioMexico } from './common.model';

export interface DomicilioDeclarante {
  domicilioMexico?: DomicilioMexico;
  domicilioExtranjero?: DomicilioExtranjero;
  aclaracionesObservaciones: string;
}
