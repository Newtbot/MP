//location
//get all
curl localhost/api/v0/location

//get id
curl http://localhost/api/v0/location/3

//post
curl localhost/api/v0/location/new -H "Content-Type: application/json" -X POST -d '{"name": "test", "added_by": "noot" , "description": "test"}'

status: 200 

//put
curl localhost/api/v0/location/update -X PUT -H "Content-Type: application/json" -d '{"id": "2" , "name": "test", "added_by": "noot", "description": "test12344444444"}'

  status: 200 
  "message": "Location 13 updated"

//delete
curl localhost/api/v0/location/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "6" }'

status: 200
{
  "message": "Location 13 deleted"
}

//sensor
//GET all
curl localhost/api/v0/sensor

//get id
curl http://localhost/api/v0/sensor/3

//POST
curl localhost/api/v0/sensor/new -H "Content-Type: application/json" -X POST -d '{"sensorname": "test", "added_by": "noot" , "mac_address": "99-6A-F8-7D-B4-90", "description": "test" , "location": "2"}'

//put
curl localhost/api/v0/sensor/update -H "Content-Type: application/json" -X PUT -d '{"id": "2" ,"sensorname": "test", "added_by": "noot" , "mac_address": "99-6A-F8-7D-B4-90" , "description": "test123333333" , "location": "3" }'

//delete
curl localhost/api/v0/sensor/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "2" }'

//sensor data
curl http://localhost/api/v0/sensor-data/

//sensor data by id 
curl http://localhost/api/v0/sensor-data/1


//post 
curl localhost/api/v0/sensor-data/new -H "Content-Type: application/json" -X POST -d '{"id": "2", "id_sensor": "1" , "id_location": "2" , "sensordata": { 
  "psi": "34",
  "humidity": "11%",
  "o3": "326ppm",
  "no2": "445ppm",
  "so2": "511ppm",
  "co": "16ppm",
  "temperature": "25C",
  "windspeed": "2km/h",
  "time": "2023-12-21 14:24:44",
  "region": "east"
}}'

//put 
curl localhost/api/v0/sensor-data/update -H "Content-Type: application/json" -X PUT -d '{"id": "1", "id_sensor": "1" , "id_location": "3" , "sensordata": { 
  "psi": "500",
  "humidity": "11%",
  "o3": "326ppm",
  "no2": "445ppm",
  "so2": "511ppm",
  "co": "16ppm",
  "temperature": "25C",
  "windspeed": "2km/h",
  "time": "2023-12-21 14:24:44",
  "region": "east"
}}'

//delete 
curl localhost/api/v0/sensor-data/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "3" }'

//seed 

curl localhost/api/seed/v0/seed/new -H "Content-Type: application/json" -X POST -d '{"mockLocation": ["test", "test123"]}'
