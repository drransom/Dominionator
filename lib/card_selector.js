(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var cardSelector = function () {
  this.cardList = new Dominionator.CardList();
};

if (Dominionator.CardSelector) {
  var surrogate = Dominionator.CardSelector;
  cardSelector.prototype = surrogate.prototype;
}

Dominionator.CardSelector = cardSelector;
var CardSelector = Dominionator.CardSelector;

CardSelector.prototype.createNewGame = function (options) {
  options = options || {};
  this.currentGame = new Dominionator.Game(this.cardList, options.alchemy_min_3);
  this.currentGame.selectCards(options);
  this.displayCards(options);
};

CardSelector.prototype.displayCards = function (options) {
  options = options || {};
  options.properties = options.properties || ['name'];
  this.cardList.sortKingdomCards(options.properties);
  this.displayAllCards();
};

CardSelector.prototype.start = function () {
  this.cardList.initializeCards(this.initializeListeners());
};

CardSelector.prototype.initializeListeners = function () {
  var selector = this;
  return function () {
    selector.initializeForm(selector.setVetoListener());
  };
};


CardSelector.prototype.setVetoListener = function () {
  var displayArea = document.getElementById('card-location');
  var selector = this;
  return function () {
    displayArea.addEventListener('click', function (event) {
      var target = event.target;
      if (target.classList && target.classList.contains('veto-button')) {
        selector.vetoCard(target.id);
      }
    });
  };
};
CardSelector.prototype.initializeForm = function (callback) {
  var form = document.getElementById('input-form');
  var selector = this;
  form.innerHTML = JST.cardForm( { sets: selector.cardList.sets.sort() } );
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var min = selector.findMinMax("min");
    var max = selector.findMinMax("max");
    var alchemy_min_3 = selector.checkAlchemyCondition();
    selector.cardList.resetKingdom();
    selector.createNewGame({ min: min, max: max, alchemy_min_3: alchemy_min_3});
  });
  selector.sortDisplay = new Dominionator.SortDisplay(selector);
  selector.sortDisplay.render();
  callback();
  this.setExcludeListeners();
};

CardSelector.prototype.setExcludeListeners = function () {
  var excludeButtons = document.querySelectorAll('input[name=exclude-checkbox]');
  var selector = this;
  for (var i = 0; i < excludeButtons.length; i++) {
    excludeButtons[i].addEventListener('change', function (event) {
      var target = event.target;
      if (target.checked) {
        selector.excludeSet(event.target.value);
      } else {
        selector.includeSet(event.target.value);
      }
    });
  }
  this.setAlchemyConditionListener();
};

CardSelector.prototype.changeSetExclusion = function (options) {
  var disabled, htmlizedName, minOption, maxOption, max;
  max = options.max;
  if (options.disabled === undefined) {
    disabled = !max;
  } else {
    disabled = options.disabled;
  }
  htmlizedName = Dominionator.htmlize(options.setName);
  minOption = document.getElementById(htmlizedName + '-min');
  maxOption = document.getElementById(htmlizedName + '-max');
  minOption.disabled = disabled;
  maxOption.disabled = disabled;
  CardSelector.resetValue(minOption, 0);
  CardSelector.resetValue(maxOption, max);
};

CardSelector.resetValue = function (optionList, value) {
  var currentNode;
  for (var i = 0; i < optionList.childNodes.length; i++) {
    currentNode = optionList.childNodes[i];
    if (parseInt(currentNode.value) === value) {
      currentNode.selected = true;
      return;
    }
  }
};

CardSelector.prototype.includeSet = function (setName, options) {
  var disabled, max;
  options = options || {};
  max = options.max || 10;
  if (options.disabled === undefined) {
    disabled = false;
  } else {
    disabled = options.disabled;
  }
  this.changeSetExclusion({setName: setName, max: max, disabled: disabled});
};

CardSelector.prototype.excludeSet = function (setName) {
  this.changeSetExclusion({setName: setName, max: 0});
  this.updateAlchemyBox(setName, false);
};


CardSelector.prototype.displayAllCards = function() {
  var card, el, options, template = JST.cardList;
  el = document.getElementById('card-location');
  options = {
    cards: _.where(this.cardList.allCards, {isEvent: false}),
    selector: this,
    hasEvent: this.currentGame.events.length > 0,
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
  el.innerHTML = template(options);
};

CardSelector.prototype.hiddenClass = function (bool) {
  var hiddenClass = bool ? "" : "slideLeft";
  return hiddenClass;
};

CardSelector.prototype.constructCardName = function(card) {
  return card.constructCardName(this.currentGame);
};

CardSelector.prototype.vetoCard = function (cardId) {
  this.currentGame.veto(parseInt(cardId));
  this.updateCardDisplay();
};

CardSelector.prototype.updateCardDisplay = function () {
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

CardSelector.prototype.updateExtraSetup = function () {
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

CardSelector.prototype.findMinMax = function (minOrMax) {
  var id, value, result = {};
  this.cardList.sets.forEach(function(set) {
    id = Dominionator.htmlize(set) + "-" + minOrMax;
    result[set] = document.getElementById(id).value;
  });
  return result;
};

})();
