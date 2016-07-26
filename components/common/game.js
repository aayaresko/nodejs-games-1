/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 25.07.16.
 * Game component.
 *
 * This component is used to store the game data.
 * It contains methods and properties common to all games.
 *
 */
var inquirer = require('inquirer');

function GameObject( id, successCallback, failureCallback ) {
    if (!successCallback) {
        successCallback =
            function() {
                this.runActions();
                this.runMainPrompt();
            }
            .bind(this);
    }
    if (!failureCallback) {
        failureCallback =
            function() {
                this.finalActions();
            }
            .bind(this);
    }
    this.successCallback = successCallback;
    this.failureCallback = failureCallback;
    this.id = id;
}
GameObject.prototype.init = function() {};
GameObject.prototype.runActions = function() {};
GameObject.prototype.runMainPrompt = function() {};
GameObject.prototype.restartPrompt = function() {
    this.init();
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'restart',
                message: 'Play again?'
            }
        ])
        .then(function(answers) {
                if (answers.restart) {
                    console.log('restarting');
                    this.successCallback();
                } else {
                    this.failureCallback();
                }
            }
            .bind(this)
        );
};
GameObject.prototype.finalActions = function() {};

module.exports = GameObject;