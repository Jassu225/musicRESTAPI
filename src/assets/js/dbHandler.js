import LinvoDB from 'linvodb3';
import path from 'path';
import util from 'util';
import leveljs from 'level-js';

import Schemas from './dbSchemas';

LinvoDB.defaults.store = { db: leveljs}; // Comment out to use LevelDB instead of level-js
// Set dbPath - this should be done explicitly and will be the dir where each model's store is saved
LinvoDB.dbPath = path.join(process.cwd(), './data', './db');


export default class DBHandler {
    songsDB;
    albumsDB;
    DBHandler() {
        this.songsDB = new LinvoDB("song", Schemas.song());
        this.songsDB.ensureIndex({
            fieldName: 'path',
            unique: true
        });

        this.albumsDB = new linvodb("album", Schemas.album());
            this.albumsDB.ensureIndex({
            fieldName: 'title',
            unique: true
        });

        this.songsDB = util.promisify(this.songsDB);
        this.albumsDB = util.promisify(this.albumsDB);
    }

    async addSong(song) {
        return await this.songsDB.insert(song);
    }

    async addAlbum(album) {
        return await this.albumsDB.insert(album);
    }
}