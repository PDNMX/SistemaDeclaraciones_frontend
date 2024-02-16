import gql from 'graphql-tag';

export const lastDeclaracionDatosGenerales = gql`
  query lastDeclaracion {
    lastDeclaracion {
      _id
      anioEjercicio
      datosGenerales {
        nombre
        primerApellido
        segundoApellido
        curp
        rfc {
          rfc
          homoClave
        }
        correoElectronico {
          institucional
          personal
        }
        telefono {
          casa
          celularPersonal
        }
        situacionPersonalEstadoCivil {
          clave
          valor
        }
        regimenMatrimonial {
          clave
          valor
        }
        paisNacimiento
        nacionalidad
        aclaracionesObservaciones
      }
    }
  }
`;

export const lastDeclaracionDomicilioDeclarante = gql`
  query lastDeclaracion {
    lastDeclaracion {
      _id
      domicilioDeclarante {
        domicilioMexico {
          calle
          numeroExterior
          numeroInterior
          coloniaLocalidad
          municipioAlcaldia {
            clave
            valor
          }
          entidadFederativa {
            clave
            valor
          }
          codigoPostal
        }
        domicilioExtranjero {
          calle
          numeroExterior
          numeroInterior
          ciudadLocalidad
          estadoProvincia
          pais
          codigoPostal
        }
        aclaracionesObservaciones
      }
    }
  }
`;
