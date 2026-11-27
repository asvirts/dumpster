import tailwindcss from '@tailwindcss/vite';
import { voidVue } from '@void/vue/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';

export default defineConfig({
  // Share local D1 state with `wrangler d1 … --local` (migrations, seeds).
  plugins: [voidPlugin({ persistTo: '.wrangler/state' }), voidVue(), tailwindcss()],
  server: { port: 4321, strictPort: true },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
