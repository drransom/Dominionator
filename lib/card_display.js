;(function() {
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
  return "dominionator-card-" + this.card.id;
};

CardDisplay.prototype.nameIdHtml = function() {
  return "dominionator-card-name-" + this.card.id;
};

CardDisplay.prototype.constructNode = function() {
  var li  = document.createElement('li');
  li.setAttribute('id', this.idHtml());

  this.createTextSpan();
  var cardAttributesElement = this.createCardAttributes();
  this.vetoButtonElement = this.createVetoButton();

  li.appendChild(this.textSpanElement);
  li.appendChild(cardAttributesElement);
  li.appendChild(this.vetoButtonElement);

  this.node = li;
  this.hide(true);
};

CardDisplay.prototype.createTextSpan = function() {
  this.textSpanElement = document.createElement('span');
  var cardName = this.selector.constructCardName(this.card);
  this.textSpanElement.setAttribute('id', this.nameIdHtml());
  this.textSpanElement.appendChild(document.createTextNode(cardName + ", "));
};

CardDisplay.prototype.createCardAttributes = function() {
  var cardAttributesString = "  Cost: " + this.card.costString();
  cardAttributesString += (this.card.isEvent ? "" : ", Set: " + this.card.set);
  return document.createTextNode(cardAttributesString);
};

CardDisplay.prototype.createVetoButton = function() {
  var buttonElement = document.createElement('button');
  D.addClass(buttonElement, 'veto-button');
  D.addClass(buttonElement, 'dominionator-veto');
  buttonElement.setAttribute('id', "dominionator-veto-button-" + this.card.id);
  buttonElement.innerHTML = "Veto";
  return buttonElement;
};

CardDisplay.prototype.setCard = function () {
  this.textSpanElement.cardDisplay = this;
  this.vetoButtonElement.cardDisplay = this;
  this.card.cardDisplay = this;
};

CardDisplay.prototype.updateDisplay = function(game, reverse) {
  this.updateHiddenStatus(game, reverse);
  this.textSpanElement.innerHTML = this.card.constructCardName(game);
};

CardDisplay.prototype.hide = function(direction) {
  if (direction === "right") {
    this.slideRight();
  } else {
    this.slideLeft();
  }
};

CardDisplay.prototype.unhide = function(direction) {
  var node = this.node;
  if (direction === "right") {
    this.teleportRight();
    window.setTimeout(function () {
        D.removeClass(node, "slideLeft");
        D.removeClass(node, "slideRight");
      },
      100
    );
  } else {
    D.removeClass(node, "slideLeft");
    D.removeClass(node, "slideRight");
  }
};

CardDisplay.prototype.teleportLeft = function() {
  this.teleport("left");
};

CardDisplay.prototype.teleportRight = function(callback) {
  this.teleport("right", callback);
};

CardDisplay.prototype.teleport = function(direction) {
  D.addClass(this.node, "noMove");
  D.removeClass(this.node, (direction === "right" ? "slideLeft" : "slideRight"));
  D.addClass(this.node, (direction === "right" ? "slideRight" : "slideLeft"));
  D.removeClass(this.node, "noMove");
};

CardDisplay.prototype.slideLeft = function() {
  D.removeClass(this.node, "slideRight");
  D.removeClass(this.node, "noMove");
  D.addClass(this.node, "slideLeft");
};

CardDisplay.prototype.slideRight = function() {
  D.removeClass(this.node, "slideLeft");
  D.removeClass(this.node, "noMove");
  D.addClass(this.node, "slideRight");
};

CardDisplay.prototype.processRemoval = function(reverse) {
  if (reverse) {
    this.slideLeft();
  } else {
    this.slideRight();
  }
};

CardDisplay.prototype.isHidden = function() {
  return this.node.hasClass("slideLeft") || this.node.hasClass("slideRight");
};

CardDisplay.prototype.updateHiddenStatus = function(game, reverse) {
  if (game.includesCard(this.card)) {
    this.unhide(reverse);
  } else {
    this.hide(reverse);
  }
};

})();
