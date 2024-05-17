import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  userId: string = null;

  constructor(private http: HttpClient) {}
  // getCatalogo(catalogoName: string) {
  //   const credentials = JSON.parse(localStorage.getItem('credentials'));
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${credentials.token}`,
  //   });
  //   try {
  //     /* this.http.get(`${environment.serverUrl}/catalog/${catalogoName}`, {headers}).subscribe(data => {
  //       return data;
  //     }); */
  //     return new Promise((resolve, reject) => {
  //       this.http.get(`${environment.serverUrl}/catalog/${catalogoName}`, { headers }).subscribe(
  //         (data) => {
  //           resolve(data ? data['resp'] : null);
  //         },
  //         (err) => {
  //           console.log(err);
  //           reject(err);
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  getInstituciones() {
    // const token = this.credentials.credentials.jwtToken;
    const url = `${environment.serverUrl}/instituciones`;

    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    // .get(url, { headers })

    return this.http
      .get(url)
      .toPromise()
      .then((data: any[]) => {
        return data.map((d) => {
          const { clave, ente_publico: valor } = d;

          return { clave, valor };
        });
      });
  }
}
