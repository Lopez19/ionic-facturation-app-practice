export interface Usuario {
  idUsuario?: string;
  DNI: number;
  nombre: string;
  apellido: string;
  username: string;
  password?: string;
  email: string;
  rolId: string;
}
