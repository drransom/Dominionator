(function() {
  "use strict";

if (window.JST === undefined) {
  window.JST = {};
}

var cardlistTemplateString = "" +
  "<h1>Kingdom Cards</h1>" +
  "<ul><% for (var i = 0; i < cards.length; i++) { %>" +
    "<li class='<%= cards[i].hidden %>' id='<%= cards[i].idHtml() %>'>" +
    "<%= selector.constructCardName(cards[i]) %> " +
    "<%= cards[i].costString() %> <%= cards[i].set %> " +
    "<%= JST.vetoButton(cards[i]) %></li>" +
  "<% } %></ul>";

var eventString = "" +
  "<% if (events.length > 0) { %>" +
    "<h2>Events <small>(from Adventures)</small></h1><ul>" +
      "<% for (var j = 0; j < events.length; j++) { %>" +
        "<li><%= events[j].name %> <%= JST.vetoButton(events[j]) %></li>" +
      "<% } %>" +
    "</ul>" +
  "<% } %>";

var otherCardTemplateString = "" +
  "<h2 class='<%= displayClass %>' id='extra-setup'>Extra Setup</h1><ul>" +
      "<li class='<%= ruinsClass %>' id='display-ruins'>Ruins</li>" +
      "<li class='<%= sheltersClass %>' id='display-shelters'>Shelters</li>" +
      "<li class='<%= platColClass %>' id='display-plat-col'>Platinum and Colonies</li>" +
      "<li class='<%= spoilsClass %>' id='display-spoils'>Spoils</li>" +
    "</ul>";

JST.cardList = _.template(cardlistTemplateString + eventString + otherCardTemplateString);

JST.setText = function (setName) {
  var minButtons = JST.minMaxButtons(setName, "min");
  var maxButtons = JST.minMaxButtons(setName, "max");
  var excludeButton = "<label><input type='checkbox' name ='exclude-checkbox' " +
    "value='" + setName + "'>Exclude";
  return  "<div role='group' aria-label='...'>" +
    minButtons + setName + maxButtons + excludeButton + "</div>";
};

JST.minMaxButtons = function (setName, minOrMax) {
  var target = (function () {
    return (minOrMax === 'min') ? 0 : 10;
  })();
  var defaultValue = function (num) {
    return (num === target) ? " selected " : "";
  };
  var buttons = "", startLabel = "<select id='" + Dominionator.htmlize(setName) + "-" + minOrMax + "'>";
  for (var i = 0; i <= 10; i++) {
    buttons += "<option value='" + i + "'" + defaultValue(i) + ">" +
      i + "</option>";
  }
  return startLabel + buttons + "</select>";
};

var cardForm = "" +
  "<ul class='set-name-list'>" +
  "<% for (var i = 0; i < sets.length; i ++) { %>" +
    "<li><%= JST.setText(sets[i]) %></li>" +
  "<% } %>" +
  "</ul>";

var submitButton = "" +
  "<input type='submit' value='New Set'>";

JST.vetoButton = function (card) {
  return "<button class='btn btn-default btn-xs veto-button' id='" + card.id +
  "'>Veto</button>";
};

JST.cardForm = _.template(cardForm + submitButton);

})();
