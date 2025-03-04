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
  const historicalData = getHistoricalCardPrices();
  const currentData = historicalData[currentDate]
    ? historicalData[currentDate]
    : {};

  for (let card of processedSetCards) {
    if (card.basicPricingInfo.PSA10 > 0 && card.basicPricingInfo.AVG > 2) {
      currentData[card.UCID] = card.basicPricingInfo;
    }
  }

  historicalData[currentDate] = currentData;

  saveHistoricalPrices(JSON.stringify(historicalData));
};

const saveHistoricalPrices = (cardPrices) => {
  writeFileSync("history/psa10prices.json", cardPrices);
};

// Load card prices from json
const getHistoricalCardPrices = () => {
  const psa10prices = readFileSync("history/psa10prices.json", {
    encoding: "utf-8",
  });

  return JSON.parse(psa10prices);
};
