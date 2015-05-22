(function() {
  "use strict";

if (window.JST === undefined) {
  window.JST = {};
}

var cardlistTemplateString = "" +
  "<h1>Kingdom Cards</h1>" +
  "<ul><% for (var i = 0; i < cards.length; i++) { %>" +
    "<li><%= selector.constructCardName(cards[i]) %> "+
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
  "<% if (ruins || shelters || platCol) { %>" +
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
    "</ul>" +
  "<% } %>";

JST.cardList = _.template(cardlistTemplateString + eventString + otherCardTemplateString);

var cardForm = "" +
  "";

var submitButton = "" +
  "<input type='submit'>";

JST.vetoButton = function (card) {
  return "<button class='btn btn-default btn-xs veto-button' id='" + card.id +
  "'>Veto</button>";
};

JST.cardForm = _.template(cardForm + submitButton);

})();
