/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 25.07.16.
 */
'use strict';
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2));
var logFileName = argv['filename'];
var inquirer = require('inquirer');
var colors = require('colors/safe');
var sugar = require('sugar');
var fs = require('fs');
var GameObject = require('./components/common/game');
var GameContainer = require('./components/black_jack/container');
var User = require('./components/black_jack/user');
var Logger = require('./components/common/logger');
var logger = new Logger({ fileName: logFileName });

if (argv['help']) {
    console.log(colors.yellow("Program stores game results in log file"));
    console.log(colors.yellow("Default log filename is 'log.txt'."));
    console.log(colors.yellow("You can specify any filename as '--filename' parameter"));
    process.exit(0);
}

var headsOrTailObject = new GameObject(1, null, run);
var blackJack = new GameObject(2, null, run);

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
                var winner = 0;
                if (answers.guess == random) {
                    winner = 2;
                    console.log(colors.green('Correct! You won!'));
                } else {
                    winner = 1;
                    console.log(colors.red(`Wrong! The number is ${ random }. Please, try again!`));
                }
                var data = {
                    gameId: this.id,
                    player: parseInt(answers.guess),
                    game: random,
                    winner: winner,
                    date: new Date()
                };
                logger.log(data);
                this.restartPrompt();
            }
            .bind(this)
        );
};

blackJack.init = function() {
    var player = new User('player');
    var dealer = new User('dealer');
    this.container = new GameContainer( player, dealer );
};
blackJack.saveResults = function( winner ) {
    var data = {
        gameId: this.id,
        player: this.container.player.points,
        game: this.container.dealer.points,
        winner: winner,
        date: new Date()
    };
    logger.log(data);
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
                var winner = 0;
                if (answers.next == 'Hit me!') {
                    winner = this.container.hit({ dealer: true, player: true });
                    if (winner) {
                        this.saveResults(winner);
                        this.restartPrompt();
                    } else {
                        this.runMainPrompt();
                    }
                }
                if (answers.next == 'Stand') {
                    winner = this.container.stand();
                    if (winner) {
                        this.saveResults(winner);
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
    this.container.hit({ dealer: true, player: true });
    var winner = this.container.hit({ dealer: true, player: true });
    if (winner) {
        this.saveResults(winner);
        this.restartPrompt();
    }
};

function getGameStatistics() {
    var statistics = [];
    var container = {
        wins: 0,
        total: 0,
        loose: 0,
        winSeries: 0,
        defeatsSeries: 0,
        wtl: 0
    };
    logger.readLogFile(null, function( lines ) {
        lines.forEach(function( string ) {
            if (string) {
                var item = JSON.parse(string);
                var gameId = item.gameId;
                if (!statistics[gameId]) {
                    statistics[gameId] = Object.create(container);
                }
                switch (item.winner) {
                    case 1:
                        statistics[gameId].loose += 1;
                        break;
                    case 2:
                        statistics[gameId].wins += 1;
                        break;
                }
                statistics[gameId].total += 1;
            }
        });
        statistics.forEach(function( item, index ) {
            item.wtl = (item.wins / item.loose).round();
            console.log(colors.blue(`In game with id ${ index } user won ${ item.wins } times and loose ${ item.loose }. Wins/Loose is round to ${ item.wtl }`));
        });
    });
}

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
                    'View statistics',
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
                case 'View statistics':
                    getGameStatistics();
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
