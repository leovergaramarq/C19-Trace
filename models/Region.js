const {Schema, model} = require('mongoose');

const RegionSchema = new Schema({
    Ccode: String,
    location: String,
    population: Number,
    data: [{
        date: String,
        total_cases: Number,
        total_deaths: Number,
        total_cases_per_million: Number,
        total_deaths_per_million: Number
    }]
},
{
    collection: 'regions'
});

module.exports = model('Region', RegionSchema);