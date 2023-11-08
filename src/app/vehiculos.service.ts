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
export class VehiculosService {

  // URL principal
  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  // Listar todos los vehiculos
  getVehiculos(): Observable<any> {
    return this.http.get(this.Url + "/vehiculo", httpOptions);
  }


  // Listar vehiculo por id
  getVehiculo(Id: any): Observable<any> {
    return this.http.get(this.Url + "/vehiculo/" + Id, httpOptions);
  }


  // Insertar vehiculo
  async insertVehiculo(Dato: any): Promise<any> {
    return this.http.post(this.Url + "/vehiculo", Dato, httpOptions).toPromise();
  }


  // Actualizar vehiculo
  async updateVehiculo(Dato: any): Promise<any> {
    return this.http.put(this.Url + "/vehiculo", Dato, httpOptions).toPromise();
  }

}
