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

export const lastDatosCurricularesDeclaranteQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastDatosEmpleoCargoComisionQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastExperienciaLaboralQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastDatosParejaQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastDatosDependientesEconomicosQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastBienesInmueblesQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastVehiculosQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastBienesMueblesQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastInversionesCuentasValoresQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastAdeudosPasivosQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastPrestamoComodatoQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastParticipacionQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastParticipacionTomaDecisionesQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastApoyosQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastRepresentacionesQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastClientesPrincipalesQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastBeneficiosPrivadosQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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

export const lastFideicomisosQuery = gql`
  query lastDeclaracion {
    lastDeclaracion {
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
