import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ContactosService } from '../contactos.service';
import { PersonasService } from '../personas.service';
import { SercatalogounivService } from '../sercatalogouniv.service';



@Component({
  selector: 'app-catalogo-contacto',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})

export class ContactosComponent implements OnInit {


  //------------------------------------------------------

  constructor
    (
      private formBuilder: FormBuilder,
      private servi: ContactosService,
      private universalServi: SercatalogounivService,
      private personaServi: PersonasService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todas las contactos
  contactos: any = [];
  contactosShow: any = [];

  // Lista de todas las personas
  personas: any = [];

  // Tipos de contactos traídos del Universal
  contactoTipos: any[] = [];

  contactoSearched: any = [];


  // Contacto a editar
  contactoFound: any = [];
  //Saber si ya se cargaron los datos del backend
  asyncReady = false;

  //***************************************************************************
  // Definición de formgroups para cada formulario

  // Grupo para leer contacto
  readContactoGroup = new FormGroup
    (
      {
        readContactoId: new FormControl(),
        readContactoPersona: new FormControl(),
        readContactoContacto: new FormControl(),
        readContactoTipo: new FormControl(),
      }
    );


  //Grupo para crear contactos
  insertContactoGroup = new FormGroup
    (
      {
        //insertContactoId: new FormControl(),
        insertContactoPersona: new FormControl(),
        insertContactoContacto: new FormControl(),
        insertContactoTipo: new FormControl(),
      }
    );

  //Grupo para editar contactos
  updateContactoGroup = new FormGroup
    (
      {
        updateContactoId: new FormControl(),
        updateContactoPersona: new FormControl(),
        updateContactoContacto: new FormControl(),
        updateContactoTipo: new FormControl(),
      }
    );

  //***************************************************************************
  // Definición de métodos

  // Cargar datos del backend
  public loadData() {
    this.asyncReady = false;
    forkJoin([
      // Traer todas las contactos
      this.servi.getContactos(),
      // Traer todas las personas
      this.personaServi.getPersonas(),
      // Tipos de contacto
      this.universalServi.getUniversalTipo('/5'),

    ]).subscribe(([contactos, personasContactos, tiposContatos]) => {
      this.contactos = contactos as any[];
      this.contactosShow = contactos as any[];
      this.personas = personasContactos as any[];
      this.contactoTipos = tiposContatos as any[];

    },
      error => { console.log(error) },
      () => {
        this.asyncReady = true
        this.contactosShow.forEach((element: any) => {
          element.persona_contacto = this.personas.find((x: any) => x.doc_persona == element.persona_contacto)
          element.persona_contacto = element.persona_contacto?.nombre1_persona
            + " " + (element.persona_contacto?.nombre2_persona ? element.persona_contacto?.nombre2_persona : "")
              + " " + element.persona_contacto?.apellido1_persona
              + " " + (element.persona_contacto?.apellido2_persona ? element.persona_contacto?.apellido2_persona : "")
        });
      })
  }


  // Mostrar contacto seleccionada
  getById() {
    this.servi.getContacto(this.readContactoGroup.getRawValue()['readContactoId']).subscribe((data: []) => {
      this.contactoSearched = data;

      let personaTemp = this.personas.find((item: any) => item.doc_persona == this.contactoSearched[0].persona_contacto)
      personaTemp = personaTemp?.nombre1_persona
        + " " + (personaTemp?.nombre2_persona ? personaTemp?.nombre2_persona : "")
          + " " + personaTemp?.apellido1_persona
          + " " + (personaTemp?.apellido2_persona ? personaTemp?.apellido2_persona : "")

      // Preparar datos para cargar en el formulario
      let forupd = {
        readContactoId: this.contactoSearched[0].id_contacto,
        readContactoPersona: personaTemp,
        readContactoContacto: this.contactoSearched[0].contacto_contacto,
        readContactoTipo: this.contactoSearched[0].tipo_contacto,
      }
      this.readContactoGroup.patchValue(forupd);
      console.log(this.readContactoGroup)
    });
  }


  // Buscar contacto por id para actualizar
  public getForUpdate() {
    let idSearch = this.updateContactoGroup.getRawValue()['updateContactoId'];

    // Llamar al servicio
    this.contactoFound = this.servi.getContacto(idSearch).subscribe((data: []) => {
      this.contactoFound = data;

      // Preparar datos para cargar en el formulario
      let forupd = {
        updateContactoId: this.contactoFound[0].id_contacto,
        updateContactoPersona: this.personas.find((item: any) => item.doc_persona == this.contactoFound[0].persona_contacto).id_persona,
        updateContactoContacto: this.contactoFound[0].contacto_contacto,
        updateContactoTipo: this.contactoTipos.find((item: any) => item.denominacion_catalogo == this.contactoFound[0].tipo_contacto).id_catalogo,

      }
      this.updateContactoGroup.patchValue(forupd);
      console.log(this.updateContactoGroup)
    });



  }

  // Insertar un nuevo catálogo
  public insertContacto() {

    //JSON armado
    var body = {
      "persona_contacto": this.insertContactoGroup.getRawValue()['insertContactoPersona'],
      "contacto_contacto": this.insertContactoGroup.getRawValue()['insertContactoContacto'],
      "tipo_contacto": this.insertContactoGroup.getRawValue()['insertContactoTipo'],
    };

    //se consume el servicio
    this.servi.insertContacto(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertContactoGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // Actualizar un catálogo
  public updateContacto() {

    //JSON armado
    var cadena = {
      "id_contacto": this.updateContactoGroup.getRawValue()['updateContactoId'],
      "persona_contacto": this.updateContactoGroup.getRawValue()['updateContactoPersona'],
      "contacto_contacto": this.updateContactoGroup.getRawValue()['updateContactoContacto'],
      "tipo_contacto": this.updateContactoGroup.getRawValue()['updateContactoTipo'],
    };

    //se consume el servicio
    this.servi.updateContacto(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.updateContactoGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // OnInit. Acciones apenas inicia la página
  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.readContactoGroup = this.formBuilder.group({
      readContactoId: [],
      readContactoPersona: [],
      readContactoContacto: [],
      readContactoTipo: [],

    });

    this.insertContactoGroup = this.formBuilder.group({
      //insertContactoId: [],
      insertContactoPersona: [],
      insertContactoContacto: [],
      insertContactoTipo: [],
    });

    this.updateContactoGroup = this.formBuilder.group({
      updateContactoId: [],
      updateContactoPersona: [],
      updateContactoContacto: [],
      updateContactoTipo: [],
    });

  }
}
