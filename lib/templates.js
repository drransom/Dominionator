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
  "<% if (ruins || shelters || platCol || spoils) { %>" +
    "<h2>Extra Setup</h1><ul>" +
      "<% if (ruins) { %>" +
        "<li>Ruins</li>" +
      "<% } %>" +
      "<% if (shelters) { %>" +
        "<li>Shelters</li>" +
      "<% } %>" +
      "<% if (platCol) { %>" +
        "<li>Platinum and Colonies</li>" +
      "<% } %>" +
      "<% if (spoils) { %>" +
        "<li>Spoils</li>" +
      "<% } %>" +
    "</ul>" +
  "<% } %>";

JST.cardList = _.template(cardlistTemplateString + eventString + otherCardTemplateString);

JST.cardText = function (set) {
  var minButtons = JST.minMaxButtons(set, "min");
  var maxButtons = JST.minMaxButtons(set, "max");
  var setText = set;
  return  "<div role='group' aria-label='...'>" +
    minButtons + setText + maxButtons + "</div>";
};

JST.minMaxButtons = function (set, minOrMax) {
  var target = (function () {
    return (minOrMax === 'min') ? 0 : 10;
  })();
  var defaultValue = function (num) {
    return (num === target) ? " selected " : "";
  };
  var buttons = "", startLabel = "<select id='" + set + "-" + minOrMax + "'>";
  for (var i = 0; i <= 10; i++) {
    buttons += "<option value='" + i + "'" + defaultValue(i) + ">" +
      i + "</option>";
  }
  return startLabel + buttons + "</select>";
};

var cardForm = "" +
  "<ul class='set-name-list'>" +
  "<% for (var i = 0; i < sets.length; i ++) { %>" +
    "<li><%= JST.cardText(sets[i]) %></li>" +
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
