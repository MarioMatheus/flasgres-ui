import { PluginObject } from "vue/types/umd";
import Loading from "./Loading.vue";

declare module "vue/types/vue" {
  interface Vue {
    $loading: boolean;
  }
}

const VLoading: PluginObject<void> = {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, "_$loading", {
      value: false,
      writable: true
    });
    Object.defineProperty(Vue.prototype, "_$loadingComponent", {
      value: new Loading().$mount(),
      writable: false
    });

    Object.defineProperty(Vue.prototype, "$loading", {
      get: function() {
        return this._$loading;
      },
      set: function(value: boolean) {
        if (!this.$loading && value === true) {
          this.$root.$el.appendChild(this._$loadingComponent.$el);
          this._$loadingComponent.fadeIn();
        }
        if (this.$loading && value === false) {
          this._$loadingComponent.fadeOut(() => {
            this.$root.$el.removeChild(this._$loadingComponent.$el);
          });
        }
        this._$loading = value;
      }
    });
  }
};

export default VLoading;
