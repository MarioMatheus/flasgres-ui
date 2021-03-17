import Endereco from "./endereco";

export default interface Usuario {
  id: bigint;
  nome: string;
  email: string;
  cpf: string;
  pis: string;
  endereco: Endereco;
}
