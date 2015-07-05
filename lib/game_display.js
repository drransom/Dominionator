(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

D.GameDisplay = function(options) {
  this.selector = options.selector;
  this.el = options.el;
  this.currentGame = this.selector.currentGame;
  this.cardList = this.selector.cardList;
};

var GameDisplay = D.GameDisplay;

GameDisplay.prototype.displayCards = function () {
  var sortOrder = this.sortDisplay.pullSortOrder();
  this.cardList.sortKingdomCards(sortOrder);
  this.displayAllCards();
};

GameDisplay.prototype.displayAllCards = function() {
  var card, options, template = JST.cardList;
  options = {
    cards: _.where(this.cardList.allCards, {isEvent: false}),
    selector: this,
    hasEvent: this.currentGame.events.length > 0,
    kingdomCards: this.currentGame.kingdomCards,
    events: _.where(this.cardList.allCards, {isEvent: true}),
    platColClass: this.hiddenClass(this.currentGame.platCol),
    sheltersClass: this.hiddenClass(this.currentGame.shelters),
    ruinsClass: this.hiddenClass(this.currentGame.includesRuins()),
    spoilsClass: this.hiddenClass(this.currentGame.includesSpoils()),
    displayClass: this.hiddenClass(
      this.currentGame.platCol || this.currentGame.shelters ||
      this.currentGame.includesRuins() || this.currentGame.includesSpoils()
    )
  };
  this.el.innerHTML = template(options);
};

GameDisplay.prototype.hiddenClass = function (bool) {
  var hiddenClass = bool ? "" : "slideLeft";
  return hiddenClass;
};

GameDisplay.prototype.constructCardName = function(card) {
  return card.constructCardName(this.currentGame);
};

GameDisplay.prototype.vetoCard = function (cardId) {
  this.currentGame.veto(parseInt(cardId));
  this.updateCardDisplay();
};

GameDisplay.prototype.updateCardDisplay = function () {
  var card, li, cardText, allCards = this.cardList.allCards;
  for (var i = 0; i < allCards.length; i++) {
    card = allCards[i];
    if (li = document.getElementById(card.idHtml())) {
      cardText = document.getElementById(card.nameIdHtml());
      Dominionator.removeClass(li, 'slideLeft');
      Dominionator.addClass(li, card.hidden);
      cardText.innerHTML = card.constructCardName(this.currentGame);
    }
  }
  this.updateExtraSetup();
};

GameDisplay.prototype.updateExtraSetup = function () {
  var display, displayClass, ruins, ruinsClass, shelters, sheltersClass, platCol,
    platColClass, spoils, spoilsClass;

  ruins = document.getElementById('display-ruins');
  ruinsClass = this.hiddenClass(this.currentGame.includesRuins());
  ruins.setAttribute('class', ruinsClass);

  shelters = document.getElementById('display-shelters');
  sheltersClass = this.hiddenClass(this.currentGame.shelters);
  shelters.setAttribute('class', sheltersClass);

  platCol = document.getElementById('display-plat-col');
  platColClass = this.hiddenClass(this.currentGame.platCol);
  platCol.setAttribute('class', platColClass);

  spoils = document.getElementById('display-spoils');
  spoilsClass = this.hiddenClass(this.currentGame.includesSpoils());
  spoils.setAttribute('class', spoilsClass);

  display = document.getElementById('extra-setup');
  displayClass = this.hiddenClass(
    this.currentGame.includesRuins() || this.currentGame.shelters ||
    this.currentGame.platCol || this.currentGame.includesSpoils());
  display.setAttribute('class', displayClass);
};

})();
