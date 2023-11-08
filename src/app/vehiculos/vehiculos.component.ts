import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { SercatalogounivService } from '../sercatalogouniv.service';
import { SucursalesService } from '../sucursales.service';
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
      private SucursalesServi: SucursalesService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todos los vehiculos
  vehiculos: any = [];

  // Lista de sucursales traídas de las Sucursales
  vehiculoSucursales: any[] = [];

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
        readVehiculoPlaca: new FormControl(),
        readVehiculoMarca: new FormControl(),
        readVehiculoModelo: new FormControl(),
        readVehiculoColor: new FormControl(),
        readVehiculoAnio: new FormControl(),
        readVehiculoTipo: new FormControl(),
        readVehiculoEstado: new FormControl(),
        readVehiculoPasajeros: new FormControl(),
        readVehiculoTransmision: new FormControl(),
        readVehiculoPrecioDia: new FormControl(),
        readVehiculoSucursal: new FormControl()
      }
    );


  //Grupo para crear vehiculos
  insertVehiculoGroup = new FormGroup
    (
      {
        insertVehiculoId: new FormControl(),
        insertVehiculoPlaca: new FormControl(),
        insertVehiculoMarca: new FormControl(),
        insertVehiculoModelo: new FormControl(),
        insertVehiculoColor: new FormControl(),
        insertVehiculoAnio: new FormControl(),
        insertVehiculoTipo: new FormControl(),
        insertVehiculoEstado: new FormControl(),
        insertVehiculoPasajeros: new FormControl(),
        insertVehiculoTransmision: new FormControl(),
        insertVehiculoPrecioDia: new FormControl(),
        insertVehiculoSucursal: new FormControl()

      }
    );

  //Grupo para editar vehiculos
  updateVehiculoGroup = new FormGroup
    (
      {
        updateVehiculoId: new FormControl(),
        updateVehiculoPlaca: new FormControl(),
        updateVehiculoMarca: new FormControl(),
        updateVehiculoModelo: new FormControl(),
        updateVehiculoColor: new FormControl(),
        updateVehiculoAnio: new FormControl(),
        updateVehiculoTipo: new FormControl(),
        updateVehiculoEstado: new FormControl(),
        updateVehiculoPasajeros: new FormControl(),
        updateVehiculoTransmision: new FormControl(),
        updateVehiculoPrecioDia: new FormControl(),
        updateVehiculoSucursal: new FormControl()
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
      // Marcas de vehiculo
      this.universalServi.getUniversalTipo('/6'),
      // Colores de vehiculo
      this.universalServi.getUniversalTipo('/7'),
      // Tipos de vehiculo
      this.universalServi.getUniversalTipo('/8'),
      // Estados de vehiculo
      this.universalServi.getUniversalTipo('/9'),
      // Transmsiones de vehiculo
      this.universalServi.getUniversalTipo('/10'),
      // Sucursales
      this.SucursalesServi.getSucursales()

    ]).subscribe((
      [
        vehiculos,
        marcasVehiculos,
        coloresVehiculos,
        tiposVehiculos,
        estadosVehiculos,
        transmisionesVehiculos,
        sucursalesVehiculos
      ]) => {
      this.vehiculos = vehiculos as any[];
      this.vehiculoTiposMarca = marcasVehiculos as any[];
      this.vehiculoTiposColor = coloresVehiculos as any[];
      this.vehiculoTipos = tiposVehiculos as any[];
      this.vehiculoTiposEstado = estadosVehiculos as any[];
      this.vehiculoTiposTransmision = transmisionesVehiculos as any[];
      this.vehiculoSucursales = sucursalesVehiculos as any[];
    },
      error => { console.log(error) },
      () => {
        this.asyncReady = true;
      }
    );
  }


  // Mostrar vehiculo seleccionado
  getById() {
    this.servi.getVehiculo(this.readVehiculoGroup.getRawValue()['readVehiculoId']).subscribe((data: []) => {
      this.vehiculoSearched = data;
      // Preparar datos para cargar en el formulario
      let forupd = {
        readVehiculoId: this.vehiculoSearched[0].id_vehiculo,
        readVehiculoPlaca: this.vehiculoSearched[0].placa_vehiculo,
        readVehiculoMarca: this.vehiculoSearched[0].marca_vehiculo,
        readVehiculoModelo: this.vehiculoSearched[0].modelo_vehiculo,
        readVehiculoColor: this.vehiculoSearched[0].color_vehiculo,
        readVehiculoAnio: this.vehiculoSearched[0].anio_vehiculo,
        readVehiculoTipo: this.vehiculoSearched[0].tipo_vehiculo,
        readVehiculoEstado: this.vehiculoSearched[0].estado_vehiculo,
        readVehiculoPasajeros: this.vehiculoSearched[0].pasajeros_vehiculo,
        readVehiculoTransmision: this.vehiculoSearched[0].transmision_vehiculo,
        readVehiculoPrecioDia: this.vehiculoSearched[0].precio_dia_vehiculo,
        readVehiculoSucursal: this.vehiculoSearched[0].sucursal_vehiculo
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

      // Preparar datos para cargar en el formulario
      let forupd = {
        updateVehiculoId: this.vehiculoFound[0].id_vehiculo,
        updateVehiculoPlaca: this.vehiculoFound[0].placa_vehiculo,
        updateVehiculoMarca: this.vehiculoTiposMarca.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].marca_vehiculo).id_catalogo,
        updateVehiculoModelo: this.vehiculoFound[0].modelo_vehiculo,
        updateVehiculoColor: this.vehiculoTiposColor.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].color_vehiculo).id_catalogo,
        updateVehiculoAnio: this.vehiculoFound[0].anio_vehiculo,
        updateVehiculoTipo: this.vehiculoTipos.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].tipo_vehiculo).id_catalogo,
        updateVehiculoEstado: this.vehiculoTiposEstado.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].estado_vehiculo).id_catalogo,
        updateVehiculoPasajeros: this.vehiculoFound[0].pasajeros_vehiculo,
        updateVehiculoTransmision: this.vehiculoTiposTransmision.find((item: any) => item.denominacion_catalogo == this.vehiculoFound[0].transmision_vehiculo).id_catalogo,
        updateVehiculoPrecioDia: this.vehiculoFound[0].precio_dia_vehiculo,
        updateVehiculoSucursal: this.vehiculoSucursales.find((item: any) => item.nombre_sucursal == this.vehiculoFound[0].sucursal_vehiculo).id_sucursal
     }
      this.updateVehiculoGroup.patchValue(forupd);
      console.log(this.updateVehiculoGroup)
    });



  }

  // Insertar un nuevo vehículo
  public insertVehiculo() {

    //JSON armado
    var body = {
      "placa_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoPlaca'],
      "marca_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoMarca'],
      "modelo_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoModelo'],
      "color_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoColor'],
      "anio_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoAnio'],
      "tipo_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoTipo'],
      "estado_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoEstado'],
      "pasajeros_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoPasajeros'],
      "transmision_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoTransmision'],
      "precio_dia_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoPrecioDia'],
      "sucursal_vehiculo": this.insertVehiculoGroup.getRawValue()['insertVehiculoSucursal']
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


  // Actualizar un vehículo
  public updateVehiculo() {

    //JSON armado
    var cadena = {
      "id_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoId'],
      "placa_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoPlaca'],
      "marca_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoMarca'],
      "modelo_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoModelo'],
      "color_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoColor'],
      "anio_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoAnio'],
      "tipo_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoTipo'],
      "estado_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoEstado'],
      "pasajeros_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoPasajeros'],
      "transmision_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoTransmision'],
      "precio_dia_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoPrecioDia'],
      "sucursal_vehiculo": this.updateVehiculoGroup.getRawValue()['updateVehiculoSucursal']
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
      readVehiculoPlaca: [],
      readVehiculoMarca: [],
      readVehiculoModelo: [],
      readVehiculoColor: [],
      readVehiculoAnio: [],
      readVehiculoTipo: [],
      readVehiculoEstado: [],
      readVehiculoPasajeros: [],
      readVehiculoTransmision: [],
      readVehiculoPrecioDia: [],
      readVehiculoSucursal: []
    });

    this.insertVehiculoGroup = this.formBuilder.group({
      insertVehiculoId: [],
      insertVehiculoPlaca: [],
      insertVehiculoMarca: [],
      insertVehiculoModelo: [],
      insertVehiculoColor: [],
      insertVehiculoAnio: [],
      insertVehiculoTipo: [],
      insertVehiculoEstado: [],
      insertVehiculoPasajeros: [],
      insertVehiculoTransmision: [],
      insertVehiculoPrecioDia: [],
      insertVehiculoSucursal: []
    });

    this.updateVehiculoGroup = this.formBuilder.group({
      updateVehiculoId: [],
      updateVehiculoPlaca: [],
      updateVehiculoMarca: [],
      updateVehiculoModelo: [],
      updateVehiculoColor: [],
      updateVehiculoAnio: [],
      updateVehiculoTipo: [],
      updateVehiculoEstado: [],
      updateVehiculoPasajeros: [],
      updateVehiculoTransmision: [],
      updateVehiculoPrecioDia: [],
      updateVehiculoSucursal: []
    });

  }
}
