import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo-icon-pwa.png'],
            manifest: {
                name: 'Toca do Cartucho',
                short_name: 'Toca do Cartucho',
                description: 'Plataforma para compra, venda e troca de jogos retrô e colecionáveis',
                theme_color: '#2b2560',
                background_color: '#2b2560',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'logo-icon-pwa.png',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\./,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
                            }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});
