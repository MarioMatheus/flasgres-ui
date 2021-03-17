<template>
  <div>
    <p>{{ msg }}</p>
    <Login v-if="!usuario" @signin="signin" />
  </div>
</template>

<script lang="ts">
import Usuario from "@/models/usuario";
import { Component, Prop, Vue } from "vue-property-decorator";
import Login from "./Login.vue";
import { getCookie } from "../utils/cookie";
import { parseJwt } from "../utils/jwt";

@Component({
  components: {
    Login
  }
})
export default class Home extends Vue {
  @Prop() grettings!: string;
  private usuario: Partial<Usuario> | null = null;

  get msg(): string {
    return `${this.grettings} ${this.usuario?.nome || "Visitante"}`;
  }

  mounted() {
    const session = getCookie("session");
    if (session) {
      const payload = parseJwt(session);
      this.usuario = { id: payload.id, nome: payload.username };
    }
  }

  signin(usuario: Usuario) {
    this.usuario = usuario;
  }
}
</script>

<style scoped></style>
