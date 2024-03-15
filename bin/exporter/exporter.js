import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

export const convertToUsableCsv = (json, setName) => { 
    // mkConfig merges your options with the defaults
    // and returns WithDefaults<ConfigOptions>
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    // Converts your Array<Object> to a CsvOutput string based on the configs
    const csv = generateCsv(csvConfig)(json);
    const filename = `exportedCsvs/${setName}.csv`;
    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

    // Write the csv file to disk
    writeFile(filename, csvBuffer, (err) => {
    if (err) throw err;
        console.log("file saved: ", filename, json);
    });
}