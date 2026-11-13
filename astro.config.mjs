import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: "server",
  adapter: vercel(),
  security: {
    // Careers CV upload uses multipart FormData from the same site.
    checkOrigin: false,
  },
  server: {
    host: true,
    port: 4321,
  },
});
