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
    newGame.landscapes = cardList.findCardsByName(gameState.landscapes);
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
    return (this.landscapes.length > 0) ? "" : Helpers.hidden();
  }

  landmarkClass() {
    return (this.landscapes.length > 0) ? "" : Helpers.hidden();
  }

  includesCard(card) {
    return this.kingdomCards.indexOf(card) >= 0 ||
           this.landscapes.indexOf(card) >= 0;
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

  selectKingdomCards(chooseEvents) {
    this.kingdomCards = [];
    this.landscapes = [];
    this.vetoed = [];
    this.updateKingdomCards(chooseEvents);
  }

  updateKingdomCards(chooseEvents) {
    chooseEvents = chooseEvents || false;
    this.currentCards = Helpers.shuffle(this.currentCards);
    this.selectCardsFromEachSet(this.minBySet, chooseEvents);
    while (this.kingdomCards.length < this.maxCards && this.currentCards.length > 0) {
      this.trySelectOneCard(chooseEvents);
    }
    this.processSpecialCases();
    this.currentCards = this.currentCards.concat(this.rejectedCards);
    this.rejectedCards = [];
  }

  selectCardsFromEachSet(setHash, chooseEvents) {
    for (let set in setHash) {
      if (parseInt(setHash[set]) !== 0) {
        this.selectnCardsFromSet(set, setHash[set], chooseEvents);
      }
    }
  }

  selectnCardsFromSet(setName, numCards, chooseEvents) {
    let currentSet = Helpers.shuffle(Helpers.where(this.currentCards, {set: setName}));
    let rejectedCards = [];
    let otherCards = Helpers.reject(this.currentCards,
       (card) => (card.set === setName));
    while (currentSet.length > 0 &&
           (numCards - this.numCardsInSet(setName) > 0) &&
           this.kingdomCards.length < 10) {
      let card = currentSet.pop();
      if (this.isValidKingdomCard(card)) {
        card.addToSelected({selectedCards: this.kingdomCards, game: this});
      } else if (this.isValidEventOrLandmark(card, chooseEvents) &&
          (!otherCards.length ||
            Math.random() < (currentSet.length / otherCards.length))) {
        let cardArray;
        if (card.isLandscape()) {
          cardArray = this.landscapes;
        }
        card.addToSelected({selectedCards: cardArray});
      } else {
        rejectedCards.push(card);
      }
    }
    this.currentCards = Helpers.shuffle(currentSet.concat(otherCards).concat(rejectedCards));
  }

  numCardsInSet(setName) {
    return Helpers.where(this.kingdomCards, {set: setName}).length;
  }

  trySelectOneCard(chooseEvents) {
    let card = this.currentCards.pop();
    if (this.isValidEventOrLandmark(card, chooseEvents)) {
      card.addToSelected({selectedCards: this.landscapes});
    } else if (this.isValidKingdomCard(card)) {
      card.addToSelected({selectedCards: this.kingdomCards, game: this});
    } else {
      this.rejectedCards.push(card);
    }
  }

  isValidEventOrLandmark(card, chooseEvents) {
    if (card.isEvent && !chooseEvents) {
      return false;
    } else if (this.landscapes.length >= 2) {
      return false;
    } else return this.isValidEvent(card) || this.isValidLandmark(card);
  }

  isValidEvent(card) {
    return card.isEvent && !this.isVetoedCard(card) &&
           this.landscapes.indexOf(card) < 0 &&
           Game.countBySet(this.allCardsInGame(), card.set) < this.maxBySet[card.set];
  }

  isValidKingdomCard(card) {
    return card.isKingdomCard && !this.isVetoedCard(card) &&
           this.kingdomCards.indexOf(card) < 0 &&
           Game.countBySet(this.allCardsInGame(), card.set) < this.maxBySet[card.set];
  }

  isValidLandmark(card) {
    return card.isLandmark && !this.isVetoedCard(card) &&
           this.landscapes.indexOf(card) < 0 &&
           Game.countBySet(this.allCardsInGame(), card.set) < this.maxBySet[card.set];
  }

  allCardsInGame() {
    return this.kingdomCards.concat(this.landscapes);
  }

  selectSheltersPlatCol() {
    this.shelters = this.selectShelters(this.options);
    this.platCol = this.selectPlatCol(this.options);
  }

  selectRandomCard() {
    return this.currentCards.pop();
  }

  selectShelters() {
    if (this.options.shelters === undefined) {
      let pctDarkAges = Game.countBySet(this.kingdomCards, "Dark Ages")/10;
      return Math.random() <= pctDarkAges;
    } else {
      return this.options.shelters;
    }
  }

  selectPlatCol() {
    if (this.options.platCol === undefined) {
      let pctProsperity = Game.countBySet(this.kingdomCards, "Prosperity")/10;
      return Math.random() <= pctProsperity;
    } else {
      return this.options.platCol;
    }
  }

  isVetoedCard(card) {
    return this.vetoed.indexOf(card) >= 0;
  }

  veto(card) {
    let index;
    if (!card.isLandscape()) {
      index = this.kingdomCards.indexOf(card);
      if (index >= 0) {
        this.gameDisplay.updateVetoDisplay("kingdom");
        this.vetoCardByIndex(index);
        this.updateKingdomCards();
      }
    } else  {
      this.gameDisplay.updateVetoDisplay("event");
      this.vetoAndReplaceLandscapeByIndex(index);
    }
  }

  vetoCardByIndex(index, array) {
    array = array || this.kingdomCards;
    let removedCard = array[index];
    array.splice(index, 1);
    this.vetoed.push(removedCard);
    removedCard.processRemoval(this);
  }

  vetoAndReplaceLandscapeByIndex(index) {
  }

  unveto() {
    let unvetoedCard = this.vetoed.pop();
    let lastCardAdded = this.getLastCardAdded(unvetoedCard);
    if (lastCardAdded === this.bane) {
      this.bane = unvetoedCard;
      this.lastBane = false;
    }
    this.removeCardThroughUnveto(lastCardAdded);
    this.readdCard(unvetoedCard);
  }

  getLastCardAdded(unvetoedCard) {
    if (unvetoedCard.isEvent) {
      return this.landscapes.pop();
    } else {
      return this.kingdomCards.pop();
    }
  }

  readdCard(card) {
    if (card.isEvent) {
      this.landscapes.push(card);
    } else {
      this.kingdomCards.push(card);
    }
    card.processUnveto(this);
  }

  removeCardThroughUnveto(card) {
    this.currentCards.push(card);
    card.removeThroughUnveto(this);
  }

  processSpecialCases() {
    this.processYoungWitch();
  }

  processYoungWitch() {
    if (this.kingdomCards.length <= this.maxCards &&
        !this.kingdomCards.every(function(card) {
          return !card.isYoungWitch();
        }) &&
        !this.bane) {
      this.addBaneCard();
    }
  }

  addReplacementBaneCard() {
    this.maxCards -=1;
    this.addBaneCard();
  }

  addBaneCard() {
    let counter = 0, card;
    while (counter < 200) {
      card = this.selectRandomCard();
      if (this.isValidKingdomCard(card) && card.meetsBaneCost()) {
        this.addBaneToKingdom({card: card, direction: "left"});
        break;
      } else {
        counter += 1;
        this.currentCards.unshift(card);
        if (counter >= 200) {
          throw "unable to find cards satsifying conditions";
        }
      }
    }
  }

  addBaneToKingdom(options) {
    options.card.addToSelected({selectedCards: this.kingdomCards,
                                direction: options.direction});
    this.bane = options.card;
    this.bane.updateCardDisplay(this);
    this.maxCards += 1;
  }

  unvetoBane() {
    if (this.lastBane) {
      this.addBaneToKingdom({card: this.lastBane, direction: "right"});
      this.lastBane = false;
    }
  }

  removeBaneCard(direction) {
    let index = Helpers.findIndex(this.kingdomCards, this.bane);
    if (index >= 0) {
      this.bane.hide(direction);
      this.kingdomCards.splice(index, 1);
      this.currentCards.push(this.bane); //allows card to be reselected as non-bane
      this.lastBane = this.bane;
      this.bane = false;
      this.maxCards -= 1;
    }
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
