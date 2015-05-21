(function() {
  "use strict";

if (window.JST === undefined) {
  window.JST = {};
}


var cardlistTemplateString = "" +
  "<h1>Kingdom Cards</h1>" +
  "<ul><% for (var i = 0; i < cards.length; i++) { %>" +
    "<li><%= selector.constructCardName(cards[i]) %> <%= cards[i].costString() %> <%= cards[i].set %></li>" +
  "<% } %></ul>";

var eventString = "" +
  "<% if (events.length > 0) { %>" +
    "<ul><h1>Events (from Adventures)</h1>" +
      "<% for (var j = 0; j < events.length; j++) { %>" +
        "<li><%= events[j].name %></li>" +
      "<% } %>" +
    "</ul>" +
  "<% } %>";

var otherCardTemplateString = "" +
  "<% if (ruins || shelters || platCol) { %>" +
    "<h1>Extra Setup</h1><ul>" +
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

})();
