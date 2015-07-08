(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

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
  this.eventsArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-events-area',
    headerType: 'h1', headerText: 'Events', smallText: ' (from Adventures)',
    hidden: true, headerId: 'dominionator-events-header'});
  this.eventsList = this.eventsArea.appendChild(document.createElement('ul'));
  this.otherSetupArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-extra-setup-area',
    headerType: 'h1', headerText: 'Other Setup', hidden: true,
    headerId: 'dominionator-extra-setup-header'});
  this.otherSetupList = this.otherSetupArea.appendChild(document.createElement('ul'));
  this.el.appendChild(this.kingdomArea);
  this.el.appendChild(this.eventsArea);
  this.el.appendChild(this.otherSetupArea);
};


GameDisplay.prototype.createDomWithHeader = function (options) {
  var hidden = options.hidden ? D.hidden() : "";
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
  var platCol = this.createExtraLi({idText: 'plat-col',
                                  visibleText: 'Platinum and Colonies'});
  var ruins = this.createExtraLi({idText: 'ruins',
                                  visibleText: 'Ruins'});
  var shelters = this.createExtraLi({idText: 'shelters',
                                  visibleText: 'Shelters'});
  var spoils = this.createExtraLi({idText: 'spoils',
                                  visibleText: 'Spoils'});
  ul.appendChild(platCol);
  ul.appendChild(ruins);
  ul.appendChild(shelters);
  ul.appendChild(spoils);
};


GameDisplay.prototype.createCardDisplays = function () {
  var display;
  this.cardDisplays = [];
  this.cardList.allCards.forEach(function(card) {
    display = new D.CardDisplay({card: card, gameDisplay: this, selector: this.selector});
    this.cardDisplays.push(display);
    card.setDisplay(display);
  }.bind(this));
  this.createExtraCardText();
};

GameDisplay.prototype.displayAllCards = function() {
  var card, options, nonEventCards, eventCards, template = JST.cardList;
  nonEventCards = _.where(this.cardList.allCards, {isEvent: false});
  eventCards = _.where(this.cardList.allCards, {isEvent: false});
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
  return (bool ? "" : "slideLeft");
};

GameDisplay.prototype.constructCardName = function(card) {
  return card.constructCardName(this.currentGame);
};

GameDisplay.prototype.vetoCard = function (cardId) {
  this.currentGame.veto(parseInt(cardId));
  this.updateCardDisplay();
};

GameDisplay.prototype.updateCardDisplay = function () {
  var card, cardDisplay, li, cardText, allCards = this.cardList.allCards;
  for (var i = 0; i < allCards.length; i++) {
    card = allCards[i];
    card.updateCardDisplay();
  }
  if (this.currentGame.events.length > 0) {
    this.displayArea(this.eventsArea);
  } else {
    this.hideArea(this.eventsArea);
  }
  this.updateExtraSetup();
};

GameDisplay.prototype.updateExtraSetup = function () {
  var display, displayClass, ruins, ruinsClass, shelters, sheltersClass, platCol,
    platColClass, spoils, spoilsClass, events, eventsClass;

  ruins = document.getElementById('dominionator-display-ruins');
  ruinsClass = this.hiddenClass(this.currentGame.includesRuins());
  ruins.setAttribute('class', ruinsClass);

  shelters = document.getElementById('dominionator-display-shelters');
  sheltersClass = this.hiddenClass(this.currentGame.shelters);
  shelters.setAttribute('class', sheltersClass);

  platCol = document.getElementById('dominionator-display-plat-col');
  platColClass = this.hiddenClass(this.currentGame.platCol);
  platCol.setAttribute('class', platColClass);

  spoils = document.getElementById('dominionator-display-spoils');
  spoilsClass = this.hiddenClass(this.currentGame.includesSpoils());
  spoils.setAttribute('class', spoilsClass);

  display = document.getElementById('dominionator-extra-setup-header');
  displayClass = this.hiddenClass(
    this.currentGame.includesRuins() || this.currentGame.shelters ||
    this.currentGame.platCol || this.currentGame.includesSpoils());
  display.setAttribute('class', displayClass);
};

GameDisplay.prototype.displayArea = function (area) {
  var header = area.getElementsByTagName('h1')[0];
  D.removeClass(header, this.hiddenClass(false));
};

GameDisplay.prototype.hideArea = function (area) {
  var header = area.getElementsByTagName('h1')[0];
  D.addClass(header, this.hiddenClass(false));
};

GameDisplay.prototype.createExtraLi = function(options) {
  var element = document.createElement('li');
  element.setAttribute('id', 'dominionator-display-'+options.idText);
  D.addClass(element, this.hiddenClass(false));;
  element.innerHTML = options.visibleText;
  return element;
}

})();
