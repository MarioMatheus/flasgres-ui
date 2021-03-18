<template>
  <div>
    <button class="filled">Editar dados</button>
    <br />
    <button class="unfilled top8" @click="logout">Sair</button>
  </div>
</template>

<script>
import { removeCookie } from "@/utils/cookie";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Profile extends Vue {
  logout() {
    removeCookie("session");
    this.$emit("logout");
  }
}
</script>

<style scoped>
.unfilled {
  color: red;
}
</style>
