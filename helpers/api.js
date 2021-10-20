const router = require('express').Router();

const { NotExtended } = require('http-errors');
const Country = require('../models/Country');
const Region = require('../models/Region');
const {isInt} = require('./numeric');

router.get(/^\/(global|continental)\/(month|week|history)?$/, async (req, res, next)=>{
    
    const param = req.params[1] || 'history';
    const extension = req.params[0];

    let query = null;
    try{
        const pipline = [];

        if(extension ==='continental'){
            pipline.push({$match: {continent: null}})
        }

        if (param === 'history') {
            pipline.push(
                {
                    $replaceWith: {
                        $mergeObjects: ['$$CURRENT', {
                            $last: '$data'
                        }]
                    }
                },
                {
                    $unset: 'data'
                }
            );
            
        }else{

            const elem = param==='month'? 0:1;
            pipline.push(
                {
                    $replaceWith: {
                        $mergeObjects: ['$$CURRENT', {
                            $mergeObjects: [
                                {
                                    $arrayElemAt: ['$data', elem]
                                },
                                {
                                    total_cases: {
                                        $subtract: [
                                            {
                                                $last: '$data.total_cases'
                                            },
                                            {
                                                $arrayElemAt: ['$data.total_cases', elem]
                                            }
                                        ]
                                    },
                                    total_deaths: {
                                        $subtract: [
                                            {
                                                $last: '$data.total_deaths'
                                            },
                                            {
                                                $arrayElemAt: ['$data.total_deaths', elem]
                                            }
                                        ]
                                    },
                                    actual_cases_per_million: {
                                        $last: '$data.total_cases_per_million'
                                    },
                                    actual_deaths_per_million: {
                                        $last: '$data.total_deaths_per_million'
                                    }
                                }
                            ]
                        }]
                    }
                },
                {
                    $unset: 'data'
                }
            );
        }
        const query = await Region.aggregate(pipline);
        res.status(200).json(query);
    }catch(err){
        console.error(err);
        next(err);
    }
    
    // res.send('hola');
});

router.get('/line', async (req, res, next)=>{
    // Destructuring body
    
    let {period, group, country} = req.body==={}? req.body: require('url').parse(req.url, true).query;

    if(typeof(period)!=='number' && isInt(period)){
        period = parseInt(period);
    }
    
    // Setting defaults
    // period= period || 'history';
    group = group || 'day';
    country = country || 'all';

    const pipline = [];

    // HANDLING QUERY

    // if we get a country
    if ( typeof(country)==='string' && country !== 'all') {
        // add a match stage to the aggregation pipline
        pipline.push({
            $match: {Ccode: country}
        });
    }else if(country.constructor === Array){// If we get a listo of countries
        pipline.push({
            $match: {Ccode: {$in: country}}
        });
    }else if(typeof(country) === 'number'){
        pipline.push({
            $sample: { size: parseInt(country) }
        });
    }
    else{
        pipline.push({
            $match: {}
        });
    }

    // if we get a period (it must to be a number)
    if (period && typeof(period) === 'number') {

        // add a stage to the pipline
        pipline.push({
            $set: {
                data: {
                    $slice: ['$data', -period]
                }
            }
        });
    }

    // Handling agrupations of time
    if (group==='year' || group==='month' || group === 'week') {
        pipline.push({$unwind: '$data'});
        const stage1 = {
            $group: {
                _id: {
                    _id: '$_id',
                    Ccode: '$Ccode',
                    location: '$location',
                    continent: '$continent',
                    population: '$population',
                    deaths: '$deaths',
                    total_cases: '$total_cases',
                    year: {
                        $year: '$data.date'
                    }
                },
                new_cases: {
                    $sum: '$data.new_cases'
                },
                new_deaths: {
                    $sum: '$data.new_deaths'
                }
            }
        },
        stage2 = {
            $group:{
                _id:{
                    _id: '$_id._id',
                    Ccode: '$_id.Ccode',
                    location: '$_id.location',
                    continent: '$_id.continent',
                    population: '$_id.population',
                    deaths: '$_id.deaths',
                    total_cases: '$_id.total_cases',
                },
                data: {
                    $push: {
                        year: '$_id.year',
                        new_cases: '$new_cases',
                        new_deaths: '$new_deaths'
                    }
                }
            }
        }

        if (group === 'month') {
            stage1.$group._id.month = {
                $month: '$data.date'
            };

            stage2.$group.data.$push.month = '$_id.month';
        }else if( group === 'week'){
            stage1.$group._id.week = {
                $week: '$data.date'
            };

            stage2.$group.data.$push.week = '$_id.week';
        }
        pipline.push(stage1);
        pipline.push(stage2);
        pipline.push({
                $replaceWith: {
                    $mergeObjects: [
                        '$$CURRENT',
                        '$_id'
                    ]
                }
        });
    }

    try{
        // consulting to the database
        const query = await Country.aggregate(pipline);

        res.json(query)
    }catch(err){
        // console.error(err);
        next(err);
    }
});

router.post('/countries', async(req,res, next) => {
    res.json( ["Botswana","Bhutan","Comoros","Egypt","Iceland","Jamaica","Lebanon","Marshall Islands","Malta","Mexico","Namibia","Niue","Nepal","Oman","Norway","Portugal","Sri Lanka","Venezuela","China","Central African Republic","Bonaire Sint Eustatius and Saba","Curacao","Dominica","Falkland Islands","Israel","Montenegro","Nauru","New Caledonia","North Macedonia","Papua New Guinea","Cuba","Equatorial Guinea","Guinea","Japan","Libya","Nigeria","Pitcairn","Paraguay","Qatar","Peru","Vietnam","Cyprus","Georgia","Guatemala","Kiribati","Jordan","Malaysia","Sudan","Tajikistan","Uganda","United Kingdom","Brazil","Burkina Faso","Cameroon","Democratic Republic of Congo","Eswatini","Germany","Honduras","Italy","Maldives","Moldova","Northern Cyprus","Palau","San Marino","Saudi Arabia","Tanzania","Tunisia","Vatican","Africa","Estonia","Grenada","Ghana","Greece","Haiti","International","Liechtenstein","Luxembourg","Palestine","Saint Vincent and the Grenadines","Sint Maarten (Dutch part)","Singapore","South Africa","Syria","Trinidad and Tobago","Canada","Gabon","Isle of Man","Indonesia","Iran","Monaco","Mozambique","Saint Kitts and Nevis","Senegal","Slovakia","Thailand","World","Zimbabwe","Angola","Australia","Bosnia and Herzegovina","Cape Verde","Costa Rica","Guernsey","Hungary","Lesotho","Liberia","Mongolia","Mauritius","Netherlands","Pakistan","Russia","Tokelau","Switzerland","Tuvalu","Turks and Caicos Islands","Wallis and Futuna","Zambia","Austria","British Virgin Islands","Bolivia","Benin","Dominican Republic","Ethiopia","Fiji","El Salvador","Gambia","Greenland","Jersey","Kosovo","Montserrat","New Zealand","Saint Helena","Romania","Seychelles","Somalia","United Arab Emirates","Anguilla","Barbados","Bahrain","Bermuda","Cayman Islands","Bulgaria","Faeroe Islands","Europe","Guinea-Bissau","Iraq","Kuwait","Kyrgyzstan","Laos","Latvia","Mauritania","Niger","Samoa","South America","South Korea","Uzbekistan","Algeria","Bahamas","Bangladesh","Ecuador","Finland","Hong Kong","Nicaragua","Sao Tome and Principe","Serbia","Sweden","Slovenia","Yemen","Afghanistan","Brunei","Chile","Djibouti","French Polynesia","Poland","Solomon Islands","Taiwan","Ukraine","Uruguay","United States","Andorra","Antigua and Barbuda","Armenia","Argentina","Belarus","Cambodia","Croatia","Denmark","Eritrea","Gibraltar","France","Guyana","Kenya","Micronesia (country)","Morocco","Rwanda","South Sudan","Suriname","Turkey","Congo","Cote d'Ivoire","India","Ireland","Macao","Lithuania","Mali","North America","Philippines","Saint Lucia","Albania","Asia","Belize","Belgium","Chad","Czechia","Madagascar","Panama","Sierra Leone","Timor","Togo","Turkmenistan","Aruba","Azerbaijan","Burundi","Cook Islands","Colombia","European Union","Kazakhstan","Malawi","Myanmar","Oceania","Spain","Tonga","Vanuatu"]);
});
module.exports = router;