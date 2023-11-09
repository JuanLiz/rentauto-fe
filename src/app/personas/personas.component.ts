import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { PersonasService } from '../personas.service';
import { SercatalogounivService } from '../sercatalogouniv.service';



@Component({
  selector: 'app-catalogo-persona',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})

export class PersonasComponent implements OnInit {


  //------------------------------------------------------

  constructor
    (
      private formBuilder: FormBuilder,
      private servi: PersonasService,
      private universalServi: SercatalogounivService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todas las personas
  personas: any = [];

  // Tipos de personas traídos del Universal
  personaTipos: any[] = [];
  // Tipos de documentos traídos del Universal
  personaTiposDoc: any[] = [];
  // Tipos de sexo traídos del Universal
  personaTiposSexo: any[] = [];

  personaSearched: any = [];


  // Persona a editar
  personaFound: any = [];
  //Saber si ya se cargaron los datos del backend
  asyncReady = false;

  //***************************************************************************
  // Definición de formgroups para cada formulario

  // Grupo para lere persona
  readPersonaGroup = new FormGroup
    (
      {
        readPersonaId: new FormControl(),
        readPersonaTipo: new FormControl(),
        readPersonaTipoDoc: new FormControl(),
        readPersonaDoc: new FormControl(),
        readPersonaNombre1: new FormControl(),
        readPersonaNombre2: new FormControl(),
        readPersonaApellido1: new FormControl(),
        readPersonaApellido2: new FormControl(),
        readPersonaFechaNac: new FormControl(),
        readPersonaSexo: new FormControl()
      }
    );


  //Grupo para crear personas
  insertPersonaGroup = new FormGroup
    (
      {
        insertPersonaTipo: new FormControl(),
        insertPersonaTipoDoc: new FormControl(),
        insertPersonaDoc: new FormControl(),
        insertPersonaNombre1: new FormControl(),
        insertPersonaNombre2: new FormControl(),
        insertPersonaApellido1: new FormControl(),
        insertPersonaApellido2: new FormControl(),
        insertPersonaFechaNac: new FormControl(),
        insertPersonaSexo: new FormControl()
      }
    );

  //Grupo para editar personas
  updatePersonaGroup = new FormGroup
    (
      {
        updatePersonaId: new FormControl(),
        updatePersonaTipo: new FormControl(),
        updatePersonaTipoDoc: new FormControl(),
        updatePersonaDoc: new FormControl(),
        updatePersonaNombre1: new FormControl(),
        updatePersonaNombre2: new FormControl(),
        updatePersonaApellido1: new FormControl(),
        updatePersonaApellido2: new FormControl(),
        updatePersonaFechaNac: new FormControl(),
        updatePersonaSexo: new FormControl()
      }
    );

  //***************************************************************************
  // Definición de métodos

  // Cargar datos del backend
  public loadData() {
    this.asyncReady = false;
    forkJoin([
      // Traer todas las personas
      this.servi.getPersonas(),
      // Traer cosas del catálogo
      // Tipos de persona
      this.universalServi.getUniversalTipo('/2'),
      // Tipos de documento
      this.universalServi.getUniversalTipo('/3'),
      // Tipos de sexo
      this.universalServi.getUniversalTipo('/4'),

    ]).subscribe(([personas, tiposPersona, tiposDocumento, tiposSexo]) => {
      this.personas = personas as any[];
      // Reemplazar valores nulos de nombre2 y apellido2
      this.personas.forEach((item: any) => {
        item.nombre2_persona = item.nombre2_persona ? item.nombre2_persona : '';
        item.apellido2_persona = item.apellido2_persona ? item.apellido2_persona : '';
      });
      // Quitar hora "T05:00:00.000Z" de la fecha
      this.personas.forEach((item: any) => {
        item.fecha_nacimiento_persona = item.fecha_nacimiento_persona.slice(0, 10);
      });
      this.personaTipos = tiposPersona as any[];
      this.personaTiposDoc = tiposDocumento as any[];
      this.personaTiposSexo = tiposSexo as any[];

    },
      error => { console.log(error) },
      () => {
        this.asyncReady = true;
      }
    );
  }


  // Mostrar persona seleccionada
  getById() {
    this.servi.getPersona(this.readPersonaGroup.getRawValue()['readPersonaId']).subscribe((data: []) => {
      this.personaSearched = data;
      // Formatear fecha
      var fecha = new Date(this.personaSearched[0].fecha_nacimiento_persona);
      var dia = String(fecha.getDate());
      // Con cero a la izquierda
      if (parseInt(dia) < 10) {
        dia = '0' + dia;
      }

      var mes = String(fecha.getMonth() + 1);

      // Con cero a la izquierda
      if (parseInt(mes) < 10) {
        mes = '0' + mes;
      }
      var año = fecha.getFullYear();
      this.personaSearched[0].fecha_nacimiento_persona = año + '-' + mes + '-' + dia;

      // Preparar datos para cargar en el formulario
      let forupd = {
        readPersonaId: this.personaSearched[0].id_persona,
        readPersonaTipo: this.personaSearched[0].tipo_persona,
        readPersonaTipoDoc: this.personaSearched[0].tipo_doc_persona,
        readPersonaDoc: this.personaSearched[0].doc_persona,
        readPersonaNombre1: this.personaSearched[0].nombre1_persona,
        readPersonaNombre2: this.personaSearched[0].nombre2_persona ? this.personaSearched[0].nombre2_persona : '',
        readPersonaApellido1: this.personaSearched[0].apellido1_persona,
        readPersonaApellido2: this.personaSearched[0].apellido2_persona ? this.personaSearched[0].apellido2_persona : '',
        readPersonaFechaNac: this.personaSearched[0].fecha_nacimiento_persona,
        readPersonaSexo: this.personaSearched[0].sexo_persona
      }
      this.readPersonaGroup.patchValue(forupd);
      console.log(this.readPersonaGroup)
    });
  }


  // Buscar persona por id para actualizar
  public getForUpdate() {
    let idSearch = this.updatePersonaGroup.getRawValue()['updatePersonaId'];

    // Llamar al servicio
    this.personaFound = this.servi.getPersona(idSearch).subscribe((data: []) => {
      this.personaFound = data;

      // Formatear fecha
      var fecha = new Date(this.personaFound[0].fecha_nacimiento_persona);
      var dia = String(fecha.getDate());
      // Con cero a la izquierda
      if (parseInt(dia) < 10) {
        dia = '0' + dia;
      }

      var mes = String(fecha.getMonth() + 1);

      // Con cero a la izquierda
      if (parseInt(mes) < 10) {
        mes = '0' + mes;
      }
      var año = fecha.getFullYear();
      this.personaFound[0].fecha_nacimiento_persona = año + '-' + mes + '-' + dia;

      // Preparar datos para cargar en el formulario
      let forupd = {
        updatePersonaId: this.personaFound[0].id_persona,
        updatePersonaTipo: this.personaTipos.find((item: any) => item.denominacion_catalogo == this.personaFound[0].tipo_persona).id_catalogo,
        updatePersonaTipoDoc: this.personaTiposDoc.find((item: any) => item.denominacion_catalogo == this.personaFound[0].tipo_doc_persona).id_catalogo,
        updatePersonaDoc: this.personaFound[0].doc_persona,
        updatePersonaNombre1: this.personaFound[0].nombre1_persona,
        updatePersonaNombre2: this.personaFound[0].nombre2_persona ? this.personaFound[0].nombre2_persona : '',
        updatePersonaApellido1: this.personaFound[0].apellido1_persona,
        updatePersonaApellido2: this.personaFound[0].apellido2_persona ? this.personaFound[0].apellido2_persona : '',
        updatePersonaFechaNac: this.personaFound[0].fecha_nacimiento_persona,
        updatePersonaSexo: this.personaTiposSexo.find((item: any) => item.denominacion_catalogo == this.personaFound[0].sexo_persona).id_catalogo
      }
      this.updatePersonaGroup.patchValue(forupd);
      console.log(this.updatePersonaGroup)
    });



  }

  // Insertar un nuevo catálogo
  public insertPersona() {

    //JSON armado
    var body = {
      "tipo_persona": this.insertPersonaGroup.getRawValue()['insertPersonaTipo'],
      "tipo_doc_persona": this.insertPersonaGroup.getRawValue()['insertPersonaTipoDoc'],
      "doc_persona": this.insertPersonaGroup.getRawValue()['insertPersonaDoc'],
      "nombre1_persona": this.insertPersonaGroup.getRawValue()['insertPersonaNombre1'],
      "nombre2_persona": this.insertPersonaGroup.getRawValue()['insertPersonaNombre2']
        ? this.insertPersonaGroup.getRawValue()['insertPersonaNombre2'] : null,
      "apellido1_persona": this.insertPersonaGroup.getRawValue()['insertPersonaApellido1'],
      "apellido2_persona": this.insertPersonaGroup.getRawValue()['insertPersonaApellido2']
        ? this.insertPersonaGroup.getRawValue()['insertPersonaApellido2'] : null,
      "fecha_nacimiento_persona": this.insertPersonaGroup.getRawValue()['insertPersonaFechaNac'],
      "sexo_persona": this.insertPersonaGroup.getRawValue()['insertPersonaSexo']
    };

    //se consume el servicio
    this.servi.insertPersona(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertPersonaGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // Actualizar un catálogo
  public updatePersona() {

    //JSON armado
    var cadena = {
      "id_persona": this.updatePersonaGroup.getRawValue()['updatePersonaId'],
      "tipo_persona": this.updatePersonaGroup.getRawValue()['updatePersonaTipo'],
      "tipo_doc_persona": this.updatePersonaGroup.getRawValue()['updatePersonaTipoDoc'],
      "doc_persona": this.updatePersonaGroup.getRawValue()['updatePersonaDoc'],
      "nombre1_persona": this.updatePersonaGroup.getRawValue()['updatePersonaNombre1'],
      "nombre2_persona": this.updatePersonaGroup.getRawValue()['updatePersonaNombre2']
        ? this.updatePersonaGroup.getRawValue()['updatePersonaNombre2'] : null,
      "apellido1_persona": this.updatePersonaGroup.getRawValue()['updatePersonaApellido1'],
      "apellido2_persona": this.updatePersonaGroup.getRawValue()['updatePersonaApellido2']
        ? this.updatePersonaGroup.getRawValue()['updatePersonaApellido2'] : null,
      "fecha_nacimiento_persona": this.updatePersonaGroup.getRawValue()['updatePersonaFechaNac'],
      "sexo_persona": this.updatePersonaGroup.getRawValue()['updatePersonaSexo']
    };

    //se consume el servicio
    this.servi.updatePersona(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.updatePersonaGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // OnInit. Acciones apenas inicia la página
  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.readPersonaGroup = this.formBuilder.group({
      readPersonaId: [],
      readPersonaTipo: [],
      readPersonaTipoDoc: [],
      readPersonaDoc: [],
      readPersonaNombre1: [],
      readPersonaNombre2: [],
      readPersonaApellido1: [],
      readPersonaApellido2: [],
      readPersonaFechaNac: [],
      readPersonaSexo: []
    });

    this.insertPersonaGroup = this.formBuilder.group({
      insertPersonaTipo: [],
      insertPersonaTipoDoc: [],
      insertPersonaDoc: [],
      insertPersonaNombre1: [],
      insertPersonaNombre2: [],
      insertPersonaApellido1: [],
      insertPersonaApellido2: [],
      insertPersonaFechaNac: [],
      insertPersonaSexo: []
    });

    this.updatePersonaGroup = this.formBuilder.group({
      updatePersonaId: [],
      updatePersonaTipo: [],
      updatePersonaTipoDoc: [],
      updatePersonaDoc: [],
      updatePersonaNombre1: [],
      updatePersonaNombre2: [],
      updatePersonaApellido1: [],
      updatePersonaApellido2: [],
      updatePersonaFechaNac: [],
      updatePersonaSexo: []
    });

  }
}
