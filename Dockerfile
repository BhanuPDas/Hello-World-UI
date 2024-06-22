# Stage 1: Build Hello World UI
FROM node:21 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test
RUN ls -l
RUN sed -i 's/%%API_URL%%/'"$(node -e 'console.log(process.env.API_URL)')"'/' index.html

#Stage 2: Deploy to Nginx server
FROM nginx:latest
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the application files from the build stage
COPY --from=build /usr/src/app/index.html /usr/share/nginx/html/
COPY --from=build /usr/src/app/server.js /usr/share/nginx/html/
COPY --from=build /usr/src/app/package.json /usr/share/nginx/html/
COPY --from=build /usr/src/app/package-lock.json /usr/share/nginx/html/

# Set the working directory
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]