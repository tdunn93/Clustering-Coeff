//Variable to hold the layout itself
var force;

//Particle parameters
var chargeVal = -800;
var linkDist = 400;

//Variables to hold graph data
var labels;
var edges;
var nodes;

//Grouping for nodes
var gnodes;

//Var for svg elements
var svg;

//Width and height for screen
var w = 2050;
var h = 1050;


var network_coefficient;
var topologies = ["Line", "Star", "Complete", "Ring", "Mesh"];

//Graph generator
function generate_graph(dataset)
{
  //var copy = duplicate(dataset);
  
  //Create the force directed layout
  //Edge distance and charge depenedent on graph size
  force = d3.layout.force()
    .nodes(dataset.nodes)
    .links(dataset.edges)
    .size([w, h])
    .linkDistance([linkDist])
    .charge([chargeVal])
    .start()
    .on("end", function() {
      converged = true;
  });
         
  //Create an SVG element
  svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
			
//Create edges as svg lines
  edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);
 
//Create a group of svg elements for nodes
  gnodes = svg.selectAll("g.gnode")
    .data(dataset.nodes)
    .enter()
    .append("g")
    .classed("gnode", true)

    
//Add a circle to the node   
  nodes = gnodes.append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .style("fill", function(d) {
          //console.log("Degree " + dataset.nodes[d.index].adjacent_to.length, "Edges " + dataset.edges.length);
					var r = (dataset.nodes[d.index].adjacent_to.length / (dataset.edges.length/2)) * 255.00 * 4.00;
					//console.log (r);
          return d3.rgb(r, 0, 0);
    })
    .on("mouseover", function(d) {
        d3.select(labels[0][d.index])
        .style("visibility", "visible");
        d3.select(labels[0][d.index].nextSibling)
        .style("visibility", "visible");   
    })
    .on("mouseout", function(d) {
     d3.select(labels[0][d.index])
       .style("visibility", "hidden");
      d3.select(labels[0][d.index].nextSibling)
        .style("visibility", "hidden");
    })
    
    .call(force.drag);

  
  //Create labels for the node group
  labels = gnodes.append("text")
    .text(function(d) { 
        return ("Network: " + d.name ); 
    })
    .attr("class","nodetext")
    .attr("dx", 0)
    .attr("dy", ".35em")
    .style("font-size","5px")
    
    //Anchor the text a few units below the centre of node for each label
    .attr("text-anchor", "middle")
    .attr("transform","translate(0, 24)")
    .transition()
    .duration(300)
    .style("font-size","12px")
    .attr("font-family", "Verdana")
    .attr("font-size", "11px")
    .style("visibility", "hidden"); //hide under hover over the node 
    
  gnodes.append("text")
    .text(function(d) { 
        return ("Clustering coefficient " + d.coefficient.toFixed(2)); 
    })
    .attr("class","nodetext")
    .attr("dx", 0)
    .attr("dy", ".35em")
    .style("font-size","5px")
    .attr("text-anchor", "middle")
    .attr("transform","translate(0, 36)")
    .transition()
    .duration(300)
    .style("font-size","12px")
    .attr("font-family", "Verdana")
    .attr("font-size", "11px")
    .style("visibility", "hidden"); //hide under hover over the node 
    
  

  //Called everytime the simulation ticks over
  force.on("tick", function() {
    edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });

  gnodes.attr("transform", function(d) { 
      return 'translate(' + [d.x, d.y] + ')';         
     })
  });
}



//Generates a network of specified number of nodes and type
//E.g a Star network with 23 nodes
function generate_graph_data(num_nodes, type)
{

  var i, j, dataset = {
      nodes :[],
      edges :[]
  }
  
  
  if(type == "Line")
  {
    for(i = 0; i < num_nodes; i++)
    {
        dataset.nodes.push({name: "node " + i
                           , coefficient: 0
                           , adjacent_to: []});
       if(i == 0)
         dataset.nodes[i].adjacent_to.push(i+1);
       else if(i == num_nodes - 1)
         dataset.nodes[i].adjacent_to.push(i-1);
       else
         dataset.nodes[i].adjacent_to.push(i-1, i+1);
    }
       
    for(j = 0; j <  num_nodes - 1; j++)
      dataset.edges.push({ source: j, target: j + 1 });
  }
  else if(type == "Star")
  {
    dataset.nodes.push({name: "Central Hub"
                           , coefficient: 0
                           , adjacent_to: []});
       
    for(i = 0 ; i < num_nodes; i++)
    {
        dataset.nodes.push({name: "node " + i
                           , coefficient: 0
                           , adjacent_to: []});
    }
    for(i = 1; i < num_nodes + 1; i++)
        dataset.nodes[0].adjacent_to.push(i);
    for(j = 1; j <  num_nodes + 1; j++)
    {
      dataset.nodes[j].adjacent_to.push(0);
      dataset.edges.push({ source: j, target: 0 });
    }
      //console.log("gen_graph_data(): dataset ", dataset);
  }
  else if(type == "Mesh")
  {
    var randLength;
    var randNode;
        
    for(i = 0 ; i < num_nodes; i++)
    {
        dataset.nodes.push({name: "node " + i
                           , coefficient: 0
                           , adjacent_to: []});
    }
    for(j = 0; j < num_nodes; j++)
    {
        /* Making number of adjacent nodes proportional to the square root of the number
        of nodes seems to scale well */
        randLength = Math.floor((Math.random() 
                                    * (Math.sqrt(num_nodes))) + 1); //cant be 0
        for(var k = 0; k < randLength; k++)
        {
            randNode = Math.floor((Math.random() 
                                    * (num_nodes)));
       //     console.log("Node:", randNode);
            dataset.nodes[j].adjacent_to.push(randNode);
            dataset.nodes[randNode].adjacent_to.push(j);

            dataset.edges.push({ source: randNode, target: j });
            //dataset.edges.push({ source: j, target: randNode });
        }
          
    }
      console.log(dataset);
  }
  else if(type == "Ring")
  {
    for(i = 0; i < num_nodes; i++)
    {
        dataset.nodes.push({name: "node " + i
                           , coefficient: 0
                           , adjacent_to: []});
       if(i == 0)
         dataset.nodes[i].adjacent_to.push(i+1, num_nodes - 1);
       else if(i == num_nodes - 1)
         dataset.nodes[i].adjacent_to.push(i-1, 0);
       else
         dataset.nodes[i].adjacent_to.push(i-1, i+1);
    }
        
    for(j = 0; j <  num_nodes - 1; j++)
      dataset.edges.push({ source: j, target: j + 1 });
    dataset.edges.push({ source: num_nodes - 1, target: 0 });
  }
  else if(type == "Complete")
  {
    for(i = 0; i < num_nodes; i++)
    {
        dataset.nodes.push({name: "node " + i
                           , coefficient: 0
                           , adjacent_to: []});    
    }
    //n(n-1)/2 nodes in complete graph
    for(j = 0; j < num_nodes; j++)
    {
        for(i = 0; i < num_nodes; i++)
        {
          if(i != j)
          {
              dataset.nodes[j].adjacent_to.push(i);
          }
        }

				for(i = 0; i < num_nodes; i++)
				{
					if (i > j)
					{
						dataset.edges.push({source: j, target: i});
					}
				}
    }
  }  
  return dataset;
}

function generate_scale_free(num_nodes, type, T, m)
{
  var dataset = generate_graph_data(num_nodes, type);

  for(var i = 0; i < T; i++)
  {
    dataset.nodes.push({name: "node " + dataset.nodes.length
                           , adjacent_to: []});

		//console.log(dataset.nodes.length);
    var nodes_array = new Array();
    for (var j = 0; j < dataset.nodes.length - 1; j++)
		{
			nodes_array.push({index: j, degree: dataset.nodes[j].adjacent_to.length});
		}

		var k = 2*dataset.edges.length;
		for (var j = 0; j < m; j++)
		{
			//console.log(k);
			var randNum = Math.floor(Math.random() * k);
			var walk = 0;
			while (randNum >= 0)
			{
				//console.log("nodes_array length: " + nodes_array.length + ", walk: " + walk + ", randNum: " + randNum + ", degree: " + nodes_array[walk].degree);
				randNum -= nodes_array[walk].degree;
				walk++;
			}
			var chosenIndex = walk - 1;
			//console.log(chosenIndex);

			dataset.edges.push({source: (dataset.nodes.length - 1), target: nodes_array[chosenIndex].index});
			dataset.nodes[dataset.nodes.length - 1].adjacent_to.push(nodes_array[chosenIndex].index);
			dataset.nodes[nodes_array[chosenIndex].index].adjacent_to.push(dataset.nodes.length - 1);

			k = k - nodes_array[chosenIndex].degree;
			//console.log(k);
			//console.log("-------------------");

			nodes_array.splice(chosenIndex, 1);
		}
  }

	var coef_sum = 0;
	for (var currentNode = 0; currentNode < dataset.nodes.length; currentNode++)
	{
		var e1 = 0;
		for (var currentNeighbour = 0; currentNeighbour < dataset.nodes[currentNode].adjacent_to.length; currentNeighbour++)
		{
			var currentNeighbourIndex = dataset.nodes[currentNode].adjacent_to[currentNeighbour];
			for (var currentFOAF = 0; currentFOAF < dataset.nodes[currentNeighbourIndex].adjacent_to.length; currentFOAF++)
			{
				var currentFOAFIndex = dataset.nodes[currentNeighbourIndex].adjacent_to[currentFOAF];
				for (var i = 0; i < dataset.nodes[currentFOAFIndex].adjacent_to.length; i++)
				{				
					if (dataset.nodes[currentFOAFIndex].adjacent_to[i] == currentNode)
					{
						e1++;
					}
				}
			}
		}
		if (dataset.nodes[currentNode].adjacent_to.length == 1)
			dataset.nodes[currentNode].coefficient = 0;
		else
			dataset.nodes[currentNode].coefficient = e1 / (dataset.nodes[currentNode].adjacent_to.length * (dataset.nodes[currentNode].adjacent_to.length-1));
		coef_sum += dataset.nodes[currentNode].coefficient;
	}
	network_coefficient = coef_sum / dataset.nodes.length;
	console.log(network_coefficient);

	return dataset;
}
