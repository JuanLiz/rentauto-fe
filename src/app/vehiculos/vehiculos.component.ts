import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { SercatalogounivService } from '../sercatalogouniv.service';
import { VehiculosService } from '../vehiculos.service';



@Component({
  selector: 'app-catalogo-vehiculo',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})

export class VehiculosComponent implements OnInit {


  //------------------------------------------------------

  constructor
    (
      private formBuilder: FormBuilder,
      private servi: VehiculosService,
      private universalServi: SercatalogounivService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todos los vehiculos
  vehiculos: any = [];

  // Lista de sucursales traídas de las Sucursales

  // Tipos de vehiculos traídos del Universal
  vehiculoTipos: any[] = [];
  // Tipos de marca traídos del Universal
  vehiculoTiposMarca: any[] = [];
  // Tipos de color traídos del Universal
  vehiculoTiposColor: any[] = [];
  // Tipos de transmisión traídos del Universal
  vehiculoTiposTransmision: any[] = [];
  // Tipos de estado traídos del Universal
  vehiculoTiposEstado: any[] = [];

  vehiculoSearched: any = [];


  // Catálogo a editar
  vehiculoFound: any = [];
  //Saber si ya se cargaron los datos del backend
  asyncReady = false;

  //***************************************************************************
  // Definición de formgroups para cada formulario

  // Grupo para lere vehiculo
  readVehiculoGroup = new FormGroup
    (
      {
        readVehiculoId: new FormControl(),
        readVehiculoTipo: new FormControl(),
        readVehiculoTipoMarca: new FormControl(),
        readVehiculoMarca: new FormControl(),
        readVehiculoNombre1: new FormControl(),
        readVehiculoNombre2: new FormControl(),
        readVehiculoApellido1: new FormControl(),
        readVehiculoApellido2: new FormControl(),
        readVehiculoFechaNac: new FormControl(),
        readVehiculoColor: new FormControl()
      }
    );


  //Grupo para crear vehiculos
  insertVehiculoGroup = new FormGroup
    (
      {
        insertVehiculoTipo: new FormControl(),
        insertVehiculoTipoMarca: new FormControl(),
        insertVehiculoMarca: new FormControl(),
        insertVehiculoNombre1: new FormControl(),
        insertVehiculoNombre2: new FormControl(),
        insertVehiculoApellido1: new FormControl(),
        insertVehiculoApellido2: new FormControl(),
        insertVehiculoFechaNac: new FormControl(),
        insertVehiculoColor: new FormControl()
      }
    );

  //Grupo para editar vehiculos
  updateVehiculoGroup = new FormGroup
    (
      {
        updateVehiculoId: new FormControl(),
        updateVehiculoTipo: new FormControl(),
        updateVehiculoTipoMarca: new FormControl(),
        updateVehiculoMarca: new FormControl(),
        updateVehiculoNombre1: new FormControl(),
        updateVehiculoNombre2: new FormControl(),
        updateVehiculoApellido1: new FormControl(),
        updateVehiculoApellido2: new FormControl(),
        updateVehiculoFechaNac: new FormControl(),
        updateVehiculoColor: new FormControl()
      }
    );

  //***************************************************************************
  // Definición de métodos

  // Cargar datos del backend
  public loadData() {
    this.asyncReady = false;
    forkJoin([
      // Traer todas las vehiculos
      this.servi.getVehiculos(),
      // Traer cosas del catálogo
      // Tipos de vehiculo
      this.universalServi.getUniversalTipo('/2'),
      // Tipos de documento
      this.universalServi.getUniversalTipo('/3'),
      // Tipos de sexo
      this.universalServi.getUniversalTipo('/4'),

    ]).subscribe(([vehiculos, tiposVehiculo, tiposMarcaumento, tiposColor]) => {
      this.vehiculos = vehiculos as any[];
      // Reemplazar valores nulos de nombre2 y apellido2
      this.vehiculos.forEach((item: any) => {
        item.nombre2_vehiculo = item.nombre2_vehiculo ? item.nombre2_vehiculo : '';
        item.apellido2_vehiculo = item.apellido2_vehiculo ? item.apellido2_vehiculo : '';
      });
      // Quitar hora "T05:00:00.000Z" de la fecha
      this.vehiculos.forEach((item: any) => {
        item.fecha_nacimiento_vehiculo = item.fecha_nacimiento_vehiculo.slice(0, 10);
      });
      this.vehiculoTipos = tiposVehiculo as any[];
      this.vehiculoTiposMarca = tiposMarcaumento as any[];
      this.vehiculoTiposColor = tiposColor as any[];

    },
      error => { console.log(error) },
      () => {
        this.asyncReady = true;
      }
    );
  }


  // Mostrar vehiculo seleccionada
  getById() {
    this.servi.getVehiculo(this.readVehiculoGroup.getRawValue()['readVehiculoId']).subscribe((data: []) => {
      this.vehiculoSearched = data;
      // Formatear fecha
      var fecha = new Date(this.vehiculoSearched[0].fecha_nacimiento_vehiculo);
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
      this.vehiculoSearched[0].fecha_nacimiento_vehiculo = año + '-' + mes + '-' + dia;

      // Preparar datos para cargar en el formulario
      let forupd = {
        readVehiculoId: this.vehiculoSearched[0].id_vehiculo,
        readVehiculoTipo: this.vehiculoSearched[0].tipo_vehiculo,
        readVehiculoTipoMarca: this.vehiculoSearched[0].tipo_doc_vehiculo,
        readVehiculoMarca: this.vehiculoSearched[0].doc_vehiculo,
        readVehiculoNombre1: this.vehiculoSearched[0].nombre1_vehiculo,
        readVehiculoNombre2: this.vehiculoSearched[0].nombre2_vehiculo ? this.vehiculoSearched[0].nombre2_vehiculo : '',
        readVehiculoApellido1: this.vehiculoSearched[0].apellido1_vehiculo,
        readVehiculoApellido2: this.vehiculoSearched[0].apellido2_vehiculo ? this.vehiculoSearched[0].apellido2_vehiculo : '',
        readVehiculoFechaNac: this.vehiculoSearched[0].fecha_nacimiento_vehiculo,
        readVehiculoColor: this.vehiculoSearched[0].sexo_vehiculo
      }
      this.readVehiculoGroup.patchValue(forupd);
      console.log(this.readVehiculoGroup)
    });
  }


  // Buscar vehiculo por id para actualizar
  public getForUpdate() {
    let idSearch = this.updateVehiculoGroup.getRawValue()['updateVehiculoId'];

    // Llamar al servicio
    this.vehiculoFound = this.servi.getVehiculo(idSearch).subscribe((data: []) => {
      this.vehiculoFound = data;

      // Formatear fecha
      var fecha = new Date(this.vehiculoFound[0].fecha_nacimiento_vehiculo);
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
      this.vehiculoFound[0].fecha_nacimiento_vehiculo = año + '-' + mes + '-' + dia;

      // Preparar datos para cargar en el formulario
      let forupd = {
        updateVehiculoId: this.vehiculoFound[0].id_vehiculo,
        updateVehiculoTipo: this.vehiculoTipos.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].tipo_vehiculo).id_catalogo,
        updateVehiculoTipoMarca: this.vehiculoTiposMarca.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].tipo_doc_vehiculo).id_catalogo,
        updateVehiculoMarca: this.vehiculoFound[0].doc_vehiculo,
        updateVehiculoNombre1: this.vehiculoFound[0].nombre1_vehiculo,
        updateVehiculoNombre2: this.vehiculoFound[0].nombre2_vehiculo ? this.vehiculoFound[0].nombre2_vehiculo : '',
        updateVehiculoApellido1: this.vehiculoFound[0].apellido1_vehiculo,
        updateVehiculoApellido2: this.vehiculoFound[0].apellido2_vehiculo ? this.vehiculoFound[0].apellido2_vehiculo : '',
        updateVehiculoFechaNac: this.vehiculoFound[0].fecha_nacimiento_vehiculo,
        updateVehiculoColor: this.vehiculoTiposColor.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].sexo_vehiculo).id_catalogo
      }
      this.updateVehiculoGroup.patchValue(forupd);
      console.log(this.updateVehiculoGroup)
    });



  }

  // Insertar un nuevo catálogo
  public insertVehiculo() {

    //JSON armado
    var body = {
      "tipo_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoTipo'],
      "tipo_doc_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoTipoMarca'],
      "doc_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoMarca'],
      "nombre1_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoNombre1'],
      "nombre2_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoNombre2']
        ? this.insertVehiculoGroup.getRawValue()['insertVehiculoNombre2'] : null,
      "apellido1_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoApellido1'],
      "apellido2_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoApellido2']
        ? this.insertVehiculoGroup.getRawValue()['insertVehiculoApellido2'] : null,
      "fecha_nacimiento_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoFechaNac'],
      "sexo_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoColor']
    };

    //se consume el servicio
    this.servi.insertVehiculo(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertVehiculoGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // Actualizar un catálogo
  public updateVehiculo() {

    //JSON armado
    var cadena = {
      "id_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoId'],
      "tipo_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoTipo'],
      "tipo_doc_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoTipoMarca'],
      "doc_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoMarca'],
      "nombre1_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoNombre1'],
      "nombre2_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoNombre2']
        ? this.updateVehiculoGroup.getRawValue()['updateVehiculoNombre2'] : null,
      "apellido1_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoApellido1'],
      "apellido2_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoApellido2']
        ? this.updateVehiculoGroup.getRawValue()['updateVehiculoApellido2'] : null,
      "fecha_nacimiento_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoFechaNac'],
      "sexo_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoColor']
    };

    //se consume el servicio
    this.servi.updateVehiculo(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.updateVehiculoGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // OnInit. Acciones apenas inicia la página
  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.readVehiculoGroup = this.formBuilder.group({
      readVehiculoId: [],
      readVehiculoTipo: [],
      readVehiculoTipoMarca: [],
      readVehiculoMarca: [],
      readVehiculoNombre1: [],
      readVehiculoNombre2: [],
      readVehiculoApellido1: [],
      readVehiculoApellido2: [],
      readVehiculoFechaNac: [],
      readVehiculoColor: []
    });

    this.insertVehiculoGroup = this.formBuilder.group({
      insertVehiculoTipo: [],
      insertVehiculoTipoMarca: [],
      insertVehiculoMarca: [],
      insertVehiculoNombre1: [],
      insertVehiculoNombre2: [],
      insertVehiculoApellido1: [],
      insertVehiculoApellido2: [],
      insertVehiculoFechaNac: [],
      insertVehiculoColor: []
    });

    this.updateVehiculoGroup = this.formBuilder.group({
      updateVehiculoId: [],
      updateVehiculoTipo: [],
      updateVehiculoTipoMarca: [],
      updateVehiculoMarca: [],
      updateVehiculoNombre1: [],
      updateVehiculoNombre2: [],
      updateVehiculoApellido1: [],
      updateVehiculoApellido2: [],
      updateVehiculoFechaNac: [],
      updateVehiculoColor: []
    });

  }
}
