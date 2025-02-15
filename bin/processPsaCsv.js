import { openCsv, convertToUsableCsv } from "./exporter/exporter.js";
import { getImagesByCertNumber } from "./api/psa/psaHandler.js";
import { getCardInfo, getSearchForCard } from "./api/pokedataHandler.js";

export const processPsaCsv = async () => {
  const psaOrderNumber = process.argv[process.argv.indexOf("-o") + 1];
  const psaFileRecords = await openCsv(psaOrderNumber);
  const ebayListings = [];

  const cardCertIndex = 0;
  const cardNameIndex = 2; // These could be dynamic if the csv shifts often
  const cardGradeIndex = 3;

  for (let record of psaFileRecords) {
    const nameValues = extractValues(record[cardNameIndex]);
    const cardGradeValues = extractGrade(record[cardGradeIndex]);
    const certNumber = record[cardCertIndex];

    let cardName = `${nameValues.name} ${nameValues.number}`;
    let completeCardName =
      `${cardName} PSA ${cardGradeValues.grade} ${cardGradeValues.name}`.trim();
    let finalCardName = `${completeCardName} - ${nameValues.set} - Pokemon`;

    const images = await getImagesByCertNumber(certNumber);
    const pokeDataId = await getSearchForCard(`${cardName} ${nameValues.set}`);
    const marketPrice = await getCardInfo(pokeDataId, cardGradeValues.grade);

    ebayListings.push({
      ebayStatus: "Draft",
      sku: "MC" + certNumber,
      ebayCategoryId: 183454,
      title: finalCardName,
      upc: undefined,
      price: marketPrice,
      quantity: 1,
      photos: undefined,
      ebayConditionId: 2750,
      desciption: `${completeCardName} from ${nameValues.set}. Graded ${cardGradeValues.grade} by PSA.`,
      ebayFormat: "FixedPrice",
    });
  }

  convertToUsableCsv(
    ebayListings,
    `eBay-draft-listing-template-${psaOrderNumber}`
  );
};

// Eg. YEAR POKEMON SET SERIES NAME CARD NUMBER CARD NAME CARD TYPE
const extractValues = (psaCardName) => {
  let listingCardName = toTitleCase(psaCardName);

  const baseStartRegex = /^\d{4} Pokemon/;
  const setNameRegex = /[A-Za-z]{3} En-/;
  listingCardName = listingCardName.replace(baseStartRegex, "").trim();
  listingCardName = listingCardName.replace(setNameRegex, "").trim();

  const textRemovals = {
    "Sword & Shield": "",
    "Sword And Shield": "",
    "Full Art/": "",
    Secret: "",
    "Special Illustration Rare": "",
    "Illustration Rare": "",
  };

  for (const entry of Object.entries(textRemovals)) {
    listingCardName = listingCardName.replace(entry[0], entry[1]);
  }

  const cardNumberRegex = /\sGg\d{2}|\s\d{3}|\sTg\d{2}|\sSv\d{3}/;
  const cardNumberPosition = listingCardName.search(cardNumberRegex);
  const cardNumberLength = listingCardName.match(cardNumberRegex)[0].length;

  let card = {
    name: toTitleCase(
      listingCardName.slice(cardNumberPosition + cardNumberLength)
    ).trim(),
    number: listingCardName
      .slice(cardNumberPosition, cardNumberPosition + cardNumberLength)
      .trim(),
    set: toTitleCase(listingCardName.slice(0, cardNumberPosition)).trim(),
    photos: [],
  };

  const textReplacements = {
    Gg: "GG",
  };

  for (const entry of Object.entries(textReplacements)) {
    card.name = card.name.replace(entry[0], entry[1]);
    card.number = card.number.replace(entry[0], entry[1]);
    card.set = card.set.replace(entry[0], entry[1]);
  }

  return card;
};

const extractGrade = (psaGradeValue) => {
  const cardGradeRegex = /\d{1}|\d{2}/;
  const cardGradePosition = psaGradeValue.search(cardGradeRegex);
  const grade = psaGradeValue.slice(cardGradePosition).trim();

  let listingCardGradeName = toTitleCase(
    psaGradeValue.slice(0, cardGradePosition)
  ).trim();

  const textReplacements = {
    "Excellent-mint": "",
  };

  for (const entry of Object.entries(textReplacements)) {
    listingCardGradeName = listingCardGradeName.replace(entry[0], entry[1]);
  }

  const cardGradeParts = {
    name: toTitleCase(listingCardGradeName).trim(),
    grade: grade,
  };

  return cardGradeParts;
};

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};
