import {Card} from './card.js';
import {Helpers} from './helpers.js';
import {Sorter} from './sorter.js';

class CardList {
  constructor() {
    this.byName = {};
    this.sets = [];
  }

  initializeCards(callback) {
    let request = new XMLHttpRequest();
    let callbackFunction = this.loadCardsFunction(callback);
    request.addEventListener("load", callbackFunction, false);
    request.open("GET", 'dominion_cards.csv', true);
    request.send();
  }

  loadCardsFunction(callback) {
    let list = this;
    return function(response) {
      Papa.parse(response.currentTarget.response, {
        header: true,
        dynamicTyping: true,
        complete: function(papaResponse) {
          for (let i = 0; i < papaResponse.data.length; i++) {
            list.loadOneCard(papaResponse.data[i]);
          }
          list.constructAllCards();
          callback.call();
        }
      });
    };
  }

  loadOneCard(array) {
    let card = Card.constructCard(array);
    if (!card.name) {
      return;
    } else if (this[card.set] === undefined) {
      this[card.set] = [card];
      this.sets.push(card.set);
    } else {
      this[card.set].push(card);
    }
    this.byName[card.name] = card;
  }

  constructAllCards() {
    this.allCards = [];
    this.sets.forEach((setName) => {
      this.allCards = this.allCards.concat(this[setName]);
    });
  }

  resetKingdom() {
    this.resetCards(this.allCards);
  }

  resetCards(array) {
    if (array) {
      array.forEach((card) => {
        card.hide({default: true});
      });
    }
  }

  sortKingdomCards(properties) {
    this.allCards = Sorter.sortByProperties(this.allCards, properties);
  }

  findOneCardByName(name) {
    if (name) {
      return Helpers.findWhere(this.allCards, {name: name});
    } else {
      return false;
    }
  }

  findCardsByName(names) {
    let cards = [];
    names.forEach((name) => {
      cards.push(this.findOneCardByName(name));
    });
    return cards;
  }

  updateHiddenStatus(game) {
    this.allCards.forEach((card) => {
      if (game.includesCard(card)) {
        card.unhide();
      } else {
        card.hide({default: true});
      }
    });
  }

  hideNotInKingdom(game) {
    if (!game.includesCard(card)) {
      card.hide({default: true});
    }
  }

  displayInKingdom(game) {
    if (game.includesCard(card)) {
      card.unhide({default: true});
    }
  }
};

export {CardList};
