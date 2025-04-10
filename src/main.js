import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";

import "bootstrap/dist/css/bootstrap.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@/assets/styles/fonts.css";
import "./assets/main.css";

window.bootstrap = bootstrap;

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueApexCharts);

app.mount("#app");
