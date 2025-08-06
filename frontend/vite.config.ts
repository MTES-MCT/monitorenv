/* eslint-disable import/no-extraneous-dependencies, sort-keys-fix/sort-keys-fix */
import importMetaEnv from '@import-meta-env/unplugin'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  // @see https://vite.dev/config/#using-environment-variables-in-config
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      outDir: './build',
      sourcemap: true
    },

    plugins: [
      react(),
      viteTsconfigPaths(),
      svgr(),
      importMetaEnv.vite({
        env: './.env',
        example: './.env.frontend.example'
      }),
      sentryVitePlugin({
        org: 'betagouv',
        project: 'monitorenv',
        url: 'https://sentry.incubateur.net/',
        authToken: env.FRONTEND_SENTRY_AUTH_TOKEN
      })
    ],

    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8880'
        },
        '/bff': {
          target: 'http://localhost:8880'
        },
        '/logout': {
          target: 'http://localhost:8880'
        },
        '/oauth2': {
          target: 'http://localhost:8880'
        },
        '/proxy': {
          target: 'http://localhost:8880'
        },
        '/realms': {
          target: 'http://localhost:8085'
        },
        '/resources': {
          target: 'http://localhost:8085'
        }
      }
    }
  }
})
