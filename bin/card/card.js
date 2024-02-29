// export interface IPokeDataCard {
//     hot: number,
//     id: number,
//     img_url: string,
//     live: boolean,
//     name: string,
//     num: string,
//     secret: boolean,
//     set_id: number,
//     set_name: string,
//     stat_url: string,
//     stats: Array<IPokeDataStat>,
// }

// export interface IPokeDataStat {
//     avg?: number,
//     source: PokeDataSource,
// }

export const PokeDataSource = {
    RAW: 0, 
    PSA1: 1,
    PSA2: 2,
    PSA3: 3,
    PSA4: 4,
    PSA5: 5,
    PSA6: 6,
    PSA7: 7,
    PSA8: 8,
    PSA9: 9,
    PSA10: 10,
    TCGP: 11,
}

/**
 * GRADING_EXPENSE: ((15 * 20) + 25 + 15) / 20 = 17
 *  - 15 to grade in bulk (20), 25 return ship, 15 outgoing ship divide total cards
 */
const GRADING_EXPENSE = 17;

export class PokeRatioCard {
    cardPrice = 0;
    name;
    number;
    setName;
    imgUrl;

    stats = new Map();

    constructor(pokeDataCard) {
        this.name = pokeDataCard.name;
        this.setName = pokeDataCard.set_name;
        this.number = pokeDataCard.num;
        this.imgUrl = pokeDataCard.img_url;

        if (pokeDataCard.stats){
            this.stats = new Map(pokeDataCard.stats.map((stat) => [stat.source, stat.avg]));
        }
        this.setCardPrice();
    }
  
    /** Returns the average value of the given card given the source */
    getStat(source) {
        return this.stats.get(source);
    }

    /** PSA # Ratio = Card Price + Expenses / PSA Sale Price  */
    getPSARatio(source) {
        const psaAvgSalePrice = this.getStat(source);

        if (this.cardPrice && psaAvgSalePrice) {
            const totalCardCost = GRADING_EXPENSE + this.cardPrice;

            return (psaAvgSalePrice / totalCardCost);
        }

        return undefined;
    }

    /** 
     * Average of grades (4 - 8) that are defined 
     *  - Bonus for sequential value increase 
     */
    getPokeRatio() {
        const BONUS_AMOUNT = 0.02;
        const eightThruFour = [
            PokeDataSource.PSA8,
            PokeDataSource.PSA7,
            PokeDataSource.PSA6,
            PokeDataSource.PSA5,
            PokeDataSource.PSA4,
        ];

        let sum = 0;
        let prevRatio = 0;
        let totalBonus = 0;

        for (let psaScore of eightThruFour) {
            const psaRatio = this.getPSARatio(psaScore) ?? 0;
            if (psaRatio > 0) {
                sum = sum + psaRatio;
            } else {
                sum = sum + (psaScore * 0.1) // 9 -> 0.9, 8 -> 0.8 etc.
            }

            if (psaRatio < prevRatio) {
                totalBonus += BONUS_AMOUNT;
            }

            prevRatio = psaRatio;
        }

        return (sum / eightThruFour.length) + totalBonus;
    }

    setCardPrice() {
        const rawPrice = this.stats.get(PokeDataSource.RAW) ?? 0;
        const tcgpPrice = this.stats.get(PokeDataSource.TCGP) ?? 0;

        if (rawPrice > 0 && tcgpPrice > 0) {
            this.cardPrice = (rawPrice + tcgpPrice) / 2;
        } else {
            this.cardPrice = rawPrice ?? tcgpPrice;
        }
    }
}