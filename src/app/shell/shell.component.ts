import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { MatStep } from '@angular/material/stepper';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  situacionPatrimonialOptions = [
    { text: 'Datos generales', url: '/situacion-patrimonial/datos-generales', simplificada: true },
    { text: 'Domicilio del declarante', url: '/situacion-patrimonial/domicilio-declarante', simplificada: true },
    { text: 'Datos curriculares del declarante', url: '/situacion-patrimonial/datos-curriculares', simplificada: true },
    {
      text: 'Datos del empleo, cargo o comisión',
      url: '/situacion-patrimonial/datos-empleo',
      simplificada: true,
    },
    {
      text: 'Experiencia laboral (últimos cinco empleos)',
      url: '/situacion-patrimonial/experiencia-laboral',
      simplificada: true,
    },
    { text: 'Datos de la pareja', url: '/situacion-patrimonial/datos-pareja' },
    { text: 'Datos del dependiente económico', url: '/situacion-patrimonial/datos-dependiente' },
    {
      text: 'Ingresos netos del declarante, pareja y/o dependientes económicos',
      url: '/situacion-patrimonial/ingresos-netos',
      simplificada: true,
    },
    {
      text: '¿Te desempeñaste como servidor público en el año inmediato anterior?',
      url: '/situacion-patrimonial/servidor-publico',
      simplificada: true,
    },
    { text: 'Bienes inmuebles', url: '/situacion-patrimonial/bienes-inmuebles' },
    { text: 'Vehículos', url: '/situacion-patrimonial/vehiculos' },
    { text: 'Bienes muebles', url: '/situacion-patrimonial/bienes-muebles' },
    {
      text: 'Inversiones, cuentas bancarias u otro tipo de valores / activos',
      url: '/situacion-patrimonial/inversiones',
    },
    { text: 'Adeudos / pasivos', url: '/situacion-patrimonial/adeudos' },
    { text: 'Préstamo o comodato por terceros', url: '/situacion-patrimonial/prestamos-terceros' },
  ];

  interesesOptions = [
    {
      text: 'Participación en empresas, sociedades o asociaciones (hasta los dos últimos años)',
      url: '/intereses/participacion-empresa',
    },
    {
      text: '¿Participa en la toma de decisiones de alguna de estas instituciones? (hasta los dos últimos años)',
      url: '/intereses/toma-decisiones',
    },
    { text: 'Apoyos o beneficios públicos (hasta los dos últimos años)', url: '/intereses/apoyos-publicos' },
    { text: 'Representación (hasta los dos últimos años)', url: '/intereses/representacion' },
    { text: 'Clientes principales (hasta los dos últimos años)', url: '/intereses/clientes-principales' },
    { text: 'Beneficios privados (hasta los dos últimos años)', url: '/intereses/beneficios-privados' },
    { text: 'Fideicomisos (hasta los dos últimos años)', url: '/intereses/fideicomisos' },
  ];

  declaracionSimplificada = false;
  tipoDeclaracion: string = null;
  url: string = null;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver
  ) {}

  goToInteresesSection(optionIndex: number) {
    this.router.navigate([`/${this.tipoDeclaracion}${this.interesesOptions[optionIndex].url}`], { replaceUrl: true });
  }

  goToSituacionPatrimonialSection(selectedStep: MatStep) {
    const selected = this.situacionPatrimonialOptions.find((opt) => opt.text === selectedStep.label);
    const route =
      this.declaracionSimplificada && selected.simplificada
        ? `/${this.tipoDeclaracion}/simplificada${selected.url}`
        : `/${this.tipoDeclaracion}${selected.url}`;

    this.router.navigate([route], {
      replaceUrl: true,
    });
  }

  ngOnInit() {
    this.url = this.router.url;

    const chunks = this.router.url.split('/');
    this.tipoDeclaracion = chunks[1] || null;
    this.declaracionSimplificada = chunks[2] === 'simplificada';

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = this.router.url;
      }
    });
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.user.username : null;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
