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
  this.node = li;

  this.createTextSpan();
  li.appendChild(this.textSpanElement);
  this.createCardAttributes();

  this.vetoButtonElement = this.createVetoButton();
  li.appendChild(this.vetoButtonElement);

  this.hide({default: true});
};

CardDisplay.prototype.createTextSpan = function() {
  this.textSpanElement = document.createElement('span');
  var cardName = this.selector.constructCardName(this.card);
  this.textSpanElement.setAttribute('id', this.nameIdHtml());
  D.addClass(this.textSpanElement, 'dominionator-card-name');
  this.textSpanElement.appendChild(document.createTextNode(cardName));
};

CardDisplay.prototype.createCardAttributes = function() {
  var cardAttributesString = "<span class='dominionator-card-cost'>" +
    this.card.costString() + "</span>";
  if (!this.card.isEvent) {
    cardAttributesString += "<span class='dominionator-set-name'>" + this.card.set +
      "</span>";
  }
  this.node.insertAdjacentHTML('beforeend', cardAttributesString);
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
  if (!this.isHidden) {
    this.textSpanElement.innerHTML = this.card.constructCardName(game);
  }
};

CardDisplay.prototype.hide = function(options) {
  if (!this.isHidden && options && options.default !== undefined &&
      !options.default) {
    this.slideRight();
  } else {
    this.slideLeft();
  }
  this.isHidden = true;
};

CardDisplay.prototype.unhide = function(options) {
  if ((this.isHidden || this.isHidden === undefined) && options &&
      options.default !== undefined && !options.default) {
    this.unhideRight();
  } else {
    this.removeHiddenClasses();
  }
  this.isHidden = false;
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
  return this.isHidden;
};

CardDisplay.prototype.updateHiddenStatus = function(game) {
  if (game.includesCard(this.card)) {
    this.unhide({default: true});
  } else {
    this.hide({default: true});
  }
};

})();
