;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.CardDisplay = function(options) {
  this.card = options.card;
  this.gameDisplay = options.gameDisplay;
  this.selector = options.selector;
  this.constructNode();
  this.attachDisplayToNodes();
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
  this.hide({default: true});
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
  buttonElement.innerText = "Veto";
  return buttonElement;
};

CardDisplay.prototype.attachDisplayToNodes = function () {
  this.textSpanElement.cardDisplay = this;
  this.vetoButtonElement.cardDisplay = this;
  this.card.cardDisplay = this;
};

CardDisplay.prototype.updateDisplay = function(game) {
  this.updateHiddenStatus(game);
  this.textSpanElement.innerText = this.card.constructCardName(game);
};

CardDisplay.prototype.hide = function(options) {
  if (options && options.default !== undefined & !options.default) {
    this.slideRight();
  } else {
    this.slideLeft();
  }
};

CardDisplay.prototype.unhide = function(options) {
  if (options && options.default !== undefined && !options.default) {
    this.unhideRight();
  } else {
    this.removeHiddenClasses();
  }
};

CardDisplay.prototype.unhideRight = function() {
  var display = this;
  this.teleportRight();
  window.setTimeout(function () {
      display.removeHiddenClasses();
    },
    100
  );
};

CardDisplay.prototype.removeHiddenClasses = function() {
  D.removeClass(this.node, "slideLeft");
  D.removeClass(this.node, "slideRight");
};

CardDisplay.prototype.teleportLeft = function() {
  this.teleport("left");
};

CardDisplay.prototype.teleportRight = function(callback) {
  this.teleport("right");
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

CardDisplay.prototype.processRemoval = function(options) {
  this.hide(options);
};

CardDisplay.prototype.isHidden = function() {
  return this.node.hasClass("slideLeft") || this.node.hasClass("slideRight");
};

CardDisplay.prototype.updateHiddenStatus = function(game) {
  if (game.includesCard(this.card)) {
    this.unhide({default: true});
  } else {
    this.hide({default: true});
  }
};

})();
