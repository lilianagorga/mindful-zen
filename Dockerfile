FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install ts-node tsconfig-paths --save-dev
COPY . .
RUN npm run build
RUN NODE_ENV=production ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run
EXPOSE 3000
CMD ["node", "dist/main"]