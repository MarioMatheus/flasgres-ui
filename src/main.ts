import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import VLoading from "./utils/plugins/loading";

Vue.use(VLoading);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
