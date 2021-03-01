import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { GraphQLModule } from './graphql.module';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { SharedPresentarDeclaracionModule } from './presentar-declaracion/shared-presentar-declaracion/shared-presentar-declaracion.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SituacionPatrimonialModule } from './presentar-declaracion/situacion-patrimonial/situacion-patrimonial.module';
import { InteresesModule } from './presentar-declaracion/intereses/intereses.module';
import { PreguntasFrecuentesModule } from './preguntas-frecuentes/preguntas-frecuentes.module';
import { PerfilModule } from './perfil/perfil.module';
import { ListaDeclaracionesModule } from './lista-declaraciones/lista-declaraciones.module';
import { ComienzaTuDeclaracionModule } from './presentar-declaracion/comienza-tu-declaracion/comienza-tu-declaracion.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    GraphQLModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AuthModule,
    SharedPresentarDeclaracionModule,
    SituacionPatrimonialModule,
    InteresesModule,
    PreguntasFrecuentesModule,
    PerfilModule,
    ListaDeclaracionesModule,
    ComienzaTuDeclaracionModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
