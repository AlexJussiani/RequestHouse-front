export class PedidoViews {
  idPedido: string;
  clienteId: string;
  clienteNome: string;
  codigo:number;
  valorTotal: number;
  dataCadastro: Date;
  dataAutorizacao: Date;
  dataConclusao: Date;
  pedidoStatus: number;
  valorAcrescimo: number;
  valorDesconto: number;
  descricao: string;
  pedidoItems: ItemPedido[]
}

export class ItemPedido{
  idItem: string;
  produtoId: string;
  produtoNome: string;
  valorUnitario: number;
  quantidade: number;
}
