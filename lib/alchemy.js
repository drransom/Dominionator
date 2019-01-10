import {Card as Card} from '../lib/card.js';
// import { NewGameForm as NewGameForm } from 'lib/card_select_form';
// import {CardSelectLi as CardSelectLi } from 'lib/card_select_form_li';
// import { Helpers as Helpers } from 'lib/helpers';
;(function() {
"use strict";

//contains rules for the alchemy expansion
window.Dominionator = window.Dominionator || {};

let D = Dominionator,
    // Card = D.Card,
    Game = D.Game,
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

D.AlchemyCard = class AlchemyCard extends D.Card {
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

CardSelectLi.prototype.createAlchemyOptionBox = function() {
  if (this.setName === "Alchemy") {
    let id = 'dominionator-alchemy-condition-checkbox';
    let newLi = D.createDOMElement({
      type: 'li',
      classes: ['alchemy-condition-li']
    });
    let label = D.createDOMElement({
      type: 'label',
      attributes: {
        for: id,
        innerText: "Require at least three Alchemy cards if any are chosen."
      }
    });
    let input = D.createDOMElement({
      type: 'input',
      classes: [id],
      attributes: {
        type: 'checkbox',
        id: id,
        selectLi: this
      }
    });
    label.insertBefore(input, label.firstChild);
    newLi.appendChild(label);
    this.alchemyCheckbox = input;
    this.alchemyCheckboxLi = newLi;
  }
};

CardSelectLi.prototype.validateAlchemy = function() {
  let max = parseInt(this.maxOption.value);
  if (this.alchemyCheckbox.checked && max) {
    this.maxOption.value = Math.max(max, 3);
    this.rememberInput();
  }
};

CardSelectLi.prototype.validateUncheckAlchemy = function() {
  if (this.alchemyCheckbox && parseInt(this.maxOption.value) < 3) {
    this.alchemyCheckbox.checked = false;
  }
};

})();
