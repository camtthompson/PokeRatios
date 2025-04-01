import { getTimeStampedCardPrice } from "../api/history/historicalDataHandler.js";
import { PokeRatioCard, PokeDataSource } from "./card.js";
import { getLangCode, getSetCode } from "./setCode.js";

export class PokeRatioSet {
  listOfCards;

  constructor(pokeDataCards) {
    this.listOfCards = pokeDataCards;
  }

  getProcessedSet(setInfo) {
    const langCode = getLangCode(setInfo.language);
    const setCode = setInfo.code ? setInfo.code : getSetCode(setInfo.name);
    const yearReleased = new Date(setInfo.release_date).getFullYear();
    const language = setInfo.language;
    const firstTimeStamp = process.argv[process.argv.indexOf("-d") + 1];
    const secondTimeStamp = process.argv[process.argv.indexOf("-d2") + 1];

    let processedCards = [];

    for (const card of this.listOfCards) {
      const pCard = new PokeRatioCard(card, setCode);
      const psa10Value = pCard.getStat(PokeDataSource.PSA10)?.toFixed(2) ?? 0;
      const avgPrice = pCard.cardPrice.toFixed(2);
      const gradeCost = psa10Value > 500 ? 65 : 20;
      const p10Proceeds = (
        psa10Value * 0.87 -
        pCard.cardPrice -
        gradeCost
      ).toFixed(2);
      const UCID = setCode ? langCode + setCode + pCard.number : undefined;
      const firstTimeStampPrices = getTimeStampedCardPrice(
        firstTimeStamp,
        UCID
      );
      const secondTimeStampPrices = getTimeStampedCardPrice(
        secondTimeStamp,
        UCID
      );
      const processedCard = {
        Name: pCard.name,
        Number: pCard.number,
        SetName: pCard.setName,
        AvgPrice: avgPrice,
        PSA10Value: pCard.getStat(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
        PSA10Proceeds: isNaN(p10Proceeds) ? undefined : p10Proceeds,
        PSA9Value: pCard.getStat(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
        TCGPPrice: pCard.tcgpPrice.toFixed(2),
        EBAYPrice: pCard.eBayPrice.toFixed(2),
        EBAYDiff: (pCard.tcgpPrice - pCard.eBayPrice).toFixed(2),
        PSA10Diff: (
          pCard.getStat(PokeDataSource.PSA10) - pCard.cardPrice
        ).toFixed(2),
        PSA9Diff: (
          pCard.getStat(PokeDataSource.PSA9) - pCard.cardPrice
        ).toFixed(2),
        YearReleased: yearReleased,
        Language: language,
        UCID: UCID,
      };

      const psa10Change = psa10Value / firstTimeStampPrices?.PSA10;
      const priceChange = avgPrice / firstTimeStampPrices?.AVG;
      const psa10Change2 = psa10Value / secondTimeStampPrices?.PSA10;

      processedCard["10c " + firstTimeStamp] = psa10Change
        ? (psa10Change - 1).toFixed(2)
        : 0;
      processedCard["AVGc " + firstTimeStamp] = priceChange
        ? (priceChange - 1).toFixed(2)
        : 0;
      processedCard["10c " + secondTimeStamp] = psa10Change2
        ? (psa10Change2 - 1).toFixed(2)
        : 0;

      processedCards.push(processedCard);
    }

    return processedCards;
  }
}
