import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8085/portal'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8060,
      proxy: {
        '/portal': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/portal/, '')
        }
      }
    },
    preview: {
      port: 8060
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            utilities: ['axios', 'dayjs', '@lucide/vue']
          }
        }
      }
    }
  }
})
