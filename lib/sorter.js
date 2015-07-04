(function() {
"use strict";

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

Dominionator.Sorter = function () {};

var Sorter = Dominionator.Sorter;

Sorter.sortByProperties = function (cards, properties) {
  var sortFunction = Sorter.constructSorter(properties);
  return cards.sort(sortFunction);
};

Sorter.constructSorter = function (properties, kingdomName) {
  return function (card1, card2) {
    var result;
    for (var i = 0; i < properties.length; i++) {
      result = Sorter.compareProperty(card1, card2, properties[i], kingdomName);
      if (result) {
        return result;
      }
    }
    return 0;
  };
};

Sorter.compareProperty = function (card1, card2, property, kingdomName) {
  if (property === 'cost') {
    return card1.compareCost(card2);
  } else if (property === 'moveKingdomToFront') {
    return card1.kingdomCompare(card2, kingdomName);
  } else if (card1[property] > card2[property]) {
      return 1;
  } else if (card1[property] < card2[property]) {
    return -1;
  } else {
    return 0;
  }
};


})();
