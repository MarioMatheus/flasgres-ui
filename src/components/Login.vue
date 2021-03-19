<template>
  <div>
    <input type="text" v-model="login" placeholder="Email, CPF ou PIS" />
    <p class="p-error">{{ loginError }}</p>
    <input
      type="password"
      v-model="senha"
      placeholder="Senha"
      autocomplete="on"
    />
    <p class="p-error">{{ senhaError }}</p>
    <button class="top8 filled" @click="entrar">Entrar</button>
    <br />
    <button class="top8 unfilled" @click="exibirCadastro = true">
      Quero me cadastrar
    </button>
    <UsuarioForm
      v-if="exibirCadastro"
      habilitarSenha
      salvarButtonText="Cadastrar"
      @salvar="cadastrarUsuario"
      @cancelar="exibirCadastro = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/utils/api";
import Usuario from "@/models/usuario";
import UsuarioForm from "./UsuarioForm.vue";

@Component({
  components: { UsuarioForm }
})
export default class Login extends Vue {
  login = "";
  senha = "";
  loginError = "";
  senhaError = "";

  exibirCadastro = false;

  validarFormulario() {
    this.loginError = "";
    this.senhaError = "";
    let valid = true;
    if (
      !this.login.match(/.+@[A-Za-z]+\.[A-Za-z]+/) &&
      !this.login.match(/[0-9]{11}/)
    ) {
      valid = false;
      this.loginError =
        "O campo de login deve possui um email válido ou apenas os números do CPF ou PIS";
    }

    if (this.senha.length < 3) {
      valid = false;
      this.senhaError = "Senha deve conter no mínimo 3 caracteres";
    }

    return valid;
  }

  async entrar() {
    if (!this.validarFormulario()) {
      return;
    }
    this.$loading = true;
    try {
      const res = await api.post<Usuario>("/auth/login", {
        login: this.login,
        senha: this.senha
      });
      this.$emit("signin", res.data);
      this.$loading = false;
    } catch (error) {
      if (!error.response) {
        this.senhaError = "Conexão não encontrada";
      } else {
        this.senhaError =
          error.response.data?.description ?? "Erro desconhecido";
      }
      this.$loading = false;
    }
  }

  async cadastrarUsuario(usuario: Usuario) {
    this.exibirCadastro = false;
    this.$loading = true;
    try {
      const res = await api.post<Usuario>("/usuario", usuario);
      this.$emit("registro", res.data);
      this.$loading = false;
    } catch (error) {
      this.senhaError = "Erro ao registrar novo usuário";
      this.$loading = false;
    }
  }
}
</script>

<style scoped>
input {
  min-width: 200px;
  min-height: 20px;
  border-radius: 6px;
}
</style>
