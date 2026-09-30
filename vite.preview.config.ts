// Builds a single self-contained HTML file (hash URLs) for sharing a preview link.
// Usage: VITE_HASH_ROUTER=true npx vite build --config vite.preview.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-preview' },
});
