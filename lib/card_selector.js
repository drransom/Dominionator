(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardSelector = function () {
  this.cardList = new Dominionator.CardList();
  this.cardList.initializeCards();
};

var CardSelector = Dominionator.CardSelector;

CardSelector.prototype.selectCards = function (options) {
  options = options || {};
  this.cardList.selectRandomCards(options);
};

CardSelector.prototype.displayCards = function (options) {
  options = options || {};
  options.properties = options.properties || ['name'];
  this.cardList.sortKingdomCards(options.properties);
  this.displayExtraCards();
  this.displayKingdomCards();
};

CardSelector.prototype.displayExtraCards = function() {
  this.displayPlatColShelters();
  this.displaySpoils();
  this.displayRuins();
  this.displayEvents();
};

CardSelector.prototype.displayPlatColShelters = function() {
  if (this.cardList.platCol) {
    console.log("Platinum and Colonies");
  }
  if (this.cardList.shelters) {
    console.log("Shelters");
  }
};

CardSelector.prototype.displayEvents = function() {
  if (this.cardList.events.length > 0) {
    console.log("Events:");
    for (var i = 0; i < this.cardList.events.length; i++) {
      console.log (this.cardList.events[i].name);
    }
  }
};

CardSelector.prototype.displayRuins = function() {
  if (this.cardList.includesRuins()) {
    console.log("Ruins");
  }
};

CardSelector.prototype.displaySpoils = function() {
  if (this.cardList.includesSpoils()) {
    console.log("Spoils");
  }
};

CardSelector.prototype.displayKingdomCards = function() {
  var card, cardNameDisplay;
  console.log("Kingdom cards:");
  for (var i = 0; i < this.cardList.kingdomCards.length; i++) {
    card = this.cardList.kingdomCards[i];
    cardNameDisplay = this.constructCardName(card);
    console.log(cardNameDisplay + " " + card.set + " " + card.costString());
  }
};

CardSelector.prototype.constructCardName = function(card) {
  var name = card.name;
  if (card.extraPile && card.extraPile != "Bane") {
    name += " (with " + card.extraPile + ")";
  }
  if (card.bane) {
    name += " (bane)";
  }
  return name;
};

CardSelector.prototype.vetoCard = function (cardName) {
  this.cardList.veto(cardName);
};

})();
