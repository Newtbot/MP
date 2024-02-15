How to get started with this project? 
1) git clone or whatever you are comfortable with. 
2) npm install in vscode termianl (assuming you have nodejs installed)

Service:
1) admin.teeseng.uk admin website
2) ecosaver.teeseng.uk comsumer website
3) proxy.teeseng.uk reverse proxy
4) mqtt.teeseng.uk mqtt broker
5) iot-sensor

## cert folder
The cert folder holds all certificate that would be used by the codebase like azure mysql database cert and lets encrypt generated certificate. 

## consumerWebsite folder
* app.js which is the express application file that runs all express functions.
* mqttApp.js which would handle all MQTT logic.
* bin folder
  * contains the www file which would run the express http server. 
* cert folder 
  * The cert folder holds all certificate that would be used by the codebase like azure mysql database cert and lets encrypt generated certificate. 
* database folder 
  The folder would also contain the mySQL.js which is used to connect the SQL database.
  * model folder 
    * contains the sequalize model files that would be used by the codebase.
* function folder 
  * contains various function files tht can be called by the consumerWebsite code base like validatetion file or user.js
* middleware folder
  * contains the middleware files that is used by the express application.
* module folder
  * contains the nodemailer and mqtt modules files. 
* public folder 
  * contains the files / folders that would be in used by the frontend files like css / images / javascript files.
* routes folder
  * contains express route files. 
* views
  * contains the frontend files of the web application.

## iot-sensor folder
* index.js is the file that would run all files in the IoT-sensor codebase.
* cert folder 
  * The cert folder holds all certificate that would be used by the codebase like azure mysql database cert and lets encrypt generated certificate. 
* database folder 
  The folder would also contain the mySQL.js which is used to connect the SQL database.
* function folder 
  * contains various function files tht can be called by the iot-sensor codebase
* module folder
  * contains the iot-sensor, mqtt modules files.

## sean folder
Holds all admin web application files. 

## schema folder 
Holds all sql files.

## Documentation folder 
Holds all basic documentation.txt.

## api.MD 
Holds all basic API documentation. 

