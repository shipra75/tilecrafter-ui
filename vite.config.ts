import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [{
    name: "health-check-plugin",
    configureServer(server) {
      server.middlewares.use("/health_check", (req, res) => {
        const healthData = {
          uptime: process.uptime(),
          message: "OK",
          timestamp: Date.now(),
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(healthData));
      });
    },
  },react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

