import { PokeRatioCard, PokeDataSource } from "./card.js";
import { getSetCode } from "./setCode.js";

export class PokeRatioSet {
  listOfCards;

  constructor(pokeDataCards) {
    this.listOfCards = pokeDataCards;
  }

  getProcessedSet(setName, yearReleased, language) {
    const setCode = setInfo.code ? setInfo.code : getSetCode(setInfo.name);
    let processedCards = [];

    for (const card of this.listOfCards) {
      const pCard = new PokeRatioCard(card);
      const psa10Value = pCard.getStat(PokeDataSource.PSA10);
      const gradeCost = psa10Value > 500 ? 65 : 20;
      const p10Proceeds = (
        psa10Value * 0.87 -
        pCard.cardPrice -
        gradeCost
      ).toFixed(2);
      const processedCard = {
        Name: pCard.name,
        Number: pCard.number,
        SetName: pCard.setName,
        AvgPrice: pCard.cardPrice.toFixed(2),
        PSA10Proceeds: p10Proceeds,
        PSA10PRatio: (p10Proceeds / pCard.cardPrice).toFixed(2),
        TCGPPrice: pCard.tcgpPrice.toFixed(2),
        EBAYPrice: pCard.eBayPrice.toFixed(2),
        EBAYDiff: (pCard.tcgpPrice - pCard.eBayPrice).toFixed(2),
        PSA9Diff: (
          pCard.getStat(PokeDataSource.PSA9) - pCard.cardPrice
        ).toFixed(2),
        PSA10Diff: (
          pCard.getStat(PokeDataSource.PSA10) - pCard.cardPrice
        ).toFixed(2),
        PSA10Ratio: pCard.getPSARatio(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
        PSA10AvgSell: pCard.getStat(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
        PSA9Ratio: pCard.getPSARatio(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
        PSA9AvgSell: pCard.getStat(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
        YearReleased: yearReleased,
        Language: language,
        UCID: setCode ? setCode + pCard.number : undefined,
      };

      processedCards.push(processedCard);
    }

    return processedCards;
  }
}
