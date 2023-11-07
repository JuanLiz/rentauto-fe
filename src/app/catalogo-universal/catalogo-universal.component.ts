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

  //------------------------------------------------------------
  //LAS VARIABLES 
  title = "MANEJO DE CATALOGO UNIVERSAL";    //Titulo dela página
  tituloCataUniLista = "";             //Titulo Lista de todos los catalogos
  titloCataUniBuscado = "";                //Titulo de Color Buscado
  titloCataUniEditar = "";          //Titulo de Color a Editar

  Universal: any = [];               //Lista de todos los catalogos
  UniversalTypes: any[] = [];        //Lista de todas las categorías
  selected: { [key: string]: string } = {};

  CataUniCatalogo: any = [];        //Lista catalogo Catalogo
  CataUniColor: any = [];           //Lista catalogo Color
  UniversalipVehi: any = [];         //Lista catalogo TiposVehiculos

  CataUniCatalogoSel: any = [];        //Lista catalogo Catalogo selecionado
  CataUniColorSel: any = [];           //Lista el color selecionado
  UniversalipVehiSel: any = [];         //Lista catalogo TiposVehiculos selecionado
  universalFound: any = [];             // Registro del catalogo a editar

  tablacatalogosstotales: any = [];          //Encabezados tabla catalogos totales

  BuscarEvalor = 1;               //Control para carga del valor a buscar
  controlLista = 1;               //Control para limpiar la lista

  asyncReady = false;            //Control para sincronizar el llamado a los servicios

  //*****************************************************************************
  // Definición de formgroups para cada formulario


  // Crear uno iterado
  universalTipos: any[] = [];

  // Crear un objeto para guardar los formgroups
  formGroups: { [key: string]: FormGroup } = {};


  ListarCatTotales = new FormGroup
    (
      {

      }
    );

  //Grupo para formulariomostrar catalogo de Catalogos
  CBCatalogoCatalogo = new FormGroup
    (
      {
        CatCatalogofiltro: new FormControl(),
        textCatalogo: new FormControl()
      }
    );

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


  public loadData() {
    this.asyncReady = false;
    forkJoin([
      this.servi.getUniversales(),
      this.servi.getUniversalTipo('/' + 1),
    ]).subscribe(([result1, result2]) => {
      // Aquí puedes realizar acciones con los resultados de los observables
      this.Universal = result1;
      this.universalTipos = result2;


      // Realiza otras acciones aquí después de que todos los observables se completen
    },
      error => { console.log(error) },
      () => {
        this.createFormGroups();
        this.asyncReady = true;
      }
    );
  }


  //Lista de todos los catalogos

  public consultaCatalogosTotales() {
    if (this.controlLista == 1) {
      this.servi.getUniversales().subscribe((data: { catalogouiversal: [] }) => {

        this.Universal = data;  //JSON.parse(data);
        this.tituloCataUniLista = "LISTA DE TODOS LOS CATALOGOS";
        this.tablacatalogosstotales[0] = "Id";
        this.tablacatalogosstotales[1] = "Denominación";
        this.tablacatalogosstotales[2] = "LLaveForanea";
      },
        error => { console.error(error + " ") });
    }
    else {
      this.Universal = null;
      this.tituloCataUniLista = "";
      this.tablacatalogosstotales[0] = "";
      this.tablacatalogosstotales[1] = "";
      this.tablacatalogosstotales[2] = "";
      this.tablacatalogosstotales[3] = "";
      this.controlLista = 1;
    }

  }

  //--------------------------------------------------------------------------------------------->
  //para Limpiar la lista

  public LimpiarLista() {
    this.controlLista = 0;
  }

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

  printId(idcatalogo: any) {
    console.log(idcatalogo)
    let val = this.formGroups[idcatalogo].getRawValue()['denominacion_catalogo']
    this.selected[idcatalogo] = val;
  }


  // -----------------------------------------------------------------------------------------
  // Listar un solo tipo de Catalogo
  //--------------------------------------------------------------
  //Consulta un color por medio de su id.

  public ListarCatalogoE(catip: any) {

    this.servi.getUniversalTipo('/' + catip).subscribe((data: {}) => {
      if (catip == 1) {
        this.CataUniCatalogo = data;
      }
      else if (catip == 2) {
        this.CataUniColor = data;
      }
      else if (catip == 3) {
        this.UniversalipVehi = data;
      }

    },
      error => { console.log(error) });

  }


  public getById() {
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


  //--------------------------------------------------------------
  //Consulta un catalogo por Id.

  // public SelCataEditar() {
  //   this.BuscarEvalor = this.updateUniversalGroup.getRawValue()['updateUniversalId'];

  //   this.servi.getUniversal(this.BuscarEvalor).subscribe((data: any) => {

  //     this.universalFound = data;
  //     //console.log(" aca 45 " + this.universalFound.length + " y la data  " + data.length);
  //     this.titloCataUniEditar = "CATALOGO A EDITAR";

  //   },
  //     error => { console.log(error) });


  // }
  //-------------------------------------------------------------------------
  //Para insertar una nuevo catalogo

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

  // -----------------------------------------------------------------------------------------
  // método para actualizar un catalogo .

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

  //=============================================================
  //LAS FUNCIONES PARA LLAMARLAS DESDE EL HTML
  //=============================================================  

  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.ListarCatTotales = this.formBuilder.group(
      {

      });

    this.CBCatalogoCatalogo = this.formBuilder.group(
      {
        CatCatalogofiltro: [],
        textCatalogo: []
      });

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
