// === GOOGLE APPS SCRIPT WEB APP ===
const scriptURL =
  "https://script.google.com/macros/s/AKfycbw9XpIQBLWrv-dlbJ4DqWq6RF9V000Wq1YQlkp0KXeAn8ln7h8QUsxyvieVRL__cq-7/exec";

const form = document.getElementById("teamForm");
const teamList = document.getElementById("teamList");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");
const formAlert = document.getElementById("formAlert");

const modal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = modal.querySelector("h3");
const modalText = modal.querySelector("p");

const countFriday = document.getElementById("countFriday");
const countSaturday = document.getElementById("countSaturday");
const barFriday = document.getElementById("barFriday");
const barSaturday = document.getElementById("barSaturday");
const fridayOption = document.getElementById("fridayOption");
const saturdayOption = document.getElementById("saturdayOption");

const fridayText = document.getElementById("fridayText");
const saturdayText = document.getElementById("saturdayText");

const storageKey = "gingersummer_teams_v5";
let teams = JSON.parse(localStorage.getItem(storageKey) || "[]");

function loadTeamsFromSheet() {

  const script = document.createElement("script");

  script.src = scriptURL + "?callback=handleTeams";

  document.body.appendChild(script);
}

function handleTeams(data) {

  teams = data;

  saveTeams();
  renderTeams();

}

function saveTeams() {
  localStorage.setItem(storageKey, JSON.stringify(teams));
}

function getDayCounts() {
  const fridayCount = teams.filter(t => t.day === "27.03 – 18:00").length;
  const saturdayCount = teams.filter(t => t.day === "28.03 – 11:00").length;

  return { fridayCount, saturdayCount };
}

function updateDayAvailability() {

  const fridayCount = teams.filter(t => t.day === "27.03 – 18:00").length;
  const saturdayCount = teams.filter(t => t.day === "28.03 – 11:00").length;

  if (countFriday) {
    countFriday.textContent = `${fridayCount} av 15 lag påmeldte`;
  }

  if (countSaturday) {
    countSaturday.textContent = `${saturdayCount} av 15 lag påmeldte`;
  }

  const fridayInput = fridayOption.querySelector('input[name="day"]');
  const saturdayInput = saturdayOption.querySelector('input[name="day"]');

  if (fridayCount >= 15) {
    fridayOption.classList.add("full");
    fridayInput.disabled = true;
  }

  if (saturdayCount >= 15) {
    saturdayOption.classList.add("full");
    saturdayInput.disabled = true;
  }

  if (fridayText) {
  fridayText.textContent =
    `Fredag 27. mars – 18:00 (${fridayCount} av 15 lag påmeldte)`;
}

if (saturdayText) {
  saturdayText.textContent =
    `Laurdag 28. mars – 11:00 (${saturdayCount} av 15 lag påmeldte)`;
}

}

function renderTeams() {
  if (!teamList) {
    updateDayAvailability();
    return;
  }

  if (teams.length === 0) {
    teamList.innerHTML = `
      <div class="muted tiny">
        Ingen påmeldte lag ennå. Vær førstemann! 🏌️
      </div>
    `;
    updateDayAvailability();
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

  updateDayAvailability();
}

loadTeamsFromSheet();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formAlert.textContent = "";

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

  const { fridayCount, saturdayCount } = getDayCounts();

  if (day === "27.03 – 18:00" && fridayCount >= 15) {
    formAlert.textContent = "Fredag er fullteikna.";
    updateDayAvailability();
    return;
  }

  if (day === "28.03 – 11:00" && saturdayCount >= 15) {
    formAlert.textContent = "Laurdag er fullteikna.";
    updateDayAvailability();
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











