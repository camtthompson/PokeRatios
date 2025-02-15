run npm install and pokeratio

run `cat *.csv >combined.csv` to combine all the csv's into one master file

Can we calculate set value (sum of average price of card / total cards in set) (sum of average psa 9 / total cards in set)

## To generate csv with ratios:

`pokeratio process -j "https://www.pokedata.io/_next/data/LRuC-nAOZmsV04oIkT8Hb/sets.json" -s 10 -c 1`

## To generate a full csv with the individual files:

`cat exportedCsvs/*.csv >reports/oct-10-2024.csv`

## To run the commmand to generate names:

`pokeratio list -o "24492252"`

## API TOKENS

### PSA Public API

More information on this API can be found on this site: https://www.psacard.com/publicapi/documentation

Access Token:
QarGKYMhnYC75ce8fm3wtgil9qQM4E68aRekcprzhrfjqYtf_fUgkrnlRCkNnFlmv54YzgI3m4sETK5P6OuV4bEzma2TmZG_Ek-pDRjoBM2O2LZv3Q836_ZCLkJ1WG9Fy_xaDdYn1lYNdPhiF76Jpk2oyLNuFZ0ceLDPjbXzFL5pdNmVoGRZIElUXQQ6n5XS1u7JqbAK_8zK3Fv5HRsNWcTPZBatJUF25QXtFTCyPMkWEgWhxn_Ji3OkUz3IXGJrUfvK5McsgYFinvUoveANF8VRvdcA-p_yAODHGxMHNerS8BT6

### Ebay Listing API

More informaiton on this API can be found on this site:
