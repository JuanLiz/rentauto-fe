import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { SercatalogounivService } from '../sercatalogouniv.service';



@Component({
  selector: 'app-catalogo-universal',
  templateUrl: './catalogo-universal.component.html',
  styleUrls: ['./catalogo-universal.component.css']
})

export class CatalogoUniversalComponent implements OnInit {


  //------------------------------------------------------

  constructor
    (
      private formBuilder: FormBuilder,
      private servi: SercatalogounivService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todos los catalogos
  Universal: any = [];
  //Lista de todas las categorías        
  UniversalTypes: any[] = [];
  // Imprimir id de catálogo seleccionado
  selected: { [key: string]: string } = {};
  // Catálogo a editar
  universalFound: any = [];
  //Saber si ya se cargaron los datos del backend
  asyncReady = false;

  //***************************************************************************
  // Definición de formgroups para cada formulario

  // Crear uno iterado para los tipos de catálogo
  universalTipos: any[] = [];

  // Crear un objeto para guardar los formgroups
  formGroups: { [key: string]: FormGroup } = {};

  //Grupo para crear Catalogos
  insertUniversalGroup = new FormGroup
    (
      {
        createUniversalTipo: new FormControl(),
        createUniversalText: new FormControl(),
      }
    );

  //Grupo para editar Catalogos
  updateUniversalGroup = new FormGroup
    (
      {
        updateUniversalId: new FormControl(),
        updateUniversalTipo: new FormControl(),
        updateUniversalText: new FormControl(),
      }
    );

  //***************************************************************************
  // Definición de métodos

  // Crear formgroups para cada catálogo
  createFormGroups() {
    this.universalTipos.forEach(catalogo => {
      const formGroup = this.formBuilder.group({
        id_catalogo: [catalogo.id_catalogo],
        lista: [this.Universal.filter((item: any) => item.llave_foranea_catalogo == catalogo.denominacion_catalogo)],
        denominacion_catalogo: [catalogo.denominacion_catalogo],
        llave_foranea_catalogo: [catalogo.llave_foranea_catalogo]
      });

      this.formGroups[catalogo.id_catalogo] = formGroup;

    })
  }


  // Cargar datos del backend
  public loadData() {
    this.asyncReady = false;
    forkJoin([
      this.servi.getUniversales(),
      this.servi.getUniversalTipo('/' + 1),
    ]).subscribe(([result1, result2]) => {
      // Aquí puedes realizar acciones con los resultados de los observables
      this.Universal = result1;
      this.universalTipos = result2;
    },
      error => { console.log(error) },
      () => {
        this.createFormGroups();
        this.asyncReady = true;
      }
    );
  }


  // Imprimir id de catálogo seleccionado
  printId(idcatalogo: any) {
    console.log(idcatalogo)
    let val = this.formGroups[idcatalogo].getRawValue()['denominacion_catalogo']
    this.selected[idcatalogo] = val;
  }


  // Buscar catálogo por id
  public getForUpdate() {
    let idSearch = this.updateUniversalGroup.getRawValue()['updateUniversalId'];

    // Buscar en el array con filter
    this.universalFound = [this.Universal.find((item: any) => item.id_catalogo == idSearch)];

    // Buscar id de la llave foranea
    let idLlaveForanea = this.Universal.find((item: any) => item.denominacion_catalogo == this.universalFound[0].llave_foranea_catalogo).id_catalogo;

    console.log(this.universalFound)
    let forupd = {
      updateUniversalText: this.universalFound[0].denominacion_catalogo,
      updateUniversalTipo: idLlaveForanea
    }
    this.updateUniversalGroup.patchValue(forupd);
    console.log(this.updateUniversalGroup)
  }

  // Insertar un nuevo catálogo
  public insertUniversal() {

    //JSON armado
    var body = {
      "denominacion_catalogo": this.insertUniversalGroup.getRawValue()['createUniversalText'],
      "llave_foranea_catalogo": this.insertUniversalGroup.getRawValue()['createUniversalTipo'],
    };

    //se consume el servicio
    this.servi.insertUniversal(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertUniversalGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // Actualizar un catálogo
  public updateUniversal() {

    //JSON armado
    var cadena = {
      "id_catalogo": this.updateUniversalGroup.getRawValue()['updateUniversalId'],
      "denominacion_catalogo": this.updateUniversalGroup.getRawValue()['updateUniversalText'],
      "llave_foranea_catalogo": this.updateUniversalGroup.getRawValue()['updateUniversalTipo']
    };

    //se consume el servicio
    this.servi.updateUniversal(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.updateUniversalGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // OnInit. Acciones apenas inicia la página
  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.insertUniversalGroup = this.formBuilder.group(
      {
        createUniversalTipo: [],
        createUniversalText: []
      });

    this.updateUniversalGroup = this.formBuilder.group(
      {
        updateUniversalId: [],
        updateUniversalTipo: [],
        updateUniversalText: []
      });

  }
}
