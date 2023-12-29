//get all
curl localhost/api/v0/location 

//get id 
curl localhost/api/v0/1

//post
curl localhost/api/v0/add-location -H "Content-Type: application/json" -X POST -d '{"name": "test", "added_by": "noot" , "description": "test"}'

//put 
 curl localhost/api/v0/update-location -X PUT -H "Content-Type: application/json" -d '{"id": "1" , "name": "test", "added_by": "noot", "description": "test123"}'

//delete 
curl localhost/api/v0/delete-location -X DELETE -H "Content-Type: application/json" -d '{"id": "1" }'
