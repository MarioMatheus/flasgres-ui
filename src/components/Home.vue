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
import { getCookie } from "../utils/cookie";
import { parseJwt } from "../utils/jwt";
import api from "@/utils/api";

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

  async mounted() {
    const session = getCookie("session");
    if (session) {
      const payload = parseJwt(session);
      this.consultarUsuario(payload.id as number);
    }
  }

  async consultarUsuario(id: number) {
    const res = await api.get<Usuario>(`/usuario/${id}`);
    this.usuario = res.data;
  }

  signin(usuario: Usuario) {
    this.consultarUsuario(usuario.id);
  }

  logout() {
    this.usuario = {};
  }
}
</script>

<style scoped></style>
