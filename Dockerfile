FROM --platform=linux/amd64 node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "dev:debug"]