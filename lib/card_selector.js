import {CardList} from './card_list.js';
import {Game, NullGame} from './game.js';
import {GameDisplay} from './game_display.js';
import {GameHistory, NavigationDisplay} from './game_history.js';
import {NewGameForm} from './card_select_form.js';
import {SortDisplay} from './sort_display.js';

class CardSelector {
  constructor() {
    this.cardList = new CardList();
    this.lastGameId = -1;
    this.currentGameId = -1;
  }


  createNewGame(options) {
    this.lastGameId += 1;
    this.currentGameId = this.lastGameId;
    options = options || {};
    this.currentGame = new Game(this.cardList, options.alchemy_min_3, this.gameDisplay, this.lastGameId);
    options.newGame = true;
    this.currentGame.selectCards(options);
    this.updateCardDisplay(options);
    history.pushState(new GameHistory(this.currentGame),
                      "Dominionator!");
  }

  displayCards() {
    let sortOrder = this.sortDisplay.pullSortOrder();
    this.cardList.sortKingdomCards(sortOrder);
    this.displayAllCards();
  }

  start() {
    window.onpopstate = this.updateGame();
    this.cardList.initializeCards(this.initializeDocument());
  }

  initializeDocument() {
    let selector = this;
    return function () {
      selector.initializeForm(selector.setVetoListener());
      selector.currentGame = new NullGame(selector.cardList);
      selector.gameDisplay = new GameDisplay({
        selector: selector,
        el: document.getElementById('dominionator-card-location')});
      selector.gameDisplay.createCardDisplays(selector.displayCards.bind(selector));
      selector.initializeNavigation();
    };
  }

  initializeNavigation() {
    this.navigationDisplay = new NavigationDisplay({
      el: document.getElementById('dominionator-navigation'),
      selector: this
    });
    this.navigationDisplay.initializeDisplay();
  }

  updateGame() {
    let selector = this;
    return function(event) {
      selector.currentGame = Game.convertFromHistory({
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
    let displayArea = document.getElementById('dominionator-card-location');
    let selector = this;
    return function() {
      displayArea.addEventListener('click', (event) => {
        let target = event.target;
        if (target.tagName === "BUTTON" && target.classList.contains('veto-button')) {
          selector.vetoCard(target.cardDisplay);
        }
      });
    };
  }

  initializeForm(callback) {
    let selector = this;
    this.selectForm = new NewGameForm({
      selector: selector,
      el: document.getElementById('dominionator-input-form')
    });
    this.selectForm.initializeForm();
    this.sortDisplay = new SortDisplay(this);
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
    history.replaceState(new GameHistory(this.currentGame),
                      "Dominionator!");
  }

  updateCardDisplay(options) {
    this.gameDisplay.currentGame = this.currentGame;
    this.gameDisplay.updateCardDisplay(options);
    this.navigationDisplay.updateNavigationDisplay();
  }

  updateSort(options) {
    if (this.currentGame) {
      this.displayCards({properties: options});
    }
  }

  canGoForward() {
    return this.currentGameId < this.lastGameId;
  }

  canGoBack() {
    return this.currentGameId >= 1;
  }
}

window.CardSelector = CardSelector;
export {CardSelector};
