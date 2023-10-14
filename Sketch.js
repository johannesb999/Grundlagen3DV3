let crimeRateData;
let giniIndexData;

function preload() {
  crimeRateData = loadTable("path/to/crimerate.csv", "csv", "header");
  giniIndexData = loadTable("path/to/giniindex.csv", "csv", "header");
}

function setup() {
  createCanvas(1500, 750);
}
function draw() {
  background(0);
  rect(mouseX, mouseY, 50, 50);
}

class Countrys {
  constructor() {
    this.crimeRates = [];
    this.giniIndexes = [];
  }

  getDataByYear(year, dataType) {
    const dataForYear = [];
    const data = dataType === "crime" ? this.crimeRates : this.giniIndexes;

    data.forEach((row) => {
      if (parseInt(row["Year"]) === year) {
        dataForYear.push(row);
      }
    });

    return dataForYear;
  }
}

// Usage example
const countrys = new Countrys();
Promise.all([
  countrys.loadCrimeRates("path/to/crimerate.csv"),
  countrys.loadGiniIndexes("path/to/giniindex.csv"),
]).then(() => {
  const crimeDataForYear = countrys.getDataByYear(2000, "crime");
  const giniDataForYear = countrys.getDataByYear(2000, "gini");

  console.log(`Crime data for the year 2000:`, crimeDataForYear);
  console.log(`Gini index data for the year 2000:`, giniDataForYear);
});
