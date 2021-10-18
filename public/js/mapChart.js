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
let queryTools = {};

// Eventos
(() => {
    const {period, variable} = queryTools;

    const variables = {
        'Total cases': TOTAL_C,
        'Total cases per million': TOTAL_CPM,
        'Total deaths': TOTAL_D,
        'Total deaths per million': TOTAL_DPM,
    }
    const vKeys = Object.keys(variables);
    const $dropdownVar = document.querySelector('.dropdown-var');
    const updateDropdownVar = txt => $dropdownVar.firstElementChild.textContent = txt;

    let i = 0;
    for(let child of $dropdownVar.querySelector('ul').children) {
        const txt = vKeys[i];
        
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
    const updateDropdownPer = txt => $dropdownPer.firstElementChild.textContent = txt;

    i = 0;
    for(let child of $dropdownPer.querySelector('ul').children) {
        const txt = pKeys[i];
        
        child.textContent = txt;
        child.addEventListener('click', e => {
            updateDropdownPer(txt);
            period !== periods[txt] && getData(periods[txt], variable);
        })
        i++;
    }
})();

// Funciones
// Data
function getData(period, variable) {
    queryTools = {period, variable};
    
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
        });
}
getData(WEEK, TOTAL_C);

// Funciones D3
const { select, geoPath, geoMercator, min, max, scaleLinear } = d3;

// Propiedad a analizar
const property = 'gdp_md_est';

// SVG settings
const svg = select('.ex__map__area__chart');
const width = 800, height = 600;
svg
    .attr('width', width)
    .attr('height', height);

// Color settings
const minProp = min(dataGeoJson.features, feature => feature.properties[property]);
const maxProp = max(dataGeoJson.features, feature => feature.properties[property]);
const colorScale = scaleLinear()
    .domain([minProp, maxProp])
    .range(['#ccc', 'red']);
    
// País seleccionado
let selectedCountry = null;

// Tipo de proyección
let pathGenerator = null;

function updateProjection(feature) {
    selectedCountry = selectedCountry === feature ? null : feature;

    const projection = geoMercator()
        .fitSize([width, height], selectedCountry || dataGeoJson)
        .precision(100);
    pathGenerator = geoPath().projection(projection);
}
updateProjection(null);

// Renderizado de países
function updateAll() {
    svg.selectAll('.country')
        .data(dataGeoJson.features)
        .join(
            enter => enter.append('path').attr('d', feature => pathGenerator(feature)),
            update => update,
            exit => exit.remove()
        )
        .on('click', e => {
            updateProjection(dataGeoJson.features[e.target.getAttribute('featureIndex')]);
            updateAll();
        })
        .attr('class', 'country')
        .transition()
        .duration(1000)
        .attr('fill', feature => colorScale(feature.properties[property]))
        .attr('featureIndex', (feature, i) => i)
        .attr('d', feature => pathGenerator(feature))
        .attr('stroke', 'black')
        .attr('stroke-opacity', '0.1')
}
updateAll();

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
