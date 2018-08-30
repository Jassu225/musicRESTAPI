const routes = {
    GET: {
        root: '/',
        getSongs: '/getSongs',
        getAlbums: '/getAlbums',
        uploads: '/uploads' // static serving 
    },
    POST: {
        uploadSong: '/uploadSong',
        uploadComplete: '/uploadComplete'
    }
}

module.exports = routes;