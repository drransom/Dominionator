class Cost {
  constructor(object) {
    this.coinCost = object.cost === "N" ? null : object.cost;
    this.potion = object.potionCost ? "P" : "";
    this.debtCost = object.debtCost === "N" ? null : object.debtCost;
  }

  compareCost(other) {
    this.NumCost = Math.max([this.coinCost, this.debtCost]);
    otherNumCost = Math.max([other.coinCost, other.debtCost]);
    if (thisNumCost > otherNumCost) {
      return 1;
    } else if (thisNumCost == otherNumCost) {
      return this.compareByPotion(other);
    } else {
      return -1;
    }
  }

  compareByPotion(other) {
    if (this.potion === other.potion) {
      return 0;
    } else if (this.potion) {
      return 1;  //potion cards are more expensive
    } else {
      return -1;
    }
  }

  costString() {
    let debtString = this.debtCost ? "" + this.debtString + "D" : "";
    if (this.isNull()) {
      return "";
    }
    if (!this.coinCost && !this.debtCost && this.potion) {
      return this.potion;
    } else {
      return "" + this.coinCost + debtString + this.potion;
    }
  }

  getDebtCost() {
    return this.debtCost === null ? 0 : this.debtCost;
  }

  getCoinCost() {
    return this.coinCost === null ? 0 : this.coinCost;
  }

  isZero() {
    return !this.isNull()
        && !this.getCoinCost()
        && !this.getDebtCost()
        && !this.potion;
  }

  isNull() {
    return this.coinCost === null
        && this.debtCost === null
        && this.potion === '';
  }
}

export {Cost};
