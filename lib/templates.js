(function() {
  "use strict";

if (window.JST === undefined) {
  window.JST = {};
}

var cardlistTemplateString = "\
  <h1>Kingdom Cards</h1> \
  <ul><% for (var i = 0; i < cards.length; i++) { %>\
    <li class='<%= cards[i].hidden %>' id='<%= cards[i].idHtml() %>'>\
    <span id='<%= cards[i].nameIdHtml() %>'>\
    <%= selector.constructCardName(cards[i]) %></span>\
    <%= cards[i].costString() %> <%= cards[i].set %>\
    <%= JST.vetoButton(cards[i]) %></li>\
  <% } %></ul>";

var eventString = "\
  <% if (hasEvent) { %>\
    <h2>Events <small>(from Adventures)</small></h1><ul>\
      <% for (var j = 0; j < events.length; j++) { %>\
        <li class='<%= events[j].hidden %>' id='<%= events[j].idHtml() %>'>\
        <span id='<%= events[j].nameIdHtml() %>'>\
        <%= selector.constructCardName(events[j]) %></span>\
        <%= events[j].costString() %>\
        <%= JST.vetoButton(events[j]) %></li>\
      <% } %>\
    </ul>\
  <% } %>";

var otherCardTemplateString = "\
  <h2 class='<%= displayClass %>' id='extra-setup'>Extra Setup</h1><ul>\
      <li class='<%= ruinsClass %>' id='display-ruins'>Ruins</li>\
      <li class='<%= sheltersClass %>' id='display-shelters'>Shelters</li>\
      <li class='<%= platColClass %>' id='display-plat-col'>Platinum and Colonies</li>\
      <li class='<%= spoilsClass %>' id='display-spoils'>Spoils</li>\
    </ul>";

JST.cardList = _.template(cardlistTemplateString + eventString + otherCardTemplateString);

var sortTemplateString = "\
  <ul id='sort-boxes'>\
    <% for (var i = 0; i < 3; i++) { %>\
      <div><%= JST.sortText(i) %></div>\
      <select id='sort-<%= i %>'>\
        <% for (var j = 0; j < sortProperties.length; j++) { %>\
          <option value='<%= sortProperties[j] %>' <%= JST.selectedText(i, j) %>>\
          <%= sortProperties[j] %></option>\
        <% } %>\
      </select>\
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
  var alchemyButton = JST.alchemyButton(setName);
  var excludeButton = "<label><input type='checkbox' name ='exclude-checkbox' \
    value='" + setName + "' + id='" + Dominionator.htmlize(setName) +
    "-exclude'>Exclude";
  return  "<div role='group' aria-label='...'>" +
    minButtons + setName + maxButtons + excludeButton + alchemyButton + "</div>";
};

JST.minMaxButtons = function (setName, minOrMax) {
  var target = (function () {
    return (minOrMax === 'min') ? 0 : 10;
  })();
  var defaultValue = function (num) {
    return (num === target) ? " selected " : "";
  };
  var buttons = "", startLabel = "<select id='" + Dominionator.htmlize(setName) +
    "-" + minOrMax + "'>";
  for (var i = 0; i <= 10; i++) {
    buttons += "<option value='" + i + "'" + defaultValue(i) + ">" +
      i + "</option>";
  }
  return startLabel + buttons + "</select>";
};

var cardForm = "" +
  "<ul class='set-name-list'>\
  <% for (var i = 0; i < sets.length; i ++) { %>\
    <li><%= JST.setText(sets[i]) %></li>\
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
