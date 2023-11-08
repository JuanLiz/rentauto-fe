import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { map, catchError, tap } from 'rxjs/operators';


const httpOptions =
{
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class SercatalogounivService {

  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  
  // Listar todos los catalogos
  getUniversales(): Observable<any> {
    return this.http.get(this.Url + "/universal", httpOptions);

  }

  // Listar catálogo por id
  getUniversal(Id: any): Observable<any> {
    return this.http.get(this.Url + "/universal/I/" + Id, httpOptions);

  }

  // Listar catálogo por tipo
  getUniversalTipo(tipcat: any): Observable<any> {
    return this.http.get(this.Url + "/universal" + tipcat, httpOptions);

  }

  // Insertar catálogo
  async insertUniversal(Dato: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(this.Url + "/universal", Dato, httpOptions).toPromise()
    });
  }

  // Modificar catálogo
  async updateUniversal(Dato: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.put(this.Url + "/universal", Dato, httpOptions).toPromise()
    });
  }
}
