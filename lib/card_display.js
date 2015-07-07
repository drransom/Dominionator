(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.CardDisplay = function(options) {
  this.card = options.card;
  this.gameDisplay = options.gameDisplay;
  this.selector = options.selector;
};

var CardDisplay = D.CardDisplay;

CardDisplay.prototype.template = function() {
  return ("" +
    "<li class='" + this.card.hidden + "' id='" + this.card.idHtml()  + "'>" +
    "<span id='" + this.card.nameIdHtml() +"'>" +
    this.selector.constructCardName(this.card) + "</span>" +
    this.card.costString() + " " + this.card.set +
    JST.vetoButton(this.card) + "</li>");
};

CardDisplay.prototype.idHtml = function () {
  return "domininionator-card-" + this.card.id;
};

CardDisplay.prototype.nameIdHtml = function () {
  return "dominionator-card-name-" + this.card.id;
};




})();
