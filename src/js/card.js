export default class Card {
  static getCard(name, types, cmc, colors, language, colorIdentity) {
    let url = `https://api.magicthegathering.io/v1/cards?name=${name}`;
    if (types !== "Any") {
      url += `&types=${types}`;
    }
    if (cmc) {
      url += `&cmc=${cmc}`;
    }
    if (colors) {
      url += `&colors=${colors.join("|")}`;
    }
    if (colorIdentity) {
      url += `&colorIdentity=${colorIdentity.join(",")}`;
    }
    if (language) {
      url += `&language=${language}`;
    }

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }

  static getCardbyId(id) {
    return fetch(`https://api.magicthegathering.io/v1/cards?multiverseid=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }
}