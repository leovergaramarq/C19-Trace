# C19-Trace
Website for Covid-19 data visualization.
visit our website at: [http://c19-trace.herokuapp.com/](http://c19-trace.herokuapp.com/)

# Database Installation
## Requirements

 - you need to have already installed the ***MongoDB database Tools***. You
   can find the steps to install it in the following link: [enter link
   description here](https://docs.mongodb.com/database-tools/)
   
 - you need the ***data.json*** and the ***expandDB.js*** files that you can find in the ***database_setup*** folder

## Installation
### Bat file (only for windows)
You can use the ***CreateDB.bat*** file that is included with the project.
When you run it you will see

    you need to have installed the MongoDB Database Tools
    Presione una tecla para continuar . . .
if you already have the MongoDB database Tools instaled just press any key and continue with the process.
Next, you will see:

### By console

 - Open a console and navigate to the ***data.json*** file location.
 - In the following line, replace the ***< db >*** with the name of you database 

The command:

    mongoimport --db < db > --collection Countries \ --drop --file "data.json"

 - Execute the command (and see the magic)

Now, in the ***expandDB.js*** you need to replace your database URI and NAME.

And for last, you need to open a console and navigate to the ***expandDB.js***, next open a mongoshell and execute the next command:

    load(expandDB.js)
