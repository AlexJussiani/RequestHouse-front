import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/services/base.service";
import { PedidoViews } from "../models/PedidoViews";
import { Observable, catchError, map } from "rxjs";

@Injectable()
export class PedidoService extends BaseService {

  constructor(private http: HttpClient) { super()
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

}
