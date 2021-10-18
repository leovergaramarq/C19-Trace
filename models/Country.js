const mongo = require('mongoose');

let BasicScheema = new mongo.Schema({
    Ccode: String,
    continent: {type: String, required: false},
    location: String,
    population: Number,
    deaths: {type: Number, required: false},
    total_cases: {type: Number, required: false},
    data: [{
        date: Date,
        new_cases: Number, 
        new_cases_per_million: Number,
        new_deaths: {type: Number, required: false},
        new_deaths_per_million: {type: Number, required: false}
    }]
},
{
    collection: 'reduced_countries'
});


module.exports = mongo.model('BasicCountry', BasicScheema);