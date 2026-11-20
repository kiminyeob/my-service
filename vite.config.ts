import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages(https://<user>.github.io/my-service/)에서는 하위 경로로 서비스되므로 빌드 시 base를 맞춥니다.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/my-service/' : '/',
  plugins: [react()],
}));
