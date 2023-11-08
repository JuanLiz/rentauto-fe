import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { SercatalogounivService } from '../sercatalogouniv.service';
import { SucursalesService } from '../sucursales.service';



@Component({
  selector: 'app-catalogo-sucursal',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})

export class SucursalesComponent implements OnInit {


  //------------------------------------------------------

  constructor
    (
      private formBuilder: FormBuilder,
      private servi: SucursalesService,
      private universalServi: SercatalogounivService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todas las sucursales
  sucursales: any = [];

  // Sucursal buscada
  sucursalSearched: any = [];

  // Sucursal a editar
  sucursalFound: any = [];
  //Saber si ya se cargaron los datos del backend
  asyncReady = false;

  //***************************************************************************
  // Definición de formgroups para cada formulario



  // Grupo para lere sucursal
  readSucursalGroup = new FormGroup
    (
      {
        readSucursalId: new FormControl(),
        readSucursalNombre: new FormControl(),
        readSucursalDireccion: new FormControl(),
        readSucursalTelefono: new FormControl(),
        readSucursalHorario: new FormControl(),
        readSucursalUbicacion: new FormControl()
      }
    );


  //Grupo para crear sucursales
  insertSucursalGroup = new FormGroup
    (
      {
        //insertSucursalId: new FormControl(),
        insertSucursalNombre: new FormControl(),
        insertSucursalDireccion: new FormControl(),
        insertSucursalTelefono: new FormControl(),
        insertSucursalHorario: new FormControl(),
        insertSucursalUbicacion: new FormControl()

      }
    );

  //Grupo para editar sucursales
  updateSucursalGroup = new FormGroup
    (
      {
        updateSucursalId: new FormControl(),
        updateSucursalNombre: new FormControl(),
        updateSucursalDireccion: new FormControl(),
        updateSucursalTelefono: new FormControl(),
        updateSucursalHorario: new FormControl(),
        updateSucursalUbicacion: new FormControl()
      }
    );

  //***************************************************************************
  // Definición de métodos

  // Cargar datos del backend
  public loadData() {
    this.asyncReady = false;
    forkJoin([
      // Traer todas las sucursales
      this.servi.getSucursales()
    ]).subscribe(([sucursales]) => {
      this.sucursales = sucursales as any[];
    },
      error => { console.log(error) },
      () => {
        this.asyncReady = true;
      }
    );
  }


  // Mostrar sucursal seleccionada
  getById() {
    this.servi.getSucursal(this.readSucursalGroup.getRawValue()['readSucursalId']).subscribe((data: []) => {
      this.sucursalSearched = data;

      // Preparar datos para cargar en el formulario
      let forupd = {
        readSucursalId: this.sucursalSearched[0].id_sucursal,
        readSucursalNombre: this.sucursalSearched[0].nombre_sucursal,
        readSucursalDireccion: this.sucursalSearched[0].direccion_sucursal,
        readSucursalTelefono: this.sucursalSearched[0].telefono_sucursal,
        readSucursalHorario: this.sucursalSearched[0].horario_sucursal,
        readSucursalUbicacion: this.sucursalSearched[0].ubicacion_sucursal
      }
      this.readSucursalGroup.patchValue(forupd);
      console.log(this.readSucursalGroup)
    });
  }


  // Buscar sucursal por id para actualizar
  public getForUpdate() {
    let idSearch = this.updateSucursalGroup.getRawValue()['updateSucursalId'];

    // Llamar al servicio
    this.sucursalFound = this.servi.getSucursal(idSearch).subscribe((data: []) => {
      this.sucursalFound = data;

      // Preparar datos para cargar en el formulario
      let forupd = {
        updateSucursalId: this.sucursalFound[0].id_sucursal,
        updateSucursalNombre: this.sucursalFound[0].nombre_sucursal,
        updateSucursalDireccion: this.sucursalFound[0].direccion_sucursal,
        updateSucursalTelefono: this.sucursalFound[0].telefono_sucursal,
        updateSucursalHorario: this.sucursalFound[0].horario_sucursal,
        updateSucursalUbicacion: this.sucursalFound[0].ubicacion_sucursal
      }
      this.updateSucursalGroup.patchValue(forupd);
      console.log(this.updateSucursalGroup)
    });



  }

  // Insertar un nuevo catálogo
  public insertSucursal() {

    //JSON armado
    var body = {
      "nombre_sucursal": this.insertSucursalGroup.getRawValue()['insertSucursalNombre'],
      "direccion_sucursal": this.insertSucursalGroup.getRawValue()['insertSucursalDireccion'],
      "telefono_sucursal": this.insertSucursalGroup.getRawValue()['insertSucursalTelefono'],
      "horario_sucursal": this.insertSucursalGroup.getRawValue()['insertSucursalHorario'],
      "ubicacion_sucursal": this.insertSucursalGroup.getRawValue()['insertSucursalUbicacion']
    };

    //se consume el servicio
    this.servi.insertSucursal(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertSucursalGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // Actualizar un catálogo
  public updateSucursal() {

    //JSON armado
    var cadena = {
      "id_sucursal": this.updateSucursalGroup.getRawValue()['updateSucursalId'],
      "nombre_sucursal": this.updateSucursalGroup.getRawValue()['updateSucursalNombre'],
      "direccion_sucursal": this.updateSucursalGroup.getRawValue()['updateSucursalDireccion'],
      "telefono_sucursal": this.updateSucursalGroup.getRawValue()['updateSucursalTelefono'],
      "horario_sucursal": this.updateSucursalGroup.getRawValue()['updateSucursalHorario'],
      "ubicacion_sucursal": this.updateSucursalGroup.getRawValue()['updateSucursalUbicacion']
    };

    //se consume el servicio
    this.servi.updateSucursal(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.updateSucursalGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // OnInit. Acciones apenas inicia la página
  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.readSucursalGroup = this.formBuilder.group({
      readSucursalId: [],
      readSucursalNombre: [],
      readSucursalDireccion: [],
      readSucursalTelefono: [],
      readSucursalHorario: [],
      readSucursalUbicacion: []
    });

    this.insertSucursalGroup = this.formBuilder.group({
      insertSucursalNombre: [],
      insertSucursalDireccion: [],
      insertSucursalTelefono: [],
      insertSucursalHorario: [],
      insertSucursalUbicacion: []
    });

    this.updateSucursalGroup = this.formBuilder.group({
      updateSucursalId: [],
      updateSucursalNombre: [],
      updateSucursalDireccion: [],
      updateSucursalTelefono: [],
      updateSucursalHorario: [],
      updateSucursalUbicacion: []
    });

  }
}
