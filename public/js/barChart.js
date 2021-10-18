
var fil = ["","total_deaths", "total_cases","total_cases_per_million","total_deaths_per_million"];
    function graf() {
        let per = ["week","month",""];
        var period = +document.getElementById("period").value;  
        var filter = +document.getElementById("filter_t").value;
        var query = new XMLHttpRequest();
        console.log(typeof(period)); 
        if(isNaN(period) || isNaN(filter)) {
            query.open('GET', 'http://127.0.0.1:3000/api/continental/', true);
            console.log("adfdsaffdsf");
            filter =1;
        }else{
            query.open('GET', 'http://127.0.0.1:3000/api/continental/'+per[period-1], true);
        }        
        query.send();
        query.onreadystatechange = function() {
        if (query.readyState == 4 && query.status == 200) {
            var datos = JSON.parse(query.responseText);
            datos.splice(4,1);
            datos.splice(7,1);
            graficar(+filter, datos); 
        }
    }

       function graficar(filter, datos) { 

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
                var svg = d3.select(".ex__bar__chart")
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
        
                svg.selectAll("rect")
                    .data(datos)
                    .enter()
                        .append("rect")
                        .attr("x", function(d) { return x(d.location); })
                        .attr("width", x.bandwidth())
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d){return height - y(d.value);})
                        .style("fill", "steelblue");


            }

            
        }



graf();

    function update() {
                let per = ["week","month",""];
        var period = +document.getElementById("period").value;  
        var filter = +document.getElementById("filter_t").value;
        var query = new XMLHttpRequest();
        console.log(typeof(period)); 
        if(isNaN(period) || isNaN(filter)) {
            query.open('GET', 'http://127.0.0.1:3000/api/continental/', true);
            console.log("adfdsaffdsf");
            filter =1;
        }else{
            query.open('GET', 'http://127.0.0.1:3000/api/continental/'+per[period-1], true);
        }        
        query.send();
        query.onreadystatechange = function() {
        if (query.readyState == 4 && query.status == 200) {
            var datos = JSON.parse(query.responseText);
            datos.splice(4,1);
            datos.splice(7,1);
            d3.select('.ex__bar__chart')
            .selectAll('text')
            .join(
                function(enter) {
                    return enter.append('text')
                        .style('opacity', 0);
                },
                function(update) {
                    return update.style('opacity',0)
                }
            )
            d3.select('.ex__bar__chart')
            .selectAll('g')
            .data(datos)
            .join(
            function(enter) {
                return enter.append('rect')
                .style('opacity', 0.25);
            },
            function(update) {               
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
                var svg = d3.select(".ex__bar__chart")
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
        
                svg.selectAll("rect")
                    .data(datos)
                    .enter()
                        .append("rect")
                        .attr("x", function(d) { return x(d.location); })
                        .attr("width", x.bandwidth())
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d){return height - y(d.value);})
                        .style("fill", "steelblue");

                return svg;
                    
            }
            ) 
        }


        
    }
}