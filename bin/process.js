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
        const setName = setInfo.name;
        const encodedSetName = encodeURIComponent(setName);
        const setUrlToProcess = `https://www.pokedata.io/api/cards?set_name=${encodedSetName}&stats=kwan`;
        const releasedYear = new Date(setInfo.release_date).getFullYear();
        const language = setInfo.language;
        const delay = baseDelay * index;

        if (releasedYear > 2019 && language === "ENGLISH") {
          setPromises.push(
            processSet(setName, setUrlToProcess, releasedYear, language, delay)
          );
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

  const processSet = (setName, setUrl, releasedYear, language, delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      fetch(setUrl).then((response) => {
        response.json().then((json) => {
          const currentSet = new PokeRatioSet(json);
          const processedSet = currentSet.getProcessedSet(
            setName,
            releasedYear,
            language
          );

          if (processedSet.length > 0) {
            convertToUsableCsv(processedSet, setName);
          }

          return processedSet;
        });
      })
    );
  };
};
