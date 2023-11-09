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

export class ReservasService {

  // URL principal
  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  // Listar todas las reservas
  getReservas(): Observable<any> {
    return this.http.get(this.Url + "/reserva", httpOptions);
  }


  // Listar reserva por id
  getReserva(Id: any): Observable<any> {
    return this.http.get(this.Url + "/reserva/" + Id, httpOptions);
  }


  // Insertar reserva
  async insertReserva(Dato: any): Promise<any> {
    return this.http.post(this.Url + "/reserva", Dato, httpOptions).toPromise();
  }


  // Actualizar reserva
  async updateReserva(Dato: any): Promise<any> {
    return this.http.put(this.Url + "/reserva", Dato, httpOptions).toPromise();
  }


}
