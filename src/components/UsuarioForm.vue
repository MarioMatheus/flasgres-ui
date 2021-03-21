<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="container">
        <div id="info" class="section">
          <h5>Dados do Usuário</h5>
          <div class="field">
            <label> Nome* </label>
            <input type="text" v-model="data.nome" />
          </div>
          <div class="field">
            <label> Email* </label>
            <input type="email" v-model="data.email" />
          </div>
          <div class="field">
            <label> CPF </label>
            <input type="number" v-model="data.cpf" />
          </div>
          <div class="field">
            <label> PIS </label>
            <input type="number" v-model="data.pis" />
          </div>
          <div class="field field-hidden">
            <label>Hidden</label>
            <input type="text" />
          </div>
          <div class="field" v-if="habilitarSenha">
            <label> Senha* </label>
            <input type="password" v-model="data.senha" />
          </div>
          <div class="field" v-if="habilitarSenha">
            <label> Confirmar Senha* </label>
            <input type="password" v-model="senhaValidada" />
          </div>
        </div>
        <div id="endereco" class="section">
          <h5>Endereço</h5>
          <div class="field">
            <label> CEP* </label>
            <input type="number" v-model="data.endereco.cep" />
          </div>
          <div class="field">
            <label> Logradouro* </label>
            <input type="text" v-model="data.endereco.rua" />
          </div>
          <div class="field">
            <label> Número* </label>
            <input type="number" v-model.number="data.endereco.numero" />
          </div>
          <div class="field">
            <label> Complemento </label>
            <input type="text" v-model="data.endereco.complemento" />
          </div>
          <div class="field">
            <label> Município* </label>
            <input type="text" v-model="data.endereco.municipio" />
          </div>
          <div class="field">
            <label> Estado* </label>
            <input type="text" v-model="data.endereco.estado" />
          </div>
          <div class="field">
            <label> País* </label>
            <input type="text" v-model="data.endereco.pais" />
          </div>
        </div>
      </div>
      <template v-if="showErrors">
        <div :key="erro" v-for="erro of errors">
          <label class="p-error">{{ erro }}</label>
        </div>
      </template>
      <button class="top12 filled" @click="salvar">
        {{ salvarButtonText || "Salvar" }}
      </button>
      <button class="top8 unfilled last" @click="$emit('cancelar')">
        Cancelar
      </button>
      <br />
      <button
        v-if="habilitarDelecao"
        class="top12 filled last btn-red"
        @click="$emit('deletar')"
      >
        Deletar Conta
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Usuario from "@/models/usuario";

@Component
export default class UsuarioForm extends Vue {
  @Prop() readonly usuario?: Usuario;
  @Prop() readonly salvarButtonText?: string;
  @Prop({ type: Boolean, default: false }) readonly habilitarSenha!: boolean;
  @Prop({ type: Boolean, default: false }) readonly habilitarDelecao!: boolean;

  showErrors = false;
  errors: string[] = [];

  private data!: Partial<Usuario>;
  private senhaValidada!: string;

  get formularioValido(): boolean {
    let valid = true;
    if (!this.data.email?.match(/.+@[A-Za-z]+\.[A-Za-z]+/)) {
      valid = false;
      this.errors.push("Email inserido não é válido");
    }

    if (this.data.cpf && !this.data.cpf?.match(/[0-9]{11}/)) {
      valid = false;
      this.errors.push("CPF inserido não é válido");
    }

    if (this.data.pis && !this.data.pis?.match(/[0-9]{11}/)) {
      valid = false;
      this.errors.push("PIS inserido não é válido");
    }

    if (
      this.data.endereco?.cep &&
      !this.data.endereco?.cep?.match(/[0-9]{8}/)
    ) {
      valid = false;
      this.errors.push("CEP inserido não é válido");
    }

    const existeCampoEnderecoVazio =
      (this.data?.endereco ?? {}) === {} ||
      Object.entries(this.data?.endereco ?? {})
        .filter(entry => entry[0] !== "complemento")
        .some(
          entry =>
            (typeof entry[1] === "string" && !entry[1]) ||
            (typeof entry[1] === "number" && entry[1] < 0)
        );

    if (existeCampoEnderecoVazio) {
      valid = false;
      this.errors.push(
        "Existe campos obrigatórios do endereço ainda não preenchidos"
      );
    }

    if (this.habilitarSenha) {
      if ((this.data.senha?.length ?? 0) < 3) {
        valid = false;
        this.errors.push("Senha deve conter no mínimo 3 caracteres");
      }
      if (this.data.senha !== this.senhaValidada) {
        valid = false;
        this.errors.push("Confirmação de Senha inválida");
      }
    }

    return valid;
  }

  created() {
    this.senhaValidada = "";
    if (this.usuario) {
      this.data = Object.assign(
        {},
        { ...this.usuario, endereco: { ...this.usuario.endereco } }
      );
    } else {
      this.data = {
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        pis: "",
        endereco: {
          pais: "",
          estado: "",
          municipio: "",
          cep: "",
          rua: "",
          numero: 0,
          complemento: ""
        }
      };
    }
  }

  salvar() {
    this.showErrors = false;
    this.errors = [];
    if (this.formularioValido) {
      this.$emit("salvar", this.data);
    } else {
      this.showErrors = true;
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.container {
  display: flex;
  flex-direction: row;
  /* justify-content: space-around; */
  overflow: auto;
}

@media (max-width: 800px) {
  .container {
    flex-direction: column;
    max-height: 400px;
  }
}

.container .section {
  margin: 12px;
}

.field {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.field input {
  min-width: 200px;
}

.field-hidden {
  color: transparent;
}

.field-hidden input {
  border-color: transparent;
}

.btn-red {
  background-color: red;
}
</style>
