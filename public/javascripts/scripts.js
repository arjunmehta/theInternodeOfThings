$(document).ready(function(){

  //IGNORE THIS BIT
  console.log("READY");
  $("#text-input").hide();
  $("#send-button").hide();  
 
  var valueArray = new Array();
  now.receiveValue = function(name, serialValues){
  
    valueArray = serialValues.split(','); //split the passed in serialValues by commas
      
    conversion = Math.ceil( (Number(valueArray[0])*359)/1023); //converts a number from 0-1023 to a value ration over 360 degrees for hue
    satConversion = Math.ceil( (Number(valueArray[1])*100)/1023); //converts a number from 0-1023 to a value ration over 100 for saturation
    brightConversion = Math.ceil( (Number(valueArray[2])*100)/1023); //converts a number from 0-1023 to a value ration over 360 for brightness
    
    if(satConversion == 1){
      satConversion = 0;      
    }
    if(brightConversion == 1){
      brightConversion = 0;      
    }
    
    colour = "hsb('" + conversion + "," + satConversion + ","+ brightConversion +"')"; //this is using jQuery xcolor plugin
    
    $('body').css('background-color', colour); //make background of html the colour value
    $('#serialValue').text(serialValues); //display the original serialValues string
    $('#colourValue').text(colour); //display the colour value used

  }
    
  now.name = prompt("What's your name?", "");

});