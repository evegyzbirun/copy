import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Card from "./js/card.js";

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


  $("#more-options").click(function () {
    $(".advanced-search").toggleClass("hidden");
  });
});


async function cardById(id) {
  let data = await Card.getCardbyId(id);
  console.log(data);
}

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
          if ((foreignName.language === language) && (!prevNames.has(foreignName.name)) && foreignName.imageUrl) {
            prevNames.add(foreignName.name);
            $("#output ul").append(`<li>${foreignName.name}</li>`);
            $("#output ul").append(`<img src=${foreignName.imageUrl} alt=${foreignName.name} id=${card.multiverseid}>`);
          }
        });
      }
    });
  } else {
    data.cards.forEach(function (card) {
      if (cmcOperator === "less") {
        if (!prevNames.has(card.name) && card.imageUrl && (card.cmc <= cmc)) {
          prevNames.add(card.name);
          $("#output ul").append(`<li>${card.name}</li>`);
          $("#output ul").append(`<img src=${card.imageUrl} alt="${card.name}" id=${card.multiverseid}>`);
        }
      } else if ((cmcOperator === "more")) {
        if (!prevNames.has(card.name) && card.imageUrl && (card.cmc >= cmc)) {
          prevNames.add(card.name);
          $("#output ul").append(`<li>${card.name}</li>`);
          $("#output ul").append(`<img src=${card.imageUrl} alt="${card.name}" id=${card.multiverseid}>`);
        }
      } else if (!prevNames.has(card.name) && card.imageUrl) {
        prevNames.add(card.name);
        $("#output ul").append(`<li>${card.name}</li>`);
        $("#output ul").append(`<img src=${card.imageUrl} alt="${card.name}" id=${card.multiverseid}>`);
      }

    });
  }
  $("img").on("click", function () {
    console.log("test");
    console.log(this.id);
    console.log(cardById(this.id));
  });
}