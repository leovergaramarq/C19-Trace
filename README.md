# C19-Trace
Website for the visualization of data on the Covid-19 pandemic around the world in graphic form. Data taken from the [Our World in Data](https://ourworldindata.org/covid-deaths) dataset.

<img src="https://user-images.githubusercontent.com/73978713/174461077-18870a9f-5b41-430c-ae9f-56da7d3bf7ef.png" height="400">

### Built With

 - [Node.js](https://nodejs.org/es/)
 - [MongoDB Atlas](https://www.mongodb.com/es/atlas)
 - [D3.js](https://d3js.org)
 - [Chart.js](https://www.chartjs.org)
 - [Visual Studio Code](https://code.visualstudio.com)
 - [Bootstrap](https://getbootstrap.com)
 - [Sass](https://sass-lang.com)
 - [EJS](https://ejs.co)

## Getting Started
You can clone this repsitory to get the source code

    git clone https://github.com/vergaraldvm/C19-Trace.git


## Database Installation
### Requirements

 - You need to have already installed the ***MongoDB database Tools***. You can find the steps to install it in the following link: [https://docs.mongodb.com/database-tools/](https://docs.mongodb.com/database-tools/).
 - You need the ***data.json*** and the ***expandDB.js*** files that you can find in the ***database_setup*** folder.

### Installation
#### Bat file (only for windows)
You can use the ***CreateDB.bat*** file that is included with the project. When you run it you will see

    you need to have installed the MongoDB Database Tools
    Presione una tecla para continuar . . .

If you already have the MongoDB database Tools instaled just press any key and continue with the process.

#### By console

 - Open a console and navigate to the ***data.json*** file location.
 - In the following line, replace the ***< db >*** with the name of you database 

The command

    mongoimport --db < db > --collection Countries \ --drop --file "data.json"

 - Execute the command (and see the magic).

Now, in the ***expandDB.js*** you need to replace your database URI and NAME.

And for last, you need to open a console and navigate to the ***expandDB.js***, next open a mongoshell and execute the command

    load(expandDB.js)

## Run Web Application
### Requirements
 - [Node.js](https://nodejs.org/es/)

Install dependencies

    npm install

Run the application

    npm start

<img src="https://user-images.githubusercontent.com/73978713/174461078-9b3d335a-c03e-4683-a98b-7e3210cadfd5.png" height="260">

## Authors
 - Leonardo Aguilera - [leoar0810](https://github.com/leoar0810)
 - Leonardo Lizcano - [LeoLizc](https://github.com/LeoLizc)
 - Leonardo Vergara - [LeonardoVergara](https://github.com/LeonardoVergara)

## Acknowledgements
 - [Our World in Data](https://ourworldindata.org/covid-deaths)
 - [muratkemaldar/using-react-hooks-with-d3](https://github.com/muratkemaldar/using-react-hooks-with-d3/tree/12-geo)
 - [GeoJSON Maps of the globe](https://geojson-maps.ash.ms)
 - [W3Schools](https://www.w3schools.com/howto/howto_js_autocomplete.asp)
