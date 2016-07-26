/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 25.07.16.
 */
'use strict';
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2));
var logFileName = argv['_'][0];
var inquirer = require('inquirer');
var colors = require('colors/safe');
var GameObject = require('./components/common/game');
var GameContainer = require('./components/black_jack/container');
var User = require('./components/black_jack/user');
var sugar = require('sugar');
var Logger = require('./components/common/logger');

var logger = new Logger(logFileName);

var headsOrTailObject = new GameObject(null, run);

headsOrTailObject.runMainPrompt = function() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'guess',
                message: 'Which number in my memory write now, 1 or 2?',
                validate: function(value) {
                    var result = parseInt(value);
                    return (result === 1 || result === 2);
                }
            }
        ])
        .then(function(answers) {
                var random = Number.random(1, 2);
                if (logFileName) {
                    fs.appendFile(
                        logFileName,
                        JSON.stringify({
                            guess: answers.guess,
                            random: random,
                            date: new Date()
                        }) + '\n',
                        function(error) {
                            if (error) {
                                console.log(`Some error occurred ${ error }`);
                            }
                        });
                }
                if (answers.guess == random) {
                    console.log(colors.green('Correct! You won!'));
                } else {
                    console.log(colors.red(`Wrong! The number is ${ random }. Please, try again!`));
                }
                this.restartPrompt();
            }
            .bind(this)
        );
};

var blackJack = new GameObject(null, run);

blackJack.init = function() {
    var player = new User('player');
    var dealer = new User('dealer');
    this.container = new GameContainer( player, dealer );
};
blackJack.runMainPrompt = function() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'next',
                message: 'What would you like to do?',
                choices: [
                    'Hit me!',
                    'Stand'
                ]
            }
        ])
        .then(function( answers ) {
                var error = 0;
                if (answers.next == 'Hit me!') {
                    error = this.container.hit({ dealer: true, player: true });
                    if (error) {
                        this.restartPrompt();
                    } else {
                        this.runMainPrompt();
                    }
                }
                if (answers.next == 'Stand') {
                    error = this.container.stand();
                    if (error) {
                        this.restartPrompt();
                    } else {
                        this.runMainPrompt();
                    }
                }
                if (answers.next == 'Quit') {
                    run();
                }
            }
            .bind(this)
        );
};
blackJack.runActions = function() {
    var error = this.container.hit({ dealer: true, player: true });
        error = this.container.hit({ dealer: true, player: true });
    if (error) {
        this.restartPrompt();
    }
};

function run() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'chooser',
                message: 'Choose the game you like to play',
                choices: [
                    'Heads or tails',
                    'Black Jack',
                    'Quit'
                ]
            }
        ])
        .then(function( answers ) {
            switch (answers.chooser) {
                case 'Heads or tails':
                    headsOrTailObject.runMainPrompt();
                    break;
                case 'Black Jack':
                    blackJack.init();
                    blackJack.runActions();
                    blackJack.runMainPrompt();
                    break;
                case 'Quit':
                    process.exit(0);
                    break;
                default:
                    process.exit(1);
            }
        });
}
run();
