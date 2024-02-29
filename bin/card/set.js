import { PokeRatioCard, PokeDataSource } from "./card.js";

export class PokeRatioSet {
    listOfCards;

    constructor(pokeDataCards) {
        this.listOfCards = pokeDataCards
    }

    getProcessedSet(minScore, minCost, releaseDate) {
        let processedCards = []; 

        for (const card of this.listOfCards) {
            const pCard = new PokeRatioCard(card);
            const processedCard = {
                Name: pCard.name,
                Number: pCard.number,
                Setname: pCard.setName,
                Price: pCard.cardPrice.toFixed(2),
                ReleaseDate: releaseDate,
                PokeRatio: pCard.getPokeRatio().toFixed(2),
                PSA1Ratio: pCard.getPSARatio(PokeDataSource.PSA1)?.toFixed(2) ?? 0,
                PSA2Ratio: pCard.getPSARatio(PokeDataSource.PSA2)?.toFixed(2) ?? 0,
                PSA3Ratio: pCard.getPSARatio(PokeDataSource.PSA3)?.toFixed(2) ?? 0,
                PSA4Ratio: pCard.getPSARatio(PokeDataSource.PSA4)?.toFixed(2) ?? 0,
                PSA5Ratio: pCard.getPSARatio(PokeDataSource.PSA5)?.toFixed(2) ?? 0,
                PSA6Ratio: pCard.getPSARatio(PokeDataSource.PSA6)?.toFixed(2) ?? 0,
                PSA7Ratio: pCard.getPSARatio(PokeDataSource.PSA7)?.toFixed(2) ?? 0,
                PSA8Ratio: pCard.getPSARatio(PokeDataSource.PSA8)?.toFixed(2) ?? 0,
                PSA9Ratio: pCard.getPSARatio(PokeDataSource.PSA9)?.toFixed(2) ?? 0,
                PSA10Ratio: pCard.getPSARatio(PokeDataSource.PSA10)?.toFixed(2) ?? 0,
            }

            if (pCard.cardPrice > minCost && pCard.getStat(minScore)) {
                processedCards.push(processedCard);
            }
        }

        return processedCards;
    }
}