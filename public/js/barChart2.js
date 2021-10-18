(() => {
let data = [0.1, 0.46, 1, 0.6, 0.4, 0.98];

let svgWidth = 600,
    svgHeight = 430,
    chartWidth = 580,
    chartHeight = 420,
    chartGapTop = 40,
    chartGapBottom = 20,
    maxDataHeight = chartHeight - chartGapTop - chartGapBottom,
    barWidth = chartWidth / data.length,
    barPadding = barWidth * 0.1,
    labelFontSize = 16;

let svg = d3.select('.ex__bar2__chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('margin-top', (svgHeight - chartHeight) / 2)
    .style('margin-bottom', (svgHeight - chartHeight) / 2)
    .style('margin-left', (svgWidth - chartWidth) / 2)
    .style('margin-right', (svgWidth - chartWidth) / 2)

let xScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, chartWidth]);

let yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([maxDataHeight, 0]);

let xAxis = d3.axisBottom()
    .scale(xScale);

let yAxis = d3.axisRight()
    .scale(yScale);

let barChart = svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', d => chartHeight - (maxDataHeight - yScale(d)) - chartGapBottom)
    .attr('x', (d, i) => i * barWidth + barPadding / 2)
    .attr('height', d => maxDataHeight - yScale(d))
    .attr('width', barWidth - barPadding)
    // .attr('transform', (d, i) => `translate(${[i * barWidth + barPadding / 2, -chartGapBottom]})`);
    // .style('background-color', "white")
    // .style('vorder-radius', "10px")

let labels = svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => chartHeight -  d * maxDataHeight - 2 * labelFontSize)
    .attr('x', (d, i) => i * barWidth + barPadding / 2)
    .attr('fill', '000')
    .attr('font-size', labelFontSize)

let a = svg.append('g')
    .call(xAxis)
    // .attr('tranform', `translate(0, 300)`)

let b = svg.append('g')
    // .attr('tranform', 'translate(50, 400)')
    .call(yAxis);
})();
