import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'ui/index': 'src/ui/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,           // gera .d.ts para cada entry
  sourcemap: true,
  clean: true,
  splitting: false,    // libs React costumam preferir sem splitting para CJS
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom'], // não bundlear peer deps
  outExtension: (ctx) => ({
    js: ctx.format === 'cjs' ? '.cjs' : '.mjs', // ✅ casa com package.json
  }),
})
