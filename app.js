// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "age") {
      var label = "Age:";
    }
    else {
      var label = "Smokes:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        
        // Correct notation for d.id? was d.rockband in hairMetal example
        // return 'tool tip'
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data, index, element) {
      toolTip.show(data, element[index]);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
  
  // Retrieve data from the CSV file and execute everything below

d3.csv("data.csv").then(function(healthData){
    
  // parse data
    healthData.forEach(function(data) {
      data.age = +data.age;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      
      // Print ages to console for examination
      console.log(data.age)
    });
  
    // Print 'healthData' to console to verify import of csv
    console.log(healthData);
    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.obesity)])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// append y axis
chartGroup.append("g")
.call(leftAxis);

// var elem = chartGroup.selectAll("g").data(healthData);

// var elemEnter = elem.enter().append("g")
// .attr("cx", d => xLinearScale(d[chosenXAxis]))
// .attr("cy", d => yLinearScale(d.obesity));

// var circle = elemEnter
// .append("circle")
// .attr("r", 20)
// .attr("fill", "blue")
// .attr("opacity", "0.4");

// var stateLabel = elemEnter
// .append("text")
// .text(function(d){
//    return (d.abbr)
// });


// // append initial circles
// // var circlesGroup = circleSpaceGroup.selectAll("circle")

//NOTE: I realize that at this point in the code I had to create a group
// to refer to the location for the 'circle' and corresponding 'text'
// Since the variable 'circlesGroup' is called many places in this file,
// only the location of the circles gets updated (and not the text)

var circlesGroup = chartGroup.selectAll("circle")
.data(healthData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d.obesity))
.attr("r", 20)
.attr("fill", "pink")
.attr("opacity", ".5");

var textGroup = chartGroup.selectAll("text")
.data(healthData)
.enter()
.append("text")
.attr("dx", d => xLinearScale(d[chosenXAxis]))
.attr("dy", d => yLinearScale(d.obesity))
.text(d => d.abbr)
.attr("fill", "black")
.attr("font-size", "12px")
.attr("text-anchor", "middle");

// .selectAll("text")
// .data(healthData)
// .enter()
// .append("text")
// .text(function(d){
//   return (d.abbr)
// })
// .attr("cx", d => xLinearScale(d[chosenXAxis]))
// .attr("cy", d => yLinearScale(d.obesity))
// .attr("fill", "black")
// .attr("font-size", "12px")
// .attr("stroke-width", 1)
// ;

// var textGroup = chartGroup.selectAll("text")
// .data(healthData)
// .enter()
// .append("text")
// .text(function(d){
//   return (d.abbr)
// })
// .attr("cx", d => xLinearScale(d[chosenXAxis]))
// .attr("cy", d => yLinearScale(d.obesity))
// .attr("fill", "black")
// .attr("font-size", "12px")
// .attr("stroke-width", 0)
// ;





// Create group for  2 x- axis labels
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (years)");

  var smokesLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes(%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "smokes") {
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  });
  

  




