import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { Catalogo } from '@models/declaracion';

@Component({
  selector: 'app-comienza-tu-declaracion',
  templateUrl: './comienza-tu-declaracion.component.html',
  styleUrls: ['./comienza-tu-declaracion.component.scss'],
})
export class ComienzaTuDeclaracionComponent {
  userInstitucion: Catalogo = null;

  constructor(private credential: CredentialsService) {
    this.userInstitucion = credential.credentials.user.institucion;
  }
}
