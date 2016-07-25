/*
 * Copyright (c) 2016  Andrey Yaresko.
 */

/**
 * Created by aayaresko on 25.07.16.
 */
var config = require('../../config');

function User(type) {
    this.points = 0;
    this.cards = 0;
    this.type = type;
    if (type == config.roles.DEALER) {
        this.hiddenPoints = 0;
    }
}
User.prototype.hitMe = function (points, cards) {
    if (points) {
        if (!cards) {
            cards = 1;
        }
        this.cards += cards;
        this.points += points;
        if (this.cards == 1 && this.type == config.roles.DEALER) {
            this.hiddenPoints = points;
        }
    }
};
User.prototype.getPoints = function (hideFirstCard) {
    if (this.type == config.roles.DEALER && hideFirstCard) {
        return this.points - this.hiddenPoints;
    } else {
        return this.points;
    }
};

module.exports = User;

//# sourceMappingURL=user-compiled.js.map