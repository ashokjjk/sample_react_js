# # Docker Image which is used as foundation to create
# # a custom Docker Image with this Dockerfile
# FROM node:10-alpine
 
# # A directory within the virtualized Docker environment
# # Becomes more relevant when using Docker Compose later
# WORKDIR /usr/src/app
 
# # Copies package.json and package-lock.json to Docker environment
# COPY package*.json ./
 
# # Installs all node packages
# RUN npm install
 
# # Copies everything over to Docker environment
# COPY . .
 
# # Uses port which is used by the actual application
# EXPOSE 3001

# ENV REACT_APP_BACK_API=http://localhost:3000/api
 
# # Finally runs the application
# CMD [ "npm", "start" ]


# build environment
# FROM node:13.12.0-alpine as build
# WORKDIR /app
# ENV REACT_APP_BACK_API=http://localhost:3000/api
# COPY package.json ./
# RUN npm ci --silent
# RUN npm install react-scripts@3.4.1 -g --silent
# COPY . ./
# RUN npm run build

# # production environment
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# # new
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 3001
# CMD ["nginx", "-g", "daemon off;"]

# build environment
# FROM node:13.12.0-alpine as build
# WORKDIR /app
# ENV REACT_APP_BACK_API=''
# COPY . .
# RUN yarn
# RUN yarn build
# # production environment
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# stage 1
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV REACT_APP_BACK_API=''
COPY . /app
RUN yarn
RUN yarn build
# RUN npm ci --loglevel verbose
# RUN npm run build

# # stage 2
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]