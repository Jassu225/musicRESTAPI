const DBHandler = require('./dbHandler');
const {Objects} = require('./dbSchemasAndObjects');
const MetadataHandler = require('./metadataHandler');
const config = require('../../config');
const path = require('path');
const util = require('util');

let currentSong = null;

// const dbHandler = new DBHandler();

class BusinessLayer {

    static async extractMetaData(fileName) {
        return await MetadataHandler.extract(fileName);
    }

    static async addSongToDB(fileName, metadata) {
        let song = Objects.song();
        let metaData = metadata;
        song.title = fileName;
        song.path = path.join(config.uploadsDir, fileName);
        song.album = metaData.common.album ? metaData.common.album : song.album;
        song.albumartist = metaData.common.albumartist ? metaData.common.albumartist.split(',') : song.albumartist;
        song.artists = metaData.common.artists ? metaData.common.artists: song.artists;

        let picture = metaData.common.picture;
        song.cover = ( (picture && picture[0].data) ? `data:${picture[0].format};base64,${picture[0].data.toString('base64')}`: song.cover);
        song.disk.no = metaData.common.disk ? metaData.common.disk.no : song.disk.no;
        song.disk.of = metaData.common.disk ? metaData.common.disk.of : song.disk.of;
        song.duration = metadata.format.duration ? metadata.format.duration : song.duration;
        song.genre = metaData.common.genre ? metaData.common.genre : song.genre;
        song.track.no = metaData.common.track ? metaData.common.track.no : song.track.no;
        song.track.of = metaData.common.track ? metaData.common.track.of : song.track.of;
        song.year = metadata.common.year ? metadata.common.year : song.year;

        // console.log(song);
        currentSong = song;
        await DBHandler.addSong(song);
    }

    static async addSongToAlbumDB(fileName, metaData) {
        let album = await DBHandler.findAlbum(metaData.common.album ? metaData.common.album : 'unknown');
        // console.log(album);
        if(album) {
            album.songsList.push(fileName);
            // atrists concatenation not working
            metaData.common.artists ? album.artists.concat(metaData.common.artists): null;
            metaData.format.duration ? album.duration +=  metaData.format.duration : currentSong.duration;
            album.tracks++;
            await DBHandler.updateAlbum(album);
        } else {
            album = Objects.album();
            album.artists =  metaData.common.artists ? metaData.common.artists: album.artists;
            let picture = metaData.common.picture;
            album.cover =  ( (picture && picture[0].data) ? `data:${picture[0].format};base64,${picture[0].data.toString('base64')}`: album.cover);
            album.duration =  metaData.format.duration ? metaData.format.duration : album.duration;
            album.songsList.push(fileName);
            album.title = metaData.common.album ? metaData.common.album : album.title;
            album.tracks++;
            album.year = metaData.common.year ? metaData.common.year : album.year;
            await DBHandler.addAlbum(album);
        }
    }

    static async extractMetaAndAddToDB(fileName) {
        let metadata = await this.extractMetaData(fileName);
        console.log(util.inspect(metadata, { showHidden: false, depth: null }));
        await this.addSongToDB(fileName, metadata);
        await this.addSongToAlbumDB(fileName, metadata);
    }

    static async getSongs() {
        return await DBHandler.getSongs();
    }

    static async getAlbums() {
        return await DBHandler.getAlbums();
    }
}

module.exports = BusinessLayer;