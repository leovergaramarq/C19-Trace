(() => {

var datos = [1,2,4,5,8,13,21,34,55,89,144];
var w = datos.length*25;
var h = d3.max(datos) +20;

var svg = d3.select('.ex__bar__chart')
    .append('svg')
    .attr('width',w)
    .attr('height',h);

svg.selectAll("rect")
    .data(datos)
    .enter()
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",20)
    .attr("height",100)
    .attr("x", function(d,i) {
        return i*21+30
    })
    .attr("height", function(d) {
        return d;
    })
    .attr("y", function(d) {
        return h-d;
    })

svg.selectAll("text")
    .data(datos)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("x", function(d,i) {
        return i*21+40
    })
    .attr("y", function(d) {
        return h-d-3;
    })
})();
