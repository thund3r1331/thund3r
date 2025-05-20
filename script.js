document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link")
  const tabContents = document.querySelectorAll(".tab-content")

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      navLinks.forEach((navLink) => navLink.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      link.classList.add("active")
      const tabId = link.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")

      const headerHeight = document.querySelector(".main-header").offsetHeight + 20
      const targetElement = document.getElementById(tabId)
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    })
  })

  function animateSkillCircles() {
    const circles = document.querySelectorAll(".skill-circle-progress")

    circles.forEach((circle) => {
      const percent = circle.style.getPropertyValue("--percent")
      circle.style.strokeDashoffset = 339.292

      setTimeout(() => {
        circle.style.strokeDashoffset = `calc(339.292 - (339.292 * ${percent}) / 100)`
      }, 300)
    })
  }

  animateSkillCircles()

  const langLinks = document.querySelectorAll(".lang-link")
  const translations = {
    en: {
      skills: "Skills",
      portfolio: "Portfolio",
      contact: "Contact",
      email: "Email",
      telegram: "Telegram",
      github: "GitHub",
      "tech-stats-title": "Software Used",
      "blender-desc": "3D modeling and animation",
      "photoshop-desc": "Image editing",
      "blockbench-desc": "3D model creation",
      "aseprite-desc": "Pixel art and animation",
    },
    ru: {
      skills: "Навыки",
      portfolio: "Портфолио",
      contact: "Контакты",
      email: "Email",
      telegram: "Telegram",
      github: "GitHub",
      "tech-stats-title": "Используемые программы",
      "blender-desc": "3D моделирование и анимация",
      "photoshop-desc": "Редактирование изображений",
      "blockbench-desc": "Создание 3D моделей",
      "aseprite-desc": "Пиксель-арт и анимация",
    },
  }

  function loadTranslations(lang) {
    document.querySelector('[data-tab="skills"]').textContent = translations[lang]["skills"]
    document.querySelector('[data-tab="portfolio"]').textContent = translations[lang]["portfolio"]
    document.querySelector('[data-tab="contact"]').textContent = translations[lang]["contact"]

    document.querySelectorAll(".section-title")[0].textContent = translations[lang]["skills"]
    document.querySelectorAll(".section-title")[1].textContent = translations[lang]["portfolio"]
    document.querySelectorAll(".section-title")[2].textContent = translations[lang]["contact"]

    document.querySelector(".tech-stats h3").textContent = translations[lang]["tech-stats-title"]

    const skillInfos = document.querySelectorAll(".skill-info p")
    skillInfos[0].textContent = translations[lang]["blender-desc"]
    skillInfos[1].textContent = translations[lang]["photoshop-desc"]
    skillInfos[2].textContent = translations[lang]["blockbench-desc"]
    skillInfos[3].textContent = translations[lang]["aseprite-desc"]

    const contactTitles = document.querySelectorAll(".contact-card h3")
    contactTitles[0].textContent = translations[lang]["email"]
    contactTitles[1].textContent = translations[lang]["telegram"]
    contactTitles[2].textContent = translations[lang]["github"]

    document.querySelector(".copyright").textContent = translations[lang]["copyright"]
  }

  langLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      langLinks.forEach((langLink) => langLink.classList.remove("active"))

      link.classList.add("active")

      const lang = link.getAttribute("data-lang")
      loadTranslations(lang)
    })
  })

  if (window.innerWidth <= 768) {
    const headerContainer = document.querySelector(".header-container")
    const mobileMenuToggle = document.createElement("button")
    mobileMenuToggle.className = "mobile-menu-toggle"
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>'

    headerContainer.insertBefore(mobileMenuToggle, document.querySelector(".header-right"))

    const mainNav = document.querySelector(".main-nav")

    mobileMenuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active")
      mobileMenuToggle.innerHTML = mainNav.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>'
    })
  }
})
