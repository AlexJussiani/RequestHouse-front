import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PedidoRoutingModule } from './pedido.route';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { EditarComponent } from './editar/editar.component';
import { PedidoAppComponent } from './pedido.app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PedidoService } from './services/pedido.service';



@NgModule({
  declarations: [
    ListaComponent,
    PedidoAppComponent,
    NovoComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers:[
    PedidoService
  ]
})
export class PedidoModule { }
