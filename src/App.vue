<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/flogo.png" />
    <Home grettings="Olá" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Home from "@/components/Home.vue";

@Component({
  components: {
    Home
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  min-width: 100px;
  min-height: 15px;
  max-width: 250px;
  width: 90%;
  height: 4vh;
  border-radius: 0;
  margin: auto;
}

input {
  min-width: 100px;
  min-height: 15px;
  max-width: 300px;
  width: 80%;
  height: 4vh;
  border-radius: 0;
  margin: auto;
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

.top20 {
  margin-top: 20px;
}

.filled {
  background-color: #41b883;
  color: white;
}

.filled:disabled {
  background-color: #41b88394;
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
