const config = require("../config");

const CACHE = {};
// skopje: {
//  timestamp: 123458686.21 -> tretiot povik obratete vnimanie na timestamp bidejki nema da se promeni
//  data: {}
// }

const getCityWeather = async (city) => {
  //na vtoriot povik so ist grad - Skopje
  let now = new Date().getTime() / 1000; // 1 Jan 1970 - Unix Period - in seconds
  // ova e sekogas drugo vreme koga se povikuva funkcijata, t.e tocnoto vreme koga sme ja povikale

  console.log("CACHE", CACHE);

  //CACHE[city].timestamp -> vremeto koga sme go pobarale toj resurs t.e toj grad
  //config.getSection("weather").cache_exp -> 60 sekundi

  // 20:30 -> napravivme povik so grad Skopje, ovaa vreme e zapisano vo CACHE[city].timestamp vo sekundi
  // CACHE[city].timestamp - staroto vreme ili vremeto koga bil napraven prviot povik za ovoj grad
  //config.getSection("weather").cache_exp -> kolku vreme da odi vo idnina t.e
  // 20:31 -> ovaa e vtor povik, gradot Skopje postoi
  // 20:32 -> ovoj uslov nema da vazi i ke prodolzi dolu vo fetch funkcijata za da povika ponovi podatoci za
  // gradot Skopje
  if (
    CACHE[city] &&
    now < CACHE[city].timestamp + config.getSection("weather").cache_expiery
  ) {
    console.log("Data is from cache");
    return CACHE[city];
  }

  const URL = `${
    config.getSection("weather").API_URL
  }/weather?q=${city}&units=metric&appid=${
    config.getSection("weather").api_key
  }`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

    CACHE[city] = {
      timestamp: new Date().getTime() / 1000,
      data: data,
    };
  } catch (err) {
    throw err;
  }
};

const getFiveDaysForecastForCity = async (city) => {};

module.exports = {
  getCityWeather,
};
