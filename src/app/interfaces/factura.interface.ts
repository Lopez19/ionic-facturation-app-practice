export interface factura {
  id?: number;
  fecha?: string;
  cliente: string;
  imageUrl: string;
  description?: {
    id: number;
    descripcion: string;
    cantidad: number;
    precio: number;
  }[];
  estado?: string;
  observaciones?: string;
  total: number;
}
