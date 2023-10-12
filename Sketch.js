let giniData;
let crimeData;

function preload() {
  giniData = loadTable("data/ginifinal.csv", "csv", "header");
  crimeData = loadTable("data/crimefinal.csv", "csv", "header");
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
  line(300, 150, 300, 600); // Gini-Achse
  line(1150, 150, 1150, 600); // Kriminalitäts-Achse

  // Gini-Achse beschriften
  for (let i = 1; i <= 10; i++) {
    let y = map(i, 1, 10, 600, 150);
    text(i, 260, y);
  }

  // Kriminalitätsrate-Achse beschriften
  for (let i = 10; i <= 100; i += 10) {
    let y = map(i, 10, 100, 600, 150);
    text(i, 1175, y);
  }
}
function updateYear() {
  yearDisplay.html(yearSlider.value());
  let selectedYear = yearSlider.value();
  yearDisplay.html(selectedYear);

  background(3);
  draw();

  // Zeichne die neuen Gini-Punkte und speichere die Koordinaten
  let giniPoints = drawGiniPoints();
  // Zeichne die neuen Kriminalitätspunkte und speichere die Koordinaten
  let crimePoints = drawCrimePoints();

  // Verbinde die Gini- und Kriminalitätspunkte
  connectPoints(giniPoints, crimePoints);
}

function drawGiniPoints() {
  let points = [];
  let selectedYear = yearSlider.value();
  let rows = giniData.findRows(selectedYear.toString(), "Year");

  for (let row of rows) {
    let giniValue = row.getNum("Value");

    // Transformiere den Gini-Wert in eine y-Koordinate
    let y = map(giniValue, 1, 60, 600, 150);

    // Zeichne den Datenpunkt
    // fill(255);
    // ellipse(300, y, 10, 10);
    points.push({ x: 300, y: y });
  }
  return points;
}
function drawCrimePoints() {
  let points = [];
  let selectedYear = yearSlider.value();
  let rows = crimeData.findRows(selectedYear.toString(), "Year");

  for (let row of rows) {
    let crimeValue = row.getNum("Homiciderate");

    // Transformiere den Kriminalitätswert in eine y-Koordinate
    let y = map(crimeValue, 0, 50, 600, 150);

    // Zeichne den Datenpunkt
    // fill(255);
    // ellipse(1150, y, 10, 10);
    points.push({ x: 1150, y: y });
  }
  return points;
}
function connectPoints(giniPoints, crimePoints) {
  stroke(255);
  for (let i = 0; i < giniPoints.length; i++) {
    let giniPoint = giniPoints[i];
    let crimePoint = crimePoints[i];
    line(giniPoint.x, giniPoint.y, crimePoint.x, crimePoint.y);
  }
}
