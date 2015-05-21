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

CardSelector.prototype.selectAndDisplay = function (options) {
  options = options || {min: {Adventures: 3}};
  this.selectCards(options);
  this.displayCards(options);
};

CardSelector.prototype.selectCards = function (options) {
  options = options || {};
  this.cardList.selectRandomCards(options);
};

CardSelector.prototype.displayCards = function (options) {
  options = options || {};
  options.properties = options.properties || ['name'];
  this.cardList.sortKingdomCards(options.properties);
  this.displayAllCards();
};

CardSelector.prototype.start = function () {
  var form = document.getElementById('input-form'), selector = this;
  form.innerHTML = JST.cardForm();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    selector.selectAndDisplay();
  });
};


CardSelector.prototype.displayAllCards = function() {
  var card, cardNameDisplay, el, options, template = JST.cardList;
  el = document.getElementById('card-location');
  options = {
    cards: this.cardList.kingdomCards,
    selector: this,
    platCol: this.cardList.platCol,
    shelters: this.cardList.shelters,
    ruins: this.cardList.ruins,
    events: this.cardList.events
  };
  el.innerHTML = template(options);
  console.log("Kingdom cards:");
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
