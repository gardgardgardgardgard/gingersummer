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

// Form submission handling (optional - Formspree handles the actual submission)
const signupForm = document.querySelector('.signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', () => {
    // Formspree will handle the submission
    // You can add custom validation or success messages here if needed
    console.log('Form submitted');
  });
}

// Quick page transition (fast fade-out on navigation)
function setupPageTransitions() {
  const links = document.querySelectorAll('a[href$=".html"]');
  links.forEach((link) => {
    const url = link.getAttribute('href');
    if (!url || url.startsWith('#')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-fade-out');
      setTimeout(() => {
        window.location.href = url;
      }, 120);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupPageTransitions();
});
