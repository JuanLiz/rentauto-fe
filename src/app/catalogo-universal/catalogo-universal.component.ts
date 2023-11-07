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

  CataUniCatalogo: any = [];        //Lista catalogo Catalogo
  CataUniColor: any = [];           //Lista catalogo Color
  UniversalipVehi: any = [];         //Lista catalogo TiposVehiculos

  CataUniCatalogoSel: any = [];        //Lista catalogo Catalogo selecionado
  CataUniColorSel: any = [];           //Lista el color selecionado
  UniversalipVehiSel: any = [];         //Lista catalogo TiposVehiculos selecionado
  CataUniCataEdi: any = [];             // Registro del catalogo a editar

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

  //Grupo para formulariomostrar catalogo colores
  CBCatalogoColor = new FormGroup
    (
      {
        CatColorfiltro: new FormControl(),
        textColor: new FormControl()
      }
    );

  //Grupo para formulariomostrar catalogo Tipos de Vehículos
  CBCatalogoTipVehi = new FormGroup
    (
      {
        CatTipVehifiltro: new FormControl(),
        textTivVehi: new FormControl()
      }
    );


  //Grupo para crear Catalogos
  insertUniversal = new FormGroup
    (
      {
        CBTipoCatalogo: new FormControl(),
        textNueDenominacion: new FormControl(),
        textNueTipoCat: new FormControl(),
      }
    );

  //Grupo para editar Catalogos
  ActCatalogoU = new FormGroup
    (
      {
        CBCatalogoEdi: new FormControl(),
        CBTipoCatalogoEdi: new FormControl(),
        textNueDenominacionEdi: new FormControl(),
        textNueTipoCatEdi: new FormControl(),
      }
    );

  //=============================================================
  //LOS CRUD
  //=============================================================
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


  // // Traer todos los tipos de catalogos
  // public consultaUniversalTipo() {
  //   this.servi.getUniversalTipo('/1').subscribe((data: []) => {
  //     this.UniversalTypes = data;
  //     console.log(this.UniversalTypes);
  //   },
  //     error => { console.log(error) });
  // }



  createFormGroups() {
    this.universalTipos.forEach(catalogo => {
      const formGroup = this.formBuilder.group({
        id_catalogo: [catalogo.id_catalogo],
        //list: [],
        denominacion_catalogo: [catalogo.denominacion_catalogo],
        llave_foranea_catalogo: [catalogo.llave_foranea_catalogo]
      });

      this.formGroups[catalogo.id_catalogo] = formGroup;

    })
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


  //--------------------------------------------------------------
  //Consulta un color por medio de su id.

  public SelecCatalogoE(catip: any, catselec: any) {

    if (this.BuscarEvalor != 0) {
      if (catip == 1) {
        this.BuscarEvalor = this.CBCatalogoCatalogo.getRawValue()['CatCatalogofiltro'];
      }
      else if (catip == 2) {
        this.BuscarEvalor = this.CBCatalogoColor.getRawValue()['CatColorfiltro'];
      }
      else if (catip == 3) {
        this.BuscarEvalor = this.CBCatalogoTipVehi.getRawValue()['CatTipVehifiltro'];
      }

    }
    catselec = this.BuscarEvalor;


    this.servi.getUniversalTipo('/' + catip + '/' + catselec).subscribe((data: {}) => {
      console.log(" aca 12  catip - " + catip + "  Catselec  - " + catselec);
      if (catip == 1) {
        this.CataUniCatalogoSel = data;
      }
      else if (catip == 2) {
        this.CataUniColorSel = data;
      }
      else if (catip == 3) {
        this.UniversalipVehiSel = data;
      }

    },
      error => { console.log(error) });

  }

  //--------------------------------------------------------------
  //Consulta un catalogo por Id.

  public SelCataEditar() {
    this.BuscarEvalor = this.ActCatalogoU.getRawValue()['CBCatalogoEdi'];

    this.servi.getUniversal(this.BuscarEvalor).subscribe((data: any) => {

      this.CataUniCataEdi = data;
      //console.log(" aca 45 " + this.CataUniCataEdi.length + " y la data  " + data.length);
      this.titloCataUniEditar = "CATALOGO A EDITAR";

    },
      error => { console.log(error) });


  }
  //-------------------------------------------------------------------------
  //Para insertar una nuevo catalogo

  InsertarNuevoCatalogo() {
    //variables para armar el JSON que se va a enviar al Back-End
    var datosvalo1 = this.insertUniversal.getRawValue()['textNueDenominacion'];
    var datosvalo2 = this.insertUniversal.getRawValue()['textNueTipoCat'];
    var datosvalo3 = this.insertUniversal.getRawValue()['CBTipoCatalogo'];

    //JSON armado
    var cadena = {
      "denominacion_catalogo": datosvalo1,
      "catalogo_universal": datosvalo2,
      "llave_foranea_catalogo": datosvalo3,
    };

    //se consume el servicio
    this.servi.insertUniversal(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertUniversal.reset();
  }

  // -----------------------------------------------------------------------------------------
  // método para actualizar un catalogo .

  public ActualizarCatalogo() {

    //variables para armar el JSON que se va a enviar al Back-End
    var datosvalo1 = this.ActCatalogoU.getRawValue()['CBCatalogoEdi'];
    var datosvalo2 = this.ActCatalogoU.getRawValue()['textNueDenominacionEdi'];
    var datosvalo3 = this.ActCatalogoU.getRawValue()['textNueTipoCatEdi'];
    var datosvalo4 = this.ActCatalogoU.getRawValue()['CBTipoCatalogoEdi'];

    //JSON armado
    var cadena = {
      "id_catalogo": datosvalo1,
      "denominacion_catalogo": datosvalo2,
      "catalogo_universal": datosvalo3,
      "llave_foranea_catalogo": datosvalo4
    };

    //se consume el servicio
    this.servi.updateUniversal(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.insertUniversal.reset();
  }

  //=============================================================
  //LAS FUNCIONES PARA LLAMARLAS DESDE EL HTML
  //=============================================================  

  ngOnInit(): void {

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
        console.log(this.formGroups)
        this.asyncReady = true;
      }
    );


    // Llamar a la función que lista todos los catalogos
    // this.consultaUniversalTipo(1).subscribe((data: any[]) => {
    //   this.universalTipos = data;
    //   this.createFormGroups();
    // });


    this.ListarCatTotales = this.formBuilder.group(
      {

      });

    this.CBCatalogoCatalogo = this.formBuilder.group(
      {
        CatCatalogofiltro: [],
        textCatalogo: []
      });

    this.CBCatalogoColor = this.formBuilder.group(
      {
        CatColorfiltro: [],
        textColor: []
      });

    this.CBCatalogoTipVehi = this.formBuilder.group(
      {
        CatTipVehifiltro: [],
        textTivVehi: []
      });

    this.insertUniversal = this.formBuilder.group(
      {
        CBTipoCatalogo: [],
        textNueDenominacion: [],
        textNueTipoCat: []
      });

    this.ActCatalogoU = this.formBuilder.group(
      {
        CBCatalogoEdi: [],
        CBTipoCatalogoEdi: [],
        textNueDenominacionEdi: [],
        textNueTipoCatEdi: []
      });

  }
}
