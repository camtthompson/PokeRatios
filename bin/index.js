#! /usr/bin/env node
import yargs from "yargs";
import { processUrl } from "./process.js";
import { processPsaCsv } from "./processPsaCsv.js";

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
                  describe: 'Cards with a cost less than this will be filtered out, default is 1',
                  demandOption: false,
                  type: 'number'
            },
      },
      handler(argv) {
            console.log('here', argv.j);
      }
})
const commandName = process.argv[2];

switch(commandName) {
      case 'process':
        processUrl();
        break;
      case 'list':
        processPsaCsv();
        break;
      default:
        // code block
    }
