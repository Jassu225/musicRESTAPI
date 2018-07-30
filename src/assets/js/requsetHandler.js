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
    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
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
        
        let body = '';
        // console.log(req);
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            // props {name, size, type, binaryString}
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
            this.store(chunk, res);
        });
    }

    store(chunk, res) {
        
        if(chunk["isFirst"]) {
            console.log(chunk["isFirst"]);
            this.storeInNewFile(chunk, res);
        } else {
            console.log(chunk["isFirst"]);
            this.appendToExistingFile(chunk, res);
        }
    }

    storeInNewFile(chunk, res) {
        fs.writeFile(
            path.join(config.uploadsDir, chunk["name"]),
            chunk["base64Data"],
            (err) => {
                if(err) throw err;
                res.writeHead(200, headers);
                res.end('Chunk has been saved');
            }
        );
    }

    appendToExistingFile(chunk, res) {
        fs.appendFile(
            path.join(config.uploadsDir, chunk["name"]),
            chunk["base64Data"],
            (err) => {
                if(err) throw err;
                res.writeHead(200, headers);
                res.end('Chunk has been saved');
            }
        );
    }
}

module.exports = RequestHandler;