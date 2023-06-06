import { Component, OnInit } from '@angular/core';
import { PedidoViews } from '../models/PedidoViews';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PedidoService } from '../services/pedido.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  errors: any[] = [];
  public pedidos: PedidoViews[];
  constructor(
    private pedidoService: PedidoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
   this.obterTodos();
  }

  obterTodos(){
    this.spinner.show();
    this.pedidoService.obterTodosNaoConcluidos()
      .subscribe({
        next: (pedidos) => {this.pedidos = pedidos, this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
  }

  obterTodosNaoConcluidos(){
    this.spinner.show();
    this.pedidoService.obterTodosNaoConcluidos()
      .subscribe({
        next: (pedidos) => {this.pedidos = pedidos, this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
  }

  obterTodosConcluidos(){
    this.spinner.show();
    this.pedidoService.obterTodosConcluidos()
      .subscribe({
        next: (pedidos) => {this.pedidos = pedidos, this.spinner.hide()},
        error: (falha) => {this.processarFalha(falha)},
        complete: () => {}
      });
  }

  processarFalha(fail: any) {
    this.spinner.hide()
    if(fail.status === 400)
      this.errors = fail.error.errors?.Mensagens;
    else
     this.errors = fail.error?.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(',{
      progressAnimation: 'increasing',
      progressBar: true
    });
  }

  onStatusId(id){
    if(id.value == 1){
      this.obterTodos();
    }
    if(id.value == 2){
      this.obterTodosNaoConcluidos();
    }
    if(id.value == 3){
      this.obterTodosConcluidos();
    }
  }

  EmitirPedido(idPedido: string){
    this.spinner.show();
    this.pedidoService.emitirPedido(idPedido)
    .subscribe({
      next: (pedidos) => {this.obterTodosNaoConcluidos()},
      error: (falha) => {this.processarFalha(falha)},
      complete: () => {}
    });
  }

  AutorizarPedido(idPedido: string){
    this.spinner.show();
    this.pedidoService.autorizarPedido(idPedido)
    .subscribe({
      next: (pedidos) => {this.obterTodosNaoConcluidos()},
      error: (falha) => {this.processarFalha(falha)},
      complete: () => {}
    });
  }

  despacharPedido(idPedido: string){
    this.spinner.show();
    this.pedidoService.despacharPedido(idPedido)
    .subscribe({
      next: (pedidos) => {this.obterTodosNaoConcluidos()},
      error: (falha) => {this.processarFalha(falha)},
      complete: () => {}
    });
  }

  entregarPedido(idPedido: string){
    this.spinner.show();
    this.pedidoService.entregarPedido(idPedido)
    .subscribe({
      next: (pedidos) => {this.obterTodosNaoConcluidos()},
      error: (falha) => {this.processarFalha(falha)},
      complete: () => {}
    });
  }

  cancelarPedido(idPedido: string){
    this.spinner.show();
    this.pedidoService.cancelarPedido(idPedido)
    .subscribe({
      next: (pedidos) => {this.obterTodosNaoConcluidos()},
      error: (falha) => {this.processarFalha(falha)},
      complete: () => {}
    });
  }

  AlterarStatusPedido(event, pedido){
    if(pedido.pedidoStatus == 1){
      this.EmitirPedido(pedido.idPedido);
    }
    if(pedido.pedidoStatus == 2){
      this.AutorizarPedido(pedido.idPedido)
    }
    if(pedido.pedidoStatus == 3){
      this.despacharPedido(pedido.idPedido)
    }
    if(pedido.pedidoStatus == 4){
      this.entregarPedido(pedido.idPedido)
    }
  }

}
