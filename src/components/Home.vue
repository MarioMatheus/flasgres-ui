<template>
  <div>
    <p>{{ msg }}</p>
    <Login v-if="!usuario.id" @signin="signin" @registro="signin" />
    <Perfil
      v-if="usuario.id"
      :usuario="usuario"
      @atualizacao="signin"
      @logout="logout"
    />
  </div>
</template>

<script lang="ts">
import Usuario from "@/models/usuario";
import { Component, Prop, Vue } from "vue-property-decorator";
import Login from "./Login.vue";
import Perfil from "./Perfil.vue";

@Component({
  components: {
    Login,
    Perfil
  }
})
export default class Home extends Vue {
  @Prop() grettings!: string;
  private usuario: Partial<Usuario> = {};
  private defaultName = "";

  get msg(): string {
    return `${this.grettings} ${this.usuario?.nome || this.defaultName}`;
  }

  mounted() {
    this.$oauth.addCallback(Home.name, isAuthenticated => {
      if (!isAuthenticated) {
        this.defaultName = "Visitante";
      }
    });
  }

  async signin(usuario: Usuario) {
    this.usuario = usuario;
  }

  logout() {
    this.usuario = {};
  }
}
</script>

<style scoped></style>
