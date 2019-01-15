import {Card as Card} from './card.js';
import { NewGameForm as NewGameForm } from './card_select_form.js';
import {CardSelectLi as CardSelectLi } from './card_select_form_li.js';
import {Game as Game} from './game.js';
// import { Helpers as Helpers } from 'lib/helpers';

//contains rules for the alchemy expansion
window.Dominionator = window.Dominionator || {};

let D = Dominionator,
    CardSelector = D.CardSelector,
    NewGameForm = D.NewGameForm,
    CardSelectLi = D.CardSelectLi;

Game.prototype.alchemyConditionMet = function() {
  let numAlchemy = this.numAlchemyCards();
  return (numAlchemy >= 3 && numAlchemy <= 4);
};

Game.prototype.needsMoreAlchemy = function() {
  let numAlchemy = this.numAlchemyCards();
  return (this.alchemy_min_3 && numAlchemy < 3 &&
    this.maxCards - this.numAlchemyCards() >= 2);
};

Game.prototype.numAlchemyCards = function() {
  return D.where(this.kingdomCards, {set: "Alchemy"}).length;
};

Game.prototype.hasPotionCard = function() {
  return D.find(this.kingdomCards,function(card) {
    return card.isPotionCard();
  });
};

D.AlchemyCard = class AlchemyCard extends Card {
  constructor(object) {
    super(object);
  }

  static addToSelected(options) {
    let game = options.game;
    Card.prototype.addToSelected.call(this, options);
    if (options.game.needsMoreAlchemy()) {
      if (game.minBySet.Alchemy <=3 ) {
        game.minBySet.Alchemy = 3;
      }
      game.selectnCardsFromSet("Alchemy", 3);
    }
  }
};

NewGameForm.prototype.updateAlchemyBox = function(setName, bool) {
  let alchemyBox = document.getElementById('dominionator-alchemy-condition-checkbox');
  if (setName === "Alchemy") {
    alchemyBox.el.checked = bool;
  }
};

NewGameForm.prototype.setAlchemyConditionListener = function() {
  let alchemyBox = document.getElementById('dominionator-alchemy-condition-checkbox');
  let selector = this;
  alchemyBox.addEventListener('change', function(event) {
    let target = event.target;
    let excludeBox = document.getElementById('alchemy-exclude');
    if (target.checked) {
      selector.includeSet("Alchemy");
      excludeBox.checked = false;
    } else if (!excludeBox.checked) {
      selector.includeSet("Alchemy");
    }
  });
};

NewGameForm.prototype.checkAlchemyCondition = function() {
  return document.getElementById('dominionator-alchemy-condition-checkbox').checked;
};
