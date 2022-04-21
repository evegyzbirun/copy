import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Card from "./js/card.js";
import Deck from './js/deck.js';
let deck = new Deck();
$(document).ready(function () {

  $("form").submit(function (e) {
    e.preventDefault();
    let colorArray = [];
    $("[name=color]:checked").each(function () {
      colorArray.push($(this).val());
    });
    let colorIdentity = [];
    $("[name=color-identity]:checked").each(function () {
      colorIdentity.push($(this).val());
    });
    let cmcOperator = $("#less-or-more").val();
    let cmc = parseInt($("#cmc").val());

    printCardName($("#search-field").val(), $("#types").val(), cmc, cmcOperator, colorArray, $("#language").val(), colorIdentity);
  });

  $("#draw").on("click", function () {
    let shuffleDeck = deck.firstDraw();
    let hand = ``;
    shuffleDeck.forEach(function (card) {
      hand += `<img src=${card} class="hand">`;
    });
    $("#hand").html(hand);
  });

  $("#more-options").click(function () {
    $(".advanced-search").toggleClass("hidden");
  });
});

async function printCardName(name, types, cmc, cmcOperator, colors, language, colorIdentity) {
  let newCMC = cmc;
  if (cmcOperator !== "equal") {
    newCMC = "";
  }
  let data = await Card.getCard(name, types, newCMC, colors, language, colorIdentity);
  $("#output ul").empty();
  let prevNames = new Set();
  if (language) {
    data.cards.forEach(function (card) {
      if (card.foreignNames) {
        card.foreignNames.forEach(function (foreignName) {
          if (cmcOperator === "less") {
            if ((foreignName.language === language) && (!prevNames.has(foreignName.name)) && foreignName.imageUrl && (foreignName.cmc <= cmc)) {
              $("#output ul").append(`<img src=${foreignName.imageUrl} alt=${foreignName.name} id=${card.multiverseid}>`);
            } else if (cmcOperator === "more") {
              if ((foreignName.language === language) && (!prevNames.has(foreignName.name)) && foreignName.imageUrl && (foreignName.cmc >= cmc)) {
                $("#output ul").append(`<img src=${foreignName.imageUrl} alt=${foreignName.name} id=${card.multiverseid}>`);
              }
            } else if ((foreignName.language === language) && (!prevNames.has(foreignName.name)) && foreignName.imageUrl) {
              prevNames.add(foreignName.name);
              $("#output ul").append(`<img src=${foreignName.imageUrl} alt=${foreignName.name} id=${card.multiverseid}>`);
            }
          }
        });
      }
    });
  } else {
    data.cards.forEach(function (card) {
      if (cmcOperator === "less") {
        if (!prevNames.has(card.name) && card.imageUrl && (card.cmc <= cmc)) {
          prevNames.add(card.name);
          $("#output ul").append(`<img src=${card.imageUrl} alt="${card.name}" id=${card.multiverseid}>`);
        }
      } else if ((cmcOperator === "more")) {
        if (!prevNames.has(card.name) && card.imageUrl && (card.cmc >= cmc)) {
          prevNames.add(card.name);
          $("#output ul").append(`<img src=${card.imageUrl} alt="${card.name}" id=${card.multiverseid}>`);
        }
      } else if (!prevNames.has(card.name) && card.imageUrl) {
        prevNames.add(card.name);
        $("#output ul").append(`<img src=${card.imageUrl} alt="${card.name}" id=${card.multiverseid}>`);
      }

    });
  }

  $("img").on("click", async function () {
    await deck.addCard(Card.getCardbyId(this.id));
    deck.deckSize();
    deck.deckDistribution();
    $("#deck-size").html(`${deck.deckLength}<br>Average Cost: ${deck.averageManaCost()}<br>Land: ${deck.landPercent()}%`);
    $(".deck-list").html(deck.displayDeck());
  });

}