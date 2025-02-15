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
  EBAY: 12,
};

/**
 * GRADING_EXPENSE: ((15 * 20) + 25 + 15) / 20 = 17
 *  - 15 to grade in bulk (20), 25 return ship, 15 outgoing ship divide total cards
 */
const GRADING_EXPENSE = 17;

/**
 * eBay selling rate (15%)
 */
const TOTAL_PROCEEDS = 0.85;

export class PokeRatioCard {
  UCID;
  cardPrice = 0;
  medianCardPrice = 0;
  tcgpPrice = 0;
  eBayPrice = 0;
  rawPrice = 0;
  mBuyPrice = 0;
  nmBuyPrice = 0;
  lpBuyPrice = 0;
  name;
  number;
  setName;
  imgUrl;

  averageStats = new Map();
  medianStats = new Map();

  constructor(setCode, pokeDataCard) {
    this.UCID = setCode + pokeDataCard.num;
    this.name = pokeDataCard.name;
    this.setName = pokeDataCard.set_name;
    this.number = pokeDataCard.num;
    this.imgUrl = pokeDataCard.img_url;

    if (pokeDataCard.stats) {
      this.averageStats = new Map(
        pokeDataCard.stats.map((stat) => [stat.source, stat.avg])
      );
      this.medianStats = new Map(
        pokeDataCard.stats.map((stat) => [stat.source, stat.median])
      );
    }

    this.setCardPrice();
    this.setMedianCardPrice();

    this.mBuyPrice = this.setBuyPrice([
      PokeDataSource.PSA9,
      PokeDataSource.PSA10,
    ])?.toFixed(2);
    this.nmBuyPrice = this.setBuyPrice([
      PokeDataSource.PSA7,
      PokeDataSource.PSA8,
      PokeDataSource.PSA9,
    ])?.toFixed(2);
    this.lpBuyPrice = this.setBuyPrice([
      PokeDataSource.PSA4,
      PokeDataSource.PSA5,
      PokeDataSource.PSA6,
    ])?.toFixed(2);
  }

  /** Returns the average value of the given card given the source */
  getStat(source) {
    return this.averageStats.get(source);
  }

  /** PSA # Ratio = Card Price / PSA Sale Price  */
  getPSARatio(source) {
    const psaAvgSalePrice = this.getStat(source);

    if (this.cardPrice && psaAvgSalePrice) {
      return psaAvgSalePrice / this.cardPrice;
    }

    return undefined;
  }

  getEbayProceeds(source) {
    const psaAvgSalePrice = this.getStat(source);

    if (psaAvgSalePrice) {
      return psaAvgSalePrice * TOTAL_PROCEEDS;
    }

    return 0;
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
        sum = sum + psaScore * 0.1; // 9 -> 0.9, 8 -> 0.8 etc.
      }

      if (psaRatio < prevRatio) {
        totalBonus += BONUS_AMOUNT;
      }

      prevRatio = psaRatio;
    }

    return sum / eightThruFour.length + totalBonus;
  }

  setCardPrice() {
    this.rawPrice = this.averageStats.get(PokeDataSource.RAW) ?? 0;
    this.tcgpPrice = this.averageStats.get(PokeDataSource.TCGP) ?? 0;
    this.eBayPrice = this.averageStats.get(PokeDataSource.EBAY) ?? 0;

    if (this.rawPrice > 0 && this.tcgpPrice > 0) {
      this.cardPrice = (this.rawPrice + this.tcgpPrice) / 2;
    } else {
      this.cardPrice = this.rawPrice ?? this.tcgpPrice;
    }
  }

  setMedianCardPrice() {
    let medianTcgPlayerCost = this.medianStats.get(PokeDataSource.TCGP);
    this.medianCardPrice = this.medianStats.get(PokeDataSource.RAW);

    if (medianTcgPlayerCost > 0 && this.medianCardPrice <= 0) {
      this.medianCardPrice = medianTcgPlayerCost;
    } else if (this.medianCardPrice <= 0) {
      this.medianCardPrice = 0;
    }
  }

  /**
   * This should get the get the lowest profitable ratio (> 1) and multiply it by the raw price
   */
  setBuyPrice(grades) {
    let lowestSellPrice = this.getEbayProceeds(
      grades[0] ?? this.getStat(PokeDataSource.PSA10)
    );

    for (let grade of grades) {
      let proceeds = this.getEbayProceeds(grade);
      if (proceeds < lowestSellPrice) {
        lowestSellPrice = proceeds;
      }
    }

    return lowestSellPrice - GRADING_EXPENSE;
  }

  /**
   * This should get the get the lowest profitable ratio (> 1) and multiply it by the raw price
   */
  getBuyPrice(grade) {
    let sellPrice = this.getEbayProceeds(grade);

    return sellPrice - GRADING_EXPENSE;
  }
}
