// Aufgaben: Console checken // liegt wahrscheinlich an den kommas in der crime datei die müssen weg
// slider verschönern und besser platzieren
// jahreszahlanzeige verbessern und besser platzieren
// alles gestalten
// tooltip soll der hovereffekt sein aber funktioniert nicht
// manchmal ist nichts highligtetd obwohl die daten dafür da sind //prüfen ob die daten wirklich richtig verbunden sind
// ich kann erst samstag weitermachen

let giniData;
let crimeData;
let selectedCountries = ["ALB", "DEU", "AUS"];
let giniPoints = [];
let crimePoints = [];
let tooltip = document.getElementById("tooltip");
let countrySpan = document.getElementById("country");
let giniValueSpan = document.getElementById("giniValue");
let crimeValueSpan = document.getElementById("crimeValue");

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
  for (let i = 10; i <= 150; i += 10) {
    let y = map(i, 1, 150, 600, 150);
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
    points.push({
      x: 300,
      y: y,
      countryCode: row.getString("Country Code"),
      value: giniValue,
    });
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
    let y = map(crimeValue, 1, 100, 600, 250);

    // Zeichne den Datenpunkt
    // fill(255);test ob ihr mal rein geschaut habt und wie genau haha
    // ellipse(1150, y, 10, 10);
    points.push({
      x: 1150,
      y: y,
      countryCode: row.getString("Country Code"),
      value: crimeValue,
    });
  }
  return points;
}
function connectPoints(giniPoints, crimePoints) {
  // Zeichne zuerst die dunkleren Linien für nicht ausgewählte Länder
  stroke(40); // Dunkelgrau

  if (giniPoints.length !== crimePoints.length) {
    console.error(
      "Mismatched data lengths:",
      giniPoints.length,
      crimePoints.length
    );
  }

  for (let i = 0; i < giniPoints.length; i++) {
    if (!selectedCountries.includes(giniPoints[i].countryCode)) {
      line(
        giniPoints[i].x,
        giniPoints[i].y,
        crimePoints[i].x,
        crimePoints[i].y
      );
    }
  }

  // Zeichne die hervorgehobenen Linien für ausgewählte Länder
  stroke(255);
  for (let i = 0; i < giniPoints.length; i++) {
    if (selectedCountries.includes(giniPoints[i].countryCode)) {
      line(
        giniPoints[i].x,
        giniPoints[i].y,
        crimePoints[i].x,
        crimePoints[i].y
      );
    }
  }
}
// Berechnet den Abstand eines Punktes zu einer Linie für den hovereffekt
function pointToLineDistance(px, py, x1, y1, x2, y2) {
  let A = px - x1;
  let B = py - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  let dx = px - xx;
  let dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
// mouseMoved() wird aufgerufen, wenn sich die Maus bewegt
function mouseMoved() {
  let closestLine = null;
  let minDistance = 20; // Threshold for distance to the line

  for (let i = 0; i < giniPoints.length; i++) {
    let d = pointToLineDistance(
      mouseX,
      mouseY,
      giniPoints[i].x,
      giniPoints[i].y,
      crimePoints[i].x,
      crimePoints[i].y
    );

    if (d < minDistance) {
      closestLine = i;
      minDistance = d;
    }
  }

  if (closestLine !== null) {
    displayLineData(giniPoints[closestLine], crimePoints[closestLine]);
  } else {
    tooltip.style.display = "none"; // Hide the tooltip when not needed
  }
}

function displayLineData(giniPoint, crimePoint) {
  countrySpan.textContent = giniPoint.countryCode;
  giniValueSpan.textContent = giniPoint.value;
  crimeValueSpan.textContent = crimePoint.value;

  tooltip.style.left = mouseX + 15 + "px";
  tooltip.style.top = mouseY - 15 + "px";
  tooltip.style.display = "block";
}
