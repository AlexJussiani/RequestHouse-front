import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/services/base.service";
import { PedidoViews } from "../models/PedidoViews";
import { Observable, catchError, map } from "rxjs";
import { Cliente } from "../models/Cliente";
import { Produto } from "src/app/produto/models/produtos";

@Injectable()
export class PedidoService extends BaseService {

  constructor(private http: HttpClient) { super()
  }

  adicionarPedido(idCliente: string): Observable<PedidoViews>{
    return this.http
    .post(this.UrlServiceGatewayV1+ `api/adicionar-pedido?idCliente=${idCliente}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    );
  }

  adicionarItemPedido(idPedido: string, idProduto, quantidade: number): Observable<PedidoViews>{
    return this.http
    .post(this.UrlServiceGatewayV1+ `api/adicionar-item-pedido?idPedido=${idPedido}&idProduto=${idProduto}&quantidade=${quantidade}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    );
  }

  atualizarItemPedido(idPedido: string, idProduto: string, quantidade: number): Observable<PedidoViews>{
    return this.http
    .put(this.UrlServicePedidoV1+ `pedidoItem?pedidoId=${idPedido}&produtoId=${idProduto}&quantidade=${quantidade}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    );
  }

  atualizarPedido(pedido: PedidoViews): Observable<PedidoViews>{
    return this.http
    .put(this.UrlServicePedidoV1, pedido, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    );
  }

  removerItemPedido(idPedido: string, produtoId: string): Observable<PedidoViews>{
    return this.http
    .delete(this.UrlServicePedidoV1+ `pedidoItem?pedidoId=${idPedido}&produtoId=${produtoId}`, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    );
  }

  obterPorId(id: string): Observable<PedidoViews>{
    return   this.http
         .get<PedidoViews>(`${this.UrlServiceGatewayV1}obter-Pedido-PorId?pedidoId=`+ id, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterTodos(): Observable<PedidoViews[]>{
    return  this.http
         .get<PedidoViews[]>(`${this.UrlServiceGatewayV1}lista-pedidos`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterTodosNaoConcluidos(): Observable<PedidoViews[]>{
    return  this.http
         .get<PedidoViews[]>(`${this.UrlServiceGatewayV1}lista-pedidos-nao-concluido`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  obterTodosConcluidos(): Observable<PedidoViews[]>{
    return  this.http
         .get<PedidoViews[]>(`${this.UrlServiceGatewayV1}lista-pedidos-concluido`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

  emitirPedido(id: string): Observable<PedidoViews>{
    return this.http
    .put(`${this.UrlServicePedidoV1}emitir-pedido/${id}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    )
  }

  autorizarPedido(id: string): Observable<PedidoViews>{
    return this.http
    .put(`${this.UrlServicePedidoV1}autorizar-pedido/${id}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    )
  }

  despacharPedido(id: string): Observable<PedidoViews>{
    return this.http
    .put(`${this.UrlServicePedidoV1}despachar-pedido/${id}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    )
  }

  entregarPedido(id: string): Observable<PedidoViews>{
    return this.http
    .put(`${this.UrlServicePedidoV1}entregar-pedido/${id}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    )
  }

  cancelarPedido(id: string): Observable<PedidoViews>{
    return this.http
    .put(`${this.UrlServicePedidoV1}cancelar-pedido/${id}`, null, super.ObterAuthHeaderJson())
    .pipe(
      map(super.extractData),
      catchError(super.serviceError)
    )
  }

  obterClientes(): Observable<Cliente[]> {
    return this.http
        .get<Cliente[]>(this.UrlServiceClientesV1 + "clientes", this.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
  }

  obterTodosProdutos(): Observable<Produto[]>{
    return  this.http
         .get<Produto[]>(`${this.UrlServiceProdutosV1}produtos`, this.ObterAuthHeaderJson())
        .pipe(
          map((obj) => obj),
          catchError(super.serviceError)
        );
  }

}
