const setCodeMap = {
  ENPRE161: 12632263,
};

const langCodeMap = {
  ENGLISH: EN,
  JAPANESE: JP,
};

export const getSetCode = (setName, language) => {
  const langCode = langCodeMap[language];
  const setCode = setCodeMap[setName];
  const generatedSetCode = `${langCode}-${setCode}`;

  return langCode && setCode ? generatedSetCode : undefined;
};
