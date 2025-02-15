const psaApiKey =
  "Bearer QarGKYMhnYC75ce8fm3wtgil9qQM4E68aRekcprzhrfjqYtf_fUgkrnlRCkNnFlmv54YzgI3m4sETK5P6OuV4bEzma2TmZG_Ek-pDRjoBM2O2LZv3Q836_ZCLkJ1WG9Fy_xaDdYn1lYNdPhiF76Jpk2oyLNuFZ0ceLDPjbXzFL5pdNmVoGRZIElUXQQ6n5XS1u7JqbAK_8zK3Fv5HRsNWcTPZBatJUF25QXtFTCyPMkWEgWhxn_Ji3OkUz3IXGJrUfvK5McsgYFinvUoveANF8VRvdcA-p_yAODHGxMHNerS8BT6";

export const getImagesByCertNumber = (certNumber) => {
  return new Promise((resolve) =>
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
      .then((response) => {
        let photosString = "";

        response.json().map((image) => {
          if (image.IsFrontImage) {
            photosString = image.ImageURL + "|" + photosString;
          } else {
            photosString = photosString + image.ImageURL;
          }
        });

        resolve(photosString);
      })
      .catch((err) => {
        console.log(err);
        rejects(err);
      })
  );
};

export const getPSASpecPopulation = (specId) => {
  return new Promise((resolve) =>
    fetch(
      `https://api.psacard.com/publicapi/pop/GetPSASpecPopulation/${specId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: psaApiKey,
        },
      }
    )
      .then((response) => {
        let json = response.json();
        let totalGrades = json.PSAPop.Total;
        let tenGrades = json.PSAPop.Grade10;
        let gemRate = (tenGrades / totalGrades).toFixed(2);

        resolve(gemRate);
      })
      .catch((err) => {
        console.log(err);
        resolve(undefined);
      })
  );
};
