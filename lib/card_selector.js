(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}
var D = Dominionator;

var cardSelector = function () {
  this.cardList = new D.CardList();
};

if (D.CardSelector) {
  var surrogate = D.CardSelector;
  cardSelector.prototype = surrogate.prototype;
}

D.CardSelector = cardSelector;
var CardSelector = D.CardSelector;

CardSelector.prototype.createNewGame = function (options) {
  options = options || {};
  this.currentGame = new D.Game(this.cardList, options.alchemy_min_3);
  this.currentGame.selectCards(options);
  this.updateCardDisplay(options);
  history.pushState(new D.GameHistory(this.currentGame),
                    "Dominionator!");
};

CardSelector.prototype.displayCards = function () {
  var sortOrder = this.sortDisplay.pullSortOrder();
  this.cardList.sortKingdomCards(sortOrder);
  this.displayAllCards();
};

CardSelector.prototype.start = function () {
  window.onpopstate = this.updateGame();
  this.cardList.initializeCards(this.initializeDocument());
};

CardSelector.prototype.initializeDocument = function () {
  var selector = this;
  return function () {
    selector.initializeForm(selector.setVetoListener());
    selector.currentGame = new D.NullGame(selector.cardList);
    selector.gameDisplay = new D.GameDisplay({
      selector: selector,
      currentGame: selector.currentGame,
      el: document.getElementById('card-location')});
    selector.displayCards();
  };
};

CardSelector.prototype.updateGame = function() {
  var selector = this;
  return function (event) {
    selector.currentGame = D.Game.convertFromHistory(event.state, selector.cardList);
    selector.gameDisplay = selector.currentGame;
    selector.updateCardDisplay();
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
  selector.sortDisplay = new D.SortDisplay(selector);
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
  htmlizedName = D.htmlize(options.setName);
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
  this.gameDisplay.displayAllCards();
};


CardSelector.prototype.constructCardName = function(card) {
  this.gameDisplay.constructCardName(this.currentGame);
};

CardSelector.prototype.vetoCard = function (cardId) {
  this.currentGame.veto(parseInt(cardId));
  this.updateCardDisplay();
};

CardSelector.prototype.updateCardDisplay = function () {
  this.gameDisplay.updateCardDisplay();
};


CardSelector.prototype.findMinMax = function (minOrMax) {
  var id, value, result = {};
  this.cardList.sets.forEach(function(set) {
    id = D.htmlize(set) + "-" + minOrMax;
    result[set] = document.getElementById(id).value;
  });
  return result;
};

CardSelector.prototype.updateSort = function (options) {
  if (this.currentGame) {
    this.displayCards( {properties: options});
  }
};

})();
