// Type 3: Persistent datastore with automatic loading
const Datastore = require('nedb');
const path = require('path');
const util = require('util');
const config = require('./../../config');
const Promise = require('bluebird');

// const {Schemas} = require('./dbSchemasAndObjects');

let songsDB = new Datastore({ filename: path.join(config.databaseDir, 'songs.db'), autoload: true });
let albumsDB = new Datastore({ filename: path.join(config.databaseDir, 'albums.db'), autoload: true });
// You can issue commands right away


songsDB = Promise.promisifyAll(songsDB);
albumsDB = Promise.promisifyAll(songsDB);

class DBHandler {

    static async addSong(song) {
        let data;
        await songsDB.insertAsync(song)
        .then((song) => {
            // if(err) console.log(err);
            // console.log(song);
            data = song;
        });
        return data;
    }

    static async addAlbum(album) {
        let data;
        await albumsDB.insertAsync(album)
        .then(album => {
            data =  album;
        });
        return data;
    }

    static async getSongs() {
        let data;
        await songsDB.findAsync({})
        .then(docs => {
            // console.log(docs);
            data = docs;
        });
        return data;
    }
}

module.exports = DBHandler;