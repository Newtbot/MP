//location
//get all
curl localhost/api/v0/location 

//get id 
http://localhost/api/v0/location/3

//post
curl localhost/api/v0/location/new -H "Content-Type: application/json" -X POST -d '{"name": "test", "added_by": "noot" , "description": "test"}'

//put 
 curl localhost/api/v0/location/update -X PUT -H "Content-Type: application/json" -d '{"id": "2" , "name": "test", "added_by": "noot", "description": "test12344444444"}'

//delete 
curl localhost/api/v0/location/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "6" }'

//sensor 
//GET all
curl localhost/api/v0/sensor

//get id 
curl http://localhost/api/v0/sensor/3

//POST
 curl localhost/api/v0/sensor/new -H "Content-Type: application/json" -X POST -d '{"sensortype": "test", "added_by": "noot" , "description": "test" , "location": "2"}'

 //put
 curl localhost/api/v0/sensor/update -H "Content-Type: application/json" -X PUT -d '{"id": "2" ,"sensortype": "test", "added_by": "noot" , "description": "test123333333" , "location": "3" }'

//delete
curl localhost/api/v0/sensor/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "2" }'

//sensor data
