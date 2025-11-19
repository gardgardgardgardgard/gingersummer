// News data (same as in main.js)
const newsData = [
  {
    id: 1,
    title: "GingerSummer Invitational – Winter edition",
    description:
      "Velkommen til vestlandets største simulatorcupturnering 20. desember kl. 14 hos Børdi golf! 2-manns scramble, cupformat og maks 15 lag.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
    date: "20. desember 2025",
    fullContent:
      "Velkommen til vestlandets største simulatorcupturnering 20. desember, klokka 14! " +
      "No er vintersesongen i gang, og etter ein suksessturnering i sommar ønskjer vi å invitere til simulatorturnering hos Børdi golf ⛳️\n\n" +
      "Om turneringa:\n" +
      "Turneringsformatet er 2-manns scramble, og sidan dette er ein cupturnering spelar alle på brutto slag (ingen får tildelte slag). " +
      "Det er maks 15 lag påmeldte, så her må ein vere rask!\n\n" +
      "Premier:\n" +
      "1., 2. og 3. plass får premiar, og i tillegg blir det nokre konkurransar og trekkepremiar.\n\n" +
      "Sosialt:\n" +
      "Dette er eit sosialt arrangement som kjem til å ta mange timar frå start til slutt. Her er det lov å drikke og kose seg 🍻 " +
      "Det vil òg kome tilbod om felles matbestilling (t.d. pizza). Meir info kjem seinare!\n\n" +
      "Mvh\n" +
      "Hallvard Sommer, Heine Fonn Skåre og Eivind Frøholm\n\n" +
      "Turneringsoppsett:\n" +
      "Det blir delt inn i tre grupper (5 lag på kvar simulator). Her spelar vi scramble matchplay over 3 hol mot kvart lag i gruppa. " +
      "Vinnaren av dei tre hola får 3 poeng, uavgjort 1 poeng, og tap 0 poeng. 1.-plass, 2.-plass og dei to beste trearane er kvalifisert til sluttspel.\n\n" +
      "Sluttspelet startar med kvartfinale. Både i kvartfinalen, semifinalen og bronsefinalen er det scramble matchplay best av 3 hol. " +
      "I finalen er det best av 5 hol."
  }
];

// Get news ID from URL
function getNewsIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  return id ? parseInt(id) : 1;
}

// Load news detail
function loadNewsDetail() {
  const newsId = getNewsIdFromURL();
  const news = newsData.find((item) => item.id === newsId);

  const newsDetail = document.getElementById("newsDetail");

  if (newsDetail && news) {
    const showSignupCTA = newsId === 1; // Show CTA for this tournament

    newsDetail.innerHTML = `
      <img src="${news.image}" alt="${news.title}" class="detail-image">
      <div class="detail-content">
        <span class="detail-date">${news.date}</span>
        <h1 class="detail-title">${news.title}</h1>
        <p class="detail-text">${news.fullContent.replace(/\n/g, "<br>")}</p>
        ${
          showSignupCTA
            ? `
          <div class="signup-cta">
            <h3>Ready to Join?</h3>
            <p>Register now for the tournament!</p>
            <a href="signup.html" class="btn-signup">Sign Up Now</a>
          </div>
        `
            : ""
        }
      </div>
    `;
  } else if (newsDetail) {
    newsDetail.innerHTML = "<p>News article not found.</p>";
  }
}

// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  const navLinks = document.querySelectorAll(".nav-menu a");
  for (const link of navLinks) {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  }
}

// Quick page transition (fast fade-out on navigation)
function setupPageTransitions() {
  const links = document.querySelectorAll('a[href$=".html"]');
  links.forEach((link) => {
    const url = link.getAttribute("href");
    if (!url || url.startsWith("#")) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.add("page-fade-out");
      setTimeout(() => {
        window.location.href = url;
      }, 120);
    });
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadNewsDetail();
  setupPageTransitions();
});
