var express = require('express');
var multer  = require('multer');
var bodyParser = require('body-parser');
var cors = require('cors');
const config = require('./config');

var upload = multer({ dest: config.uploadsDir });

var app = express();
app.use(cors);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    console.log('root get');
  	res.send("Music REST API");
});

app.post('/', function (req, res) {
    res.sendStatus(403);
});

app.post('/uploadSong', upload.array('songs', 20), function(req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin');
    // res.end();
    console.log(req.file);
});

// app.post('/uploadSong', function(req, res) {
//     console.log(req.files);
// });


app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});