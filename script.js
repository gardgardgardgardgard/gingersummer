const scriptURL =
  "https://script.google.com/macros/s/AKfycbxpFxU1gwFhb9ekm9O-Su4oBOKO7jGrvf9Uqhg264nMSmkC5aI17eCJ-XuZZFQ-KQoG/exec";

const form = document.getElementById("teamForm");
const formAlert = document.getElementById("formAlert");

const modal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = modal.querySelector("h3");
const modalText = modal.querySelector("p");

const fridayOption = document.getElementById("fridayOption");
const saturdayOption = document.getElementById("saturdayOption");
const fridayText = document.getElementById("fridayText");
const saturdayText = document.getElementById("saturdayText");

let teams = [];

function loadTeamsFromSheet() {
  const oldScript = document.getElementById("teamsJsonpScript");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.id = "teamsJsonpScript";
  script.src = scriptURL + "?callback=handleTeams&_=" + Date.now();
  document.body.appendChild(script);
}

function handleTeams(data) {
  teams = Array.isArray(data) ? data : [];
  renderTeams();
}

function getDayCounts() {
  const fridayCount = teams.filter(t => t.day === "27.03 – 18:00").length;
  const saturdayCount = teams.filter(t => t.day === "28.03 – 11:00").length;
  return { fridayCount, saturdayCount };
}

function updateDayAvailability() {
  const { fridayCount, saturdayCount } = getDayCounts();

  const fridayInput = fridayOption.querySelector('input[name="day"]');
  const saturdayInput = saturdayOption.querySelector('input[name="day"]');

  fridayOption.classList.remove("full");
  saturdayOption.classList.remove("full");
  fridayInput.disabled = false;
  saturdayInput.disabled = false;

  if (fridayText) {
    fridayText.textContent = `Fredag 27. mars – 18:00`;
  }

  if (saturdayText) {
    saturdayText.textContent = `Laurdag 28. mars – 11:00`;
  }

  if (fridayCount >= 15) {
    fridayOption.classList.add("full");
    fridayInput.disabled = true;
    fridayText.textContent = "Fredag 27. mars – 18:00 (FULLTEIKNA)";
  }

  if (saturdayCount >= 15) {
    saturdayOption.classList.add("full");
    saturdayInput.disabled = true;
    saturdayText.textContent = "Laurdag 28. mars – 11:00 (FULLTEIKNA)";
  }
}

function renderTeams() {
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
    return;
  }

  if (day === "28.03 – 11:00" && saturdayCount >= 15) {
    formAlert.textContent = "Laurdag er fullteikna.";
    return;
  }

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

    modalTitle.textContent = "Påmelding registrert 🎉";
    modalText.textContent = "Hugs å vippse 700 kr til Eivind for å stadfeste påmeldinga.";
    closeModalBtn.style.display = "inline-block";

    form.reset();

    setTimeout(() => {
      loadTeamsFromSheet();
    }, 1000);

  } catch (error) {
    console.error(error);
    modalTitle.textContent = "Noko gjekk gale";
    modalText.textContent = "Prøv igjen om litt.";
    closeModalBtn.style.display = "inline-block";
  }
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

