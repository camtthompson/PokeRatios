const pokedataApiKey =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczMTgxNDkzNSwianRpIjoiMTQzMzY5NTgtMGQ2OS00YzY0LWI5ZDAtZTMxNDc5NmQ4M2IyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjI4YTJmNTg3LWY1YTgtNGUwNi1iOTI1LTc4MTdmYzNjOTgyYSIsIm5iZiI6MTczMTgxNDkzNSwidG9rZW5fdHlwZSI6ImFwaSJ9.oOGkqnfukcN4yud8f4rkOiBz25jvZhSroLZH8kAq1q0";

export const getSearchForCard = (cardName) => {
  return new Promise((resolve) =>
    fetch(
      `https://www.pokedata.io/v0/search?query=${cardName}&asset_type=CARD`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: pokedataApiKey,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        let topResultId = json[0].id ? json[0].id : undefined;

        resolve(topResultId);
      })
      .catch((err) => {
        console.log(err);
        resolve(undefined);
      })
  );
};

export const getCardInfo = (pokedataCardId, grade) => {
  return new Promise((resolve) =>
    fetch(
      `https://www.pokedata.io/v0/pricing?id=${pokedataCardId}&asset_type=CARD`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: pokedataApiKey,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        let gradedValue = Math.round(json.pricing[`PSA ${grade}.0`].value);

        resolve(gradedValue);
      })
      .catch((err) => {
        console.log(err);
        resolve(0);
      })
  );
};
