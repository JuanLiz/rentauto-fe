import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const httpOptions =
{
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class PersonasService {

  // URL principal
  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  // Extraer datos de la respuesta
  private extractData(res: Response) {
    //console.log("22");

    let body = JSON.parse('' + res);
    //console.log("23 A " + body);
    return body || {};
  }


  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    //console.log("25 ");
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);
      return of(result as T)

    };
  }


  // Listar todas las personas
  getPersonas(): Observable<any> {
    return this.http.get(this.Url + "/persona", httpOptions);
  }


  // Listar persona por id
  getPersona(Id: any): Observable<any> {
    return this.http.get(this.Url + "/persona/" + Id, httpOptions);
  }


  // Insertar persona
  async insertPersona(Dato: any): Promise<any> {
    return this.http.post(this.Url + "/persona", Dato, httpOptions).toPromise();
  }


  // Actualizar persona
  async updatePersona(Dato: any): Promise<any> {
    return this.http.put(this.Url + "/persona", Dato, httpOptions).toPromise();
  }
}
