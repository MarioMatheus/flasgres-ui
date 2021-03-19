<template>
  <div class="modal-backdrop" v-bind:style="styleObject">
    <div class="modal">
      <h5>Carregando...</h5>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Loading extends Vue {
  styleObject = {
    opacity: 0
  };

  timer: number | undefined;

  private readonly fadeSpeed = 20;

  fadeIn(callbackfn?: () => void) {
    let step = 0;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      step = step + 1;
      this.styleObject.opacity = 0.05 * step;
      if (step >= 20) {
        clearInterval(this.timer);
        this.timer = undefined;
        callbackfn?.call(this);
      }
    }, this.fadeSpeed);
  }

  fadeOut(callbackfn?: () => void) {
    let step = 20;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      step = step - 1;
      this.styleObject.opacity = 0.05 * step;
      if (step <= 0) {
        clearInterval(this.timer);
        this.timer = undefined;
        callbackfn?.call(this);
      }
    }, this.fadeSpeed);
  }
}
</script>

<style scope>
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
</style>
