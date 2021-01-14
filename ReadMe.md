## Simple 3-Tier microservice application
1. ReactJS
2. NodeJS
3 MongoDB

### Docker commands
```
docker network create react-stack
docker run --name mongo --network react-stack -d -p 27017:27017 mongo
docker run --network react-stack --name mongo-express -d -p 8081:8081 mongo-express
docker build -f Dockerfile -t react-frontend .
docker run --network react-stack --name frontend -d -p 3001:3000 react-frontend
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongo

# Change the mongo connection string and build it
# ENV MONGO_LOCAL_CONN_URL=mongodb://172.20.0.2:27017/test

docker build -f Dockerfile -t react-backend .
docker run --network react-stack --name backend -d -p 3000:3000 react-backend
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
### API
```
End Point: http://localhost:3000/api/ingredients
Method: GET

End Point: http://localhost:3000/api/ingredients
Method: POST

{"title":"Apple","amount":10}
```



