import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { PedidoViews } from "../models/PedidoViews";
import { Injectable } from "@angular/core";
import { PedidoService } from "./pedido.service";

@Injectable()
export class PedidoResolve implements Resolve<PedidoViews> {

  constructor(private pedidoService: PedidoService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.pedidoService.obterPorId(route.params['id']);
    }
  }
