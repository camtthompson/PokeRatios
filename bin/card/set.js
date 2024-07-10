import { PokeRatioCard, PokeDataSource } from "./card.js";

export class PokeRatioSet {
    listOfCards;

    constructor(pokeDataCards) {
        this.listOfCards = pokeDataCards
    }

    getProcessedSet(minScore, minCost, yearReleased, language) {
        let processedCards = []; 

        for (const card of this.listOfCards) {
            const pCard = new PokeRatioCard(card);
            const processedCard = {
                Name: pCard.name,
                Number: pCard.number,
                SetName: pCard.setName,
                AvgPrice: pCard.cardPrice.toFixed(2),
                TCGPPrice: pCard.tcgpPrice.toFixed(2),
                EBAYPrice: pCard.eBayPrice.toFixed(2),
                EBAYDiff: (pCard.tcgpPrice - pCard.eBayPrice).toFixed(2),
                PSA9Diff: (pCard.getStat(PokeDataSource.PSA9) - pCard.cardPrice).toFixed(2),
                PSA10Ratio: pCard.getPSARatio(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
                PSA10AvgSell: pCard.getStat(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
                PSA9Ratio: pCard.getPSARatio(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
                PSA9AvgSell: pCard.getStat(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
                PSA8Ratio: pCard.getPSARatio(PokeDataSource.PSA8)?.toFixed(2) ?? 0,
                PSA8AvgSell: pCard.getStat(PokeDataSource.PSA8)?.toFixed(2) ?? 0,
                YearReleased: yearReleased,
                Language: language,
            }

            if (pCard.cardPrice > minCost && pCard.getStat(minScore)) {
                processedCards.push(processedCard);
            }
        }

        return processedCards;
    }
}