import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { Proxy } from "@domoinc/ryuu-proxy";
import manifest from "./public/manifest.json";
import tailwindcss from "@tailwindcss/vite";

const config = { manifest };
const proxy = new Proxy(config);

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://127.0.0.1:6000",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "ryuu-proxy",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.status = function (code) {
            this.statusCode = code;
            return this;
          };
          res.send = function (body) {
            this.setHeader("Content-Type", "text/plain");
            this.end(body);
          };
          next();
        });
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith("/api")) {
            return next();
          }
          proxy.express()(req, res, next);
        });
      },
    },
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
