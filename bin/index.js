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
// const setName = process.argv[process.argv.indexOf('-j') + 1];
// const encodedSetName = encodeURI(setName)
// const jsonUrlToProcess = `https://www.pokedata.io/api/cards?set_name=${encodedSetName}&stats=kwan`

// fetch(jsonUrlToProcess).then((response) => {
//     response.json().then(json => {
//       const currentSet = new PokeRatioSet(json);
//       const processedJson = currentSet.getProcessedSet(minScore, minCost);

//       convertToUsableCsv(processedJson, setName)
//     });
// })


const jsonUrlToProcess = process.argv[process.argv.indexOf('-j') + 1]

fetch(jsonUrlToProcess).then((response) => {
    response.json().then(json => {
      const setInfoArray = json.pageProps.setInfoArr;
      const allProcessedJsons = [];
      let setPromises = [];

      for (let setInfo of (setInfoArray)) {
            const setName = setInfo.name;
            const encodedSetName = encodeURI(setName);
            const setUrlToProcess = `https://www.pokedata.io/api/cards?set_name=${encodedSetName}&stats=kwan`;
            const releaseDate = setInfo.release_date;

            setPromises.push(processSet(setName, setUrlToProcess, releaseDate, minCost, minScore));
      }

      Promise.all(setPromises).then((processedSets) => {
            for (let processedSet of processedSets) {
                  allProcessedJsons.push(processedSet);
            }
            console.log('processedSet: ' + processedSets);

            convertToUsableCsv(allProcessedJsons, "All Cards");
      });

    });
});

const processSet = (setName, setUrl, releaseDate, minCost, minScore) => {
      return new Promise(resolve => setTimeout(resolve, 600)).then(() => fetch(setUrl).then((response) => {
            response.json().then(json => {
                  const currentSet = new PokeRatioSet(json);
                  const processedSet = currentSet.getProcessedSet(minScore, minCost, releaseDate);

                  if (processedSet.length > 0) {
                        convertToUsableCsv(processedSet, setName);
                  }

                  return processedSet;
            });
      }))
}

var sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}