// === GOOGLE APPS SCRIPT WEB APP ===
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyiG2aEeWKEriiECWGWvWqBySqMtd3A7L-bDywO-8LYtI-xYZdXWA-LD6TVihS2ulzH/exec";

const form = document.getElementById("teamForm");
const teamList = document.getElementById("teamList");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");
const formAlert = document.getElementById("formAlert");

const modal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = modal.querySelector("h3");
const modalText = modal.querySelector("p");

const storageKey = "gingersummer_teams_v5";
let teams = JSON.parse(localStorage.getItem(storageKey) || "[]");

function saveTeams() {
  localStorage.setItem(storageKey, JSON.stringify(teams));
}

function renderTeams() {
  if (!teamList) return;

  if (teams.length === 0) {
    teamList.innerHTML = `
      <div class="muted tiny">
        Ingen påmeldte lag ennå. Vær førstemann! 🏌️
      </div>
    `;
    return;
  }

  const friday = teams.filter(t => t.day === "27.03 – 18:00");
  const saturday = teams.filter(t => t.day === "28.03 – 11:00");

  teamList.innerHTML = `
    <div class="day-group">
      <h5>27.03 – 18:00</h5>
      ${friday.length === 0
        ? "<div class='tiny muted'>Ingen lag</div>"
        : friday.map(t =>
          `<div class="team-item">
            ${t.teamName} – ${t.player1} & ${t.player2}
          </div>`
        ).join("")
      }
    </div>

    <div class="day-group">
      <h5>28.03 – 11:00</h5>
      ${saturday.length === 0
        ? "<div class='tiny muted'>Ingen lag</div>"
        : saturday.map(t =>
          `<div class="team-item">
            ${t.teamName} – ${t.player1} & ${t.player2}
          </div>`
        ).join("")
      }
    </div>
  `;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedDay = document.querySelector('input[name="day"]:checked');

  if (!selectedDay) {
    formAlert.textContent = "Vel kva dag laget stiller.";
    return;
  }

  const teamName = form.teamName.value.trim();
  const player1 = form.player1.value.trim();
  const player2 = form.player2.value.trim();
  const day = selectedDay.value;

  if (!teamName || !player1 || !player2) {
    formAlert.textContent = "Fyll inn lagnamn og begge spelarar.";
    return;
  }

  // 🔥 VIS LOADING POPUP MED EIN GONG
  modal.classList.add("active");
  modalTitle.textContent = "Sender påmelding...";
  modalText.innerHTML = `<div class="spinner"></div>`;
  closeModalBtn.style.display = "none";

  const formData = new FormData();
  formData.append("teamName", teamName);
  formData.append("player1", player1);
  formData.append("player2", player2);
  formData.append("day", day);

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    teams.push({ teamName, player1, player2, day });
    saveTeams();
    renderTeams();
    form.reset();

    // ✅ SUKSESS
    modalTitle.textContent = "Påmelding registrert 🎉";
    modalText.textContent =
      "Hugs å vippse 700 kr til Eivind for å stadfeste påmeldinga.";
    closeModalBtn.style.display = "inline-block";

  } catch (error) {
    console.error(error);

    modalTitle.textContent = "Noko gjekk gale";
    modalText.textContent =
      "Prøv igjen om litt.";
    closeModalBtn.style.display = "inline-block";
  }
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

// ================= LAUNCH GATE (ROBUST VERSION) =================

document.addEventListener("DOMContentLoaded", () => {

  const gate = document.getElementById("launchGate");
  const unlockBtn = document.getElementById("unlockBtn");
  const gatePasswordInput = document.getElementById("gatePassword");
  const gateError = document.getElementById("gateError");

  const correctPassword = "196m5jern";

  // Dersom gate ikkje finst → avslutt
  if (!gate) return;

  // Sjekk om brukaren allereie har låst opp
  if (localStorage.getItem("gateUnlocked") === "true") {
    gate.classList.add("hidden");
  }

  function getNextSaturday() {
    const now = new Date();
    const result = new Date(now);
    result.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
    result.setHours(0, 0, 0, 0);

    if (result <= now) {
      result.setDate(result.getDate() + 7);
    }

    return result;
  }

  const targetDate = getNextSaturday();

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      gate.classList.add("hidden");
      return;
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const daysElement = document.getElementById("days");

    if (daysElement) {
      daysElement.textContent = days.toString().padStart(2, "0");
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  unlockBtn?.addEventListener("click", () => {
    if (gatePasswordInput.value === correctPassword) {
      localStorage.setItem("gateUnlocked", "true");
      gate.classList.add("hidden");
    } else {
      gateError.textContent = "Feil passord.";
    }
  });

});