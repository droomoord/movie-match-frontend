import Vue from "vue";

import App from "./App.vue";
import Landing from "./components/Landing/Landing";
import Cockpit from "./components/Cockpit/Cockpit";
import Friends from "./components/Friends/Friends";
import Settings from "./components/Settings/Settings";

import VueRouter from "vue-router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Vue2TouchEvents from "vue2-touch-events";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vue2TouchEvents, {
  swipeTolerance: 120,
  disableClick: true,
});

const routes = [
  { path: "/", component: Landing, name: "landing" },
  { path: "/rate", component: Cockpit, name: "cockpit" },
  { path: "/friends", component: Friends, name: "friends" },
  { path: "/settings", component: Settings, name: "settings" },
];

const router = new VueRouter({ routes });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
