import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  security: {
    // Careers CV upload uses multipart FormData from the same site.
    checkOrigin: false,
  },
  server: {
    host: true,
    port: 4321,
  },
});
