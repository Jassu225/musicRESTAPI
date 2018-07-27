const util = require('util');
const path = require('path');
const Promise = require('bluebird');
const qs = require('querystring');
const fs = require('fs');
const config = require('../../config');
const Utils = require('./utils');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
};

class RequestHandler {
    
    // GET Handlers
    sendApiInfo(req, res) {
        res.writeHead(200, headers);
        res.write("Welcome to Music REST API");
        res.end();
    }
    // POST Handlers
    storeSongs(req, res) {
        // console.log(req.);
        // req.files.forEach(file => {
        //     fs.writeFile(path.join(config.uploadsDir, file.name), 'Hello Node.js', (err) => {
        //         if (err) throw err;
        //         console.log('The file has been saved!');
        //     });
        // });
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            // props {name, size, type, binaryString}
            let file = JSON.parse(body);
            console.log(file["name"]);
            // console.log(body);
            // res.writeHead(200, headers);
            // res.end('ok');
            fs.writeFile(
                path.join(config.uploadsDir, `${file["name"]}.${Utils.getExtension(file["type"])}`),
                file["binaryString"],
                (err) => {
                    if(err) throw err;
                    res.writeHead(200, headers);
                    res.end('File has been saved');
                }
            );
        });
    }
}

module.exports = RequestHandler;