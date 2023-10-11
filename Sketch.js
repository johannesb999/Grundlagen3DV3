let giniData;
let crimeData;

function preload() {
  giniData = loadTable("data/ginifinal.csv", "Country Code", "Year", "Value");
  crimeData = loadTable(
    "data/crimefinal.csv",
    "Country Code",
    "Year",
    "Homiciderate"
  );
}

function setup() {
  createCanvas(1500, 750);
  background(3);
  console.log(giniData);
  console.log(crimeData);

  // slider
  yearSlider = select("#yearSlider");
  yearDisplay = select("#yearDisplay");

  // Slider change event
  yearSlider.input(updateYear);
}

function draw() {
  stroke(255);
  line(300, 150, 300, 600); //Gini
  // Gini-Achse beschriften
  for (let i = 1; i <= 10; i++) {
    let y = map(i, 1, 10, 600, 150);
    text(i, 260, y);
  }

  line(1150, 150, 1150, 600); //Crime
  // Kriminalitätsrate-Achse beschriften
  for (let i = 10; i <= 100; i += 10) {
    let y = map(i, 10, 100, 600, 150);
    text(i, 1175, y);
  }
}
function updateYear() {
  yearDisplay.html(yearSlider.value());
  function updateYear() {
    let selectedYear = yearSlider.value();
    yearDisplay.html(selectedYear);

    // Lösche vorherige Punkte
    background(3);

    // Zeichne die Achsen erneut (falls erforderlich)
    // ...

    // Zeichne die neuen Gini-Punkte
    drawGiniPoints();

    // Weiterer Code ...
  }
}

function drawGiniPoints() {
  let selectedYear = yearSlider.value();
  let rows = giniData.findRows(selectedYear.toString(), "Year");

  for (let row of rows) {
    let giniValue = row.getNum("Value");

    // Transformiere den Gini-Wert in eine y-Koordinate
    let y = map(giniValue, 0, 100, 600, 150);

    // Zeichne den Datenpunkt
    fill(255);
    ellipse(300, y, 10, 10);
  }
}
