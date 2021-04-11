import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import Play from "@/components/Play.vue";
import Home from "@/components/Home.vue";
import Character from "@/components/Character.vue";
import Scene from "@/components/Scene.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [{
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "play",
    path: "/:play",
    component: Play,
    props: (route) => ({ play: route.params.play })
  },
  {
    name: "character",
    path: "/:play/characters/:character",
    component: Character,
    props: (route) => ({ character: route.params.character })
  },
  {
    name: "scene",
    path: "/:play/:scene",
    component: Scene,
    props: (route) => ({ scene: route.params.scene })
  },
  ]
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
