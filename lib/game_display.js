import {Helpers} from './helpers.js';
import {CardDisplay} from './card_display.js';

class GameDisplay {
   constructor(options) {
    this.selector = options.selector;
    this.el = options.el;
    this.createSectionHeaders();
    this.currentGame = this.selector.currentGame;
    this.cardList = this.selector.cardList;
    this.displaysById = {};
  }

  displayCards() {
    let sortOrder = this.sortDisplay.pullSortOrder();
    this.cardList.sortKingdomCards(sortOrder);
    this.displayAllCards();
  }

  createSectionHeaders() {
    this.kingdomArea = this.createDomWithHeader({
      elementType: 'section', sectionId: 'dominionator-kingdom-cards-area',
      headerType: 'h1', headerText: 'Kingdom Cards', hidden: 'left',
      headerId: 'dominionator-kingdom-cards-header'});
    this.kingdomCardsList = this.kingdomArea.appendChild(Helpers.createDOMElement({
      type: 'ul', classes: ['dominionator-list', 'standard-left-margin-padding'] }));
    this.kingdomArea.appendChild(this.createUnVetoButton());
    this.eventsAndLandmarksArea = this.createDomWithHeader({
      elementType: 'section', sectionId: 'dominionator-events-area',
      headerType: 'h1', headerText: 'Events/Landmarks',
      hidden: "left", headerId: 'dominionator-events-header'});
    this.eventsAndLandmarksList = this.eventsAndLandmarksArea.appendChild(Helpers.createDOMElement({
      type: 'ul', classes: ['dominionator-list', 'standard-left-margin-padding'] }));
    this.otherSetupArea = this.createDomWithHeader({
      elementType: 'section', sectionId: 'dominionator-setup-area',
      headerType: 'h1', headerText: 'Setup', hidden: 'left',
      headerId: 'dominionator-extra-setup-header'});
    Helpers.addClass(this.otherSetupArea, 'dominionator-setup-area');
    this.otherSetupList = this.otherSetupArea.appendChild(Helpers.createDOMElement({
      type: 'ul', classes: ['dominionator-list', 'standard-left-margin-padding'] }));
    this.el.appendChild(this.otherSetupArea);
    this.el.appendChild(this.eventsAndLandmarksArea);
    this.el.appendChild(this.kingdomArea);
  }

  createDomWithHeader  (options) {
    let hidden = Helpers.hidden(options.hidden);
    let section = Helpers.createDOMElement({
      type: options.elementType,
      attributes: { id: options.sectionId }
    });
    // section.setAttribute('id', options.sectionId);
    let header = section.appendChild(Helpers.createDOMElement({
      type: options.headerType,
      classes: [hidden, 'dominionator-heading', 'standard-left-margin-padding'],
      attributes: { id: options.headerId, innerText: options.headerText }
    }));
    if (options.smallText) {
      header.appendChild(Helpers.createDOMElement({
        type: 'small',
        attributes: { innerText: options.smalLText }
      }));
    }
    return section;
  }

  createExtraCardText() {
    let ul = this.otherSetupArea.getElementsByTagName('ul')[0];
    this.createExtraLi({el: ul, idText: 'plat-col',
                        visibleText: 'Platinum and Colonies',
                        attributeName: 'platCol'});
    this.createExtraLi({el: ul, idText: 'shelters', visibleText: 'Shelters',
                        attributeName: 'shelters'});
    this.createExtraLi({el: ul, idText: 'ruins', visibleText: 'Ruins',
                        attributeName: 'ruins'});
    this.createExtraLi({el: ul, idText: 'spoils', visibleText: 'Spoils',
                        attributeName: 'spoils'});
    this.createExtraLi({el: ul, idText: 'potions', visibleText: 'Potions',
                        attributeName: 'potions'});
  }


  createCardDisplays  (callback) {
    let display, potionImg = new Image(), gameDisplay = this;
    this.cardDisplays = [];
    potionImg.src = "https://s3-us-west-2.amazonaws.com/elliot-c-reed-dominion/potion.png";
    potionImg.onload = function() {
      gameDisplay.cardList.allCards.forEach(function(card) {
        display = new CardDisplay({card: card,
                                   gameDisplay: gameDisplay,
                                   selector: gameDisplay.selector,
                                   potionImg: potionImg});
        gameDisplay.cardDisplays.push(display);
      }.bind(gameDisplay));
      gameDisplay.createExtraCardText();
      callback();
    };
  }

  displayAllCards() {
    let card, options, nonEventCards, eventCards;
    this.cardList.allCards.forEach(function (card) {
      this.displayOneCard(card);
    }.bind(this));
  }

  displayOneCard(card) {
    if (card.isEvent || card.isLandmark) {
      this.eventsAndLandmarksList.appendChild(card.el());
    } else {
      this.kingdomCardsList.appendChild(card.el());
    }
  }

  hiddenClass(bool) {
    return (bool ? "" : Helpers.hidden("left"));
  }

  constructCardName(card) {
    return card.constructCardName(this.currentGame);
  }

  updateCardDisplay(options) {
    options = options || {};
    let card, cardDisplay, li, cardText, allCards = this.cardList.allCards;
    if (this.currentGame.kingdomCards.length > 0) {
      this.displayArea(this.kingdomArea);
    }
    for (let i = 0; i < allCards.length; i++) {
      card = allCards[i];
      card.updateCardDisplay(this.currentGame);
    }
    if (this.currentGame.eventsAndLandmarks.length > 0) {
      this.displayArea(this.eventsAndLandmarksArea);
    } else {
      this.hideArea(this.eventsAndLandmarksArea);
    }
    this.updateExtraSetup();
    if (options.newGame) {
      this.hideVetoButton();
    }
  }

  updateExtraSetup() {
    let display, displayClass;

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
    if (displayClass) {
      this.hideArea(this.otherSetupArea);
    } else {
      this.displayArea(this.otherSetupArea);
    }
  }

  displayArea(area) {
    let header = area.getElementsByTagName('h1')[0] || area.getElementsByTagName('h2')[0];
    Helpers.removeClass(header, "slideLeft");
  }

  hideArea(area) {
    let header = area.getElementsByTagName('h1')[0];
    Helpers.addClass(header, "slideLeft");
  }

  createExtraLi(options) {
    let element = Helpers.createDOMElement({
      type: 'li',
      classes: [this.hiddenClass(false)],
      attributes: {
        id: 'dominionator-display-' + options.idText,
        innerText: options.visibleText
      }
    });
    options.el.appendChild(element);
    this[options.attributeName] = element;
  }

  createUnVetoButton() {
    let vetoButton = Helpers.createDOMElement({
      type: 'button',
      classes: [this.hiddenClass(false), 'dominionator-unveto-button',
                'standard-left-margin-margin'],
      attributes: {
        id: 'dominionator-unveto-button',
        innerText: 'Undo veto'
      }
    });
    this.vetoButton = vetoButton;
    let display = this;
    vetoButton.addEventListener('click', function() {
      display.currentGame.unveto();
      display.hideVetoButton();
      display.selector.updateHistory();
    });
    return vetoButton;
  }

  displayVetoButton() {
    Helpers.removeClass(this.vetoButton, this.hiddenClass(false));
  }

  hideVetoButton() {
    Helpers.addClass(this.vetoButton, this.hiddenClass(false));
  }

  updateVetoDisplay(cardType) {
    let area = ((cardType === "kingdom") ? this.kingdomArea : this.eventsAndLandmarksArea);
    area.appendChild(this.vetoButton);
    this.displayVetoButton();
  }

};

export {GameDisplay};
