import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { SvgIconPlugin } from '@wry-smile/vite-plugin-svg-icon'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SvgIconPlugin(
      [
        {
          iconDirs: join(__dirname, './src/assets/icons/part1'),
          symbolId: 'icon-part1-[name]'
        },
        {
          iconDirs: join(__dirname, './src/assets/icons/part2'),
          symbolId: 'icon-part2-[name]'
        },
        {
          iconDirs: join(__dirname, './src/assets/icons/part3'),
          symbolId: 'icon-part3-[name]'
        },
        {
          iconDirs: join(__dirname, './src/assets/icons/with-style'),
          symbolId: 'icon-with-[name]',
          svgo: {
            plugins: [
              'inlineStyles',
              'minifyStyles',
              'cleanupIds',
              'convertStyleToAttrs',
              'removeStyleElement',
              {
                name: 'convertColors',
                params: {
                  currentColor: true,  
                },
              }
            ]
          }
        }
      ],
      join(__dirname, './svg-icon.d.ts')
    )
  ],
})
