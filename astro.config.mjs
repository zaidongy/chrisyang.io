import { defineConfig } from 'astro/config';
import 'dotenv/config';

const allowedHost = process.env.TAILSCALE_HOST;

export default defineConfig({
  output: 'static',
  server: {
    host: true,
    port: 4321,
  },
  vite: {
    server: {
      allowedHosts: allowedHost ? [allowedHost] : [],
      fs: {
        allow: ['..'],
      },
    },
  },
});