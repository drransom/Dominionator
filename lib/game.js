import {Helpers} from './helpers.js';

class Game {
  constructor(cardList, alchemy_min_3, gameDisplay, gameId) {
    this.cardList = cardList;
    this.alchemy_min_3 = alchemy_min_3 || false;
    this.sets = this.cardList.sets;
    this.byName = {};
    this.maxCards = 10;
    this.gameDisplay = gameDisplay;
    this.rejectedCards = [];
    this.id = gameId;
  }

  static countBySet(cardArray, setName) {
    return cardArray.reduce((previousValue, currentValue, index, array) => {
      return previousValue + (currentValue.set === setName ? 1 : 0);
    }, 0);
  }

  static convertFromHistory(options) {
    let cardList = options.cardList;
    let newGame = new Game(cardList);
    let gameState = options.gameState;
    newGame.kingdomCards = cardList.findCardsByName(gameState.kingdomCards);
    newGame.eventsAndLandmarks = cardList.findCardsByName(gameState.eventsAndLandmarks);
    newGame.vetoed = cardList.findCardsByName(gameState.vetoed);
    newGame.currentCards = cardList.findCardsByName(gameState.currentCards);
    newGame.bane = cardList.findOneCardByName(gameState.bane);
    newGame.maxCards = parseInt(gameState.maxCards);
    newGame.platCol = gameState.platCol;
    newGame.shelters = gameState.shelters;
    newGame.maxBySet = gameState.maxBySet;
    newGame.minBySet = gameState.minBySet;
    newGame.id = gameState.id;
    newGame.gameDisplay = options.gameDisplay;
    return newGame;
  }

  constructCurrentCards() {
    this.currentCards = [];
    let sets = this.options.sets || this.cardList.sets;
    this.setMinMax();

    for (let i = 0; i < sets.length; i++) {
      this.currentCards = this.currentCards.concat(this.cardList[sets[i]]);
    }

    if (this.options.banned) {
      banned_cards = this.constructCardsByName(this.options.banned);
      this.currentCards = Helpers.reject(this.currentCards, (card) => {
        return (Helpers.findWhere(banned_cards, {name: card.name }) !== undefined);
      });
    }
  }

  constructCardsByName(card_names) {
    return card_names.map((name) => this.byName[name]);
  }

  selectCards(options) {
    options = options || {};
    this.selectRandomCards(options);
  }

  selectRandomCards(options) {
    this.options = options || {};
    if (this.options.chooseEvents === undefined) {
      this.options.chooseEvents = true;
    }
    this.constructCurrentCards();
    this.selectKingdomCards(this.options.chooseEvents);
    this.selectSheltersPlatCol();
  }

  includesCondition(condition) {
    for (let kingdomCard of this.kingdomCards) {
      if (kingdomCard[condition]) {
        return true;
      }
    }
    return false;
  }

  includesRuins() { return this.includesCondition("ruins"); }

  includesSpoils() { return this.includesCondition("spoils"); }

  setMinMax() {
    this.options.minBySet = this.options.minBySet || {};
    this.options.maxBySet = this.options.maxBySet || {};
    this.minBySet = {};
    this.maxBySet = {};
    this.sets.forEach ((set) => {
      this.minBySet[set] = this.options.minBySet[set] || 0;
      this.maxBySet[set] = this.options.maxBySet[set] || 11;
      if (this.maxBySet[set] < this.minBySet[set]) {
        this.maxBySet[set] = 11;
      }
    });
  }

  eventClass() {
    return (this.eventsAndLandmarks.length > 0) ? "" : Helpers.hidden();
  }

  landmarkClass() {
    return (this.eventsAndLandmarks.length > 0) ? "" : Helpers.hidden();
  }

  includesCard(card) {
    return this.kingdomCards.indexOf(card) >= 0 ||
           this.eventsAndLandmarks.indexOf(card) >= 0;
  }

  alchemyConditionMet() {
    let numAlchemy = this.numAlchemyCards();
    return (numAlchemy >= 3 && numAlchemy <= 4);
  }

  needsMoreAlchemy() {
    let numAlchemy = this.numAlchemyCards();
    return (this.alchemy_min_3 && numAlchemy < 3 &&
      this.maxCards - this.numAlchemyCards() >= 2);
  }

  numAlchemyCards() {
    return Helpers.where(this.kingdomCards, {set: "Alchemy"}).length;
  }

  hasPotionCard() {
    return Helpers.find(this.kingdomCards,function(card) {
      return card.isPotionCard && card.isPotionCard();
    });
  }
};

class NullGame extends Game {
  constructor() {
    super([]);
    this.platCol = false;
    this.shelters = false;
  }

  includesRuins() { return false; };
  includesSpoils() { return false; };
  eventClass() { return "slideLeft"; };
};

export {Game, NullGame};
