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
                LPBuyPrice: pCard.lpBuyPrice,
                LPRatio: (pCard.lpBuyPrice / pCard.cardPrice).toFixed(2),
                NMBuyPrice: Math.max(pCard.lpBuyPrice, pCard.nmBuyPrice),
                NMRatio: (pCard.nmBuyPrice / pCard.cardPrice).toFixed(2),
                MBuyPrice: Math.max(pCard.nmBuyPrice, pCard.mBuyPrice),
                MRatio: (pCard.mBuyPrice / pCard.cardPrice).toFixed(2),
                YearReleased: yearReleased,
                Language: language,
                PokeRatio: pCard.getPokeRatio().toFixed(2),
                PSA1Ratio: pCard.getPSARatio(PokeDataSource.PSA1)?.toFixed(2) ?? 0,
                PSA2Ratio: pCard.getPSARatio(PokeDataSource.PSA2)?.toFixed(2) ?? 0,
                PSA3Ratio: pCard.getPSARatio(PokeDataSource.PSA3)?.toFixed(2) ?? 0,
                PSA3AvgSell: pCard.getStat(PokeDataSource.PSA3)?.toFixed(2) ?? 0,
                PSA4Ratio: pCard.getPSARatio(PokeDataSource.PSA4)?.toFixed(2) ?? 0,
                PSA4AvgSell: pCard.getStat(PokeDataSource.PSA4)?.toFixed(2) ?? 0,
                PSA5Ratio: pCard.getPSARatio(PokeDataSource.PSA5)?.toFixed(2) ?? 0,
                PSA5BuyPrice: pCard.getBuyPrice(PokeDataSource.PSA5)?.toFixed(2) ?? 0,
                PSA5AvgSell: pCard.getStat(PokeDataSource.PSA5)?.toFixed(2) ?? 0,
                PSA6Ratio: pCard.getPSARatio(PokeDataSource.PSA6)?.toFixed(2) ?? 0,
                PSA6BuyPrice: pCard.getBuyPrice(PokeDataSource.PSA6)?.toFixed(2) ?? 0,
                PSA6AvgSell: pCard.getStat(PokeDataSource.PSA6)?.toFixed(2) ?? 0,
                PSA7Ratio: pCard.getPSARatio(PokeDataSource.PSA7)?.toFixed(2) ?? 0,
                PSA7BuyPrice: pCard.getBuyPrice(PokeDataSource.PSA7)?.toFixed(2) ?? 0,
                PSA7AvgSell: pCard.getStat(PokeDataSource.PSA7)?.toFixed(2) ?? 0,
                PSA8Ratio: pCard.getPSARatio(PokeDataSource.PSA8)?.toFixed(2) ?? 0,
                PSA8BuyPrice: pCard.getBuyPrice(PokeDataSource.PSA8)?.toFixed(2) ?? 0,
                PSA8AvgSell: pCard.getStat(PokeDataSource.PSA8)?.toFixed(2) ?? 0,
                PSA9Ratio: pCard.getPSARatio(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
                PSA9BuyPrice: pCard.getBuyPrice(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
                PSA9AvgSell: pCard.getStat(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
                PSA10Ratio: pCard.getPSARatio(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
                PSA10BuyPrice: pCard.getBuyPrice(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
                PSA10AvgSell: pCard.getStat(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
            }

            if (pCard.cardPrice > minCost && pCard.getStat(minScore)) {
                processedCards.push(processedCard);
            }
        }

        return processedCards;
    }
}