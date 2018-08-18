const DBHandler = require('./dbHandler');
const {Objects} = require('./dbSchemasAndObjects');
const MetadataHandler = require('./metadataHandler');
const config = require('../../config');
const path = require('path');

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
        console.log(await DBHandler.addSong(song));
    }

    static async extractMetaAndAddToDB(fileName) {
        let metadata = await this.extractMetaData(fileName);
        // console.log(util.inspect(metadata, { showHidden: false, depth: null }));
        await this.addSongToDB(fileName, metadata);
    }

    static async getSongs() {
        return await DBHandler.getSongs();
    }
}

module.exports = BusinessLayer;