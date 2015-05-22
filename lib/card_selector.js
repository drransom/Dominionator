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
  this.initializeForm();
  this.setVetoListener();
};

CardSelector.prototype.initializeForm = function () {
  var form = document.getElementById('input-form'), selector = this;
  form.innerHTML = JST.cardForm();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    selector.selectAndDisplay();
  });
};

CardSelector.prototype.setVetoListener = function () {
  var displayArea = document.getElementById('card-location');
  var selector = this;
  displayArea.addEventListener('click', function (event) {
    var target = event.target;
    if (target.classList && target.classList.contains('veto-button')) {
      selector.vetoCard(target.id);
    }
  });
};


CardSelector.prototype.displayAllCards = function() {
  var card, cardNameDisplay, el, options, template = JST.cardList;
  el = document.getElementById('card-location');
  options = {
    cards: this.cardList.allCards,
    selector: this,
    platCol: this.cardList.platCol,
    shelters: this.cardList.shelters,
    ruins: this.cardList.ruins,
    events: this.cardList.events
  };
  el.innerHTML = template(options);
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

CardSelector.prototype.vetoCard = function (cardId) {
  this.cardList.veto(parseInt(cardId));
  this.displayCards();
};

})();
