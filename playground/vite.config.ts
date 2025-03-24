import { join } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { SvgIconPlugin } from '@wry-smile/vite-plugin-svg-icon'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SvgIconPlugin(
      [
        {
          iconDirs: join(__dirname, './src/assets/icons/part1'),
          symbolId: 'icon-part1-[name]',
        },
        {
          iconDirs: join(__dirname, './src/assets/icons/part2'),
          symbolId: 'icon-part2-[name]',
        },
        {
          iconDirs: join(__dirname, './src/assets/icons/part3'),
          symbolId: 'icon-part3-[name]',
        },
        {
          iconDirs: join(__dirname, './src/assets/icons/with-style'),
          symbolId: 'icon-with-[name]',
          svgo: {
            plugins: [
              'preset-default',
              'inlineStyles',
              'convertStyleToAttrs',
              {
                name: 'removeAttrs',
                params: {
                  attrs: ['class', 'fill'],
                },
              },
              {
                name: 'addAttributesToSVGElement',
                params: {
                  attributes: [{ fill: 'currentColor' }],
                },
              },
              'removeStyleElement',
            ],
          },
        },
      ],
      join(__dirname, './svg-icon.d.ts'),
    ),
  ],
})
