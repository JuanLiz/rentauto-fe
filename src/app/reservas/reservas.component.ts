import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { PersonasService } from '../personas.service';
import { ReservasService } from '../reservas.service';
import { SercatalogounivService } from '../sercatalogouniv.service';
import { VehiculosService } from '../vehiculos.service';



@Component({
  selector: 'app-catalogo-reserva',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})

export class ReservasComponent implements OnInit {


  //------------------------------------------------------

  constructor
    (
      private formBuilder: FormBuilder,
      private servi: ReservasService,
      private universalServi: SercatalogounivService,
      private vehiculoServi: VehiculosService,
      private personaServi: PersonasService,
      Router: Router
    ) { }

  //***************************************************************************
  // Definición de variables

  //Lista de todas las reservas
  reservas: any = [];
  reservasShow: any = [];

  // Lista de todas las personas
  personas: any = [];

  // Lista de todos los vehículos
  vehiculos: any = [];

  // Estados de reservas traídos del Universal
  reservaTiposEstado: any[] = [];

  reservaSearched: any = [];


  // Reserva a editar
  reservaFound: any = [];
  //Saber si ya se cargaron los datos del backend
  asyncReady = false;

  //***************************************************************************
  // Definición de formgroups para cada formulario

  // Grupo para lere reserva
  readReservaGroup = new FormGroup
    (
      {
        readReservaId: new FormControl(),
        readReservaCliente: new FormControl(),
        readReservaVehiculo: new FormControl(),
        readReservaFechaInicio: new FormControl(),
        readReservaFechaFinaliza: new FormControl(),
        readReservaEstado: new FormControl(),
        readReservaEstadoEntregado: new FormControl(),
        readReservaEstadoRecibido: new FormControl(),
        readReservaCosto: new FormControl()
      }
    );


  //Grupo para crear reservas
  insertReservaGroup = new FormGroup
    (
      {
        insertReservaId: new FormControl(),
        insertReservaCliente: new FormControl(),
        insertReservaVehiculo: new FormControl(),
        insertReservaFechaInicio: new FormControl(),
        insertReservaFechaFinaliza: new FormControl(),
        insertReservaEstado: new FormControl(),
        insertReservaEstadoEntregado: new FormControl(),
        insertReservaEstadoRecibido: new FormControl(),
        insertReservaCosto: new FormControl()
      }
    );

  //Grupo para editar reservas
  updateReservaGroup = new FormGroup
    (
      {
        updateReservaId: new FormControl(),
        updateReservaCliente: new FormControl(),
        updateReservaVehiculo: new FormControl(),
        updateReservaFechaInicio: new FormControl(),
        updateReservaFechaFinaliza: new FormControl(),
        updateReservaEstado: new FormControl(),
        updateReservaEstadoEntregado: new FormControl(),
        updateReservaEstadoRecibido: new FormControl(),
        updateReservaCosto: new FormControl()
      }
    );

  //***************************************************************************
  // Definición de métodos

  // Cargar datos del backend
  public loadData() {
    this.asyncReady = false;
    forkJoin([
      // Traer todas las reservas
      this.servi.getReservas(),
      // Traer todas las personas
      this.personaServi.getPersonas(),
      // Traer todas los vehículos
      this.vehiculoServi.getVehiculos(),
      // Traer cosas del catálogo
      // Estado de reserva
      this.universalServi.getUniversalTipo('/11')

    ]).subscribe(([reservas, personas, vehiculos, estados]) => {
      this.reservas = reservas as any[];
      this.reservasShow = reservas as any[];
      this.personas = personas as any[];
      this.vehiculos = vehiculos as any[];
      this.reservaTiposEstado = estados as any[];

    },
      error => { console.log(error) },
      () => {
        this.asyncReady = true;
        this.reservasShow.forEach((element: any) => {
          element.cliente_reserva = this.personas.find((x: any) => x.doc_persona == element.cliente_reserva)
          element.cliente_reserva = element.cliente_reserva?.nombre1_persona
            + " " + (element.cliente_reserva?.nombre2_persona ? element.cliente_reserva?.nombre2_persona : "")
            + " " + element.cliente_reserva?.apellido1_persona
            + " " + (element.cliente_reserva?.apellido2_persona ? element.cliente_reserva?.apellido2_persona : "")
        });
      }
    );
  }


  // Mostrar reserva seleccionada
  getById() {
    this.servi.getReserva(this.readReservaGroup.getRawValue()['readReservaId']).subscribe((data: []) => {
      this.reservaSearched = data;

      let personaTemp = this.personas.find((item: any) => item.doc_persona == this.reservaSearched[0].cliente_reserva)
      personaTemp = personaTemp?.nombre1_persona
        + " " + (personaTemp?.nombre2_persona ? personaTemp?.nombre2_persona : "")
        + " " + personaTemp?.apellido1_persona
        + " " + (personaTemp?.apellido2_persona ? personaTemp?.apellido2_persona : "")

      // Preparar datos para cargar en el formulario
      let forupd = {
        readReservaId: this.reservaSearched[0].id_reserva,
        readReservaCliente: personaTemp,
        readReservaVehiculo: this.reservaSearched[0].vehiculo_reserva,
        readReservaFechaInicio: this.reservaSearched[0].fecha_inicio_reserva,
        readReservaFechaFinaliza: this.reservaSearched[0].fecha_finaliza_reserva,
        readReservaEstado: this.reservaSearched[0].estado_reserva,
        readReservaEstadoEntregado: this.reservaSearched[0].estado_entregado_reserva,
        readReservaEstadoRecibido: this.reservaSearched[0].estado_recibido_reserva,
        readReservaCosto: this.reservaSearched[0].costo_reserva
      }
      this.readReservaGroup.patchValue(forupd);
      console.log(this.readReservaGroup)
    });
  }


  // Buscar reserva por id para actualizar
  public getForUpdate() {
    let idSearch = this.updateReservaGroup.getRawValue()['updateReservaId'];

    // Llamar al servicio
    this.reservaFound = this.servi.getReserva(idSearch).subscribe((data: []) => {
      this.reservaFound = data;

      // Quitarle milisegundos a las fechas
      this.reservaFound[0].fecha_inicio_reserva = this.reservaFound[0].fecha_inicio_reserva.split('.')[0]
      this.reservaFound[0].fecha_finaliza_reserva = this.reservaFound[0].fecha_finaliza_reserva.split('.')[0]


      // Preparar datos para cargar en el formulario
      let forupd = {
        updateReservaId: this.reservaFound[0].id_reserva,
        updateReservaCliente: this.personas.find((x: any) => x.doc_persona == this.reservaFound[0].cliente_reserva).id_persona,
        updateReservaVehiculo: this.vehiculos.find((x: any) => x.placa_vehiculo == this.reservaFound[0].vehiculo_reserva).id_vehiculo,
        updateReservaFechaInicio: this.reservaFound[0].fecha_inicio_reserva,
        updateReservaFechaFinaliza: this.reservaFound[0].fecha_finaliza_reserva,
        updateReservaEstado: this.reservaTiposEstado.find((x: any) => x.denominacion_catalogo == this.reservaFound[0].estado_reserva).id_catalogo,
        updateReservaEstadoEntregado: this.reservaFound[0].estado_entregado_reserva,
        updateReservaEstadoRecibido: this.reservaFound[0].estado_recibido_reserva,
        updateReservaCosto: this.reservaFound[0].costo_reserva
      }
      this.updateReservaGroup.patchValue(forupd);
      console.log(this.updateReservaGroup)
    });



  }

  // Insertar un nuevo catálogo
  public insertReserva() {

    // Traer fecha ingresada en el formulario (datetime-local) y restarle 5 horas
    let fechaInicio = new Date(this.insertReservaGroup.getRawValue()['insertReservaFechaInicio'] + 'Z')
    let fechaFinaliza = new Date(this.insertReservaGroup.getRawValue()['insertReservaFechaFinaliza'] + 'Z')

    const fechaInicioYa = new Date(fechaInicio).setHours(fechaInicio.getHours() - 5)
    const fechaFinalizaYa = new Date(fechaFinaliza).setHours(fechaFinaliza.getHours() - 5)

    const fechaInicioYa2 = new Date(fechaInicioYa).toISOString().split('.')[0]
    const fechaFinalizaYa2 = new Date(fechaFinalizaYa).toISOString().split('.')[0]

    //JSON armado
    var body = {
      "cliente_reserva": this.insertReservaGroup.getRawValue()['insertReservaCliente'],
      "vehiculo_reserva": this.insertReservaGroup.getRawValue()['insertReservaVehiculo'],
      "fecha_inicio_reserva": fechaInicioYa2,
      "fecha_finaliza_reserva": fechaFinalizaYa2,
      "estado_reserva": this.insertReservaGroup.getRawValue()['insertReservaEstado'],
      "estado_entregado_reserva": this.insertReservaGroup.getRawValue()['insertReservaEstadoEntregado'],
      "estado_recibido_reserva": this.insertReservaGroup.getRawValue()['insertReservaEstadoRecibido'],
      "costo_reserva": this.insertReservaGroup.getRawValue()['insertReservaCosto']
    };

    //se consume el servicio
    this.servi.insertReserva(body).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    //this.LimpiarFormulario();
    this.insertReservaGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // Actualizar un catálogo
  public updateReserva() {


    // Traer fecha ingresada en el formulario (datetime-local) y restarle 5 horas
    let fechaInicio = new Date(this.updateReservaGroup.getRawValue()['updateReservaFechaInicio'] + 'Z')
    let fechaFinaliza = new Date(this.updateReservaGroup.getRawValue()['updateReservaFechaFinaliza'] + 'Z')

    const fechaInicioYa = new Date(fechaInicio).setHours(fechaInicio.getHours() - 5)
    const fechaFinalizaYa = new Date(fechaFinaliza).setHours(fechaFinaliza.getHours() - 5)

    const fechaInicioYa2 = new Date(fechaInicioYa).toISOString().split('.')[0]
    const fechaFinalizaYa2 = new Date(fechaFinalizaYa).toISOString().split('.')[0]

    //JSON armado
    var cadena = {
      "id_reserva": this.updateReservaGroup.getRawValue()['updateReservaId'],
      "cliente_reserva": this.updateReservaGroup.getRawValue()['updateReservaCliente'],
      "vehiculo_reserva": this.updateReservaGroup.getRawValue()['updateReservaVehiculo'],
      "fecha_inicio_reserva": fechaInicioYa2,
      "fecha_finaliza_reserva": fechaFinalizaYa2,
      "estado_reserva": this.updateReservaGroup.getRawValue()['updateReservaEstado'],
      "estado_entregado_reserva": this.updateReservaGroup.getRawValue()['updateReservaEstadoEntregado'],
      "estado_recibido_reserva": this.updateReservaGroup.getRawValue()['updateReservaEstadoRecibido'],
      "costo_reserva": this.updateReservaGroup.getRawValue()['updateReservaCosto']
    };

    //se consume el servicio
    this.servi.updateReserva(cadena).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })

    this.updateReservaGroup.reset();
    // Cargr datos de nuevo
    this.loadData()
  }


  // OnInit. Acciones apenas inicia la página
  ngOnInit(): void {

    // Cargar datos del backend al abrir la página
    this.loadData()

    this.readReservaGroup = this.formBuilder.group({
      readReservaId: [],
      readReservaCliente: [],
      readReservaVehiculo: [],
      readReservaFechaInicio: [],
      readReservaFechaFinaliza: [],
      readReservaEstado: [],
      readReservaEstadoEntregado: [],
      readReservaEstadoRecibido: [],
      readReservaCosto: []

    });

    this.insertReservaGroup = this.formBuilder.group({
      insertReservaId: [],
      insertReservaCliente: [],
      insertReservaVehiculo: [],
      insertReservaFechaInicio: [],
      insertReservaFechaFinaliza: [],
      insertReservaEstado: [],
      insertReservaEstadoEntregado: [],
      insertReservaEstadoRecibido: [],
      insertReservaCosto: []
    });

    this.updateReservaGroup = this.formBuilder.group({
      updateReservaId: [],
      updateReservaCliente: [],
      updateReservaVehiculo: [],
      updateReservaFechaInicio: [],
      updateReservaFechaFinaliza: [],
      updateReservaEstado: [],
      updateReservaEstadoEntregado: [],
      updateReservaEstadoRecibido: [],
      updateReservaCosto: []
    });

  }
}
