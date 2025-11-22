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
                id: '/?source=pwa',
                categories: ['games', 'shopping', 'entertainment'],
                icons: [
                    {
                        src: 'logo-icon-pwa.png',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ],
                screenshots: [
                    {
                        src: '/Logos/logo final.png', // Caminho para uma imagem de screenshot
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'Tela Inicial da Toca do Cartucho'
                    }
                ],
                shortcuts: [
                    {
                        name: 'Meus Favoritos',
                        short_name: 'Favoritos',
                        description: 'Ver os produtos que você favoritou',
                        url: '/favoritos',
                        icons: [{ src: '/Logos/logo-icon.svg', sizes: '192x192' }]
                    },
                    {
                        name: 'Vender um Item',
                        short_name: 'Vender',
                        description: 'Criar um novo anúncio de venda ou troca',
                        url: '/criar-anuncio',
                        icons: [{ src: '/Logos/logo-icon.svg', sizes: '192x192' }]
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
        open: true,
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
