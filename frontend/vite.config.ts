/* eslint-disable import/no-extraneous-dependencies, sort-keys-fix/sort-keys-fix */
import importMetaEnv from '@import-meta-env/unplugin'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'
import svgr from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(
  // @see https://vite.dev/config/#using-environment-variables-in-config

  {
    build: {
      minify: true,
      outDir: './build',
      sourcemap: true,
      rollupOptions: {
        treeshake: true,
        input: {
          index: './index.html'
        },
        output: {
          manualChunks: {
            'monitor-ui': ['@mtes-mct/monitor-ui']
          }
        }
      },
      target: 'esnext'
    },

    plugins: [
      react(),
      viteTsconfigPaths(),
      svgr(),
      visualizer({
        emitFile: true,
        filename: 'bundle_size.html'
      }) as PluginOption,
      importMetaEnv.vite({
        env: './.env',
        example: './.env.frontend.example'
      })
    ],

    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8880'
        },
        '/bff': {
          target: 'http://localhost:8880'
        }
      }
    }
  }
)
