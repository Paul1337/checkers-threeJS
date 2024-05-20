cd server && yarn run build && pm2 start checkers-server;
cd client && npm run build && docker compose down && docker compose up -d --build;