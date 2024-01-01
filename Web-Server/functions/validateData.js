// Regular expressions for data validation
const psiPattern = /^\d+$/;
const humidityPattern = /^\d+%$/;
const concentrationPattern = /^\d+ppm$/;
const temperaturePattern = /^-?\d+°C$/;
const windspeedPattern = /^\d+km\/h$/;
const timePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const regionPattern = /^[a-zA-Z-]+$/;

function validateData(data) {
  return (
    psiPattern.test(data.psi) &&
    humidityPattern.test(data.humidity) &&
    concentrationPattern.test(data.o3) &&
    concentrationPattern.test(data.no2) &&
    concentrationPattern.test(data.so2) &&
    concentrationPattern.test(data.co) &&
    temperaturePattern.test(data.temperature) &&
    windspeedPattern.test(data.windspeed) &&
    timePattern.test(data.time) &&
    regionPattern.test(data.region)
  );
}

const dateRegex = /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/;

function isValidDateString(){
  return dateRegex.test(value);
}


module.exports = { validateData  , isValidDateString };
