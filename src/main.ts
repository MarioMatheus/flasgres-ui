import Vue from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import VLoading from "./utils/plugins/loading";
import { Auth0Plugin } from "./utils/plugins/oauth";
import { domain, clientId } from "../auth_config.json";

Vue.use(VLoading);
Vue.use(Auth0Plugin, {
  domain,
  clientId
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
