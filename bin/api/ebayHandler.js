const ebayApiKey =
  "Bearer QarGKYMhnYC75ce8fm3wtgil9qQM4E68aRekcprzhrfjqYtf_fUgkrnlRCkNnFlmv54YzgI3m4sETK5P6OuV4bEzma2TmZG_Ek-pDRjoBM2O2LZv3Q836_ZCLkJ1WG9Fy_xaDdYn1lYNdPhiF76Jpk2oyLNuFZ0ceLDPjbXzFL5pdNmVoGRZIElUXQQ6n5XS1u7JqbAK_8zK3Fv5HRsNWcTPZBatJUF25QXtFTCyPMkWEgWhxn_Ji3OkUz3IXGJrUfvK5McsgYFinvUoveANF8VRvdcA-p_yAODHGxMHNerS8BT6";

export const createDraftListing = (card) => {
  fetch(
    `https://api.psacard.com/publicapi/cert/GetImagesByCertNumber/${certNumber}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: psaApiKey,
      },
    }
  )
    //Modified code
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      // For every image in the array. If it is the front image add first, otherwise append after.
    })
    .catch((err) => console.error(err));
};
