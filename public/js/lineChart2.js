

var fil = ["","total_deaths", "total_cases","total_cases_per_million","total_deaths_per_million"];
    function graf_lime() {
        let per = ["week","month",""];
        var period = +document.getElementById("period").value;  
        var filter = +document.getElementById("filter_t").value;
        var query = new XMLHttpRequest();
        console.log(typeof(period)); 
        if(isNaN(period) || isNaN(filter)) {
            query.open('GET', '/api/line/', true);
            console.log("adfdsaffdsf");
            filter =1;
        }else{
            query.open('GET', '/api/line/'+per[period-1], true);
        }        
        query.send();
        query.onreadystatechange = function() {
        if (query.readyState == 4 && query.status == 200) {
            var datos = JSON.parse(query.responseText);
            datos.splice(4,1);
            datos.splice(7,1);
            graficar_line(+filter, datos); 
        }
    }

       function graficar_line(filter, datos) { 

                var margin = {top: 20, right: 20, bottom: 80, left: 80},
                width = 750 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
      
      
                var x = d3.scaleBand().rangeRound([0,width]).paddingInner(0.05);
                var y = d3.scaleLinear().range([height,0]);
      
                var color = d3.scaleLinear()
                  .domain([0,60])
                  .range(["red", "blue"]);

      
                var xAxis = d3.axisBottom(x)
                    .ticks(12);
      
                var yAxis = d3.axisLeft(y)
                    .ticks(10);
                var svg = d3.select(".ex__line__chart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate("+margin.left+","+margin.top+")");
                datos.forEach(function(d){
                  
                    console.log(d[fil[filter]]);
                    d.value = d[fil[filter]];

                }); 
                x.domain(datos.map(function(d){return d.location;}));
                y.domain([0, d3.max(datos,function(d){return d.value;})]);
        
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, " +height+")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");
  
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
            
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -70)
                    .attr("x",-height/2)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(fil[filter]);


                var line = d3.line()
                    .x(function(d){return x(d.location)})
                    .y(function(d){return y(d.value)})
console.log(line);
                svg.append("g")
                    .data(datos)
                    .attr("class","line")
                    .attr("fill","none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-linejoin","round")
                    .attr("stroke-linecap","round")
                    .attr("stroke-width", 1.5)
                    .attr("d",line)



            }
        }
//graf_line();