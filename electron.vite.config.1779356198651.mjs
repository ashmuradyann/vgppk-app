// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "F:\\Projects\\vgppkapp";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    // РАЗРЕШАЕМ ДОСТУП К КОРНЕВОМУ SRC
    server: {
      fs: {
        allow: [
          resolve(__electron_vite_injected_dirname, "src/renderer"),
          // стандарт
          resolve(__electron_vite_injected_dirname, "src/store")
          // разрешаем твой стор
        ]
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve(__electron_vite_injected_dirname, "src/renderer/src"),
        "@store": resolve(__electron_vite_injected_dirname, "src/store")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
