document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const sliderTab = document.querySelector(".slider-tab");
  
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.getAttribute("data-tab")).classList.add("active");
    });
  });

  const lang = detectBrowserLanguage();
  loadTranslations(lang);

  document.querySelectorAll('input[name="language"]').forEach((input) => {
    input.addEventListener('change', (event) => {
      sliderTab.style.left = event.target.id === 'lang-en' ? '0' : '50%';
      loadTranslations(event.target.value);
    });
  });
});

function detectBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  return lang.split('-')[0];
}

async function loadTranslations(language) {
  try {
    const response = await fetch(`/locales/${language}.json`);
    if (!response.ok) throw new Error('Translation file not found');
    const translations = await response.json();
    applyTranslations(translations);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

function applyTranslations(translations) {
  document.title = translations.title;
  document.querySelector('h2#skills').textContent = translations.skills;
  document.querySelector('h2#portfolio').textContent = translations.portfolio;
  document.querySelector('h2#contact').textContent = translations.contact;
  document.querySelector('li.email a').textContent = translations.email + ': ' + document.querySelector('li.email a').textContent.split(': ')[1];
  document.querySelector('li.telegram a').textContent = translations.telegram + ': ' + document.querySelector('li.telegram a').textContent.split(': ')[1];
}