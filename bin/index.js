#! /usr/bin/env node
import yargs from "yargs";
import { convertToUsableCsv } from "./exporter/exporter.js";
import { PokeRatioSet } from "./card/set.js";

const y = yargs()
y.command({
      command: 'process',
      describe: 'Usage: pokeratio -j <json_url> to be processed',
      builder: {
            j: {
                  describe: 'Url of json to be processed',
                  demandOption: true,
                  type: 'string'
            },
            s: {
                  describe: 'Cards without a score in this spot will be filtered out, default is 8',
                  demandOption: false,
                  type: 'number'
            },
            c: {
                  describe: 'Cards with a cost less than this will be filtered out, default is 10',
                  demandOption: false,
                  type: 'number'
            },
      },
      handler(argv) {
            console.log('here', argv.j);
      }
})

// TODO set the fields here that are passed as arguments
const minCost = 5;
const minScore = process.argv.indexOf('-s') ? parseInt(process.argv[process.argv.indexOf('-s') + 1]) : 8;
const jsonUrlToProcess = process.argv[process.argv.indexOf('-j') + 1]

fetch(jsonUrlToProcess).then((response) => {
    response.json().then(json => {
      const setInfoArray = json.pageProps.setInfoArr;
      const baseDelay = 250;
      const allProcessedJsons = [];

      let setPromises = [];

      for (let [index, setInfo] of setInfoArray.entries()) {
            const setName = setInfo.name;
            const encodedSetName = encodeURI(setName);
            const setUrlToProcess = `https://www.pokedata.io/api/cards?set_name=${encodedSetName}&stats=kwan`;
            const releasedYear = new Date(setInfo.release_date).getFullYear();
            const language = setInfo.language;
            const delay = baseDelay * index;

            if (releaseYear > 2019 && language === 'ENGLISH') {
                  setPromises.push(processSet(setName, setUrlToProcess, releasedYear, language, minCost, minScore, delay));
            }
      }

      Promise.all(setPromises).then((processedSets) => {
            for (let processedSet of processedSets) {
                  allProcessedJsons.push(processedSet);
            }
            console.log('processedSet: ' + processedSets);
      });

    });
});

const processSet = (setName, setUrl, releasedYear, language, minCost, minScore, delay) => {
      return new Promise(resolve => setTimeout(resolve, delay)).then(() => fetch(setUrl).then((response) => {
            response.json().then(json => {
                  const currentSet = new PokeRatioSet(json);
                  const processedSet = currentSet.getProcessedSet(minScore, minCost, releasedYear, language);

                  if (processedSet.length > 0) {
                        convertToUsableCsv(processedSet, setName);
                  }

                  return processedSet;
            });
      }))
}