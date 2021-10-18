// dataGeoJson
import dataGeoJson from './GeoChart.world.geo.json' assert {type: 'json'};

(() => {

// Constantes
const WEEK = 'week', MONTH = 'month', HISTORIC = '';
const TOTAL_C = 'total_cases', TOTAL_CPM = 'total_cases_per_million', TOTAL_D = 'total_deaths', 
    TOTAL_DPM = 'total_deaths_per_million';
const PATH = '/api/global/';

// ...
let data = [];
let period = WEEK, variable = TOTAL_CPM;
let colorScale;

// Eventos
(() => {
    const variables = {
        'Total cases': TOTAL_C,
        'Total cases per million': TOTAL_CPM,
        'Total deaths': TOTAL_D,
        'Total deaths per million': TOTAL_DPM,
    }
    const vKeys = Object.keys(variables);
    const $dropdownVar = document.querySelector('.dropdown-var');
    const $aVar = $dropdownVar.firstElementChild;
    const updateDropdownVar = txt => $aVar.textContent = txt;

    let i = 0;
    for(let child of $dropdownVar.querySelector('ul').children) {
        const txt = vKeys[i];
        if(variable === variables[txt]) $aVar.textContent = txt;

        child.textContent = txt;
        child.addEventListener('click', e => {
            updateDropdownVar(txt);
            variable !== variables[txt] && getData(period, variables[txt]);
        })
        i++;
    }

    const periods = {
        'Last week': WEEK,
        'Last month': MONTH,
        'Historic': HISTORIC,
    }
    const pKeys = Object.keys(periods);
    const $dropdownPer = document.querySelector('.dropdown-per');
    const $aPer = $dropdownPer.firstElementChild;
    const updateDropdownPer = txt => $aPer.textContent = txt;

    i = 0;
    for(let child of $dropdownPer.querySelector('ul').children) {
        const txt = pKeys[i];
        if(period === periods[txt]) $aPer.textContent = txt;
        
        child.textContent = txt;
        child.addEventListener('click', e => {
            updateDropdownPer(txt);
            period !== periods[txt] && getData(periods[txt], variable);
        })
        i++;
    }
})();

// FUNCIONES
// Data
function getData(_period = period, _variable = variable) {
    if(period !== _period) period = _period;
    if(variable !== _variable) variable = _variable;
    variable = _variable;
    
    fetch('/api/global/'+period)
        .then(response => response.json())
        .then(json => {
            json.forEach(country => {
                const {Ccode: iso3, population} = country;
                data.push({
                    iso3,
                    population,
                    [variable]: country[variable]
                });
            });
            initColorScale();
            updateCountries();
        });
}
getData();

// Color settings
function initColorScale() {
    const minProp = min(data, country => country[variable] < 0 ? 0 : country[variable]);
    const maxProp = max(data, country => country[variable]);
    console.log(minProp, maxProp);
    colorScale = scaleLinear()
        .domain([minProp, maxProp])
        .range(['#ccc', 'red']);
}

function getCountryFeature(country) {
    return dataGeoJson.features.find(f => f.properties.adm0_a3 === country.iso3);
}

function getCountryFeatureIndex(country) {
    return dataGeoJson.features.findIndex(f => f.properties.adm0_a3 === country.iso3);
}

// Renderizado de países
function updateCountries() {
    svg.selectAll('.country')
        .data(data)
        .join(
            enter => (
                enter.append('path').attr('d', country => pathGenerator(getCountryFeature(country)))
            ),
            update => update,
            exit => exit.remove()
        )
        .on('click', e => {
            updateProjection(dataGeoJson.features[e.target.getAttribute('featureIndex')]);
            updateCountries();
        })
        .attr('class', 'country')
        .transition()
        .duration(1000)
        .attr('fill', country => colorScale(country[variable] || 0))
        .attr('featureIndex', country => getCountryFeatureIndex(country))
        .attr('d', country => pathGenerator(getCountryFeature(country)))
        .attr('stroke', 'black')
        .attr('stroke-opacity', '0.1')
}

// Funciones D3
const { select, geoPath, geoMercator, min, max, scaleLinear } = d3;

// SVG settings
const svg = select('.ex__map__area__chart');
const width = 800, height = 600;
svg
    .attr('width', width)
    .attr('height', height);
    
// País seleccionado
let selCountryFeature = null;

// Tipo de proyección
let pathGenerator = null;

function updateProjection(feature) {
    selCountryFeature = selCountryFeature === feature ? null : feature;

    const projection = geoMercator()
        .fitSize([width, height], selCountryFeature || dataGeoJson)
        .precision(100);
    pathGenerator = geoPath().projection(projection);
}
updateProjection(null);

// Renderizado de texto
// svg.selectAll('.label')
//     .dataGeoJson([selectedCountry])
//     .join('text')
//     .attr('class', 'label')
//     .text( feature => (
//             feature &&
//             feature.properties.name +
//             ': ' +
//             feature.properties[property].toLocaleString()
//         )
//     )
//     .attr('x', 10)
//     .attr('y', 25);
})()
