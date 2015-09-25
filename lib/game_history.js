;(function() {
"use strict";

window.Dominionator = window.Dominionator || {};
var D = Dominionator;

D.GameHistory = function(game) {
  this.kingdomCards = D.GameHistory.convertCards(game.kingdomCards);
  this.events = D.GameHistory.convertCards(game.events);
  this.vetoed = D.GameHistory.convertCards(game.vetoed);
  this.currentCards = D.GameHistory.convertCards(game.currentCards);
  this.bane = game.bane ? game.bane.name : false;
  this.maxCards = game.maxCards;
  this.platCol = game.platCol;
  this.shelters = game.shelters;
  this.maxBySet = game.maxBySet;
  this.minBySet = game.minBySet;
  this.id = game.id;
};

D.GameHistory.convertCards = function(cards) {
  var nameArray = [];
  cards.forEach(function(card) {
    nameArray.push(card.name);
  });
  return nameArray;
};

D.NavigationDisplay = function(options) {
  this.el = options.el;
  this.selector = options.selector;
};

D.NavigationDisplay.prototype.initializeDisplay = function() {
  this.forwardButton = document.createElement('button');
  this.backButton = document.createElement('button');
  this.forwardButton.innerText = 'next set';
  this.backButton.innerText = 'previous set';
  this.forwardButton.setAttribute('onClick', "window.history.forward()");
  this.forwardButton.setAttribute('hidden', true);
  this.forwardButton.setAttribute('disabled', true);
  this.backButton.setAttribute('onClick', "window.history.back()");
  this.backButton.setAttribute('hidden', true);
  this.backButton.setAttribute('disabled', true);
  this.navigationMessage = document.createElement('div');
  this.navigationMessage.setAttribute('hidden', true);
  this.navigationMessage.innerText = "You can also navigate between sets using the browser history.";
  this.el.appendChild(this.backButton);
  this.el.appendChild(this.forwardButton);
  this.el.appendChild(this.navigationMessage);
};

D.NavigationDisplay.prototype.updateNavigationDisplay = function() {
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
};

})();
