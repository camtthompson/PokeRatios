import {
  writeFile,
  createReadStream,
  readFileSync,
  writeFileSync,
} from "node:fs";

// Of course you still need to parse the JSON, etc.

// Save card prices to json
export const storeCardPrices = (processedSetCards) => {
  const currentDate = new Date().toLocaleDateString();
  const historicalData = getAllHistoricalCardPrices();
  const currentData = historicalData[currentDate]
    ? historicalData[currentDate]
    : {};

  for (let card of processedSetCards) {
    if (card.PSA10Value > 0 && card.AvgPrice > 2) {
      let basicPricingInfo = {
        PSA10: card.PSA10Value,
        AVG: card.AvgPrice,
      };

      currentData[card.UCID] = basicPricingInfo;
    }
  }

  historicalData[currentDate] = currentData;

  saveHistoricalPrices(JSON.stringify(historicalData));
};

const saveHistoricalPrices = (cardPrices) => {
  writeFileSync("history/psa10prices.json", cardPrices);
};

// Load card prices from json
const getAllHistoricalCardPrices = () => {
  const psa10prices = readFileSync("history/psa10prices.json", {
    encoding: "utf-8",
  });

  return JSON.parse(psa10prices);
};

const getAllTimeStampCardPrices = (timeStamp) => {
  const prices = getAllHistoricalCardPrices();

  return prices[timeStamp];
};

export const getTimeStampedCardPrice = (timeStamp, UCID) => {
  const timeStampPrices = getAllTimeStampCardPrices(timeStamp);
  const cardPrices = timeStampPrices[UCID];

  return cardPrices;
};
