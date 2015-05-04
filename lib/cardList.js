(function() {
  "use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.CardList = function () {
  this.byName = {};
  this.sets = [];
};

var CardList = Dominionator.CardList;

CardList.prototype.addCard = function (array) {
  var card = new Dominionator.Card(array);
  if (this[card.set] === undefined) {
    this[card.set] = [card];
    this.sets.push(card.set);
  } else {
    this[card.set].push(card);
  }
  this.byName[card.name] = card;
};

CardList.prototype.constructCurrentCards = function(sets, banned) {
  currentCards = [];
  for (var i = 0; i < sets.length; i++) {
    this.currentCards = this.currentCards.concat(this[sets[i]]);
  }
  if (banned) {
    banned_cards = this.constructCardsByName(banned);
    this.currentCards = _.reject(this.currentCards, function (card) {
      return (_.findWhere(banned_cards, {name: card.name }) !== undefined);
    });
  }

  CardList.prototype.constructCardsByName = function (card_names) {
    return _.map(card_names, function (name) {
      return this.byName[name];
    }.bind(this));
  };
};

Dominionator.InitializeCards = function () {
  var request = new XMLHttpRequest();
  request.addEventListener("load", Dominionator.LoadCards, false);
  request.open("GET", 'dominion_cards.csv', true);
  request.send();
};

Dominionator.LoadCards = function (response) {
  Papa.parse(response.currentTarget.response, {
    header: true,
    dynamicTyping: true,
    complete: function(papaResponse) {
      Dominionator.allCards = new Dominionator.cardList();
      for (var i = 0; i < papaResponse.data.length; i++) {
        Dominionator.allCards.addCard(new Dominionator.Card(papaResponse.data[i]));
      }
    }
  });
};

})();
