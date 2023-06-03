export interface IFactura {
  idFactura?: string;
  encabezado: {
    Emisor: IEmisor;
    Receptor: IReceptor;
  };
  detalle: ICarrito[];
  totales: ITotales;
  estadoId: string;
  estado?: string;
}

export interface IEmisor {
  RUTEmisor: string;
  RznSocEmi: string;
}

export interface IReceptor {
  RUTRecep: string;
  RznSocRecep: string;
  DirRecep: string;
  CiudadRecep: string;
}

export interface ICarrito {
  NmbItem: number;
  DscItem: string;
  QtyItem: number;
  PrcItem: number;
  nombre?: string;
}

export interface ITotales {
  MntNeto: number;
  TasaIVA: string;
  IVA: number;
  MntTotal: number;
}

export interface IEstado {
  idEstado: string;
  nombre: string;
}
