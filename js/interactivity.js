jQuery("#contributors").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").append(
    "<div>" + "Myself" + "</div>"
  );
});

jQuery("#scores").on("click", function() {
  jQuery("#content").empty();
  var message = "1. Player1\n 2. Player2\n 3. Player3\n";
  jQuery("#content").append(
    "<ul>" +
            "<li>" + "Player1" + "</li>" +
            "<li>" + "Player2" + "</li>" +
            "<li>" + "Player3" + "</li>" +
        "</ul>"
  );
});

jQuery("#help").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").append(
    "<div>" + "Press SPACE to jump" + "</div>"
  );
});

function registerScore(score) {
  if (score > 10) {
    var playerName = prompt("What is your name?");
    var scoreEntry = "<li>" + playerName + ": " + score.toString() + "</li>";
    $("#scoreBoard").append(scoreEntry);
    score = 0;
  }
}
