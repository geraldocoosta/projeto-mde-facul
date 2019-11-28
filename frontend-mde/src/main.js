import "@babel/polyfill";
import "mutationobserver-shim";
import "./plugins/bootstrap-vue";
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import router from "./router/router";

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue({});

Vue.use(VueRouter);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
