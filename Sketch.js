// im jahr 2014 hängt sich das programm auf wegen ungleicher datenmengen finde aber den fehler in den daten nicht

let crimeRateData;
let giniIndexData;
let countrys;
let giniData;
let crimeData;
let tooltip;
let tooltipText;
let yearSlider;
let yearDisplay;

function preload() {
  crimeRateData = loadTable("data/crimerate.csv", "csv", "header");
  giniIndexData = loadTable("data/giniindex.csv", "csv", "header");
}

function setup() {
  createCanvas(1500, 773);
  //slider
  yearSlider = select("#yearSlider");
  yearDisplay = select("#yearDisplay");
  yearSlider.input(updateYearData); // Funktion, die bei Änderungen am Slider aufgerufen wird

  countrys = new Countrys();
  countrys.loadCrimeRates(crimeRateData);
  countrys.loadGiniIndexes(giniIndexData);

  // Debug-Ausgaben
  let currentYear = parseInt(yearSlider.value()); // Konvertieren Sie den Wert in eine Zahl
  yearDisplay.html(currentYear); // Aktuellen Wert im Display anzeigen

  giniData = countrys.getDataByYear(currentYear, "gini");
  crimeData = countrys.getDataByYear(currentYear, "crime");
  console.log("Gini data for the year:", giniData);
  console.log("Crime data for the year:", crimeData);

  //tooltip
  tooltip = document.getElementById("tooltip");
  tooltipText = document.getElementById("tooltipText");
}

function updateYearData() {
  let currentYear = parseInt(yearSlider.value()); // Aktuellen Wert des Sliders holen
  yearDisplay.html(currentYear); // Aktuellen Wert im Display anzeigen

  // Daten für das ausgewählte Jahr holen
  giniData = countrys.getDataByYear(currentYear, "gini");
  crimeData = countrys.getDataByYear(currentYear, "crime");
}

function draw() {
  background(0);

  // Zeichnet vertikale Säulen
  stroke(255);
  line(300, 100, 300, 650); // Gini-Säule
  line(1200, 100, 1200, 650); // Crime-Säule

  //   Linie zwischen den Punkten
  for (let i = 0; i < giniData.length; i++) {
    if (giniData[i] && crimeData[i]) {
      let giniValue = giniData[i].getNum("GINI Index");
      let crimeValue = crimeData[i].getNum("Homiciderate");

      // Überprüfen, ob die Werte NaN sind
      if (!isNaN(giniValue) && !isNaN(crimeValue)) {
        let giniPoint = map(giniValue, 0, 100, 650, 100);
        let crimePoint = map(crimeValue, 0, 100, 650, 100);

        stroke(255);
        line(300, giniPoint, 1200, crimePoint);
      } else {
        console.log(
          `Ungültige Daten für Index ${i}: GINI: ${giniValue}, Kriminalitätsrate: ${crimeValue}`
        );
      }
    }
  }
}

function mouseMoved() {
  for (let i = 0; i < giniData.length; i++) {
    if (giniData[i] && crimeData[i]) {
      let giniPoint = map(giniData[i].getNum("GINI Index"), 0, 100, 650, 100);
      let crimePoint = map(
        crimeData[i].getNum("Homiciderate"),
        0,
        100,
        650,
        100
      );

      // Berechnen Sie den Abstand zwischen Maus und Linie
      let distance = distToSegment(
        mouseX,
        mouseY,
        300,
        giniPoint,
        1200,
        crimePoint
      );

      if (distance < 5) {
        // Wenn der Abstand klein genug ist, zeigen Sie den Tooltip an
        tooltipText.innerHTML = `Country: ${giniData[i].getString(
          "Entity"
        )} <br> Country Code: ${giniData[i].getString(
          "Country Code"
        )} <br> Gini: ${giniData[i].getNum(
          "GINI Index"
        )} <br> Crime: ${crimeData[i].getNum("Homiciderate")}`;
        tooltip.style.left = mouseX + "px";
        tooltip.style.top = mouseY + "px";
        tooltip.style.display = "block";
        return;
      }
    }
  }

  tooltip.style.display = "none";
}

// Hilfsfunktion zur Berechnung der kürzesten Entfernung von einem Punkt zu einem Liniensegment
function distToSegment(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  const param = dot / len_sq;

  let xx, yy;

  if (param < 0 || (x1 == x2 && y1 == y2)) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

window.addEventListener("DOMContentLoaded", function () {
  const yearLabels = document.getElementById("yearLabels");
  const yearSlider = document.getElementById("yearSlider");

  for (let year = 1999; year <= 2021; year++) {
    const span = document.createElement("span");
    span.id = "year_" + year;
    span.innerText = year;
    yearLabels.appendChild(span);
  }

  // Event-Listener für Slider-Änderungen
  yearSlider.addEventListener("input", function () {
    const selectedYear = yearSlider.value;
    updateVisibleYear(selectedYear);
  });

  // Initial das ausgewählte Jahr sichtbar machen
  updateVisibleYear(yearSlider.value);
});

function updateVisibleYear(selectedYear) {
  for (let year = 1999; year <= 2021; year++) {
    const span = document.getElementById("year_" + year);
    if (year == selectedYear) {
      span.className = ""; // Entfernt alle Klassen
      span.style.visibility = "visible";
      span.innerHTML = year; // Setzt das Jahr
    } else {
      span.className = "year-dot"; // Fügt die 'year-dot' Klasse hinzu
      span.style.visibility = "visible";
      span.innerHTML = "•"; // Setzt einen Punkt
    }
  }
}
