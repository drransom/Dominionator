import {Helpers} from './helpers.js';

class GameHistory {
  constructor(game) {
    this.kingdomCards = GameHistory.convertCards(game.kingdomCards);
    this.landscapes = GameHistory.convertCards(game.landscapes);
    this.vetoed = GameHistory.convertCards(game.vetoed);
    this.currentCards = GameHistory.convertCards(game.currentCards);
    this.bane = game.bane ? game.bane.name : false;
    this.maxCards = game.maxCards;
    this.platCol = game.platCol;
    this.shelters = game.shelters;
    this.maxBySet = game.maxBySet;
    this.minBySet = game.minBySet;
    this.id = game.id;
  }

  static convertCards(cards) {
    let nameArray = [];
    cards.forEach(function(card) {
      nameArray.push(card.name)
    });
    return nameArray;
  }
};

class NavigationDisplay {
  constructor(options) {
    this.el = options.el;
    this.selector = options.selector;
  }

  initializeDisplay() {
    this.forwardButton = Helpers.createDOMElement({
      type: 'button',
      attributes: {
        innerText: 'next set',
        hidden: true,
        disabled: true
      },
      nonStandardAttributes: {
        onClick: 'window.history.forward()'
      }
    });
    this.backButton = Helpers.createDOMElement({
      type: 'button',
      attributes: {
        innerText: 'previous set',
        hidden: true,
        disabled: true
      },
      nonStandardAttributes: {
        onClick: 'window.history.back()'
      }
    });
    this.navigationMessage = Helpers.createDOMElement({
      type: 'div',
      attributes: {
        hidden: true,
        innerText: 'You can also navigate between sets using the browser history.'
      }
    });
    this.el.appendChild(this.backButton);
    this.el.appendChild(this.forwardButton);
    this.el.appendChild(this.navigationMessage);
  }

  updateNavigationDisplay() {
    if (this.selector.canGoBack() || this.selector.canGoForward()) {
      this.navigationMessage.removeAttribute('hidden');
    } else {
      this.navigationMessage.setAttribute('hidden', true);
    }
    if (this.selector.canGoBack()) {
      this.backButton.removeAttribute('hidden');
      this.backButton.removeAttribute('disabled');
    } else {
      this.backButton.setAttribute('disabled', true);
    }

    if (this.selector.canGoForward()) {
      this.forwardButton.removeAttribute('hidden');
      this.forwardButton.removeAttribute('disabled');
    } else {
      this.forwardButton.setAttribute('disabled', true);
    }
  }
};

export {GameHistory, NavigationDisplay};
