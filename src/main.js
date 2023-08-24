import "./assets/global.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import axios from "axios";

const app = createApp(App);
app.use(ElementPlus);
app.config.globalProperties.$http = axios;
axios.defaults.baseURL = "http://localhost:9000";

app.use(router);

app.mount("#app");

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
