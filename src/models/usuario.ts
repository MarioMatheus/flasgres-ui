import Endereco from "./endereco";

export default interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  pis: string;
  endereco: Endereco;
  oauth: boolean;
}
