const Schemas = {
    song: function() {
      return{
        album: String,
        albumartist: [String],
        artist: [String],
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

export default Schemas;