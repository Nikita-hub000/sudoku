import { createApp } from "vue";

import App from "./App.vue";
import router from "./router/rout.js";
import store from '@/store/index.js'

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
