;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var surrogate;
var D = Dominionator;

D.CardSelector = class CardSelector {
  constructor() {
    this.cardList = new D.CardList();
    this.lastGameId = -1;
    this.currentGameId = -1;
  }


  createNewGame(options) {
    this.lastGameId += 1;
    this.currentGameId = this.lastGameId;
    options = options || {};
    this.currentGame = new D.Game(this.cardList, options.alchemy_min_3, this.gameDisplay, this.lastGameId);
    options.newGame = true;
    this.currentGame.selectCards(options);
    this.updateCardDisplay(options);
    history.pushState(new D.GameHistory(this.currentGame),
                      "Dominionator!");
  }

  displayCards() {
    var sortOrder = this.sortDisplay.pullSortOrder();
    this.cardList.sortKingdomCards(sortOrder);
    this.displayAllCards();
  }

  start() {
    window.onpopstate = this.updateGame();
    this.cardList.initializeCards(this.initializeDocument());
  }

  initializeDocument() {
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
  }

  initializeNavigation() {
    this.navigationDisplay = new D.NavigationDisplay({
      el: document.getElementById('dominionator-navigation'),
      selector: this
    });
    this.navigationDisplay.initializeDisplay();
  }

  updateGame() {
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
  }


  setVetoListener() {
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
  }

  initializeForm(callback) {
    var selector = this;
    this.selectForm = new D.NewGameForm({
      selector: selector,
      el: document.getElementById('dominionator-input-form')
    });
    this.selectForm.initializeForm();
    this.sortDisplay = new D.SortDisplay(this);
    this.sortDisplay.render();
    callback();
  }

  displayAllCards() {
    this.gameDisplay.displayAllCards();
  }


  constructCardName(card) {
    return this.gameDisplay.constructCardName(card);
  }

  vetoCard(cardDisplay) {
    this.currentGame.veto(cardDisplay.card);
    this.gameDisplay.displayVetoButton();
    this.updateHistory();
  }

  updateHistory() {
    history.replaceState(new D.GameHistory(this.currentGame),
                      "Dominionator!");
  }

  updateCardDisplay(options) {
    this.gameDisplay.currentGame = this.currentGame;
    this.gameDisplay.updateCardDisplay(options);
    this.navigationDisplay.updateNavigationDisplay();
  }

  updateSort(options) {
    if (this.currentGame) {
      this.displayCards( {properties: options});
    }
  }

  canGoForward() {
    return this.currentGameId < this.lastGameId;
  }

  canGoBack() {
    return this.currentGameId >= 1;
  }

}
})();
