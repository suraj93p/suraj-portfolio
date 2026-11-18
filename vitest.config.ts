import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
    clearMocks: true, restoreMocks: true,
    coverage: {
      provider: 'v8', reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.types.ts', 'src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/config/**'],
      thresholds: { statements: 80, lines: 80, functions: 80, branches: 75 }
    }
  }
});
