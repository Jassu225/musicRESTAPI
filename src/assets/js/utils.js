const types = {
    mp3: 'audio/mp3',
    txt: 'text/plain'
}

class Utils {
    static getExtension(type) {
        switch(type) {
            case types.mp3: return 'mp3';
            case types.txt: return 'txt';
        }
    }
}

module.exports = Utils;