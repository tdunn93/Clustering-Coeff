//Vars to hold dropdown menu data

var nodeTextBox;
var edgesTextBox;
var numNodesToAddTextBox;
var topologySelectMenu;

//Generate the menu
function generate_custom()
{
  var type, graph_data, numNodes, numNodesToAdd, numEdges;
    
  $(document).ready(function() {
    $("#divLevelCustom").empty();
    nodeTextBox = $(document.createElement('div'))
	            .attr("id", 'nodeTextBoxDiv');
 
    nodeTextBox.after().html('<label>Initial number of nodes' + ' : </label>' +
	  '<input class="tb10" type="text" name="textbox1' + 
	  '" id="textbox1' + '" value="" >');
    nodeTextBox.appendTo("#divLevelCustom");
    
    numNodesToAddTextBox = $(document.createElement('div'))
	            .attr("id", ' initialnodeTextBoxDiv');
 
    numNodesToAddTextBox.after().html('<label>Number of nodes to add' + ' : </label>' +
	  '<input class="tb11" type="text" name="textbox2' + 
	  '" id="textbox2' + '" value="" >');
    numNodesToAddTextBox.appendTo("#divLevelCustom");

    edgesTextBox = $(document.createElement('div'))
	            .attr("id", ' edgeseTextBoxDiv');
 
    edgesTextBox.after().html('<label>Number of edges to attach per new node' + ' : </label>' +
	  '<input class="tb12" type="text" name="textbox3' + 
	  '" id="textbox3' + '" value="" >');
    edgesTextBox.appendTo("#divLevelCustom");
  });
    
  topologySelectMenu = $('<select class="select-style" />');
  $("<option />", {value: -1, 
                    text: "Select initial network topology"})
                   .appendTo(topologySelectMenu);
      
  //Create option for each node
  for(var val in topologies)
  {
     $("<option />", {value: val, 
                       text: topologies[val]})
                      .appendTo(topologySelectMenu);
  }
  topologySelectMenu.appendTo("#divLevelCustom");
  topologySelectMenu.on("change", function(e) {
    type = this.options[e.target.selectedIndex].text; 
    numNodes = parseInt($("#textbox1").val());
    numNodesToAdd = parseInt($("#textbox2").val());
    numEdges = parseInt($("#textbox3").val());

    //graph_data = generate_graph_data(numNodes, type);
    graph_data = generate_scale_free(numNodes, type, numNodesToAdd, numEdges);
    generate_graph(graph_data);
    
    $("#commentary").append(function() {
        $(this).text(type + " Network generated with " 
                          + numNodes + " nodes");
        $("#coeff").append( "Network coefficient: " + network_coefficient);
      });
    

  });
}


