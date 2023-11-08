import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions =
{
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})


export class ContactosService {

  // URL principal
  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  // Listar todos los contactos
  getContactos(): Observable<any> {
    return this.http.get(this.Url + "/contacto", httpOptions);
  }


  // Listar contacto por id
  getContacto(Id: any): Observable<any> {
    return this.http.get(this.Url + "/contacto/" + Id, httpOptions);
  }


  // Insertar contacto
  async insertContacto(Dato: any): Promise<any> {
    return this.http.post(this.Url + "/contacto", Dato, httpOptions).toPromise();
  }


  // Actualizar contacto
  async updateContacto(Dato: any): Promise<any> {
    return this.http.put(this.Url + "/contacto", Dato, httpOptions).toPromise();
  }

}
