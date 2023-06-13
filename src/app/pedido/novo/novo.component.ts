import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../models/Cliente';
import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { PedidoService } from '../services/pedido.service';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

    errors: any[] = [];
    pedidoForm: FormGroup;
    clientes: Cliente[];
    idClienteSelected: string;
    displayMessage: DisplayMessage = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private pedidoService: PedidoService
    ) { }

  ngOnInit(): void {
    this.pedidoService.obterClientes()
      .subscribe(
        clientes => this.clientes = clientes);

        this.pedidoForm = this.fb.group({
          clienteId: ['', [Validators.required]],
        });
  }

  ngAfterViewInit(): void {
    this.configuracaoBase();

  }

  configuracaoBase(){
    let controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

       merge(...controlBlurs).subscribe(() =>{
     });
   }

  adicionarPedido(){
    this.idClienteSelected = Object.assign({}, this.idClienteSelected, this.pedidoForm.value);
    const jsonString = `{
      "clienteId": "5b03790a-520d-4303-b3ad-d8865b3c6c7c"
    }`;
    console.log(jsonString);
    console.log('meu: ', this.idClienteSelected['clienteId']);

    this.pedidoService.adicionarPedido(this.idClienteSelected['clienteId'])
      .subscribe({
        next: (sucesso) => {this.processarSucesso(sucesso)},
          error: (falha) => {this.processarFalha(falha)}
        });
  }
  processarSucesso(response: any) {
    this.pedidoForm.reset();
    this.errors = [];
    let toast = this.toastr.success('Conta cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/pedidos/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    if(fail.status === 400)
      this.errors = fail.error.errors.Mensagens;
    else
     this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(',{
      progressAnimation: 'increasing',
      progressBar: true
    });
  }

}
