// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var scatterGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data and read
d3.csv("assets/data/data.csv").then (function(demoData){
     console.log("started reading csv file");
        demoData.forEach(function(data){
            console.log(data.obesity);
            data.poverty = +data.poverty;
            data.obesity = +data.obesity;  
        })
// linear scaling
var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d.poverty) * 0.8,
        d3.max(demoData, d => d.poverty) * 1.2])
        .range([0, width]);
        
var yLinearScale = d3.scaleLinear()
    .domain([0,
    d3.max(demoData, d => d.obesity) * 1.2])
    .range([height, 0]);

// Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
// append x axis
scatterGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// append y axis
scatterGroup.append("g")
.call(leftAxis);

// // Label axes
scatterGroup.append("text")
.attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");

scatterGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
    .attr("class", "axisText")
    .text("Poverty (%)");

// append initial circles 
var circleGroup = scatterGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 12)
    .attr("fill", "red")
    .attr("opacity", ".5");

// create tool tip variable and append to graph
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(data){
    return(`<strong>${data.state}<br>Poverty: ${data.poverty}%<br> Obesity: ${data.obesity}%`)
})
.style("background", "pink")
.style("text-align", "center")
;
scatterGroup.call(toolTip);

// add text to circles
scatterGroup.selectAll(".dot")
.data(demoData)
.enter()
.append("text")
.text(function (data){return data.abbr;})
.attr('x', function(data) {
    return xLinearScale(data.poverty);
})
.attr('y', function(data){
    return yLinearScale(data.obesity)
})
.attr("font-size", "10px")
.attr("fill", "black")
.style("text-anchor", "middle");

// create event listeners
circleGroup.on("mouseover", function(data){
    toolTip.show(data, this);
})
.on("mouseout", function(data){
    toolTip.hide(data);
})


}); 
    