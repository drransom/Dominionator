(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardSelector = function () {
  this.cardList = new Dominionator.CardList();
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
  this.cardList.initializeCards(this.initializeForm());
  this.setVetoListener();
};

CardSelector.prototype.initializeForm = function () {
  var selector = this;
  return function () {
    var form = document.getElementById('input-form');
    form.innerHTML = JST.cardForm( { sets: selector.cardList.sets.sort() } );

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var min = selector.findMinMax("min");
      var max = selector.findMinMax("max");
      selector.cardList.resetKingdom();
      selector.selectAndDisplay({ min: min, max: max });
    });
  };
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
    events: this.cardList.events,
    platColClass: this.hiddenClass(this.cardList.platCol),
    sheltersClass: this.hiddenClass(this.cardList.shelters),
    ruinsClass: this.hiddenClass(this.cardList.includesRuins()),
    spoilsClass: this.hiddenClass(this.cardList.includesSpoils()),
    displayClass: this.hiddenClass(
      this.cardList.platCol || this.cardList.shelters ||
      this.cardList.includesRuins() || this.cardList.includesSpoils()
    )
  };
  el.innerHTML = template(options);
};

CardSelector.prototype.hiddenClass = function (bool) {
  var hiddenClass = bool ? "" : "slideLeft";
  return hiddenClass;
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
  this.updateCardDisplay();
};

CardSelector.prototype.updateCardDisplay = function () {
  var card, li, allCards = this.cardList.allCards;
  for (var i = 0; i < allCards.length; i++) {
    card = allCards[i];
    li = document.getElementById(card.idHtml());
    li.setAttribute('class', card.hidden);
  }
  this.updateExtraSetup();
};

CardSelector.prototype.updateExtraSetup = function () {
  var display, displayClass, ruins, ruinsClass, shelters, sheltersClass, platCol,
    platColClass, spoils, spoilsClass;

  ruins = document.getElementById('display-ruins');
  ruinsClass = this.hiddenClass(this.cardList.includesRuins());
  ruins.setAttribute('class', ruinsClass);

  shelters = document.getElementById('display-shelters');
  sheltersClass = this.hiddenClass(this.cardList.shelters);
  shelters.setAttribute('class', sheltersClass);

  platCol = document.getElementById('display-plat-col');
  platColClass = this.hiddenClass(this.cardList.platCol);
  platCol.setAttribute('class', platColClass);

  spoils = document.getElementById('display-spoils');
  spoilsClass = this.hiddenClass(this.cardList.includesSpoils());
  spoils.setAttribute('class', spoilsClass);

  display = document.getElementById('extra-setup');
  displayClass = this.hiddenClass(
    this.cardList.includesRuins() || this.cardList.shelters ||
    this.cardList.platCol || this.cardList.includesSpoils());
  display.setAttribute('class', displayClass);
};

CardSelector.prototype.findMinMax = function (minOrMax) {
  var id, value, result = {};
  this.cardList.sets.forEach(function(set) {
    id = set + "-" + minOrMax;
    result[set] = document.getElementById(id).value;
  });
  return result;
};

})();
