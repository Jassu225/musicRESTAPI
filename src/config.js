const path = require('path');

const config = {
    port: process.env.PORT || 7991,
    uploadsDir: path.join(__dirname, "../uploads"),
    databaseDir: path.join(__dirname, "../databases")
}

module.exports = config;