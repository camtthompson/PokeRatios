import { convertToUsableCsv } from "./exporter/exporter.js";
import { PokeRatioSet } from "./card/set.js";

export const processUrl = () => {
  // TODO set the fields here that are passed as arguments
  const jsonUrlToProcess = process.argv[process.argv.indexOf("-j") + 1];

  fetch(jsonUrlToProcess).then((response) => {
    response.json().then((json) => {
      const setInfoArray = json.pageProps.setInfoArr;
      const baseDelay = 250;
      const allProcessedJsons = [];

      let setPromises = [];

      for (let [index, setInfo] of setInfoArray.entries()) {
        const delay = baseDelay * index;
        const yearReleased = new Date(setInfo.release_date).getFullYear();
        const language = setInfo.language;

        if (yearReleased > 2016 && language === "ENGLISH") {
          setPromises.push(processSet(setInfo, delay));
        }
      }

      Promise.all(setPromises).then((processedSets) => {
        for (let processedSet of processedSets) {
          allProcessedJsons.push(processedSet);
        }
        console.log("processedSet: " + processedSets);
      });
    });
  });

  const processSet = (setInfo, delay) => {
    const encodedSetName = encodeURIComponent(setInfo.name);
    const setUrl = `https://www.pokedata.io/api/cards?set_name=${encodedSetName}&stats=kwan`;

    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      fetch(setUrl).then((response) => {
        response.json().then((json) => {
          const currentSet = new PokeRatioSet(json);
          const processedSet = currentSet.getProcessedSet(setInfo);

          if (processedSet.length > 0) {
            convertToUsableCsv(processedSet, setInfo.name);
          }

          return processedSet;
        });
      })
    );
  };
};
