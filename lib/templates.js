(function() {
"use strict";

if (window.JST === undefined) {
  window.JST = {};
}

if (window.Dominionator === undefined) {
  window.Dominionator = {};
}

var D = Dominionator;

D.cardTemplate = "<%= cards[i].template() %>";

var cardlistTemplateString = "\
  <h1>Kingdom Cards</h1> \
  <ul><% for (var i = 0; i < cards.length; i++) { %>" +
  D.cardTemplate +
  "<% } %></ul>";

var eventString = "\
  <h2 class='<%= eventClass %>' id='event-header'>Events <small>(from Adventures)</small></h2><ul>\
    <% for (var j = 0; j < events.length; j++) { %>\
      <li class='<%= events[j].hidden %>' id='<%= events[j].idHtml() %>'>\
      <span id='<%= events[j].nameIdHtml() %>'>\
      <%= selector.constructCardName(events[j]) %></span>\
      <%= events[j].costString() %>\
      <%= JST.vetoButton(events[j]) %></li>\
    <% } %>\
  </ul>";

var otherCardTemplateString = "\
  <h2 class='<%= displayClass %>' id='extra-setup'>Extra Setup</h1><ul>\
      <li class='<%= ruinsClass %>' id='dominionator-display-ruins'>Ruins</li>\
      <li class='<%= sheltersClass %>' id='dominionator-display-shelters'>Shelters</li>\
      <li class='<%= platColClass %>' id='dominionator-display-plat-col'>Platinum and Colonies</li>\
      <li class='<%= spoilsClass %>' id='dominionator-display-spoils'>Spoils</li>\
    </ul>";

JST.cardList = _.template(cardlistTemplateString + eventString + otherCardTemplateString);

var sortTemplateString = "\
  <ul id='sort-boxes'>\
    <% for (var i = 0; i < 3; i++) { %>\
      <li><div><%= JST.sortText(i) %></div>\
      <select id='sort-<%= i %>'>\
        <% for (var j = 0; j < sortProperties.length; j++) { %>\
          <option value='<%= sortProperties[j][0] %>' <%= JST.selectedText(i, j) %>>\
          <%= sortProperties[j][1] %></option>\
        <% } %>\
      </select></li>\
    <% } %>\
  </ul>";

JST.sortText = function (n) {
  return n ? "then by:" : "Sort by";
};

JST.selectedText = function (i, j) {
  return (i === j) ? "selected" : "";
};

JST.sortBoxes = _.template(sortTemplateString);

JST.setText = function (setName) {
  var minButtons = JST.minMaxButtons(setName, "min");
  var maxButtons = JST.minMaxButtons(setName, "max");
  var includeButton = "<label for='" + JST.includeId(setName) +
    "'><input type='radio' class='include-radio'" +
    "name = '" + setName + "' value='include' + id='" + JST.includeId(setName) +
    "'>Include</label>";
  var excludeButton = "<label for ='" + JST.excludeId(setName) +
    "'><input type='radio' class='exclude-radio'" +
    "name = '" + setName + "' value='exclude' id='" + JST.excludeId(setName) +
    "'>Exclude</label>";
  var alchemyButton = JST.alchemyButton(setName);
  return  "<div role='group' aria-label='...'>" +
    minButtons + setName + maxButtons + includeButton + excludeButton +
    alchemyButton + "</div>";
};

JST.includeId = function(setName) {
  return Dominionator.htmlize(setName) + "-include";
};

JST.excludeId = function(setName) {
  return Dominionator.htmlize(setName) + "-exclude";
};

JST.minMaxButtons = function (setName, minOrMax) {
  var target = (function () {
    return (minOrMax === 'min') ? 0 : 10;
  })();
  var defaultValue = function (num) {
    return (num === target) ? " selected " : "";
  };

  var optionClass = minOrMax + '-option';

  var buttons = "", startLabel = "<select id='" + Dominionator.htmlize(setName) +
    "-" + minOrMax + "' class='" + optionClass + "'>";
  for (var i = 0; i <= 10; i++) {
    buttons += "<option value='" + i + "'" + defaultValue(i) + ">" +
      i + "</option>";
  }
  return startLabel + buttons + "</select>";
};

var cardForm = "" +
  "<ul class='set-name-list'>\
  <% for (var i = 0; i < sets.length; i ++) { %>\
    <li class='select-li' data-dominion-set='<%= Dominionator.htmlize(sets[i]) %>' \
    id='<%= Dominionator.htmlize(sets[i]) %>-li'>\
    <%= JST.setText(sets[i]) %></li>\
  <% } %>\
  </ul>";

var submitButton = "\
  <input type='submit' value='New Set'>";

JST.vetoButton = function (card) {
  return "<button class='veto-button' id='" + card.id +
  "'>Veto</button>";
};



JST.cardForm = _.template(cardForm + submitButton);

})();
