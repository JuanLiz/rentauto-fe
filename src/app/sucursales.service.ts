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


export class SucursalesService {

  // URL principal
  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  // Listar todas las sucursales
  getSucursales(): Observable<any> {
    return this.http.get(this.Url + "/sucursal", httpOptions);
  }


  // Listar sucursal por id
  getSucursal(Id: any): Observable<any> {
    return this.http.get(this.Url + "/sucursal/" + Id, httpOptions);
  }


  // Insertar sucursal
  async insertSucursal(Dato: any): Promise<any> {
    return this.http.post(this.Url + "/sucursal", Dato, httpOptions).toPromise();
  }


  // Actualizar sucursal
  async updateSucursal(Dato: any): Promise<any> {
    return this.http.put(this.Url + "/sucursal", Dato, httpOptions).toPromise();
  }

}
