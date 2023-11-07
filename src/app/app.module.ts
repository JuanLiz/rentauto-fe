import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Librería para poder consumir el servicio
//import { HttpModule, } from '@angular/http';
import { HttpClientModule, } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';



import { AppComponent } from './appComponent/app.component';  
import { CatalogoUniversalComponent } from './catalogo-universal/catalogo-universal.component';
//import { PersonaComponent } from './persona/persona.component';

import {SercatalogounivService } from './sercatalogouniv.service';


const appRoutes: Routes = 
[
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'Inicio'
  },
  {
    path: 'Inicio',
    component:CatalogoUniversalComponent,
  },
  // {
  //   path: 'Personas',
  //   component: PersonaComponent,   
  // }
];
  
//--------------------------------------------------------------

@NgModule
({
  declarations: 
  [
    AppComponent,
    CatalogoUniversalComponent,
    //PersonaComponent
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
