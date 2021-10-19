// new Chart(document.querySelector('.ex__line__area__chart').getContext('2d'), {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

(() => {
// Constantes
const NEW_C = 'new_cases', NEW_CPM = 'new_cases_per_million', NEW_D = 'new_deaths', 
    NEW_DPM = 'new_deaths_per_million';
    
const PATH = '/api/line/';
const urlParams = {
    period: 365,
    group: 'month',
    countries: ['COL', 'USA'],
};
const config = {
    type: 'line',
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
            y: {
                beginAtZero: true,
            }
        }
    },
  };

// ...
let data = [];
let variable = NEW_C;

// ...
const $canvas = document.querySelector('.ex__line__area__chart');
const width = 600, height = 340;
$canvas.setAttribute('width', `${width}px`);
$canvas.setAttribute('height', `${height}px`);

// FUNCIONES
function getData() {
    
    data = [];

    fetch(PATH + parseUrlParams())
        .then(response => response.json())
        .then(json => {
            
            labels = [];
            max = 0;
            json[0].data.forEach(elem => {
                labels.push(elem.month + '/' + elem.year);
            })

            json.forEach(country => {
                const {Ccode: iso3, location: name, population, data: _data} = country;
                
                data.push({
                    iso3,
                    name,
                    population,
                    data: _data.map(elem => {
                        if(elem[variable] > max) max = elem[variable];
                        return elem[variable];
                    })
                });
            });
            console.log(labels);
            console.log(data);

            config.data = {
                labels: labels,
                datasets: data.map(country => ({
                    label: country.name,
                    data: country.data
                }))
                
            };
            config.options.scales.y.max = max;
            console.log(config);

            new Chart($canvas.getContext('2d'), config);
        });
}
getData();

function parseUrlParams() {
    const {period, group, countries} = urlParams;
    let parsed = '?';
    
    if(period !== undefined) parsed += `&period=${period}`;
    if(group !== undefined) parsed += `&group=${group}`;
    countries.forEach(country => parsed += `&country=${country}`)

    return parsed;
}

// const urlSearchParams = new URLSearchParams(window.location.search);
// const params = Object.fromEntries(urlSearchParams.entries());
// console.log(urlSearchParams);
// console.log(params);



//   const DATA_COUNT = 7;
//   const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
  
//   const labels = Utils.months({count: 7});
//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Dataset 1',
//         data: Utils.numbers(NUMBER_CFG),
//         borderColor: Utils.CHART_COLORS.red,
//         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//       },
//       {
//         label: 'Dataset 2',
//         data: Utils.numbers(NUMBER_CFG),
//         borderColor: Utils.CHART_COLORS.blue,
//         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//       }
//     ]
//   };

//   const actions = [
//     {
//       name: 'Randomize',
//       handler(chart) {
//         chart.data.datasets.forEach(dataset => {
//           dataset.data = Utils.numbers({count: chart.data.labels.length, min: -100, max: 100});
//         });
//         chart.update();
//       }
//     },
//     {
//       name: 'Add Dataset',
//       handler(chart) {
//         const data = chart.data;
//         const dsColor = Utils.namedColor(chart.data.datasets.length);
//         const newDataset = {
//           label: 'Dataset ' + (data.datasets.length + 1),
//           backgroundColor: Utils.transparentize(dsColor, 0.5),
//           borderColor: dsColor,
//           data: Utils.numbers({count: data.labels.length, min: -100, max: 100}),
//         };
//         chart.data.datasets.push(newDataset);
//         chart.update();
//       }
//     },
//     {
//       name: 'Add Data',
//       handler(chart) {
//         const data = chart.data;
//         if (data.datasets.length > 0) {
//           data.labels = Utils.months({count: data.labels.length + 1});
  
//           for (var index = 0; index < data.datasets.length; ++index) {
//             data.datasets[index].data.push(Utils.rand(-100, 100));
//           }
  
//           chart.update();
//         }
//       }
//     },
//     {
//       name: 'Remove Dataset',
//       handler(chart) {
//         chart.data.datasets.pop();
//         chart.update();
//       }
//     },
//     {
//       name: 'Remove Data',
//       handler(chart) {
//         chart.data.labels.splice(-1, 1); // remove the label first
  
//         chart.data.datasets.forEach(dataset => {
//           dataset.data.pop();
//         });
  
//         chart.update();
//       }
//     }
//   ];

})();