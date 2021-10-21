
var fil = ["", "total_deaths", "total_cases", "total_cases_per_million", "total_deaths_per_million"];
var fil_imp = ["", "Total Deaths", "Total Cases", "Total Cases per Million", "Total Deaths per Million"];
var myChart;
function graf() {

    let per = ["week", "month", ""];
    var period = +document.getElementById("period").value;
    var filter = +document.getElementById("filter_t").value;
    var query = new XMLHttpRequest();
    console.log(typeof (period));
    if (isNaN(period) || isNaN(filter)) {
        query.open('GET', '/api/continental/', true);
        filter = 1;
    } else {
        query.open('GET', '/api/continental/' + per[period - 1], true);
    }
    query.send();
    query.onreadystatechange = function () {
        if (query.readyState == 4 && query.status == 200) {
            var datos = JSON.parse(query.responseText);
            datos.splice(2, 1);
            datos.splice(1, 1);
            graficar(+filter, datos);
        }
    }


    function graficar(filter, datos) {
        datos.forEach(function (d) {

            console.log(d[fil[filter]]);
            d.value = d[fil[filter]];

        });
        const labels = datos.map(function (d) { return d.location })
        console.log(labels)
        const data = {
            labels: labels,
            datasets: [{
                label: fil_imp[filter],
                backgroundColor: ['rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'],
                borderColor: ['rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'],
                data: datos.map(function (d) { return d.value }),
            }]
        };
        const config = {
            type: 'bar',
            data: data,
            options: {}
        };
        console.log(myChart);
        if (myChart) {
            console.log('leonardo');
            myChart.destroy();
        }
        var ctx = document.getElementById("myChart").getContext('2d');
        myChart = new Chart(
            ctx,
            config
        );



    }

}
graf();

