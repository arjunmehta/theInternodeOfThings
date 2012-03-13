/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');



var app = module.exports = express.createServer();




// now.js Configuration

var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.getValue = function(serialValues){
  everyone.now.receiveValue(this.now.name, serialValues);
};



// serialport Configuration

var SerialPort = require("serialport");
var fs = require("fs");
var serialPortPath = process.argv[2];
var baudrate = process.argv[3];
var serialPortActive = false;

var serialString = " ";
var serialArray = new Array();


// Express Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  // disable layout - These next few steps are so we can just render regular HTML as default. It's silly really.
  app.set("view options", {layout: false});

  // make a custom html template
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});





// ROUTING
app.get('/', routes.index);


//Will push the get request query vars to everyone. ie: 20.33.32.23/Load?id=32,344,234 will push out the string "32,344,234"
//Will look into pushing out a more robust object soon.

app.get('/Load', function(reqA, resA){
  
  if(reqA.query["id"]){
  
    resA.send('id: ' + reqA.query["id"]);

    var serialString = reqA.query["id"].toString();
    if(typeof(serialString) == 'string'){
      everyone.now.receiveValue("SerialPort", serialString );
    }
    
  }

});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


function attemptLogging(fd, serialPortPath, baudrate) {
  if (!serialPortActive) {
    fs.stat(serialPortPath,  function (err, stats) {
      if (!err) {
        serialPortActive = true;
        
        var serialPort = new SerialPort.SerialPort(serialPortPath, {
          baudrate: baudrate,
          parser: SerialPort.parsers.readline("\n")
        });
        
        
        //Write to Log
        fs.write(fd, "\n------------------------------------------------------------\nOpening SerialPort: "+target+" at "+Date.now()+"\n------------------------------------------------------------\n");  
        
        
        serialPort.on("data", function (data) {


          //WRITE TO LOG
          fs.write(fd, data.toString());
          

          //THE HEART
          serialString = data.toString();
          if(typeof(serialString) == 'string' && everyone.now.receiveValue){
            everyone.now.receiveValue("SerialPort", serialString);
          }
    

        });
        
        serialPort.on("close", function (data) {
          serialPortActive = false;
          
          //Write to Log
          fs.write(fd, "\n------------------------------------------------------------\nClosing SerialPort: "+target+" at "+Date.now()+"\n------------------------------------------------------------\n");  
        });
      }
    });
  }
}




//SerialPort Init

if (!serialPortPath) {
  console.log("You must specify a serial port location.");
} else {
  var target = serialPortPath.split("/");
  target = target[target.length-1]+".log";
  if (!baudrate) {
    baudrate = 115200;
  }
  fs.open("./"+target, 'w', function (err, fd) {
    setInterval(function () {
      if (!serialPortActive) {
        try {
          attemptLogging(fd, serialPortPath, baudrate);
        } catch (e) {
          // Error means port is not available for listening.
          serialPortActive = false;
        }
      }
    }, 1000);
  });
}



