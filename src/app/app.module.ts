import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Librería para poder consumir el servicio
//import { HttpModule, } from '@angular/http';
import { HttpClientModule, } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';



import { AppComponent } from './appComponent/app.component';
import { CatalogoUniversalComponent } from './catalogo-universal/catalogo-universal.component';
//import { PersonaComponent } from './persona/persona.component';

import { ContactosComponent } from './contactos/contactos.component';
import { PersonasComponent } from './personas/personas.component';
import { ReservasComponent } from './reservas/reservas.component';
import { SercatalogounivService } from './sercatalogouniv.service';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';


const appRoutes: Routes = 
[
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'universal'
  },
  {
    path: 'universal',
    component:CatalogoUniversalComponent,
  },
  {
    path: 'personas',
    component: PersonasComponent,   
  },
  {
    path: 'vehiculos',
    component: VehiculosComponent,   
  },
  {
    path: 'sucursales',
    component: SucursalesComponent,   
  },
  {
    path: 'contactos',
    component: ContactosComponent,
  },
  {
    path: 'reservas',
    component: ReservasComponent,
  }
];
  
//--------------------------------------------------------------

@NgModule
({
  declarations: 
  [
    AppComponent,
    CatalogoUniversalComponent,
    PersonasComponent,
    VehiculosComponent,
    SucursalesComponent,
    ContactosComponent,
    ReservasComponent,
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes), // se agregan estos 
    HttpClientModule  // <- Agregar la clase    
  ],
  providers: [SercatalogounivService],
  bootstrap: [AppComponent]
})


export class AppModule { }
