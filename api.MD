//location
//get all
curl localhost/api/v0/location
curl localhost/api/v0/location -H "Authorization: 1-1ec4ce9d-bcff-46c4-a023-c34171b9ca51"
curl localhost/api/v0/location -H "Authorization: 2-eb0c08b0-250a-4249-8a87-11141e2ff8fb"


//get id
curl http://localhost/api/v0/location/3

//post
curl localhost/api/v0/location/new -H "Content-Type: application/json" -X POST -d '{"name": "SAMPLE", "added_by": "system" , "description": "test"}'

curl localhost/api/v0/location/new -H "Content-Type: application/json" -H "Authorization: 1-1ec4ce9d-bcff-46c4-a023-c34171b9ca51" -X POST -d '{"name": "SAMPLE", "added_by": "system", "description": "test"}'

curl localhost/api/v0/location/new -H "Content-Type: application/json" -H "Authorization: 2-eb0c08b0-250a-4249-8a87-11141e2ff8fb" -X POST -d '{"name": "SAMPLE", "added_by": "system", "description": "test"}'

status: 200
added_name allowed: system , admin
name allowed: shld contain alphanumeric only

//put
curl localhost/api/v0/location/update -X PUT -H "Content-Type: application/json" -H "Authorization: 1-1ec4ce9d-bcff-46c4-a023-c34171b9ca51" -d '{"id": "7", "name": "test", "added_by": "system", "description": "test12344444444"}'

status: 200
"message": "Location 13 updated"

//delete
curl localhost/api/v0/location/delete -X DELETE -H "Content-Type: application/json" -H "Authorization: 1-1ec4ce9d-bcff-46c4-a023-c34171b9ca51" -d '{"id": "7"}'

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
curl localhost/api/v0/sensor/new -H "Content-Type: application/json" -X POST -d '{"sensorname": "test", "added_by": "system" , "mac_address": "99-6A-F8-7D-B4-94", "description": "test" , "location": "11"}'

status: 200
added_name allowed: system , admin
sensor name : shld contain alphanumeric only and be unique

//put
curl localhost/api/v0/sensor/update -H "Content-Type: application/json" -X PUT -d '{"id": "2" ,"sensorname": "test", "added_by": "system" , "mac_address": "99-6A-F8-7D-B4-94" , "description": "test123" , "location": "11" }'

status: 200
added_name allowed: system , admin
sensor name : shld contain alphanumeric only and be unique
"message": "Sensor 13 updated"

//delete
curl localhost/api/v0/sensor/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "2" }'
{
"message": "sensor 13 deleted"
}

//sensor data
curl http://localhost/api/v0/sensor-data/

//sensor data by id
curl http://localhost/api/v0/sensor-data/1

//post
curl localhost/api/v0/sensor-data/new -H "Content-Type: application/json" -X POST -d '{"id_sensor": "1" , "id_location": "11" , "sensordata": {
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
"humidity": "11",
"o3": "326",
"no2": "445",
"so2": "511",
"co": "16",
"temperature": "25",
"windspeed": "2",
}}'

//delete
curl localhost/api/v0/sensor-data/delete -X DELETE -H "Content-Type: application/json" -d '{"id": "3" }'

//seed
curl localhost/api/seed/v0/seed/new -H "Content-Type: application/json" -X POST -d '{"mockLocation": ["Ang Mo Kio", "Bishan" , "Tampines" , "Jurong" , "Marine Parade" , "Woodlands "]}'

//seed
curl localhost/api/seed/v0/seedSensorData/new -H "Content-Type: application/json" -X POST -d '{
"startDate": "2023-01-01T16:00:00.000Z",
"endDate": "2023-02-01T16:00:00.000Z",
"interval": "15",
"sensorid": ["1", "2" , "3" , "4" , "5" , "6"],
"locationid": ["1", "2" , "3" , "4" , "5" , "6"],
"seedData": {
"psi": "30",
"humidity": "15%",
"o3": "50ppm",
"no2": "45ppm",
"so2": "30ppm",
"co": "16ppm",
"temperature": "30C",
"windspeed": "4km/h"
}
}'

//latest or last data
curl http://localhost/api/v0/sensor-data/data?order=DESC&limit=2

order= ASC OR DESC
limit = 1 or whatever

//sort by sensor id
curl http://localhost/api/v0/sensor-data/data?sensorid=1

//sort by location id
curl http://localhost/api/v0/sensor-data/data?locationid=1

//get data by year
curl http://localhost/api/v0/sensor-data/data?year=2023

year = 2023 or wtv

//get by month
curl http://localhost/api/v0/sensor-data/data?month=1

month = 1 or jan

//get by week
curl http://localhost/api/v0/sensor-data/data?week=1

week = 1 or wtv

//get by daily 
curl http://localhost/api/v0/sensor-data/data?day=1

day = 1 or wtv 

//get by hourly 
http://localhost/api/v0/sensor-data/data?hour=1

Hour = 1 or wtv


//strong optional chaining
curl 'http://localhost/api/v0/sensor-data/data?year=2023&month=1&week=1&day=1&sensorid=1&locationid=1'


//get specific data
http://localhost/api/v0/sensor-data/data?psi=highest

//avg 
http://localhost/api/v0/sensor-data/data?avg=temperature

//sum
http://localhost/api/v0/sensor-data/data?sum=temperature


//pagination
http://localhost/api/v0/sensor-data/data?week=1&sensorid=1&locationid=1&page=2&pagesize=10


curl localhost/api/v0/user/register -H "Content-Type: application/json" -X POST -d '{"username": "testuser123", "password": "thisisthesystemuserpasswordnoob", "email": "testuser123@ecosaver.com", "address": "Nanyang Polytechnic 180 Ang Mo Kio Avenue 8 Singapore 569830", "phone": "12345678"}'


curl localhost/api/v0/token/new -H "Content-Type: application/json" -X POST -d '{"userid": "5", "permission": "canRead"}'
