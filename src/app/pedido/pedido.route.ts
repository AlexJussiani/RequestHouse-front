import { Routes, RouterModule } from '@angular/router';
import { PedidoAppComponent } from './pedido.app.component';
import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { EditarComponent } from './editar/editar.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {  },
];

const pedidoRouterConfig: Routes = [
  {
    path: '', component: PedidoAppComponent,
    children: [
      { path: 'listar-todos', component: ListaComponent },
      { path: 'adicionar-novo', component: NovoComponent },
      { path: 'editar/:id', component: EditarComponent,
        resolve: {
          //produto: ProdutoResolve
        }
      },
    ]
}
]

@NgModule({
  imports: [
      RouterModule.forChild(pedidoRouterConfig)
  ],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }

