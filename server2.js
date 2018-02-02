var express = require("express");
var app = express();
var serveIndex = require('serve-index');


//405
app.post('/', function(req, res) {
    res.send('405: Method not allowed!');
});


app.use('/', express.static(__dirname), serveIndex(__dirname, {'icons': true})); //list of directories
app.use(express.static(__dirname + '/public')); //gives back static files (css,js,img...) which are in public

//gives back the homepage (+css,js... because of the second app.use)
/*app.get("/", function(req, res) {
    res.sendfile('SPA.html');
 });*/

app.get(/.*/, function(req, res) {
    var fileName = req.params.name;
    //works as well
    /*if (!fileName){
       res.send('404: Page not found!'); 
    }
    else{
        res.sendFile (fileName);
    }*/
    try {
        res.sendFile (fileName);
    }
    catch (err){
        res.send('404: Page not found!'); 
    }
    
});

var port = 8080;
app.listen(port, function() {
   console.log("Listening on " + port);
});



