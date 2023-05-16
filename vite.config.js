import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        server: {
            hmr: {
                host: process.env.VITE_HOST ?? '127.0.0.1',
            },
            watch: {
                ignored: [
                    '**/storage/**',
                ],
            },

        },
        plugins: [
            laravel({
                input: ['resources/js/app.jsx'],
                refresh: true,
            }),
            react(),
        ],
    });
}