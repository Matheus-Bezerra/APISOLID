import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const viteTsconfigPaths = await import('vite-tsconfig-paths');
  return {
    plugins: [viteTsconfigPaths.default()],
  };
});