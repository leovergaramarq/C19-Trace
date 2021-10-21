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
// Constantes / Variables
const NEW_C = 'new_cases', NEW_CPM = 'new_cases_per_million', NEW_D = 'new_deaths', 
    NEW_DPM = 'new_deaths_per_million';
const DAY = 'day', WEEK = 'week', MONTH = 'month';

let variable = NEW_C;

const $canvas = document.querySelector('.ex__line__area__chart');
const PATH = '/api/line/';
const urlParams = {
    period: 365,
    group: MONTH,
    countries: ['COL', 'USA', 'ESP', 'CHN', 'IND'],
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
const colors = {};
(() => {
    const baseColors = [
        [255, 99, 132],
        [54, 162, 235],
        [255, 206, 86],
        [75, 192, 192],
        [153, 102, 255],
        // [255, 159, 64],
    ];
    colors.backgroundColor = baseColors.map(color => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`);
    colors.borderColor = baseColors.map(color => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
})();

// FUNCIONES
function getData() {
    
    fetch(PATH + parseUrlParams())
        .then(response => response.json())
        .then(json => {
            if(!json) return;

            json.forEach(country => country.data.sort((a, b) => compareDates(a, b)));

            const data = [];
            const labels = [];
            
            switch(urlParams.group) {
                case DAY:
                    json[0].data.forEach(group => labels.push(parseDay(group)));
                    break;
                case WEEK:
                    json[0].data.forEach(group => labels.push(parseWeek(group)));
                    break;
                case MONTH:
                    json[0].data.forEach(group => labels.push(parseMonth(group)));
                    break;
            }

            json.forEach(country => {
                const {Ccode: iso3, location: name, population, data: _data} = country;
                data.push({
                    iso3,
                    name,
                    population,
                    data: _data.map(elem => elem[variable])
                });
            });
            // console.log(labels);
            // console.log(data);

            config.data = {
                labels: labels,
                datasets: data.map((country, i) => ({
                    label: country.name,
                    data: country.data,
                    backgroundColor: colors.backgroundColor[i],
                    borderColor: colors.borderColor[i],
                }))
                
            };
            // console.log(config);

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

function compareDates(group1, group2) {
    switch(urlParams.group) {
        case DAY:
            return new Date(group1.date).getTime() - new Date(group2.date).getTime();
            break;
        case WEEK:
            return getDateFromWeek(group1.year, group1.week).getTime() - 
                getDateFromWeek(group2.year, group2.week).getTime();
            break;
        case MONTH:
            const {year: year1, month: month1} = group1;
            const {year: year2, month: month2} = group2;
            return year1 !== year2 ? year1 - year2 : month1 - month2;
            break;
    }
    return 0;
}

function parseDate(date) {
    const newDate = new Date(date).toLocaleDateString().split('/');
    newDate[0] = +newDate[0] + 1;
    return newDate.join('/');
}

function parseDay({date}) {
    return parseDate(date);
}

function getDateFromWeek(year, week) {
    const ISOweekStart = new Date(year, 0, 1 + (week - 1) * 7);

    if(ISOweekStart.getDay() <= 4)
        ISOweekStart.setDate(ISOweekStart.getDate() - ISOweekStart.getDay() + 1 - 1);
    else
        ISOweekStart.setDate(ISOweekStart.getDate() + 8 - ISOweekStart.getDay() - 1);

    return ISOweekStart;
}

// Tomado de: https://stackoverflow.com/questions/16590500/calculate-date-from-week-number-in-javascript
function parseWeek({year, week}) {
    return parseDate(getDateFromWeek(year, week))
}

function parseMonth({month, year}) {
    return (month < 10 ? '0':'') + month + '/' + year;
}
// console.log(typeof new Date("2021-10-31T00:00:00.000Z").toLocaleDateString());
// console.log(parseDay("2021-10-31T00:00:00.000Z"));
// xd = new Date('10-11-2020');
// console.log(parseWeek({year: 2021, week: 1}));

// console.log(parseWeek({month: 11, year: 1990}));

})();

