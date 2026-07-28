'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
const modalCertIcon = document.querySelector("[data-modal-cert-icon]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    const avatar = this.querySelector("[data-testimonials-avatar]");
    const iconBox = this.querySelector("[data-cert-icon]");

    if (avatar) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
    }

    if (modalCertIcon && iconBox) {
      modalCertIcon.setAttribute("name", iconBox.getAttribute("data-cert-icon"));
    }

    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {
    filterItems[i].classList.remove("project-pop");

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

  const visible = document.querySelectorAll(".project-item.active");
  if (visible.length) staggerReveal(visible, "project-pop", 0.06);

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
        requestAnimationFrame(function () {
          runPageAnimations(pages[i]);
        });
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



/*-----------------------------------*\
  #CREATIVE ANIMATIONS
\*-----------------------------------*/

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateSkills = function (scope) {
  const fills = (scope || document).querySelectorAll(".skill-progress-fill");

  fills.forEach(function (fill, index) {
    fill.style.animation = "none";
    void fill.offsetWidth;
    fill.style.animation = "skill-grow 1.15s cubic-bezier(0.22, 1, 0.36, 1) both";
    fill.style.animationDelay = (index * 0.12) + "s";
  });
};

const staggerReveal = function (nodes, className, step) {
  nodes.forEach(function (node, index) {
    node.classList.remove(className);
    void node.offsetWidth;
    node.style.setProperty("--reveal-delay", (index * (step || 0.07)) + "s");
    node.classList.add(className);
  });
};

const runPageAnimations = function (page) {
  if (!page || prefersReducedMotion) return;

  const title = page.querySelector(".article-title");
  if (title) {
    title.classList.remove("title-in");
    void title.offsetWidth;
    title.classList.add("title-in");
  }

  const chips = page.querySelectorAll(".tech-stack li");
  if (chips.length) staggerReveal(chips, "chip-in", 0.05);

  const services = page.querySelectorAll(".service-item");
  if (services.length) staggerReveal(services, "card-in", 0.08);

  const timelineItems = page.querySelectorAll(".timeline-item");
  if (timelineItems.length) staggerReveal(timelineItems, "timeline-in", 0.1);

  const projects = page.querySelectorAll(".project-item.active");
  if (projects.length) staggerReveal(projects, "project-pop", 0.06);

  if (page.dataset.page === "resume") animateSkills(page);
};

// Magnetic tilt on service cards
const enableMagneticTilt = function () {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  const cards = document.querySelectorAll(".service-item");

  cards.forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 10;
      const rotateY = (x - 0.5) * 12;

      card.style.transform =
        "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
      card.style.setProperty("--spot-x", (x * 100) + "%");
      card.style.setProperty("--spot-y", (y * 100) + "%");
    });

    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  });
};

// Soft cursor spotlight
const enableCursorGlow = function () {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let ticking = false;

  const render = function () {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = "translate(" + currentX + "px, " + currentY + "px)";
    ticking = false;
  };

  window.addEventListener("pointermove", function (event) {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.classList.add("is-visible");

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  });

  document.addEventListener("mouseleave", function () {
    glow.classList.remove("is-visible");
  });
};

// Boot
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("is-ready");

  const activePage = document.querySelector("article.active");
  runPageAnimations(activePage);
  enableMagneticTilt();
  enableCursorGlow();
  initProjectModal();
});



/*-----------------------------------*\
  #PROJECT MODAL
\*-----------------------------------*/

const initProjectModal = function () {
  const modal = document.querySelector("[data-project-modal]");
  if (!modal) return;

  const overlay = document.querySelector("[data-project-overlay]");
  const closeBtn = document.querySelector("[data-project-close]");
  const modalImg = document.querySelector("[data-project-modal-img]");
  const modalTitle = document.querySelector("[data-project-modal-title]");
  const modalCategory = document.querySelector("[data-project-modal-category]");
  const modalText = document.querySelector("[data-project-modal-text]");
  const modalTech = document.querySelector("[data-project-modal-tech]");
  const modalFeatures = document.querySelector("[data-project-modal-features]");
  const modalLink = document.querySelector("[data-project-modal-link]");
  const modalPdfPi = document.querySelector("[data-project-modal-pdf-pi]");
  const modalPdfPfa = document.querySelector("[data-project-modal-pdf-pfa]");
  const modalGallery = document.querySelector("[data-project-modal-gallery]");
  const openers = document.querySelectorAll("[data-project-open]");

  const splitCsv = function (value) {
    return (value || "")
      .split(",")
      .map(function (part) { return part.trim(); })
      .filter(Boolean);
  };

  const fillList = function (listEl, items, itemClass) {
    listEl.innerHTML = "";
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.className = itemClass;
      li.textContent = item;
      listEl.appendChild(li);
    });
  };

  const fillGallery = function (images) {
    if (!modalGallery) return;
    modalGallery.innerHTML = "";

    if (!images.length) {
      modalGallery.hidden = true;
      return;
    }

    modalGallery.hidden = false;
    images.forEach(function (src, index) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "project-gallery-thumb" + (index === 0 ? " active" : "");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Aperçu " + (index + 1);
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        modalImg.src = src;
        modalGallery.querySelectorAll(".project-gallery-thumb").forEach(function (el) {
          el.classList.remove("active");
        });
        btn.classList.add("active");
      });
      li.appendChild(btn);
      modalGallery.appendChild(li);
    });
  };

  const setOptionalLink = function (anchor, url) {
    if (!anchor) return;
    if (url) {
      anchor.href = url;
      anchor.hidden = false;
    } else {
      anchor.hidden = true;
    }
  };

  const toggleProjectModal = function () {
    modal.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  openers.forEach(function (opener) {
    opener.addEventListener("click", function (event) {
      event.preventDefault();

      const item = opener.closest("[data-filter-item]");
      if (!item) return;

      const mainImg = item.dataset.projectImg || "";
      const gallery = splitCsv(item.dataset.projectGallery);
      if (!gallery.length && mainImg) gallery.push(mainImg);

      modalImg.src = mainImg;
      modalImg.alt = item.dataset.projectTitle || "Projet";
      modalTitle.textContent = item.dataset.projectTitle || "";
      modalCategory.textContent = item.dataset.projectCategory || "";
      modalText.innerHTML = "<p>" + (item.dataset.projectDesc || "") + "</p>";

      fillList(modalTech, splitCsv(item.dataset.projectTech), "project-tech-chip");
      fillList(modalFeatures, splitCsv(item.dataset.projectFeatures), "project-feature-item");
      fillGallery(gallery);

      setOptionalLink(modalLink, item.dataset.projectUrl);
      setOptionalLink(modalPdfPi, item.dataset.projectPdfPi);
      setOptionalLink(modalPdfPfa, item.dataset.projectPdfPfa);

      toggleProjectModal();
    });
  });

  closeBtn.addEventListener("click", toggleProjectModal);
  overlay.addEventListener("click", toggleProjectModal);
};
