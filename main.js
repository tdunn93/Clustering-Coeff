//clone var newObject = jQuery.extend(true, {}, dataset);
//need to make copys of datasets for complete refresh



var levelCustom = function()
{
  $("#divLevelOne").empty();
  $("#divLevelTwo").empty();
  $("#divLevelThree").empty();

  d3.selectAll("svg").remove();
  generate_custom();
}



