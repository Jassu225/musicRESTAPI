const routes = {
    GET: {
        root: '/',
        getSongs: '/getSongs',
        uploads: '/uploads' // static serving 
    },
    POST: {
        uploadSong: '/uploadSong',
        uploadComplete: '/uploadComplete'
    }
}

module.exports = routes;