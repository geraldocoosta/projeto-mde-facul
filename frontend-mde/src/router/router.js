import Router from "vue-router";

import Home from "../views/Home.vue";
import CompararMensuracoes from "../views/CompararMensuracoes.vue";

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "",
      name: "home",
      component: Home
    },
    {
      path: "comparar",
      name: "comparar",
      component: CompararMensuracoes
    },
    {
      path: "*",
      redirect: {
        name: "home"
      }
    }
  ]
});

export default router;
