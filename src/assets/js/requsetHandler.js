const util = require('util');
const path = require('path');
const Promise = require('bluebird');
const qs = require('querystring');
const fs = require('fs');
const url = require('url');
const config = require('../../config');
const Utils = require('./utils');
const BusinessLayer = require('./BusinessLayer');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
};

// maps file extention to MIME types
const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

class RequestHandler {
    // Helper Functions
    static store(chunk, res) {
        // console.log(chunk);
        if(chunk["isFirst"]) {
            console.log(chunk["isFirst"]);
            this.storeInNewFile(chunk, res);
        } else {
            console.log(chunk["isFirst"]);
            this.appendToExistingFile(chunk, res);
        }
    }

    static storeInNewFile(chunk, res) {
        fs.writeFile(
            path.join(config.uploadsDir, chunk["name"]),
            chunk["base64String"],
            (err) => {
                if(err) throw err;
                res.writeHead(200, headers);
                res.end('Chunk has been saved');
            }
        );
    }

    static appendToExistingFile(chunk, res) {
        fs.appendFile(
            path.join(config.uploadsDir, chunk["name"]),
            chunk["base64String"],
            (err) => {
                if(err) throw err;
                res.writeHead(200, headers);
                res.end('Chunk has been saved');
            }
        );
    }
    // GET Handlers
    static sendApiInfo(req, res) {
        res.writeHead(200, headers);
        res.write("Welcome to Music REST API");
        res.end();
    }

    static async getSongs(req, res) {
        let songs = await BusinessLayer.getSongs();
        res.writeHead(200, headers);
        res.write(JSON.stringify({songs}));
        res.end();
    }

    static async getAlbums(req, res) {
        let albums = await BusinessLayer.getAlbums();
        res.writeHead(200, headers);
        res.write(JSON.stringify({albums}));
        res.end();
    }

    //static serving
    static getSong(req, res, fileName) {
        let fullPath = path.join(config.uploadsDir, fileName);
        console.log(fullPath);
        fs.readFile(
            fullPath,
            function(err, data) {
                if(err){
                  res.statusCode = 500;
                  res.end(`Error getting the file: ${err}.`);
                } else {
                  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                  const ext = path.parse(fullPath).ext;
                  // if the file is found, set Content-type and send data
                  res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
                  res.end(data);
                }
            }
        );
    }
    // POST Handlers
    static storeSongs(req, res) {
        
        let body = '';
        // console.log(req);
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            // props {name, size, type, base64String}
            // console.log(body.name);
            let chunk;
            // console.log(body);
            try {
                chunk = JSON.parse(body);
                
            } catch (ex) {
                // maybe preflight check (only for xhr request)
                res.writeHead(200, headers);
                res.end(ex.Message);
                return;
            }

            console.log(chunk["name"]);
            this.store(chunk, res); // decoding from base64 to binary using atob()
        });
    }

    static uploadCompleted(req, res) {
        let body = '';
        // console.log(req);
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', async () => {
            // props {name, size, type, base64String}
            // console.log(body.name);
            let file;
            // console.log(body);
            try {
                file = JSON.parse(body);
                
            } catch (ex) {
                // maybe preflight check (only for xhr request)
                res.writeHead(200, headers);
                res.end(ex.Message);
                return;
            }

            console.log(file["name"]);
            this.convertToBinary(file["name"], res);
        });
    }

    static convertToBinary(fileName, res) {
        fs.readFile(
            path.join(config.uploadsDir, fileName),
            'utf8',     // required to treat file as text file 
            function(error, data) {

                if(error) console.log(error);
                fs.writeFile(
                    path.join(config.uploadsDir, fileName),
                    new Buffer(data, 'base64'),
                    async function(error) {
                        if(error) console.log(error);
                        console.log('base64 to binary conversion completed');
                        await BusinessLayer.extractMetaAndAddToDB(fileName);
                        res.writeHead(200, headers);
                        res.end('Added to db');
                    }
                );
            }
        );
    }
}

module.exports = RequestHandler;