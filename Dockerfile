FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p dist/public && cp -r public/* dist/public/
RUN npx tsc src/utils/utils.ts --outDir dist/utils
RUN npx browserify dist/utils/utils.js -o public/js/utils.bundle.js
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]