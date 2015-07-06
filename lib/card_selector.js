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
  this.cardList.resetKingdom();
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
      el: document.getElementById('card-location')});
    selector.displayCards();
  };
};

CardSelector.prototype.updateGame = function() {
  var selector = this;
  return function (event) {
    selector.currentGame = D.Game.convertFromHistory(event.state, selector.cardList);
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
  var selector = this;
  this.selectForm = new D.CardSelectForm({
    selector: selector,
    el: document.getElementById('input-form')
  });
  this.selectForm.initializeForm();
  this.sortDisplay = new D.SortDisplay(this);
  this.sortDisplay.render();
  callback();
  // this.setExcludeListeners();
};

// CardSelector.prototype.changeSetExclusion = function (options) {
//   var disabled, htmlizedName, minOption, maxOption, max;
//   max = options.max;
//   if (options.disabled === undefined) {
//     disabled = !max;
//   } else {
//     disabled = options.disabled;
//   }
//   htmlizedName = D.htmlize(options.setName);
//   minOption = document.getElementById(htmlizedName + '-min');
//   maxOption = document.getElementById(htmlizedName + '-max');
//   minOption.disabled = disabled;
//   maxOption.disabled = disabled;
//   CardSelector.resetValue(minOption, 0);
//   CardSelector.resetValue(maxOption, max);
// };
//
//
// CardSelector.prototype.includeSet = function (setName, options) {
//   var disabled, max;
//   options = options || {};
//   max = options.max || 10;
//   if (options.disabled === undefined) {
//     disabled = false;
//   } else {
//     disabled = options.disabled;
//   }
//   this.changeSetExclusion({setName: setName, max: max, disabled: disabled});
// };
//
// CardSelector.prototype.excludeSet = function (setName) {
//   this.changeSetExclusion({setName: setName, max: 0});
//   this.updateAlchemyBox(setName, false);
// };


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
  this.gameDisplay.currentGame = this.currentGame;
  this.gameDisplay.updateCardDisplay();
};

CardSelector.prototype.updateSort = function (options) {
  if (this.currentGame) {
    this.displayCards( {properties: options});
  }
};

})();
