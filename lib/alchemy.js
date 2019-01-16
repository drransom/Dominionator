import {Card as Card} from './card.js';
import { NewGameForm as NewGameForm } from './card_select_form.js';
import {CardSelector} from './card_selector.js';
import {CardSelectLi as CardSelectLi } from './card_select_form_li.js';
import {Game as Game} from './game.js';
import {Helpers} from './helpers.js';

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
  return Helpers.where(this.kingdomCards, {set: "Alchemy"}).length;
};

Game.prototype.hasPotionCard = function() {
  return Helpers.find(this.kingdomCards,function(card) {
    return card.isPotionCard();
  });
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
