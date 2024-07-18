import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./main.ts'],
  format: ['esm'],
  shims: true,
  dts: true,
})
