const {
  getCityWeather,
  getFiveDaysForecastForCity,
} = require("../pkg/openweathermap");

const getForCity = async (req, res) => {
  try {
    const weather = await getCityWeather(req.params.city);
    res.send(weather);
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

const getFiveDaysForecast = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    console.log("params", req.params);
    const forecast = await getFiveDaysForecastForCity(lat, lon);
    res.send(forecast);
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

module.exports = { getForCity, getFiveDaysForecast };
