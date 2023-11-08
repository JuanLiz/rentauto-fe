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

import { PersonasComponent } from './personas/personas.component';
import { SercatalogounivService } from './sercatalogouniv.service';


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
