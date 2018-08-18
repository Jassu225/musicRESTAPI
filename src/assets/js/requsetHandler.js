const util = require('util');
const path = require('path');
const Promise = require('bluebird');
const qs = require('querystring');
const fs = require('fs');
const config = require('../../config');
const Utils = require('./utils');
const BusinessLayer = require('./BusinessLayer');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
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