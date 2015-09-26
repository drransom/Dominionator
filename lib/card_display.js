;(function() {
'use strict';

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.CardDisplay = function(options) {
  this.card = options.card;
  this.gameDisplay = options.gameDisplay;
  this.selector = options.selector;
  if (this.card.isPotionCard()) {
    this.potionImg = options.potionImg.cloneNode();
  }
  this.constructNode();
  this.attachDisplayToNodes();
  this.card.setDisplay(this);
};

var CardDisplay = D.CardDisplay;

CardDisplay.prototype.idHtml = function() {
  return "dominionator-card-" + this.card.id;
};

CardDisplay.prototype.nameIdHtml = function() {
  return "dominionator-card-name-" + this.card.id;
};

CardDisplay.prototype.constructNode = function() {
  var li  = D.createDOMElement({
    type: 'li',
    attributes: {id: this.idHtml()}
  });
  this.el = li;

  this.createTextSpan();
  this.el.appendChild(this.textSpanElement);
  this.createCardAttributes();

  this.vetoButtonElement = this.createVetoButton();
  this.el.appendChild(this.vetoButtonElement);

  this.hide({default: true});
};

CardDisplay.prototype.createTextSpan = function() {
  this.textSpanElement = D.createDOMElement({
    type: 'span',
    classes: ['dominionator-card-name'],
    attributes: {
      id: this.nameIdHtml(),
      innerHTML: this.selector.constructCardName(this.card)
    }
  });
};

CardDisplay.prototype.createCardAttributes = function() {
  this.addCost();
  this.el.insertAdjacentHTML('beforeend',
    "<span class='dominionator-set-name'>" + this.card.set + "</span>");
};

CardDisplay.prototype.addCost = function() {
  var costSpanElement = document.createElement('span');
  this.addNumCost(costSpanElement);
  this.addPotionCost(costSpanElement);
  this.el.appendChild(costSpanElement);
};

CardDisplay.prototype.addNumCost = function(costSpanElement) {
  var numCost = this.card.getNumCost();
  if (numCost || !this.card.isPotionCard()) {
    var costElement = D.createDOMElement({
      type: 'span',
      attributes: {innerText: numCost},
      classes: ['dominionator-card-cost-num']
    });

    if (!this.card.isPotionCard()) {
      D.addClass(costElement, 'dominionator-card-cost-num-no-img');
    }

    costSpanElement.appendChild(costElement);
  }
};

CardDisplay.prototype.addPotionCost = function(costSpanElement) {
  if (this.card.isPotionCard()) {
    if (this.card.getNumCost() === 0) {
      D.addClass(this.potionImg, 'dominionator-potion-img-no-text');
    }
    costSpanElement.appendChild(this.potionImg);
  }
};

CardDisplay.prototype.createVetoButton = function() {
  var buttonElement = D.createDOMElement({
    type: 'button',
    classes: ['veto-button', 'dominionator-veto'],
    attributes: {
      id: 'dominionator-veto-button-' + this.card.id,
      innerText: 'Veto'
    }
  });
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
    this.textSpanElement.innerHTML = this.constructCardHTML(game);
  }
};

CardDisplay.prototype.constructCardHTML = function(game) {
  var text = this.card.constructCardName(game);
  if (this.card.hasExtraCards()) {
    text += '<br><small>(with ' + this.card.extraPile + ')</small>';
  }

  return text;
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
  D.removeClass(this.el, "slideLeft");
  D.removeClass(this.el, "slideRight");
};

CardDisplay.prototype.teleportLeft = function() {
  this.teleport("left");
};

CardDisplay.prototype.teleportRight = function(callback) {
  this.teleport("right");
};

CardDisplay.prototype.teleport = function(direction) {
  D.addClass(this.el, "noMove");
  D.removeClass(this.el, (direction === "right" ? "slideLeft" : "slideRight"));
  D.addClass(this.el, (direction === "right" ? "slideRight" : "slideLeft"));
  D.removeClass(this.el, "noMove");
};

CardDisplay.prototype.slideLeft = function() {
  D.removeClass(this.el, "slideRight");
  D.removeClass(this.el, "noMove");
  D.addClass(this.el, "slideLeft");
};

CardDisplay.prototype.slideRight = function() {
  var el = this.el;
  D.addTransitionEvent(el, this.teleportLeft.bind(this));
  D.removeClass(this.el, "slideLeft");
  D.removeClass(this.el, "noMove");
  D.addClass(this.el, "slideRight");
};

CardDisplay.prototype.processRemoval = function(options) {
  this.hide(options);
};

CardDisplay.prototype.updateHiddenStatus = function(game) {
  if (game.includesCard(this.card)) {
    this.unhide({default: true});
  } else if (!this.isHidden) {
    this.hide({default: false});
  } else {
    this.hide({default: true});
  }
};

})();
