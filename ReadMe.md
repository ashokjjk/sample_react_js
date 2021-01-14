## Simple 3-Tier microservice application
1. ReactJS
2. NodeJS
3. MongoDB

### Kubernetes Commands
a. Frontend with ReactJS as LoadBalancer service
b. Backend with NodeJS as NodePort service
c. Database with MongoDB as NodePort service
```
cd react-app-k8s-manifest
kubectl apply -f .\frontend-deploy.yaml -f .\backend-deploy.yaml -f .\mongo-deploy.yaml
```

### Docker Commands
1. Create a network on docker to isolate from other containers
2. Run the database container on the port 27017
3. Run the backend container on the port 3000 with the environment variable for database connection
4. Run the frontend container on the port 3001
```
docker network create react-stack
docker run --name mongo --network react-stack -d -p 27017:27017 mongo
docker run --network react-stack --name mongo-express -d -p 8081:8081 mongo-express
docker build -f Dockerfile -t react-frontend .
docker run --network react-stack --name frontend -d -p 3001:3001 react-frontend
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongo

# Change the mongo connection string and build it
# ENV MONGO_LOCAL_CONN_URL=mongodb://172.20.0.2:27017/test

docker build -f Dockerfile -t react-backend .
docker run --network react-stack --name backend -d -p 3000:3000 -e MONGO_LOCAL_CONN_URL=mongodb://mongo:27017/test react-backend
```

### Frontend - ENV
```
REACT_APP_BACK_API = http://localhost:3000/api
```
### Backend - ENV
```
MONGO_LOCAL_CONN_URL=mongodb://127.0.0.1:27017/test 
PORT=3000
```
### API Endpoints
```
End Point: http://localhost:3000/api/ingredients
Method: GET

End Point: http://localhost:3000/api/ingredients
Method: POST

{"title":"Apple","amount":10}
```
## For experimental purpose only


