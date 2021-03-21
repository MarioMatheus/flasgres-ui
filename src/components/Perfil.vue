<template>
  <div>
    <p class="p-error">{{ error }}</p>
    <button class="filled" @click="exibirCadastro = true">Editar dados</button>
    <br />
    <button class="unfilled top8" @click="logout">Sair</button>
    <UsuarioForm
      v-if="exibirCadastro"
      habilitarDelecao
      :usuario="usuario"
      @salvar="atualizarUsuario"
      @cancelar="exibirCadastro = false"
      @deletar="deletarConta"
    />
  </div>
</template>

<script lang="ts">
import Usuario from "@/models/usuario";
import api from "@/utils/api";
import { removeCookie } from "@/utils/cookie";
import { Component, Prop, Vue } from "vue-property-decorator";
import UsuarioForm from "./UsuarioForm.vue";

@Component({
  components: { UsuarioForm }
})
export default class Perfil extends Vue {
  @Prop() usuario!: Usuario;

  exibirCadastro = false;
  error = "";

  async atualizarUsuario(usuario: Usuario) {
    this.error = "";
    this.exibirCadastro = false;
    this.$loading = true;
    try {
      const res = await api.put<Usuario>(
        `/usuario/${this.usuario.id}`,
        usuario
      );
      this.$emit("atualizacao", res.data);
    } catch (error) {
      console.log(error);
      this.error = "Erro ao atualizar usuário";
    } finally {
      this.$loading = false;
    }
  }

  logout() {
    removeCookie("session");
    if (this.$oauth.isAuthenticated) {
      this.$loading = true;
      this.$oauth.logout();
    } else {
      this.$emit("logout");
    }
  }

  async deletarConta() {
    this.error = "";
    this.exibirCadastro = false;
    this.$loading = true;
    try {
      await api.delete<Usuario>(`/usuario/${this.usuario.id}`);
      this.logout();
    } catch (error) {
      console.log(error);
      this.error = "Erro ao deletar conta";
    } finally {
      this.$loading = false;
    }
  }
}
</script>

<style scoped>
.unfilled {
  color: red;
}
</style>
