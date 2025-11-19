// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  const navLinks = document.querySelectorAll('.nav-menu a');
  for (const link of navLinks) {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  }
}
