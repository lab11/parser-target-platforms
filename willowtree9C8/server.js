//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

client.init();

//Lets define a port we want to listen to
const PORT=8080; 

//Lets use our dispatcher
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

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('resources');

//A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});    

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(req.body);
    sentence = JSON.parse(req.body);
    console.log(sentence);
    if (sentence.type == "immediate action") {
        if (sentence.action.verb == "turn on") {
            var lotuslamp = client.light("Lotus Lamp");
            lotuslamp.on();
        } else if (sentence.action.verb == "turn off") {
            var lotuslamp = client.light("Lotus Lamp");
            lotuslamp.off();
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
