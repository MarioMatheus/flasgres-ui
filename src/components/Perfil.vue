<template>
  <div>
    <button class="filled" @click="exibirCadastro = true">Editar dados</button>
    <br />
    <button class="unfilled top8" @click="logout">Sair</button>
    <UsuarioForm
      v-if="exibirCadastro"
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

  async atualizarUsuario(usuario: Usuario) {
    this.exibirCadastro = false;
    this.$loading = true;
    const res = await api.put<Usuario>(`/usuario/${this.usuario.id}`, usuario);
    this.$emit("atualizacao", res.data);
    this.$loading = false;
  }

  logout() {
    removeCookie("session");
    this.$emit("logout");
  }

  async deletarConta() {
    this.exibirCadastro = false;
    this.$loading = true;
    await api.delete<Usuario>(`/usuario/${this.usuario.id}`);
    this.logout();
    this.$loading = false;
  }
}
</script>

<style scoped>
.unfilled {
  color: red;
}
</style>
