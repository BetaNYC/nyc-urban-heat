import { defineConfig } from 'vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/nyc-urban-heat",
  plugins: [
    react({
      babel: {
        plugins: [
          ['module:@preact/signals-react-transform']
        ]
      }
    }),
    viteCommonjs()
  ],
})