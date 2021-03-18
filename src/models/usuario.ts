import Endereco from "./endereco";

export default interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  pis: string;
  endereco: Endereco;
}