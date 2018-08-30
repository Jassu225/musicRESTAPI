const Schemas = {
    song: function() {
      return{
        album: String,
        albumartist: [String],
        artists: [String],
        cover: String,
        disk: {
            no: Number,
            of: Number
        },
        duration: Number,
        genre: [String],
        path: String,
        playCount: Number,
        title: String,
        track: {
            no: Number,
            of: Number
        },
        year: String
      }
    },
    album: function() {
      return {
        artists: [String],
        cover: String,
        duration: Number,
        songsList: [String],
        title: String,
        tracks: Number,
        year: String
      }
    }
};

const Objects = {
  song: function() {
    return {
      album: 'unknown',
      albumartist: ['unknown'],
      artists: ['unknown'],
      cover: '/static/defaultCover.png',
      disk: {
          no: -1,
          of: -1
      },
      duration: -1,
      genre: ['unknown'],
      path: 'unknown',
      playCount: 0,
      title: 'unknown',
      track: {
          no: -1,
          of: -1
      },
      year: 'unknown'
    }
  },
  album: function() {
    return {
      artists: ['unknown'],
      cover: '/static/defaultCover.png',
      duration: 0,
      songsList: [],
      title: 'unknown',
      tracks: 0,
      year: 'unknown'
    }
  }
};


module.exports =  {
  Schemas,
  Objects
};