import { createApp } from "vue";
import App from "./App.vue";
import { Adminlab, defineConfig } from "adminlab";
import "adminlab/dist/adminlab.css";

const app = createApp(App);
app.use(Adminlab, defineConfig({
  // 填写一个你正在使用或想要使用的UI框架名称
  framework: "quasar",  // *必填
}));

app.mount("#app");
