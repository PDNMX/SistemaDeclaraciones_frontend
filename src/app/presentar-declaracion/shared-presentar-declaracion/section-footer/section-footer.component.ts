import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { firmarDeclaracion } from '@api/declaracion';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@shared/dialog/dialog.component';
import { PreviewDeclarationComponent } from '@shared/preview-declaration/preview-declaration.component';
import { SignDeclarationComponent } from '../sign-declaration/sign-declaration.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcuseService } from '@app/services/acuse.service';

enum tipoDeclaracion {
  inicial = 'inicial',
  modificacion = 'modificación',
  conclusion = 'conclusión',
}

@Component({
  selector: 'section-footer',
  templateUrl: './section-footer.component.html',
  styleUrls: ['./section-footer.component.scss'],
})
export class SectionFooterComponent implements OnInit {
  @Input() declaracionId: string = null;
  tipoDeclaracion: string = null;

  constructor(
    private apollo: Apollo,
    private acuseService: AcuseService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tipoDeclaracion = tipoDeclaracion[this.router.url.split('/')[1]];
  }

  ngOnInit(): void {}

  confirmFinish() {
    const dialogRef = this.dialog.open(PreviewDeclarationComponent, {
      data: {
        id: this.declaracionId,
        signDeclaration: true,
      },
    });

    dialogRef.afterClosed().subscribe(async (finish) => {
      if (finish) {
        this.showSignDeclarationModal();
      }
    });
  }

  async downloadAcuse() {
    try {
      const info: any = await this.acuseService.downloadAcuse(this.declaracionId);
      const blob = new Blob([info], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  presentSuccessAlert() {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Información actualizada',
        message: 'Se han guardado tus cambios',
        trueText: 'Aceptar',
      },
    });
  }

  showSignDeclarationModal() {
    const dialogRef = this.dialog.open(SignDeclarationComponent, {
      data: {
        tipoDeclaracion: this.tipoDeclaracion,
      },
    });

    dialogRef.afterClosed().subscribe(async (password) => {
      if (password) {
        try {
          await this.signDeclaration(password);
          await this.downloadAcuse();
          this.presentSuccessAlert();
          this.router.navigate([`/declaraciones`], {
            replaceUrl: true,
          });
        } catch (error) {
          console.log(error);
          this.openSnackBar('ERROR: No pudo firmar la declaración', 'Aceptar');
        }
      }
    });
  }

  async signDeclaration(password: string) {
    try {
      await this.apollo
        .mutate({
          mutation: firmarDeclaracion,
          variables: {
            id: this.declaracionId,
            password,
          },
        })
        .toPromise();
    } catch (error) {
      throw error;
    }
  }
}
