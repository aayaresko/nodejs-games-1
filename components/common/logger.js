/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 26.07.16.
 */
var fs = require('fs');

function Logger( options ) {
    if (!options.fileName) {
        options.fileName = 'log.txt';
    }
    if (!options.lineSeparator) {
        options.lineSeparator = '\n'
    }
    this.fileName = options.fileName;
    this.lineSeparator = options.lineSeparator;
}
Logger.prototype.log = function( data ) {
    if (this.fileName) {
        var string = null;
        var type = typeof data;
        switch (type) {
            case 'object':
                string = JSON.stringify(data);
                break;
            default:
                string = data;

        }
        fs.appendFileSync(this.fileName, string + this.lineSeparator);
    }
};

module.exports = Logger;
