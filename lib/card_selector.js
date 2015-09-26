;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var surrogate;
var D = Dominionator;

var cardSelector = function () {
  this.cardList = new D.CardList();
  this.lastGameId = -1;
  this.currentGameId = -1;
};

if (D.CardSelector) {
  surrogate = D.CardSelector;
  cardSelector.prototype = surrogate.prototype;
}

D.CardSelector = cardSelector;
var CardSelector = D.CardSelector;

CardSelector.prototype.createNewGame = function (options) {
  this.lastGameId += 1;
  this.currentGameId = this.lastGameId;
  // this.cardList.resetKingdom();
  options = options || {};
  this.currentGame = new D.Game(this.cardList, options.alchemy_min_3, this.gameDisplay, this.lastGameId);
  options.newGame = true;
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
      el: document.getElementById('dominionator-card-location')});
    selector.gameDisplay.createCardDisplays(selector.displayCards.bind(selector));
    selector.initializeNavigation();
  };
};

CardSelector.prototype.initializeNavigation = function() {
  this.navigationDisplay = new D.NavigationDisplay({
    el: document.getElementById('dominionator-navigation'),
    selector: this
  });
  this.navigationDisplay.initializeDisplay();
};

CardSelector.prototype.updateGame = function() {
  var selector = this;
  return function (event) {
    selector.currentGame = D.Game.convertFromHistory({
      gameState: event.state,
      cardList: selector.cardList,
      gameDisplay: selector.gameDisplay
    });
    selector.currentGameId = selector.currentGame.id;
    selector.updateCardDisplay();
    selector.gameDisplay.hideVetoButton();
  };
};


CardSelector.prototype.setVetoListener = function () {
  var displayArea = document.getElementById('dominionator-card-location');
  var selector = this;
  return function () {
    displayArea.addEventListener('click', function (event) {
      var target = event.target;
      if (target.tagName === "BUTTON" && target.classList.contains('veto-button')) {
        selector.vetoCard(target.cardDisplay);
      }
    });
  };
};

CardSelector.prototype.initializeForm = function (callback) {
  var selector = this;
  this.selectForm = new D.NewGameForm({
    selector: selector,
    el: document.getElementById('dominionator-input-form')
  });
  this.selectForm.initializeForm();
  this.sortDisplay = new D.SortDisplay(this);
  this.sortDisplay.render();
  callback();
};


CardSelector.prototype.displayAllCards = function() {
  this.gameDisplay.displayAllCards();
};


CardSelector.prototype.constructCardName = function(card) {
  return this.gameDisplay.constructCardName(card);
};

CardSelector.prototype.vetoCard = function (cardDisplay) {
  this.currentGame.veto(cardDisplay.card);
  this.gameDisplay.displayVetoButton();
  this.updateHistory();
};

CardSelector.prototype.updateHistory = function() {
  history.replaceState(new D.GameHistory(this.currentGame),
                    "Dominionator!");
};

CardSelector.prototype.updateCardDisplay = function (options) {
  this.gameDisplay.currentGame = this.currentGame;
  this.gameDisplay.updateCardDisplay(options);
  this.navigationDisplay.updateNavigationDisplay();
};

CardSelector.prototype.updateSort = function (options) {
  if (this.currentGame) {
    this.displayCards( {properties: options});
  }
};

CardSelector.prototype.canGoForward = function() {
  return this.currentGameId < this.lastGameId;
};

CardSelector.prototype.canGoBack = function() {
  return this.currentGameId >= 1;
};

})();
