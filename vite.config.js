import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        // host: '0.0.0.0', // 允许局域网访问
        port: 5173,      // 可选：指定端口（默认是 5173）
    },
})