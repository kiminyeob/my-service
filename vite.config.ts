import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages(https://<user>.github.io/my-service/)에서는 하위 경로로 서비스되므로
// 빌드와 미리보기(npm run preview)에서 base를 맞춥니다. 개발 서버는 루트(/)를 그대로 씁니다.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/my-service/' : '/',
  plugins: [react()],
}));
