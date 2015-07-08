(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.CardDisplay = function(options) {
  this.card = options.card;
  this.gameDisplay = options.gameDisplay;
  this.selector = options.selector;
  this.constructNode();
  this.setCard();
};

var CardDisplay = D.CardDisplay;

CardDisplay.prototype.idHtml = function() {
  return "domininionator-card-" + this.card.id;
};

CardDisplay.prototype.nameIdHtml = function() {
  return "dominionator-card-name-" + this.card.id;
};

CardDisplay.prototype.constructNode = function() {
  var li  = document.createElement('li');
  li.setAttribute('class', this.card.hidden);
  li.setAttribute('id', this.card.idHtml());
  this.textSpanElement = document.createElement('span');
  var cardName = this.selector.constructCardName(this.card);
  this.textSpanElement.setAttribute('id', this.card.nameIdHtml());
  this.textSpanElement.appendChild(document.createTextNode(cardName + ", "));
  var cardAttributesString = "  Cost: " + this.card.costString();
  cardAttributesString += (this.card.isEvent ? "" : ", Set: " + this.card.set);
  var cardAttributesElement = document.createTextNode(cardAttributesString);
  this.vetoButtonElement = this.createVetoButton();
  li.appendChild(this.textSpanElement);
  li.appendChild(cardAttributesElement);
  li.appendChild(this.vetoButtonElement);
  this.node = li;
};

CardDisplay.prototype.createVetoButton = function() {
  var buttonElement = document.createElement('button');
  buttonElement.setAttribute('class', 'veto-button');
  buttonElement.setAttribute('id', "dominionator-veto-button-" + this.card.id);
  D.addClass(buttonElement, 'dominionator-veto');
  var buttonText = document.createTextNode("Veto");
  buttonElement.appendChild(buttonText);
  return buttonElement;
};

CardDisplay.prototype.setCard = function () {
  this.textSpanElement.cardDisplay = this;
  this.vetoButtonElement.cardDisplay = this;
  this.card.cardDisplay = this;
};

CardDisplay.prototype.updateDisplay = function() {
  Dominionator.removeClass(this.node, 'slideLeft');
  Dominionator.addClass(this.node, this.card.hidden);
  this.textSpanElement.innerHTML = this.card.constructCardName(this.currentGame);
};


})();
