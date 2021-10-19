var circle = document.getElementById("myCircleGraph").getContext("2d");
var query = new XMLHttpRequest();
        console.log(typeof(period)); 
        query.open('GET', '/api/line?country=5&period=1', true);
        query.send();
        query.onreadystatechange = function() {
        if (query.readyState == 4 && query.status == 200) {
            var datos = JSON.parse(query.responseText);
            var myCircleGraph = new Chart(circle, {
    
  type: "pie",
  data: {
    labels: [datos[0].location, datos[1].location, datos[2].location, datos[3].location, datos[4].location],
    datasets: [
      {
        label: "Compras",
        data: [datos[0].deaths, datos[1].deaths, datos[2].deaths, datos[3].deaths, datos[4].deaths],
        borderWidth: 0,
        backgroundColor: [
          "rgba(255, 99, 132, .6)",
          "rgba(54, 162, 235, .6)",
          "rgba(255, 206, 86, .6)",
          "rgba(75, 192, 192, .6)",
          "rgba(153, 102, 255, .6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, .5)",
          "rgba(54, 162, 235, .5)",
          "rgba(255, 206, 86, .5)",
          "rgba(75, 192, 192, .5)",
          "rgba(153, 102, 255, .5)"
        ],
        lineTension: 0.1
      }
    ]
  },
  options: {
    legend: {
      display: true,
      position: "top",
      labels: {
        boxWidth: 10,
        fontColor: "#444444"
      }
    },
   plugins: {
     datalabels: {
       formatter: (value, ctx) => {

         let sum = 0;
         let dataArr = ctx.chart.data.datasets[0].data;
         dataArr.map(data => {
           sum += data;
         });
         let percentage = (value * 100 / sum).toFixed(2) + "%";
         return percentage;


       },
       color: '#fff',
     }
   }
  }
});
        }
    }


