let crimeRateData;
let giniIndexData;
let countrys;
let giniData;
let crimeData;
let tooltip;
let tooltipText;
let yearSlider;
let yearDisplay;
let showLabels = false;

function preload() {
  crimeRateData = loadTable("data/crimerate.csv", "csv", "header");
  giniIndexData = loadTable("data/giniindex.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas-Größe auf Fenstergröße setzen
  // slider
  yearSlider = select("#yearSlider");
  yearDisplay = select("#yearDisplay");
  yearSlider.input(updateYearData); //bei Änderungen am Slider aufgerufen wird

  countrys = new Countrys();
  countrys.loadCrimeRates(crimeRateData);
  countrys.loadGiniIndexes(giniIndexData);

  // Debug-Ausgaben
  let currentYear = parseInt(yearSlider.value()); // Konvertieren Sie den Wert in eine Zahl
  yearDisplay.html(currentYear); // Aktuellen Wert im Display anzeigen
  // data read
  giniData = countrys.getDataByYear(currentYear, "gini");
  crimeData = countrys.getDataByYear(currentYear, "crime");
  console.log("Gini data for the year:", giniData);
  console.log("Crime data for the year:", crimeData);

  //tooltip
  tooltip = document.getElementById("tooltip");
  tooltipText = document.getElementById("tooltipText");
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");
  const openModalButton = document.getElementById("openModal");

  toggleButton.addEventListener("click", function () {
    if (
      openModalButton.style.display === "none" ||
      openModalButton.style.display === ""
    ) {
      openModalButton.style.display = "block";
    } else {
      openModalButton.style.display = "none";
    }
  });
});

function updateYearData() {
  let currentYear = parseInt(yearSlider.value());
  yearDisplay.html(currentYear);

  giniData = countrys.getDataByYear(currentYear, "gini");
  crimeData = countrys.getDataByYear(currentYear, "crime");

  // debugging
  if (giniData.length !== crimeData.length) {
    console.warn(
      `Datenlängen stimmen für das Jahr ${currentYear} nicht überein: Gini(${giniData.length}) und Kriminalität(${crimeData.length})`
    );

    // Speichert die Ländercodes aus beiden Datensätzen
    const giniCountries = giniData.map((entry) =>
      entry.getString("Country Code")
    );
    const crimeCountries = crimeData.map((entry) =>
      entry.getString("Country Code")
    );

    // Findet die fehlenden oder zusätzlichen Einträge
    const missingInGini = crimeCountries.filter(
      (code) => !giniCountries.includes(code)
    );
    const missingInCrime = giniCountries.filter(
      (code) => !crimeCountries.includes(code)
    );

    console.log(
      `Fehlend in Gini-Daten für das Jahr ${currentYear}:`,
      missingInGini
    );
    console.log(
      `Fehlend in Kriminalitätsdaten für das Jahr ${currentYear}:`,
      missingInCrime
    );

    // Neue Debugging-Code hier einfügen
    giniData.forEach((giniEntry, index) => {
      const giniCountry = giniEntry.getString("Country Code");
      const giniValue = giniEntry.getNum("GINI Index");

      const crimeEntry = crimeData[index];
      const crimeCountry = crimeEntry
        ? crimeEntry.getString("Country Code")
        : null;
      const crimeValue = crimeEntry ? crimeEntry.getNum("Homiciderate") : null;

      if (giniCountry !== crimeCountry) {
        console.error(
          `Mismatch at index ${index}: GINI country is ${giniCountry}, Crime country is ${crimeCountry}`
        );
      }

      if (isNaN(giniValue)) {
        console.warn(
          `Invalid GINI value at index ${index} for country ${giniCountry}`
        );
      }

      if (isNaN(crimeValue)) {
        console.warn(
          `Invalid Crime value at index ${index} for country ${crimeCountry}`
        );
      }
    });
    // Ende des neuen Debugging-Codes
  }
  // debugging ende
}

function draw() {
  background(0);

  // Zeichnet vertikale Säulen
  stroke(255);
  line(300, 100, 300, 650); // Gini-Säule
  line(1200, 100, 1200, 650); // Crime-Säule
  if (showLabels) {
    // Beschriftungen für die Gini-Säule hinzufügen
    fill(255); // Textfarbe
    textSize(12); // Textgröße
    for (let i = 0; i <= 100; i += 10) {
      let y = map(i, 0, 100, 650, 100);
      text(i, 280, y);
    }

    // Beschriftungen für die Crime-Säule hinzufügen
    for (let i = 0; i <= 100; i += 10) {
      let y = map(i, 0, 100, 650, 100);
      text(i, 1220, y);
    }
  }

  //   Linie zwischen den Punkten
  for (let i = 0; i < giniData.length; i++) {
    if (giniData[i] && crimeData[i]) {
      let giniValue = giniData[i].getNum("GINI Index");
      let crimeValue = crimeData[i].getNum("Homiciderate");

      // Überprüfen, ob die Werte NaN sind
      if (!isNaN(giniValue) && !isNaN(crimeValue)) {
        let giniPoint = map(giniValue, 0, 100, 650, 100);
        let crimePoint = map(crimeValue, 0, 100, 650, 100);

        if (
          highlightedCountries.includes(
            giniData[i].getString("Country Code").toUpperCase()
          )
        ) {
          stroke(255);
          strokeWeight(2);
        } else {
          stroke(40);
        }
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
        tooltipText.innerHTML = `
          <div class="tooltip-divider"></div>
          <div class="tooltip-row"><span class="tooltip-label">Country:</span> <span class="tooltip-data">${giniData[
            i
          ].getString("Entity")}</span></div>
          <div class="tooltip-row"><span class="tooltip-label">Country Code:</span> <span class="tooltip-data">${giniData[
            i
          ].getString("Country Code")}</span></div>
          <div class="tooltip-row"><span class="tooltip-label">Gini:</span> <span class="tooltip-data">${giniData[
            i
          ].getNum("GINI Index")}</span></div>
          <div class="tooltip-row"><span class="tooltip-label">Crime:</span> <span class="tooltip-data">${crimeData[
            i
          ].getNum("Homiciderate")}</span></div>
        `;
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
    span.addEventListener("click", function () {
      // Event-Listener hinzufügen
      yearSlider.value = year;
      updateYearData(); // Ihre Funktion, die den Slider-Wert verarbeitet
      updateVisibleYear(year); // Jahr hervorheben
    });
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
let highlightedCountries = [];

// Modal öffnen und schließen
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("countryModal");
  const btn = document.getElementById("openModal");
  const span = document.getElementsByClassName("close")[0];

  btn.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

// Ländercodes anwenden
document
  .getElementById("applyHighlight")
  .addEventListener("click", function () {
    const input = document.getElementById("highlightedCountries").value;
    highlightedCountries = input
      .split(",")
      .map((code) => code.trim().toUpperCase());
    document.getElementById("countryModal").style.display = "none";
  });
