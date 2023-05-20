import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
/* export default defineConfig({

  server: {
    port: 4173,
    host: true
  },
  plugins: [react()],

}); */
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    define: {
      API_URL: JSON.stringify(process.env.VITE_BASE_URL),
      REPORTES_URL: JSON.stringify(process.env.VITE_BASE_URL_REPORTS),
    },
    server: {
      port: 4173,
      host: true
    },
    plugins: [react()],
  });
};
