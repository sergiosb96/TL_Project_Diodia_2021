Open Api ip domain: http://83.212.102.64/


Export swagger app:

p2o ./TL21-88.postman_collection.json -f ./swagger.yml

Run swagger app:

docker run -d -p 80:8080 -e SWAGGER_JSON=/api.yaml -v /home/user/openApi/swagger.yml:/api.yaml swaggerapi/swagger-ui
or
docker run -d -p 80:8080 -e SWAGGER_JSON=/api.yaml -v /home/user/openApi/swagger.yml:/api.yaml swaggerapi/swagger-editor 
