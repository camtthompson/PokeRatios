const setCodeMap = {
  "Scarlet & Violet Promos": "SVP",
  "Scarlet & Violet Base": "SVI",
  "Paldea Evolved": "PAL",
  "Obsidian Flames": "OBF",
  "Pokemon Card 151": "MEW",
  "Paradox Rift": "PAR",
  "Paldean Fates": "PAF",
  "Temporal Forces": "TEF",
  "Twilight Masquerade": "TWM",
  "Shrouded Fable": "SFA",
  "Stellar Crown": "SCR",
  "Surging Sparks": "SSP",
  "Prismatic Evolutions": "PRE",
  "Sword & Shield Promo": "SSO",
  "Sword & Shield": "SSH",
  "Rebel Clash": "RCL",
  "Darkness Ablaze": "DAA",
  "Champion's Path": "CPA",
  "Vivid Voltage": "VIV",
  "Shining Fates": "SHF",
  "Battle Styles": "BST",
  "Chilling Reign": "CRE",
  "Evolving Skies": "EVS",
  "Celebrations: Classic Collection": "CELC",
  Celebrations: "CEL",
  "Fusion Strike": "FST",
  "Brilliant Stars": "BRS",
  "Astral Radiance": "ASR",
  "Pokémon GO": "PGO",
  "Lost Origin": "LOR",
  "Silver Tempest": "SIT",
  "Crown Zenith": "CRZ",
  "Sun & Moon": "SUM",
  "Guardians Rising": "GRI",
  "Burning Shadows": "BUS",
  "Shining Legends": "SLG",
  "Crimson Invasion": "CIN",
  "Ultra Prism": "UPR",
  "Forbidden Light": "FLI",
  "Celestial Storm": "CES",
  "Dragon Majesty": "DRM",
  "Lost Thunder": "LOT",
  "Team Up": "TEU",
  "Detective Pikachu": "DET",
  "Unbroken Bonds": "UNB",
  "Unified Minds": "UNM",
  "Hidden Fates": "HIF",
  "Cosmic Eclipse": "CEC",
  "Kalos Starter Set": "KSS",
  XY: " XY",
  Flashfire: "FLF",
  "Furious Fists": "FFI",
  "Phantom Forces": "PHF",
  "Primal Clash": "PRC",
  "Double Crisis": "DCR",
  "Roaring Skies": "ROS",
  "Ancient Origins": "AOR",
  BREAKthrough: "BKT",
  BREAKpoint: "BKP",
  Generations: "GEN",
  "Fates Collide": "FCO",
  "Steam Siege": "STS",
  Evolutions: "EVO",
};

const langCodeMap = {
  ENGLISH: "EN",
  JAPANESE: "JP",
};

export const getSetCode = (setName) => {
  return setCodeMap[setName];
};

export const getLangCode = (language) => {
  return langCodeMap[language];
};
