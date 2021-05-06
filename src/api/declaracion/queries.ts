import gql from 'graphql-tag';

export const declaracionesMetadata = gql`
  query declaracionesMetadata(
    $userID: LimitedString
    $filter: DeclaracionesFilterInput
    $pagination: PaginationOptionsInput
  ) {
    declaracionesMetadata(userID: $userID, filter: $filter, pagination: $pagination) {
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      hasMore
      docs {
        _id
        firmada
        declaracionCompleta
        tipoDeclaracion
        createdAt
        updatedAt
        owner {
          _id
          username
          nombre
          primerApellido
          segundoApellido
          curp
          rfc
          roles
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const stats = gql`
  query stats {
    stats {
      total
      counters {
        tipoDeclaracion
        count
      }
    }
  }
`;
/*** PRESENTAR DECLARACION ***/

export const actividadAnualAnteriorQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      actividadAnualAnterior {
        servidorPublicoAnioAnterior
        fechaIngreso
        fechaConclusion
        remuneracionNetaCargoPublico {
          valor
          moneda
        }
        otrosIngresosTotal {
          valor
          moneda
        }
        actividadIndustrialComercialEmpresarial {
          remuneracionTotal {
            valor
            moneda
          }
          actividades {
            remuneracion {
              valor
              moneda
            }
            nombreRazonSocial
            tipoNegocio
          }
        }
        actividadFinanciera {
          remuneracionTotal {
            valor
            moneda
          }
          actividades {
            remuneracion {
              valor
              moneda
            }
            tipoInstrumento {
              clave
              valor
            }
          }
        }
        serviciosProfesionales {
          remuneracionTotal {
            valor
            moneda
          }
          servicios {
            remuneracion {
              valor
              moneda
            }
            tipoServicio
          }
        }
        enajenacionBienes {
          remuneracionTotal {
            valor
            moneda
          }
          bienes {
            remuneracion {
              valor
              moneda
            }
            tipoBienEnajenado
          }
        }
        otrosIngresos {
          remuneracionTotal {
            valor
            moneda
          }
          ingresos {
            remuneracion {
              valor
              moneda
            }
            tipoIngreso
          }
        }
        ingresoNetoAnualDeclarante {
          valor
          moneda
        }
        ingresoNetoAnualParejaDependiente {
          valor
          moneda
        }
        totalIngresosNetosAnuales {
          valor
          moneda
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const adeudosPasivosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      adeudosPasivos {
        ninguno
        adeudo {
          titular {
            clave
            valor
          }
          tipoAdeudo {
            clave
            valor
          }
          numeroCuentaContrato
          fechaAdquisicion
          montoOriginal {
            valor
            moneda
          }
          saldoInsolutoSituacionActual {
            valor
            moneda
          }
          tercero {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          otorganteCredito {
            tipoPersona
            nombreInstitucion
            rfc
          }
          localizacionAdeudo {
            pais
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const bienesInmueblesQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      bienesInmuebles {
        ninguno
        bienInmueble {
          tipoInmueble {
            clave
            valor
          }
          titular {
            clave
            valor
          }
          porcentajePropiedad
          superficieTerreno {
            valor
            unidad
          }
          superficieConstruccion {
            valor
            unidad
          }
          tercero {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          transmisor {
            tipoPersona
            nombreRazonSocial
            rfc
            relacion {
              clave
              valor
            }
          }
          formaAdquisicion {
            clave
            valor
          }
          formaPago
          valorAdquisicion {
            valor
            moneda
          }
          fechaAdquisicion
          datoIdentificacion
          valorConformeA
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
          motivoBaja {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const bienesMueblesQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      bienesMuebles {
        ninguno
        bienMueble {
          titular {
            clave
            valor
          }
          tipoBien {
            clave
            valor
          }
          transmisor {
            tipoPersona
            nombreRazonSocial
            rfc
            relacion {
              clave
              valor
            }
          }
          tercero {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          descripcionGeneralBien
          formaAdquisicion {
            clave
            valor
          }
          formaPago
          valorAdquisicion {
            valor
            moneda
          }
          fechaAdquisicion
          motivoBaja {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const datosCurricularesDeclaranteQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      datosCurricularesDeclarante {
        escolaridad {
          nivel {
            clave
            valor
          }
          institucionEducativa {
            nombre
            ubicacion
          }
          carreraAreaConocimiento
          estatus
          documentoObtenido
          fechaObtencion
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const datosDependientesEconomicosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      datosDependientesEconomicos {
        ninguno
        dependienteEconomico {
          nombre
          primerApellido
          segundoApellido
          fechaNacimiento
          rfc
          parentescoRelacion {
            clave
            valor
          }
          extranjero
          curp
          habitaDomicilioDeclarante
          lugarDondeReside
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
          actividadLaboral {
            clave
            valor
          }
          actividadLaboralSectorPublico {
            nivelOrdenGobierno
            ambitoPublico
            nombreEntePublico
            areaAdscripcion
            empleoCargoComision
            funcionPrincipal
            salarioMensualNeto {
              moneda
              valor
            }
            fechaIngreso
          }
          actividadLaboralSectorPrivadoOtro {
            nombreEmpresaSociedadAsociacion
            empleoCargoComision
            rfc
            fechaIngreso
            sector {
              clave
              valor
            }
            salarioMensualNeto {
              moneda
              valor
            }
            proveedorContratistaGobierno
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const datosEmpleoCargoComisionQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      datosEmpleoCargoComision {
        nivelOrdenGobierno
        ambitoPublico
        nombreEntePublico
        areaAdscripcion
        empleoCargoComision
        contratadoPorHonorarios
        nivelEmpleoCargoComision
        funcionPrincipal
        fechaTomaPosesion
        telefonoOficina {
          telefono
          extension
        }
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
        cuentaConOtroCargoPublico
      }
    }
  }
`;

export const datosGeneralesQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
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

export const datosParejaQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      datosPareja {
        ninguno
        nombre
        primerApellido
        segundoApellido
        fechaNacimiento
        rfc
        relacionConDeclarante
        ciudadanoExtranjero
        curp
        esDependienteEconomico
        habitaDomicilioDeclarante
        lugarDondeReside
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
        actividadLaboral {
          clave
          valor
        }
        actividadLaboralSectorPublico {
          nivelOrdenGobierno
          ambitoPublico
          nombreEntePublico
          areaAdscripcion
          empleoCargoComision
          funcionPrincipal
          salarioMensualNeto {
            moneda
            valor
          }
          fechaIngreso
        }
        actividadLaboralSectorPrivadoOtro {
          nombreEmpresaSociedadAsociacion
          empleoCargoComision
          rfc
          fechaIngreso
          sector {
            clave
            valor
          }
          salarioMensualNeto {
            moneda
            valor
          }
          proveedorContratistaGobierno
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const domicilioDeclaranteQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
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

export const experienciaLaboralQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      experienciaLaboral {
        ninguno
        experiencia {
          ambitoSector {
            clave
            valor
          }
          nivelOrdenGobierno
          ambitoPublico
          nombreEntePublico
          areaAdscripcion
          empleoCargoComision
          funcionPrincipal
          fechaIngreso
          fechaEgreso
          ubicacion

          nombreEmpresaSociedadAsociacion
          rfc
          area
          puesto
          sector {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const ingresosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      ingresos {
        remuneracionMensualCargoPublico {
          valor
          moneda
        }
        otrosIngresosMensualesTotal {
          valor
          moneda
        }
        actividadIndustrialComercialEmpresarial {
          remuneracionTotal {
            valor
            moneda
          }
          actividades {
            remuneracion {
              valor
              moneda
            }
            nombreRazonSocial
            tipoNegocio
          }
        }
        actividadFinanciera {
          remuneracionTotal {
            valor
            moneda
          }
          actividades {
            remuneracion {
              valor
              moneda
            }
            tipoInstrumento {
              clave
              valor
            }
          }
        }
        serviciosProfesionales {
          remuneracionTotal {
            valor
            moneda
          }
          servicios {
            remuneracion {
              valor
              moneda
            }
            tipoServicio
          }
        }
        otrosIngresos {
          remuneracionTotal {
            valor
            moneda
          }
          ingresos {
            remuneracion {
              valor
              moneda
            }
            tipoIngreso
          }
        }
        ingresoMensualNetoDeclarante {
          valor
          moneda
        }
        ingresoMensualNetoParejaDependiente {
          valor
          moneda
        }
        totalIngresosMensualesNetos {
          valor
          moneda
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const inversionesCuentasValoresQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      inversionesCuentasValores {
        ninguno
        inversion {
          tipoInversion {
            clave
            valor
          }
          subTipoInversion {
            clave
            valor
          }
          titular {
            clave
            valor
          }
          tercero {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          numeroCuentaContrato
          localizacionInversion {
            pais
            institucionRazonSocial
            rfc
          }
          saldoSituacionActual {
            valor
            moneda
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const prestamoComodatoQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      prestamoComodato {
        ninguno
        prestamo {
          tipoBien {
            inmueble {
              tipoInmueble {
                clave
                valor
              }
              domicilioMexico {
                calle
                numeroExterior
                numeroInterior: coloniaLocalidad
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
            }
            vehiculo {
              tipo {
                clave
                valor
              }
              marca
              modelo
              anio
              numeroSerieRegistro
              lugarRegistro {
                pais
                entidadFederativa {
                  clave
                  valor
                }
              }
            }
          }
          duenoTitular {
            tipoDuenoTitular
            nombreTitular
            rfc
            relacionConTitular
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const vehiculosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      vehiculos {
        ninguno
        vehiculo {
          tipoVehiculo {
            clave
            valor
          }
          titular {
            clave
            valor
          }
          transmisor {
            tipoPersona
            nombreRazonSocial
            rfc
            relacion {
              clave
              valor
            }
          }
          marca
          modelo
          anio
          numeroSerieRegistro
          tercero {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          lugarRegistro {
            pais
            entidadFederativa {
              clave
              valor
            }
          }
          formaAdquisicion {
            clave
            valor
          }
          formaPago
          valorAdquisicion {
            valor
            moneda
          }
          fechaAdquisicion
          motivoBaja {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

// INTERESES

export const apoyosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      apoyos {
        ninguno
        apoyo {
          tipoPersona
          beneficiarioPrograma {
            clave
            valor
          }
          nombrePrograma
          institucionOtorgante
          nivelOrdenGobierno
          tipoApoyo {
            clave
            valor
          }
          formaRecepcion
          montoApoyoMensual {
            valor
            moneda
          }
          especifiqueApoyo
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const beneficiosPrivadosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      beneficiosPrivados {
        ninguno
        beneficio {
          tipoOperacion
          tipoBeneficio {
            clave
            valor
          }
          beneficiario {
            clave
            valor
          }
          otorgante {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          formaRecepcion
          especifiqueBeneficio

          montoMensualAproximado {
            valor
            moneda
          }
          sector {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const clientesPrincipalesQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      clientesPrincipales {
        ninguno
        cliente {
          tipoOperacion
          realizaActividadLucrativa
          tipoRelacion
          empresa {
            nombreEmpresaServicio
            rfc
          }
          clientePrincipal {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          sector {
            clave
            valor
          }
          montoAproximadoGanancia {
            valor
            moneda
          }
          ubicacion {
            pais
            entidadFederativa {
              clave
              valor
            }
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const fideicomisosQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      fideicomisos {
        ninguno
        fideicomiso {
          tipoOperacion
          tipoRelacion
          tipoFideicomiso
          tipoParticipacion
          rfcFideicomiso
          fideicomitente {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          fiduciario {
            nombreRazonSocial
            rfc
          }
          fideicomisario {
            tipoPersona
            nombreRazonSocial
            rfc
          }
          sector {
            clave
            valor
          }
          extranjero
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const participacionQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      participacion {
        ninguno
        participacion {
          tipoOperacion
          tipoRelacion
          nombreEmpresaSociedadAsociacion
          rfc
          porcentajeParticipacion
          tipoParticipacion {
            clave
            valor
          }
          recibeRemuneracion
          montoMensual {
            valor
            moneda
          }
          ubicacion {
            pais
            entidadFederativa {
              clave
              valor
            }
          }
          sector {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const representacionesQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      representaciones {
        ninguno
        representacion {
          tipoOperacion
          tipoRelacion
          tipoRepresentacion
          fechaInicioRepresentacion
          tipoPersona
          nombreRazonSocial
          rfc
          recibeRemuneracion
          montoMensual {
            valor
            moneda
          }
          ubicacion {
            pais
            entidadFederativa {
              clave
              valor
            }
          }
          sector {
            clave
            valor
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;

export const participacionTomaDecisionesQuery = gql`
  query declaracion($tipoDeclaracion: TipoDeclaracion!, $declaracionCompleta: Boolean) {
    declaracion(tipoDeclaracion: $tipoDeclaracion, declaracionCompleta: $declaracionCompleta) {
      _id
      participacionTomaDecisiones {
        ninguno
        participacion {
          tipoOperacion
          tipoRelacion
          tipoInstitucion {
            clave
            valor
          }
          nombreInstitucion
          rfc
          puestoRol
          fechaInicioParticipacion
          recibeRemuneracion
          montoMensual {
            valor
            moneda
          }
          ubicacion {
            pais
            entidadFederativa {
              clave
              valor
            }
          }
        }
        aclaracionesObservaciones
      }
    }
  }
`;
