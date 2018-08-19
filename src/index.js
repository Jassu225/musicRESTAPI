const http =  require('http');

const config = require('./config');
const routes = require('./assets/js/routes');
let RequestHandler = require('./assets/js/requsetHandler');

//function used to decode base64 string
global.atob = require('atob');

//create a server object:
http.createServer(function (req, res) {
    // console.log(`${req.method} ${req.url}`);
    // used for fetching main url (static serving)
    let routeUrl = req.url.substring(0, req.url.indexOf('/', 1));
    let fileName = decodeURI(req.url.substring(req.url.indexOf('/', 1) + 1));

    // console.log(decodeURI(fileName));
    if(req.method == 'GET') {   // GET reqquests
        switch(req.url) {
            case routes.GET.root:
                RequestHandler.sendApiInfo(req, res);
                break;
            case routes.GET.getSongs:
                RequestHandler.getSongs(req, res);
                break;
            default:
                if(routeUrl === routes.GET.uploads) {
                    // static serving
                    RequestHandler.getSong(req, res, fileName);
                }
                break;
        }
    } else {    // POST requests
        switch(req.url) {
            case routes.POST.uploadSong: 
                RequestHandler.storeSongs(req, res);
                break;
            case routes.POST.uploadComplete:
                RequestHandler.uploadCompleted(req, res);
                break;
        }
    }
}).listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
}); //the server object listens on port 8080