<template>
  <div>
    <input type="text" v-model="login" placeholder="Email, CPF ou PIS" />
    <p class="p-error">{{ loginError }}</p>
    <input
      class="top4"
      type="password"
      v-model="senha"
      placeholder="Senha"
      autocomplete="on"
    />
    <p class="p-error">{{ senhaError }}</p>
    <button class="top12 filled" @click="entrar">Entrar</button>
    <br />
    <button class="top8 unfilled" @click="cadastrar">Quero me cadastrar</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "../utils/api";
import Usuario from "../models/usuario";

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
      const usuario = await api.post<Usuario>("/auth/login", {
        login: this.login,
        senha: this.senha
      });
      this.$emit("signin", usuario.data.nome);
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

button {
  min-width: 100px;
  min-height: 15px;
  border-radius: 0;
}

.top4 {
  margin-top: 4px;
}

.top8 {
  margin-top: 8px;
}

.top12 {
  margin-top: 12px;
}

.filled {
  background-color: #41b883;
  color: white;
}

.unfilled {
  border: none;
  background-color: transparent;
  color: #41b883;
}

.p-error {
  color: red;
  font-size: 0.8em;
}
</style>
