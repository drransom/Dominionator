;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};

var D = Dominionator;

D.GameDisplay = function(options) {
  this.selector = options.selector;
  this.el = options.el;
  this.createSectionHeaders();
  this.currentGame = this.selector.currentGame;
  this.cardList = this.selector.cardList;
  this.displaysById = {};
};

var GameDisplay = D.GameDisplay;

GameDisplay.prototype.displayCards = function () {
  var sortOrder = this.sortDisplay.pullSortOrder();
  this.cardList.sortKingdomCards(sortOrder);
  this.displayAllCards();
};

GameDisplay.prototype.createSectionHeaders = function () {
  this.kingdomArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-kingdom-cards-area',
    headerType: 'h1', headerText: 'Kingdom Cards', hidden: false,
    headerId: 'dominionator-kingdom-cards-header'});
  this.kingdomCardsList = this.kingdomArea.appendChild(document.createElement('ul'));
  this.kingdomArea.appendChild(this.createUnVetoButton());
  this.eventsArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-events-area',
    headerType: 'h1', headerText: 'Events', smallText: ' (from Adventures)',
    hidden: "left", headerId: 'dominionator-events-header'});
  this.eventsList = this.eventsArea.appendChild(document.createElement('ul'));
  this.otherSetupArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-extra-setup-area',
    headerType: 'h1', headerText: 'Other Setup', hidden: "center",
    headerId: 'dominionator-extra-setup-header'});
  this.otherSetupList = this.otherSetupArea.appendChild(document.createElement('ul'));
  this.el.appendChild(this.kingdomArea);
  this.el.appendChild(this.eventsArea);
  this.el.appendChild(this.otherSetupArea);
};


GameDisplay.prototype.createDomWithHeader = function (options) {
  var hidden = D.hidden(options.hidden);
  var section = document.createElement(options.elementType);
  section.setAttribute('id', options.sectionId);
  var header = section.appendChild(document.createElement(options.headerType));
  D.addClass(header, hidden);
  header.setAttribute('id', options.headerId);

  var headerText = document.createTextNode(options.headerText);
  header.appendChild(headerText);
  if (options.smallText) {
    var smallText = document.createElement('small');
    smallText.innerHTML = options.smallText;
    header.appendChild(smallText);
  }
  return section;
};

GameDisplay.prototype.createExtraCardText = function() {
  var ul = this.otherSetupArea.getElementsByTagName('ul')[0];
  this.createExtraLi({node: ul, idText: 'plat-col',
                      visibleText: 'Platinum and Colonies',
                      attributeName: 'platCol'});
  this.createExtraLi({node: ul, idText: 'ruins', visibleText: 'Ruins',
                      attributeName: 'ruins'});
  this.createExtraLi({node: ul, idText: 'shelters', visibleText: 'Shelters',
                      attributeName: 'shelters'});
  this.createExtraLi({node: ul, idText: 'spoils', visibleText: 'Spoils',
                      attributeName: 'spoils'});
  this.createExtraLi({node: ul, idText: 'potions', visibleText: 'Potions',
                      attributeName: 'potions'});
};


GameDisplay.prototype.createCardDisplays = function (callback) {
  var display, potionImg = new Image(), gameDisplay = this;
  this.cardDisplays = [];
  potionImg.src = "https://s3-us-west-2.amazonaws.com/elliot-c-reed-dominion/potion.png";
  potionImg.onload = function() {
    gameDisplay.cardList.allCards.forEach(function(card) {
      display = new D.CardDisplay({card: card,
                                   gameDisplay: gameDisplay,
                                   selector: gameDisplay.selector,
                                   potionImg: potionImg});
      gameDisplay.cardDisplays.push(display);
      // card.setDisplay(display);
    }.bind(gameDisplay));
    gameDisplay.createExtraCardText();
    callback();
  };
};

GameDisplay.prototype.displayAllCards = function() {
  var card, options, nonEventCards, eventCards;
  this.cardList.allCards.forEach(function (card) {
    this.displayOneCard(card);
  }.bind(this));
};

GameDisplay.prototype.displayOneCard = function (card) {
  if (card.isEvent) {
    this.eventsList.appendChild(card.node());
  } else {
    this.kingdomCardsList.appendChild(card.node());
  }
};

GameDisplay.prototype.hiddenClass = function (bool) {
  return (bool ? "" : D.hidden("center"));
};

GameDisplay.prototype.constructCardName = function(card) {
  return card.constructCardName(this.currentGame);
};

GameDisplay.prototype.updateCardDisplay = function (options) {
  options = options || {};
  var card, cardDisplay, li, cardText, allCards = this.cardList.allCards;
  for (var i = 0; i < allCards.length; i++) {
    card = allCards[i];
    card.updateCardDisplay(this.currentGame);
  }
  if (this.currentGame.events.length > 0) {
    this.displayArea(this.eventsArea);
  } else {
    this.hideArea(this.eventsArea);
  }
  this.updateExtraSetup();
  if (options.newGame) {
    this.hideVetoButton();
  }
};

GameDisplay.prototype.updateExtraSetup = function () {
  var display, displayClass;

  this.shelters.setAttribute('class', this.hiddenClass(this.currentGame.shelters));
  this.platCol.setAttribute('class',
                            this.hiddenClass(this.currentGame.platCol));
  this.spoils.setAttribute('class',
                           this.hiddenClass(this.currentGame.includesSpoils()));
  this.ruins.setAttribute('class',
                           this.hiddenClass(this.currentGame.includesRuins()));
  this.potions.setAttribute('class',
                            this.hiddenClass(this.currentGame.hasPotionCard()));
  display = document.getElementById('dominionator-extra-setup-header');
  displayClass = this.hiddenClass(
    this.currentGame.includesRuins() || this.currentGame.shelters ||
    this.currentGame.platCol || this.currentGame.includesSpoils() ||
    this.currentGame.hasPotionCard());
  display.setAttribute('class', displayClass);
};

GameDisplay.prototype.displayArea = function (area) {
  var header = area.getElementsByTagName('h1')[0];
  D.removeClass(header, "slideLeft");
};

GameDisplay.prototype.hideArea = function (area) {
  var header = area.getElementsByTagName('h1')[0];
  D.addClass(header, "slideLeft");
};

GameDisplay.prototype.createExtraLi = function(options) {
  var element = document.createElement('li');
  element.setAttribute('id', 'dominionator-display-'+options.idText);
  D.addClass(element, this.hiddenClass(false));
  element.innerHTML = options.visibleText;
  options.node.appendChild(element);
  this[options.attributeName] = element;
};

GameDisplay.prototype.createUnVetoButton = function() {
  var element = document.createElement('button');
  var display = this;
  element.setAttribute('id', 'dominionator-unveto-button');
  D.addClass(element, this.hiddenClass(false));
  element.innerHTML = "Undo veto";
  this.vetoButton = element;
  element.addEventListener('click', function() {
    display.currentGame.unveto();
    display.hideVetoButton();
    display.selector.updateHistory();
  });
  return element;
};

GameDisplay.prototype.displayVetoButton = function() {
  D.removeClass(this.vetoButton, this.hiddenClass(false));
};

GameDisplay.prototype.hideVetoButton = function() {
  D.addClass(this.vetoButton, this.hiddenClass(false));
};

GameDisplay.prototype.updateVetoDisplay = function(cardType) {
  var area = ((cardType === "kingdom") ? this.kingdomArea : this.eventsArea);
  area.appendChild(this.vetoButton);
  this.displayVetoButton();
};

})();
