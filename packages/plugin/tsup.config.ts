import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./main.ts'],
  format: ['esm'],
  shims: true,
  clean: true,
  dts: true,
  ignoreWatch: ['node_modules', "dist",],
})
