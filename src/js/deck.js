export default class Deck {
  constructor() {
    this.cards = {};
    this.deckLength = 0;
    this.types = {};
  }

  async addCard(card) {
    let awaitedCard = (await card).cards[0];
    if (!this.cards[awaitedCard.multiverseid]) {
      this.cards[awaitedCard.multiverseid] = awaitedCard;
      this.cards[awaitedCard.multiverseid].count = 1;
    } else if (this.cards[awaitedCard.multiverseid].types.includes("Land") && this.cards[awaitedCard.multiverseid].supertypes.includes("Basic")) {
      this.cards[awaitedCard.multiverseid].count++;
    }
    else if (this.cards[awaitedCard.multiverseid] && this.cards[awaitedCard.multiverseid].count < 4) {
      this.cards[awaitedCard.multiverseid].count++;
    }
  }

  deckSize() {
    this.deckLength = 0;
    Object.keys(this.cards).forEach((card) => {
      this.deckLength += this.cards[card].count;
    });
  }

  deckDistribution() {
    let arrayOfTypes = ["Artifact", "Conspiracy", "Creature", "Enchantment", "Instant", "Land", "Phenomenon", "Plane", "Planeswalker", "Scheme", "Sorcery", "Tribal", "Vanguard"];
    arrayOfTypes.forEach((type) => {
      this.types[type] = 0;
    });
    Object.keys(this.cards).forEach((card) => {
      let count = this.cards[card].count;
      let cardTypes = this.cards[card].types;
      if (cardTypes.includes("Land")) {
        this.types["Land"] += count;
      } else {
        for (let i = 0; i < cardTypes.length; i++) {
          this.types[cardTypes[i]] += count;
        }
      }
    });
  }

  landPercent() {
    const landPerc = (this.types.Land / this.deckLength) * 100;
    return Math.round(landPerc);
  }

  displayDeck() {
    let deckListCreatures = `<h4>Creatures(${this.types.Creature})</h4><ul>`;
    let deckListLands = `<h4>Lands(${this.types.Land})</h4><ul>`;
    let deckListSpells = `<h4>Non-Creature Spells(${this.deckLength - this.types.Land - this.types.Creature})</h4><ul>`;
    Object.keys(this.cards).forEach((card) => {
      let mana = (this.cards[card].manaCost).replaceAll("{W}", '<i class="ms ms-w"></i>')
        .replaceAll("{B}", '<i class="ms ms-b"></i>')
        .replaceAll("{U}", '<i class="ms ms-u"></i>')
        .replaceAll("{R}", '<i class="ms ms-r"></i>')
        .replaceAll("{G}", '<i class="ms ms-g"></i>')
        .replaceAll("{0}", '<i class="ms ms-0"></i>')
        .replaceAll("{1}", '<i class="ms ms-1"></i>')
        .replaceAll("{2}", '<i class="ms ms-2"></i>')
        .replaceAll("{3}", '<i class="ms ms-3"></i>')
        .replaceAll("{4}", '<i class="ms ms-4"></i>')
        .replaceAll("{5}", '<i class="ms ms-5"></i>')
        .replaceAll("{6}", '<i class="ms ms-6"></i>')
        .replaceAll("{7}", '<i class="ms ms-7"></i>')
        .replaceAll("{8}", '<i class="ms ms-8"></i>')
        .replaceAll("{9}", '<i class="ms ms-9"></i>')
        .replaceAll("{10}", '<i class="ms ms-10"></i>')
        .replaceAll("{11}", '<i class="ms ms-11"></i>')
        .replaceAll("{12}", '<i class="ms ms-12"></i>')
        .replaceAll("{13}", '<i class="ms ms-13></i>')
        .replaceAll("{14}", '<i class="ms ms-14"></i>')
        .replaceAll("{15}", '<i class="ms ms-15"></i>')
        .replaceAll("{16}", '<i class="ms ms-16"></i>')
        .replaceAll("{17}", '<i class="ms ms-17"></i>')
        .replaceAll("{18}", '<i class="ms ms-18"></i>')
        .replaceAll("{19}", '<i class="ms ms-19"></i>')
        .replaceAll("{20}", '<i class="ms ms-20"></i>')
        .replaceAll("{X}", '<i class="ms ms-x"></i>')
        .replaceAll("{C}", '<i class="ms ms-c"></i>')
        .replaceAll("{P}", '<i class="ms ms-p"></i>')
        .replaceAll("{S}", '<i class="ms ms-s"></i>')
        .replaceAll("{100}", '<i class="ms ms-100"></i>');
      let cardTypes = this.cards[card].types;
      let theCard = `<li>${this.cards[card].name} x${this.cards[card].count}</li>`;
      if (this.cards[card].manaCost) {
        theCard = `<li>${mana} ${this.cards[card].name} x${this.cards[card].count}</li>`;
      }

      if (cardTypes.includes("Land")) {
        deckListLands += theCard;
      } else if (cardTypes.includes("Creature")) {
        deckListCreatures += theCard;
      } else {
        deckListSpells += theCard;
      }
    });
    return `${deckListCreatures}</ul>${deckListSpells}</ul>${deckListLands}</ul>`;
  }

  averageManaCost() {
    let totalCMC = 0;
    let nonLands = 0;
    Object.keys(this.cards).forEach((card) => {
      if (!this.cards[card].types.includes("Land")) {
        totalCMC += this.cards[card].cmc;
        nonLands++;
      }
    });
    if (nonLands === 0) {
      return 0;
    } else {
      return Math.floor(totalCMC / nonLands);
    }
  }

  firstDraw() {
    let mockDeck = [];
    let draw = [];
    Object.keys(this.cards).forEach((card) => {
      for (let i = 1; i <= this.cards[card].count; i++) {
        mockDeck.push(this.cards[card].imageUrl);
      }
    });
    let counter = mockDeck.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = mockDeck[counter];
      mockDeck[counter] = mockDeck[index];
      mockDeck[index] = temp;
    }
    for (let i = 0; i < 7; i++) {
      draw.push(mockDeck[i]);
    }
    return draw;
  }
}