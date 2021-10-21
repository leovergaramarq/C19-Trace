echo off
color 0a
cls
echo you need to have instaled the MongoDB Database Tools
pause
cls
set /p uri=ingrese la dirección de la base de datos: 
mongoimport --uri %uri% --collection Countries --file data.json
echo 
echo the database is installed
pause