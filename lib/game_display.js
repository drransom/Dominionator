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
    headerType: 'h1', headerText: 'Kingdom Cards', hidden: false});
  this.kingdomCardsList = this.kingdomArea.appendChild(document.createElement('ul'));
  this.eventsArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-events-area',
    headerType: 'h2', headerText: 'Events <small>(from Adventures)</small>',
    hidden: true});
  this.eventsList = this.eventsArea.appendChild(document.createElement('ul'));
  this.otherSetupArea = this.createDomWithHeader({
    elementType: 'section', sectionId: 'dominionator-other-cards-area',
    headerType: 'h2', headerText: 'Other Setup', hidden: true});
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
  var headerText = document.createTextNode(options.headerText);
  header.appendChild(headerText);
  return section;
};

GameDisplay.prototype.createCardDisplays = function () {
  var display;
  this.cardDisplays = [];
  this.cardList.allCards.forEach(function(card) {
    display = new D.CardDisplay({card: card, gameDisplay: this, selector: this.selector});
    this.cardDisplays.push(display);
    card.setDisplay(display);
  }.bind(this));
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
  var hiddenClass = bool ? "" : "slideLeft";
  return hiddenClass;
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
    cardDisplay = card.cardDisplay;
    if (li = document.getElementById(card.idHtml())) {
      cardText = document.getElementById(card.nameIdHtml());
      Dominionator.removeClass(li, 'slideLeft');
      Dominionator.addClass(li, card.hidden);
      cardText.innerHTML = card.constructCardName(this.currentGame);
    }
  }
  // this.updateExtraSetup();
};

GameDisplay.prototype.updateExtraSetup = function () {
  var display, displayClass, ruins, ruinsClass, shelters, sheltersClass, platCol,
    platColClass, spoils, spoilsClass, events, eventsClass;

  ruins = document.getElementById('display-ruins');
  ruinsClass = this.hiddenClass(this.currentGame.includesRuins());
  ruins.setAttribute('class', ruinsClass);

  shelters = document.getElementById('display-shelters');
  sheltersClass = this.hiddenClass(this.currentGame.shelters);
  shelters.setAttribute('class', sheltersClass);

  platCol = document.getElementById('display-plat-col');
  platColClass = this.hiddenClass(this.currentGame.platCol);
  platCol.setAttribute('class', platColClass);

  spoils = document.getElementById('display-spoils');
  spoilsClass = this.hiddenClass(this.currentGame.includesSpoils());
  spoils.setAttribute('class', spoilsClass);

  display = document.getElementById('extra-setup');
  displayClass = this.hiddenClass(
    this.currentGame.includesRuins() || this.currentGame.shelters ||
    this.currentGame.platCol || this.currentGame.includesSpoils());
  display.setAttribute('class', displayClass);

  events = document.getElementById('event-header');
  eventsClass = this.currentGame.eventClass();
  events.setAttribute('class', eventsClass);
};

})();
