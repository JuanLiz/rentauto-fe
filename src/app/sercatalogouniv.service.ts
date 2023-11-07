import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
//import { map, catchError, tap } from 'rxjs/operators';


const httpOptions =
{
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class SercatalogounivService 
{

  private Url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private extractData(res: Response) 
  {
    //console.log("22");
 
     let body = JSON.parse('' + res);
     //console.log("23 A " + body);
     return body || {};
   }
 
 
 
   private handleError<T>(operation = 'operation', result?: T) 
   {
     //console.log("25 ");
     return (error: any): Observable<T> => 
     {
 
       console.log(`${operation} failed: ${error.message}`);
       return of(result as T)
 
     };
   }
 
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // SERVICIO  CATALOGO UNIVERSAL
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 


  getCatalogoTotal(): Observable<any> 
  {
    return this.http.get(this.Url + "/catalogoU", httpOptions);
    
  }

   //-------------------------------------------------------------

   getlListCatologoEsp(tipcat: any): Observable<any> 
   {
      return this.http.get(this.Url + "/catalogoU"+ tipcat, httpOptions);

   }

   //-------------------------------------------------------------

   getlCatEspSelec(IdCat: any): Observable<any> 
   {
    console.log(" aca 23  " + IdCat );
      return this.http.get(this.Url + "/catalogoU"+IdCat, httpOptions);

   }
   //-------------------------------------------------------------

   getlCatEdit(Id: any): Observable<any> 
   {
    console.log(" aca 23  " + Id );
      return this.http.get(this.Url + "/catalogoU/A/"+ Id , httpOptions);

   }
  //-------------------------------------------------------------
    // Método para insertar un nuevo Catalogo

  async CrearCatalogoU(Dato:any): Promise<any> 
  {

    return new Promise((resolve, reject) => {
    this.http.post(this.Url +  "/catalogoU",Dato, httpOptions).toPromise()
    });
  }

    //-------------------------------------------------------------
    // Método para modificar un Catalogo

    async ActualizarCatalogoU(Dato:any): Promise<any> 
    {
  
      return new Promise((resolve, reject) => {
      this.http.put(this.Url +  "/catalogoU",Dato, httpOptions).toPromise()
      });
    }
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // SERVICIO CRUD DE LAS PERSONAS
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
  
  // Método para mostrar el listado de personas

  getPersonas(): Observable<any> 
  {
    return this.http.get(this.Url + "/persona", httpOptions);

  }

  //-------------------------------------------------------------
  // Método para mostrar un solo vehiculo busqueda por ID

  getPersona(cc:any): Observable<any> 
  {
    return this.http.get(this.Url + "/persona" + cc, httpOptions);
 
  }

  //-------------------------------------------------------------
  // Método para mostrar un solo vehiculo busqueda por ID

  getPersonaEd(cc:any): Observable<any> 
  {
    return this.http.get(this.Url + "/persona/c" + cc, httpOptions);
 
  }

    //-------------------------------------------------------------
    // Método para insertar una nueva persona

  async insertarPersona(Dato:any): Promise<any> 
  {

    return new Promise((resolve, reject) => {
    this.http.post(this.Url +  "/persona",Dato, httpOptions).toPromise()
    });
  }

     //-------------------------------------------------------------
  // Método para actualizar untipo de contacto
  
 async updatePersona(cadena:any): Promise<any> 
 {
    if( cadena != null || cadena.length == 0 )
    {

      return new Promise((resolve, reject) => 
      {
        this.http.put(this.Url + "/persona", cadena, httpOptions).toPromise()
      });
    }

  }
}
