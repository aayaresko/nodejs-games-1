/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 26.07.16.
 */
var fs = require('fs');
function Init( logFileName, data ) {
    this.fileName = logFileName;
}
Init.prototype.log = function( data ) {
    if (logFileName) {
        fs.appendFile(
            logFileName,
            JSON.stringify(data) + '\n',
            function(error) {
                if (error) {
                    console.log(`Some error occurred ${ error }`);
                }
            });
    }
}

module.exports = init;
