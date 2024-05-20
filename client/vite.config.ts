import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        // react({
        //     babel: {
        //         parserOpts: {
        //             plugins: ['decorators-legacy', 'classProperties'],
        //         },
        //     },
        // }),
    ],
    resolve: {
        alias: {
            '@shared': path.join(__dirname, '../shared'),
        },
    },
    preview: {
        port: 8010,
    },
});
