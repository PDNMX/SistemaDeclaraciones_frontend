import { ActividadAnualAnterior } from './actividad-anual-anterior.model';
import { AdeudosPasivos } from './adeudos-pasivos.model';
import { Apoyos } from './apoyos.model';
import { BeneficiosPrivados } from './beneficios-privados.model';
import { BienesInmuebles } from './bienes-inmuebles.model';
import { BienesMuebles } from './bienes-muebles.model';
import { ClientesPrincipales } from './clientes-principales.model';
import { DatosCurricularesDeclarante } from './datos-curriculares-declarante.model';
import { DatosDependientesEconomicos } from './datos-dependientes-economicos.model';
import { DatosEmpleoCargoComision } from './datos-empleo-cargo-comision.model';
import { DatosGenerales } from './datos-generales.model';
import { DatosPareja } from './datos-pareja.model';
import { DomicilioDeclarante } from './domicilio-declarante.model';
import { ExperienciaLaboral } from './experiencia-laboral.model';
import { Fideicomisos } from './fideicomisos.model';
import { Ingresos } from './ingresos.model';
import { InversionesCuentasValores } from './inversiones-cuentas-valores.model';
import { Participaciones } from './participaciones.model';
import { ParticipacionTomaDecisiones } from './participacion-toma-decisiones.model';
import { PrestamoComodato } from './prestamo-comodato.model';
import { Representaciones } from './representaciones.model';
import { TipoDeclaracion } from './types';
import { Vehiculos } from './vehiculos.model';

export interface Declaracion {
  _id?: string;
  firmada?: boolean;
  declaracionCompleta?: boolean;
  tipoDeclaracion?: TipoDeclaracion;
  datosGenerales?: DatosGenerales;
  domicilioDeclarante?: DomicilioDeclarante;
  datosCurricularesDeclarante?: DatosCurricularesDeclarante;
  datosEmpleoCargoComision?: DatosEmpleoCargoComision;
  experienciaLaboral?: ExperienciaLaboral;
  datosPareja?: DatosPareja;
  datosDependientesEconomicos?: DatosDependientesEconomicos;
  ingresos?: Ingresos;
  actividadAnualAnterior?: ActividadAnualAnterior;
  bienesInmuebles?: BienesInmuebles;
  vehiculos?: Vehiculos;
  bienesMuebles?: BienesMuebles;
  inversionesCuentasValores?: InversionesCuentasValores;
  adeudosPasivos?: AdeudosPasivos;
  prestamoComodato?: PrestamoComodato;
  participacion?: Participaciones;
  participacionTomaDecisiones?: ParticipacionTomaDecisiones;
  apoyos?: Apoyos;
  representaciones?: Representaciones;
  clientesPrincipales?: ClientesPrincipales;
  beneficiosPrivados?: BeneficiosPrivados;
  fideicomisos?: Fideicomisos;
}

export interface DeclaracionOutput {
  declaracion: Declaracion;
}
