const http =  require('http');

const config = require('./config');
const routes = require('./assets/js/routes');
let RequestHandler = require('./assets/js/requsetHandler');

//create a server object:
http.createServer(function (req, res) {
    let requsetHandler = new RequestHandler();
    if(req.method == 'GET') {   // GET reqquests
        switch(req.url) {
            case routes.GET.root:
                requsetHandler.sendApiInfo(req, res);
                break;
        }
    } else {    // POST requests
        switch(req.url) {
            case routes.POST.uploadSong: 
                requsetHandler.storeSongs(req, res);
                break;
        }
    }
}).listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
}); //the server object listens on port 8080