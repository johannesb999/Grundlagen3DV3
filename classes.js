class Countrys {
  constructor() {
    this.crimeRates = [];
    this.giniIndexes = [];
  }

  loadCrimeRates(table) {
    this.crimeRates = table;
  }

  loadGiniIndexes(table) {
    this.giniIndexes = table;
  }

  getDataByYear(year, dataType) {
    const dataForYear = [];
    const data =
      dataType === "crime" ? this.crimeRates.rows : this.giniIndexes.rows;

    for (const row of data) {
      if (parseInt(row.get("Year")) === year) {
        dataForYear.push(row);
      }
    }

    return dataForYear;
  }
}
