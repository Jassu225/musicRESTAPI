var mm = require('music-metadata');
const util = require('util');
const config = require('../../config');
const path = require('path');
 

class MetadataHandler {
  static async extract(fileName) {
    let metaData = null;
    await mm.parseFile( path.join(config.uploadsDir, fileName), {native: true})
    .then(function (metadata) {
      // console.log(util.inspect(metadata, { showHidden: true, depth: null }));
      metaData = metadata;
    })
    .catch(function (err) {
      console.error(err.message);
    });

    return metaData;
  }
}

module.exports = MetadataHandler;