// Data
import data from './GeoChart.world.geo.json' assert {type: 'json'};

// Eventos


// Funciones
const { select, geoPath, geoMercator, min, max, scaleLinear } = d3;

// Propiedad a analizar
const property = 'pop_est';

// SVG settings
const svg = select('.ex__map__chart');
const width = 800, height = 500;
svg
.attr('width', width)
    .attr('height', height);

    // Color settings
const minProp = min(data.features, feature => feature.properties[property]);
const maxProp = max(data.features, feature => feature.properties[property]);
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
        .fitSize([width, height], selectedCountry || data)
        .precision(100);
    pathGenerator = geoPath().projection(projection);
}
updateProjection(null);
// Renderizado de países
function updateAll() {
    svg.selectAll('.country')
        .data(data.features)
        .join(
            enter => enter.append('path').attr('d', feature => pathGenerator(feature)),
            update => update,
            exit => exit.remove()
        )
        .on('click', e => {
            // console.log(selectedCountry);
            // console.log(feature.target.getAttribute('d'));
            updateProjection(data.features[e.target.getAttribute('featureIndex')]);
            // updateProjection(data.features[i]);
            updateAll();
            // console.log(selectedCountry);
            // svg.selectAll('.country').attr('d', feature => pathGenerator(feature))
        })
        .attr('class', 'country')
        .transition()
        .attr('fill', feature => colorScale(feature.properties[property]))
        .attr('featureIndex', (feature, i) => i)
        .attr('d', feature => pathGenerator(feature))
        .attr('stroke', 'black')
        .attr('stroke-opacity', '0.1')
}
updateAll();

// Renderizado de texto
// svg.selectAll('.label')
//     .data([selectedCountry])
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
