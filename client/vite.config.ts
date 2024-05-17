import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@shared': path.join(__dirname, '../shared'),
        },
    },
    preview: {
        port: 8010,
    },
});
