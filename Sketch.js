// es hängt sich ab 2014 auf wahrscheinlich wegen der Daten --> Console
// schöner gestalten

let crimeRateData;
let giniIndexData;
let countrys;
let giniData;
let crimeData;
let tooltip;

let playButton;

let tooltipText;
let yearSlider;
let yearDisplay;
let showLabels = false;
let highlightedCountries = [];
let highlightedCountriesShowLabel = false;
const initiallyHighlightedCountries = ["USA", "DEU", "GBR"];
let highlightedIndex = -1;

let isPlaying = false; // Flag to indicate if the animation is playing
let animationInterval; // Interval variable for animation
let minYear = 1999; // Minimum year
let maxYear = 2021; // Maximum year
let currentYear = minYear; // The current year

function preload() {
  crimeRateData = loadTable("data/crimerate.csv", "csv", "header");
  giniIndexData = loadTable("data/giniindex.csv", "csv", "header");
}
function loadData() {
  countrys = new Countrys();
  countrys.loadCrimeRates(crimeRateData);
  countrys.loadGiniIndexes(giniIndexData);
  console.log(crimeRateData);
  console.log(giniIndexData);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadData();
  yearSlider = select("#yearSlider");
  yearDisplay = select("#yearDisplay");
  yearSlider.input(updateYearData);

  currentYear = parseInt(yearSlider.value()); // hier
  yearDisplay.html(currentYear);
  giniData = countrys.getDataByYear(currentYear, "gini");
  crimeData = countrys.getDataByYear(currentYear, "crime");
  tooltip = document.getElementById("tooltip");
  tooltipText = document.getElementById("tooltipText");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
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
document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("playButton");
  const toggleButton = document.getElementById("toggleButton");
  const openModalButton = document.getElementById("openModal");
  const modal = document.getElementById("countryModal");
  const btn = document.getElementById("openModal");
  const span = document.getElementsByClassName("close")[0];
  const yearLabels = document.getElementById("yearLabels");
  const yearSlider = document.getElementById("yearSlider");

  // Ländercodes anwenden
  document
    .getElementById("applyHighlight")
    .addEventListener("click", function () {
      highlightedCountriesShowLabel = false;
      const input = document.getElementById("highlightedCountries").value;
      console.log(input);
      initiallyHighlightedCountries.push(input);
      highlightedCountries = input
        .split(",")
        .map((code) => code.trim().toUpperCase());
      document.getElementById("countryModal").style.display = "none";
    });
  //   Jahr-Labels hinzufügen
  for (let year = 1999; year <= 2021; year++) {
    const span = document.createElement("span");
    span.id = "year_" + year;
    span.innerText = year;
    span.addEventListener("click", function () {
      yearSlider.value = year;
      updateYearData(); // Funktion, die den Slider-Wert verarbeitet
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
  //   Toggle-Button
  toggleButton.addEventListener("click", function () {
    showLabels = !showLabels; // Umschalten zwischen true und false
    if (
      openModalButton.style.display === "none" ||
      openModalButton.style.display === ""
    ) {
      openModalButton.style.display = "block";
    } else {
      openModalButton.style.display = "none";
    }
  });

  // Modal öffnen und schließen
  btn.onclick = function () {
    highlightedCountriesShowLabel = true;
    modal.style.display = "block";
  };

  span.onclick = function () {
    highlightedCountriesShowLabel = false;
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      highlightedCountriesShowLabel = false;
      modal.style.display = "none";
    }
  };

  // playButton.addEventListener("click", toggleAnimation);
  playButton.addEventListener("click", toggleAnimation);
});

function updateYearData() {
  currentYear = parseInt(yearSlider.value()); //hier
  console.log("hier");
  yearDisplay.html(currentYear);
  giniData = countrys.getDataByYear(currentYear, "gini");
  crimeData = countrys.getDataByYear(currentYear, "crime");
  console.log(currentYear);
  console.log(giniData);
  console.log(crimeData);
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
    for (let i = 0; i <= 10; i += 1) {
      // Geändert
      let y = map(i, 0, 10, 650, 100); // Geändert
      text(i, 280, y);
    }

    let leftText = [
      "Gini Explanation",
      "sfbfewuf jdfb fjebf djsdwu",
      "sfbfewuf jdfb fjebf djsdw",
      "sfbfewuf jdfb fjebf djsdw",
    ];
    let xLeft = 50;
    let yLeft = 550;
    for (let i = 0; i < leftText.length; i++) {
      text(leftText[i], xLeft, yLeft + i * 15); // 15 ist der Zeilenabstand
    }

    // Beschriftungen für die Crime-Säule hinzufügen
    for (let i = 0; i <= 100; i += 10) {
      let y = map(i, 0, 100, 650, 100);
      text(i, 1220, y);
    }
    let rightText = [
      "Crime Explanation",
      "The Crime index shows how many homicides",
      "per 100.000 inhabithans.",
      "there are in one Country",
      "distributed.",
    ];
    let xRight = 1250; // Position weit genug rechts
    let yRight = 550;
    for (let i = 0; i < rightText.length; i++) {
      text(rightText[i], xRight, yRight + i * 15); // 15 ist der Zeilenabstand
    }

    // Title
    textSize(32);
    fill(255); // weiß
    text("Crime to GINI index", 10, 40); // Text und seine Position
  }

  // Linie zwischen den Punkten
  for (let i = 0; i < giniData.length; i++) {
    if (giniData[i] && crimeData[i]) {
      let giniValue = giniData[i].getNum("GINI Index");
      let crimeValue = crimeData[i].getNum("Homiciderate");

      // Überprüfen, ob die Werte NaN sind
      if (!isNaN(giniValue) && !isNaN(crimeValue)) {
        let giniPoint = map(giniValue, 0, 10, 650, 100);
        let crimePoint = map(crimeValue, 0, 100, 650, 100);

        // Entscheiden, welche Linienfarbe und -stärke zu verwenden ist
        if (i === highlightedIndex) {
          stroke(255, 0, 0);
          strokeWeight(2);
        } else if (
          highlightedCountries.includes(
            giniData[i].getString("Country Code").toUpperCase()
          )
        ) {
          stroke(255, 100, 30);
          strokeWeight(2);
        } else if (
          initiallyHighlightedCountries.includes(
            giniData[i].getString("Country Code").toUpperCase()
          )
        ) {
          stroke(255, 100, 30);
          strokeWeight(1);
        } else {
          stroke(40);
          strokeWeight(1);
        }

        // Linie zeichnen
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
  if (!highlightedCountriesShowLabel) {
    for (let i = 0; i < giniData.length; i++) {
      if (giniData[i] && crimeData[i]) {
        let giniPoint = map(giniData[i].getNum("GINI Index"), 0, 10, 650, 100);
        let crimePoint = map(
          crimeData[i].getNum("Homiciderate"),
          0,
          100,
          650,
          100
        );

        // Berechnet die Entfernung von der Maus zum Liniensegment
        let distance = distToSegment(
          mouseX,
          mouseY,
          300,
          giniPoint,
          1200,
          crimePoint
        );

        if (distance < 5) {
          highlightedIndex = i;
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

function toggleAnimation() {
  isPlaying = !isPlaying;

  if (isPlaying) {
    document.getElementById("playButton").innerHTML = "Pause";
    animationInterval = setInterval(function () {
      // Increment the current year
      currentYear++;
      if (currentYear > maxYear) {
        currentYear = minYear;
      }
      yearSlider.value(currentYear);
      updateYearData();
      updateVisibleYear(currentYear);
      // yearSlider.html(currentYear);
    }, 1000); // 1000 milliseconds (1 second) delay
  } else {
    document.getElementById("playButton").innerHTML = "Play";
    clearInterval(animationInterval);
  }
}

//   debugging
function debugDataMismatch(giniData, crimeData, currentYear) {
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
  }
}
