<template>
  <div>
    <p>{{ msg }}</p>
    <Login v-if="!usuario.id" @signin="signin" />
    <Perfil v-if="usuario.id" @logout="logout" />
  </div>
</template>

<script lang="ts">
import Usuario from "@/models/usuario";
import { Component, Prop, Vue } from "vue-property-decorator";
import Login from "./Login.vue";
import Perfil from "./Perfil.vue";
import { getCookie } from "../utils/cookie";
import { parseJwt } from "../utils/jwt";

@Component({
  components: {
    Login,
    Perfil
  }
})
export default class Home extends Vue {
  @Prop() grettings!: string;
  private usuario: Partial<Usuario> = {};

  get msg(): string {
    return `${this.grettings} ${this.usuario?.nome || "Visitante"}`;
  }

  mounted() {
    const session = getCookie("session");
    if (session) {
      const payload = parseJwt(session);
      this.usuario = {
        id: payload.id as number,
        nome: payload.username as string
      };
    }
  }

  signin(usuario: Usuario) {
    this.usuario = usuario;
  }

  logout() {
    this.usuario = {};
  }
}
</script>

<style scoped></style>
