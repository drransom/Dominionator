class Sorter {
  static sortByProperties(cards, properties) {
    let sortFunction = Sorter.constructSorter(properties);
    return cards.sort(sortFunction);
  }

  static constructSorter(properties, kingdomName) {
    return function(card1, card2) {
      let result;
      for (let i = 0; i < properties.length; i++) {
        result = Sorter.compareProperty(card1, card2, properties[i],
            kingdomName);
        if (result) {
          return result;
        }
      }
      return 0;
    };
  }

  static compareProperty(card1, card2, property, kingdomName) {
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
  }
}

export {Sorter};
