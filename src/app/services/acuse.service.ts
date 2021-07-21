import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CredentialsService } from '@app/auth/credentials.service';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AcuseService {
  userId: string = null;

  constructor(private credentialsService: CredentialsService, private http: HttpClient) {}

  getAcuse(id: string) {
    const token = this.credentialsService.token;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      return new Promise((resolve, reject) => {
        this.http.get(`${environment.serverUrl}/declaracion-preview/${id}`, { headers }).subscribe(
          (data) => {
            resolve(data ? data['resp'] : null);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  downloadAcuse(id: string, publicVersion: boolean = false) {
    const token = this.credentialsService.token;

    const headers = new HttpHeaders({
      'Content-Type': 'application/pdf',
      Authorization: `Bearer ${token}`,
    });

    return new Promise((resolve, reject) => {
      const url = publicVersion
        ? `${environment.serverUrl}/declaracion-preview/${id}?publico=true`
        : `${environment.serverUrl}/declaracion-preview/${id}`;
      this.http.get(url, { headers, responseType: 'blob' }).subscribe(
        (data) => {
          resolve(data ? data : null);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
}
