FROM artifactory.corp.olacabs.com:5000/node:18

ENV PORT 8080

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm config set engine-strict false
RUN npm install --force

COPY . .

RUN npm run build

RUN echo 'OK' > /app/dist/health_check.html
RUN ln -s /app/dist/health_check.html /app/dist/health_check

EXPOSE 8080

CMD ["npm", "run", "start"]
