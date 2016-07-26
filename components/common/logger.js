/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 26.07.16.
 * Logger component.
 *
 * This component is used to simplify logging process.
 * Specified items will be saved to a log file (synchronously).
 * If specified item is an object, logger will convert it into a JSON string.
 * It may read log file (asynchronously). In this case it will return the data as an array of strings.
 *
 * @see https://nodejs.org/api/fs.html
 */
var fs = require('fs');
var sugar = require('sugar');

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
Logger.prototype.readLogFile = function( fileName, callback ) {
    if (!fileName) {
        fileName = this.fileName;
    }
    fs.readFile(fileName, { encoding: 'utf8', highWaterMark: 4 * 1024 },  function( error, chunk ) {
        if (error) {
            console.log('some error occurred: ' + error.message);
            //throw error;
        } else {
            callback(chunk.lines());
        }
    });
};

module.exports = Logger;
