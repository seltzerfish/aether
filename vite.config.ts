import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      ignoredRouteFiles: ['**/*.css'],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    strictPort: true,
    port: process.env.PORT != null ? parseInt(process.env.PORT) : 3000,
  },
  define: {
    // Fix for CommonJS modules
    global: 'globalThis',
    'process.env': {},
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  ssr: {
    // Don't try to SSR these problematic packages
    noExternal: ['@radix-ui/react-dialog', '@radix-ui/react-separator', 'framer-motion', 'next-themes'],
    // Exclude AI/ML packages from SSR
    external: ['@xenova/transformers', 'onnxruntime-web', '@tensorflow/tfjs-backend-wasm'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    // Exclude problematic packages from pre-bundling
    exclude: ['@xenova/transformers', 'onnxruntime-web', '@tensorflow/tfjs-backend-wasm'],
  },
});
