import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoViews } from '../models/PedidoViews';
import { Observable, fromEvent, merge } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from '../services/pedido.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
})
export class EditarComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  errors: any[] = [];
  pedidoForm: FormGroup;
  produtosForm: FormGroup;
  produtos = new Array();
  displayMessage: DisplayMessage = {};
  valorTotal :number = 0

  pedido: PedidoViews = new PedidoViews();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    ) {
    this.pedido = this.route.snapshot.data['pedido'];
  }

  ngOnInit(): void {

    this.pedidoForm = this.fb.group({
      id: '',
      dataCadastro: ['', [Validators.required]],
      valorAcrescimo: [0],
      valorDesconto: [0],
      descricao: ['']
    })
    this.pedidoForm.addControl(
      'pedidoItems', new FormArray(this.createItems())
    )

    this.preencherForm();
    this.obterProdutos();
    this.sumValorTotal();;
  }

  ngAfterViewInit(): void {
    this.configuracaoBase();
  }

  configuracaoBase(){
    let controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

       merge(...controlBlurs).subscribe(() =>{
       this.somaValorTotal()
     });
    }
     preencherForm() {
      this.pedidoForm.patchValue({
        id: this.pedido.idPedido,
        dataCadastro: this.pedido.dataCadastro
         })
    }
    somaValorTotal(){
      this.pedido.pedidoItems.forEach(v => this.valorTotal = (v.quantidade * v.valorUnitario))
    }

    obterProdutos(){
      this.pedidoService.obterTodosProdutos()
      .subscribe({
        next: (produtos) => {this.produtos = produtos},
        error: (falha) => { this.processarFalha(falha) }
      })
    }

    editarPedido(){
       if(this.pedidoForm.valid && this.pedidoForm.valid){
         this.pedido = Object.assign({}, this.pedido, this.pedidoForm.value);
         console.log('teste pedido: ', this.pedido)
      //   this.pedido.pedidoItems.forEach(i => {
      //       this.pedidoService.removerItemPedido(this.pedido.idPedido, i.produtoId)
      //       .subscribe({
      //         next: (pedidos) => {this.adicionarItem(this.pedido.idPedido, i.produtoId, i.quantidade)},
      //         error: (falha) => {this.processarFalha(falha)}
      //       });
      //   });
        // this.pedido.pedidoItems.forEach(i => {
        //   this.pedidoService.adicionarItemPedido(this.pedido.idPedido, i.produtoId, i.quantidade)
        //   .subscribe({
        //     next: (pedidos) => {this.processarSucesso(pedidos)},
        //     error: (falha) => { this.processarFalha(falha) }
        //   });
    //  });
      }
    }

    adicionarItem(idPedido: string, idProduto: string, quantidade: number){
    this.spinner.show();
      this.pedidoService.adicionarItemPedido(idPedido, idProduto, quantidade)
      .subscribe({
        next: (pedidos) => {this.spinner.hide()},
        error: (falha) => { this.processarFalha(falha) }
      });
    }

    abrirModal(content){
      this.modalService.open(content);
      this.produtosForm = this.fb.group({
        produtos: this.buildProdutos()
      })
    }

    buildProdutos(){
      const values = this.produtos.map(v => new FormControl(false))
      return this.fb.array(values);
    }

    getItensControls() {
      return this.pedidoForm.get('pedidoItems') ? (<FormArray>this.pedidoForm.get('pedidoItems'))['controls'] : null;
    }
    atualizarItem(event, item){
      this.spinner.show();
      this.pedidoService.atualizarItemPedido(this.pedido.idPedido, item.value.produtoId, item.value.quantidade)
      .subscribe({
        next: (pedidos) => {this.spinner.hide()},
        error: (falha) => { this.processarFalha(falha) }
      });
      this.sumValorTotal();
    }
    sumValorTotal(){
      this.valorTotal = 0;
      this.pedidoForm.value.pedidoItems.forEach(v => this.valorTotal += (v.quantidade * v.valorUnitario))
    }

    RemoverItemLista(event, item){
      this.spinner.show();
      this.pedido = Object.assign({}, this.pedido, this.pedidoForm.value);
      this.pedido.pedidoItems = this.pedido.pedidoItems.filter(v => v.produtoId !== item.value.produtoId);
      this.loadControlsPedidoItems();
      this.sumValorTotal();
      this.pedidoService.removerItemPedido(this.pedido.idPedido, item.value.produtoId)
      .subscribe({
        next: (pedidos) => {this.spinner.hide()},
        error: (falha) => { this.processarFalha(falha) }
      });
    }



    loadControlsPedidoItems(){
      this.valorTotal = 0

      this.pedidoForm.removeControl('pedidoItems')
      this.pedidoForm.addControl(
        'pedidoItems', new FormArray(this.createItems())
      )
      this.pedido.pedidoItems.forEach(v => this.valorTotal += (v.quantidade * v.valorUnitario))

      //if(this.produtosForm.valid){
        this.modalService.dismissAll();
     // }

    }

    createItems(): FormGroup[]{
      const values = this.pedido.pedidoItems.map( v => this.fb.group({
        produtoId: [v.produtoId, Validators.required],
        produtoNome: [v.produtoNome, Validators.required],
        valorUnitario: [v.valorUnitario , Validators.required],
        quantidade: [v.quantidade, Validators.required]
      }))
      return values
    }

    onSubmit(){

      let valueSubmit = Object.assign({}, this.produtosForm.value)

      valueSubmit = Object.assign(valueSubmit, {
        produtos: valueSubmit.produtos
          .map((v, i) => v ? this.produtos[i] : null)
          .filter(v => v!= null)
      })
      let valortemp;
      for(var i = 0; i < valueSubmit.produtos.length; i++){
        valortemp = {
          'produtoId': valueSubmit.produtos[i].id,
          'produtoNome': valueSubmit.produtos[i].nome,
          'valorUnitario': valueSubmit.produtos[i].valor,
          'quantidade': 1
        }
        console.log('teste: ', valortemp)
          if(!this.pedido.pedidoItems.some(i => i.produtoId == valortemp.produtoId)){
            this.pedido.pedidoItems.push(valortemp);
            this.adicionarItem(this.pedido.idPedido, valortemp.produtoId, valortemp.quantidade);
          }
      }
      this.loadControlsPedidoItems()
    }

    getProdutosControls() {
      return this.produtosForm.get('produtos') ? (<FormArray>this.produtosForm.get('produtos'))['controls'] : null;
    }

    processarSucesso(response: any) {
      this.pedidoForm.reset();
      this.errors = [];
      let toast = this.toastr.success('Pedido atualizado com sucesso!', 'Sucesso!');
      if (toast) {
        toast.onHidden.subscribe(() => {
          this.router.navigate(['/pedidos/listar-todos']);
        });
      }
    }

    processarFalha(fail: any) {
      this.spinner.hide()
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
