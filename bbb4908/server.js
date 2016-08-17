//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
var edimax = require('edimax-smartplug');

const PORT=1337; 

var conf_file = fs.readFileSync('./configuration.json');
var conf = JSON.parse(conf_file);

function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

function setEdimaxesPowerState (onoff, edimaxes) {
    if ( typeof edimaxes == 'undefined' ) {
        edimaxes = conf.edimaxes;
    }

    for (var i=0; i<edimaxes.length; i++) {
        edimax.setSwitchState(onoff, edimaxes[i]).catch(function(e) {console.log(e)});
    }
}

dispatcher.setStatic('resources');

//A sample GET request    
//dispatcher.onGet("/page1", function(req, res) {
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.end('Page One');
//});    

//A sample POST request
dispatcher.onPost("/programs", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    sentence = JSON.parse(req.body);
    console.log(sentence);
    if (sentence.type == "immediate_action") {
        var lights = [];
        for (i in conf.edimaxes) {
            if (i == 2 || i == 4 || i == 6) {
                lights.push(conf.edimaxes[i]);
            }
        }
        if (sentence.verb == "turn on") {
            setEdimaxesPowerState(true, lights);
        } else if (sentence.verb == "turn off") {
            setEdimaxesPowerState(false, lights);
        }
    }
    res.end('Got Post Data');
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
