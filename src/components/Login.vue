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
    <button class="top8 unfilled" @click="cadastrar">Quero me cadastrar</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/utils/api";
import Usuario from "@/models/usuario";

@Component
export default class Login extends Vue {
  login = "";
  senha = "";
  loginError = "";
  senhaError = "";

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
    try {
      const res = await api.post<Usuario>("/auth/login", {
        login: this.login,
        senha: this.senha
      });
      this.$emit("signin", res.data);
    } catch (error) {
      if (!error.response) {
        this.senhaError = "Conexão não encontrada";
      } else {
        this.senhaError =
          error.response.data?.description ?? "Erro desconhecido";
      }
    }
  }

  cadastrar() {
    console.log(`Cadastrar`);
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
