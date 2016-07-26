/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 25.07.16.
 * BlackJack container.
 *
 * This component holds all game logic for a BlackJack game.
 * It controls game process and determine winner and loser.
 * It prints current game status and game results automatically.
 * The return value of method [[stand()]] and [[hit()]]:
 * * 1 dealer wins
 * * 2 player wins
 * * 3 push
 * This module follows the BlackJack logic as much as possible.
 *
 */
var colors = require('colors/safe');
var sugar = require('sugar');

function Container( player, dealer ) {
    this.player = player;
    this.dealer = dealer;
}
Container.prototype.hit = function( options ) {
    if (options.dealer) {
        this.dealer.hitMe(Number.random(1, 11));
    }
    if (options.player) {
        this.player.hitMe(Number.random(1, 11));
    }
    if (this.dealer.points == 21 && this.player.points == 21) {
        console.log(colors.green('Push'));
        this.printStatus();
        return 3;
    } else if (this.dealer.points == 21) {
        console.log(colors.red('Dealer wins'));
        this.printStatus();
        return 1;
    } else if (this.player.points == 21) {
        console.log(colors.green('Player wins'));
        this.printStatus();
        return 2;
    } else if (this.player.points > 21 && this.dealer.points < 21) {
        console.log(colors.red('Dealer wins'));
        this.printStatus();
        return 1;
    } else if (this.player.points < 21 && this.dealer.points > 21) {
        console.log(colors.green('Player wins'));
        this.printStatus();
        return 2;
    } else if (this.dealer.points > 21 && this.player.points > 21) {
        console.log(colors.green('Push'));
        this.printStatus();
        return 3;
    } else {
        this.printStatus('default', true);
    }
};
Container.prototype.stand = function() {
    var result = null;
    while(!result) {
        result = this.hit({ dealer: true });
        if (!result) {
            if (
                this.dealer.points < 21 &&
                (this.dealer.points > this.player.points)
            ) {
                console.log(colors.red('Dealer wins'));
                this.printStatus();
                return 1;
            } else if (
                this.player.points < 21 &&
                (this.player.points < this.dealer.points)
            ) {
                console.log(colors.green('Player wins'));
                this.printStatus();
                return 2;
            }
        }
    }
    return 1;
};
Container.prototype.printStatus = function( format, hideFirstCard ) {
    if (format === 'default') {
        console.log(colors.yellow(`Player points: ${ this.player.getPoints() }\nDealer pints: ${ this.dealer.getPoints(hideFirstCard) }`));
    } else {
        console.log(colors.blue(`Player points: ${ this.player.getPoints() }\nDealer pints: ${ this.dealer.getPoints(hideFirstCard) }`));
    }
};

module.exports = Container;