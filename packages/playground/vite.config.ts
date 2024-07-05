import { join } from 'path'
import { cwd } from 'process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SvgIconPlugin } from '@wry-smile/vite-plugin-svg-icon'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    SvgIconPlugin({
      dts: './types/svg-icon.d.ts',
      iconDirs: [
        join(cwd(), './src/assets/icons/test')
      ],
      // registerFormIconify: {
      //   'fa6-regular': ['circle-check', 'chess-bishop', 'file-video']
      // }
    })
  ],
})
