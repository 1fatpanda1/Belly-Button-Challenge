function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampledata = data.samples;
    var metadata =data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampledata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that filters the metadata array for the object with the desired sample number.  
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);


    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var metresult = metaArray[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values =result.sample_values;
    console.log(otu_ids);
    // console.log(otu_labels);
    console.log(sample_values);


    // 3. Create a variable that holds the washing frequency.
    var wFreq = metresult.wfreq;
    console.log(result);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(oId => `OTU ${oId}`).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: 'h',
    };

    var barData = [trace];


    // 9. Create the layout for the bar chart. 
    var barLayout = {

      title: "Top 10 Bacteria Clutures Found",
      

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }}
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      hieght: 500,
      width: 1100
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

  




    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wFreq,
        title: { text: '<b>Belly Button Washing Frequency</b> <br> <b>Scrubs per Week</b>'},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          // axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
          axis: {range: [0,10], dtick: 2},
          bar: { color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "darkorange" },
            { range: [4, 6], color: "gold" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "lawngreen" }
          ],
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 417, height: 450, margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);







    
  })};  
    

