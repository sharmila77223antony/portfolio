const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");

  mobileMenu.classList.toggle("hidden");
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation menu" : "Close navigation menu"
  );

  menuButton.textContent = isOpen ? "☰" : "✕";
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.textContent = "☰";
  });
});


const allNavLinks = document.querySelectorAll(
  '.nav-link, .mobile-link'
);

const pageSections = document.querySelectorAll(
  '#home, #about, #skills, #projects, #experience, #contact'
);


function setActiveNav(sectionId) {
  allNavLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;

    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}


const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort(
        (a, b) =>
          b.intersectionRatio - a.intersectionRatio
      );

    if (visibleSections.length > 0) {
      setActiveNav(visibleSections[0].target.id);
    }
  },
  {
    root: null,
    rootMargin: '-20% 0px -55% 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75]
  }
);

pageSections.forEach((section) => {
  sectionObserver.observe(section);
});

allNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const sectionId = link.getAttribute('href')?.slice(1);

    if (sectionId) {
      setActiveNav(sectionId);
    }
  });
});


const initialSection = window.location.hash.slice(1);

if (initialSection && document.getElementById(initialSection)) {
  setActiveNav(initialSection);
} else {
  setActiveNav('home');
}

const typedText = document.getElementById("typedText");

const titles = [
  "Python / Django Developer",
  "Python Developer",
  "Django Developer",
  "API Developer"
];

let titleIndex = 0;
let characterIndex = titles[0].length;
let deleting = false;

function typeTitle() {
  const currentTitle = titles[titleIndex];

  if (deleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  typedText.textContent = currentTitle.slice(0, characterIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && characterIndex === currentTitle.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    delay = 300;
  }

  setTimeout(typeTitle, delay);
}

setTimeout(typeTitle, 1400);

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

const EMAILJS_PUBLIC_KEY = "xcI1Wbzk38Ehu5cJ3";
const EMAILJS_SERVICE_ID = "service_40sudt6";
const EMAILJS_TEMPLATE_ID = "template_nv5h7ei";

const contactModal = document.getElementById("contactModal");
const openContactModal = document.getElementById("openContactModal");
const contactDialog = contactModal?.querySelector(".contact-modal-dialog");
const contactForm = document.getElementById("contactForm");
const contactSubmit = document.getElementById("contactSubmit");
const contactFormStatus = document.getElementById("contactFormStatus");

let previousFocus = null;
let emailJsReady = false;

if (
  window.emailjs &&
  EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"
) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });

  emailJsReady = true;
}

function showContactStatus(message, type) {
  contactFormStatus.textContent = message;
  contactFormStatus.className =
    `contact-form-status is-visible is-${type}`;
}

function openModal() {
  if (!contactModal) return;

  previousFocus = document.activeElement;

  contactModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  contactModal.querySelector("#contactName")?.focus();
}

function closeModal() {
  if (!contactModal) return;

  contactModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  previousFocus?.focus();
}

openContactModal?.addEventListener("click", openModal);

contactModal?.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    contactModal?.getAttribute("aria-hidden") === "false"
  ) {
    closeModal();
  }
});

contactDialog?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;

  const focusable = [
    ...contactDialog.querySelectorAll(
      'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href]'
    )
  ].filter((element) => element.getClientRects().length > 0);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});


contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const honeypot = contactForm.querySelector('[name="website"]');

  if (honeypot?.value.trim()) {
    contactForm.reset();
    showContactStatus("Thank you for your message.", "success");
    return;
  }

  if (!emailJsReady) {
    showContactStatus(
      "EmailJS is not configured yet. Add your Public Key, Service ID, and Template ID, then refresh.",
      "error"
    );
    return;
  }

  const submitLabel = contactSubmit.querySelector(".submit-label");
  const originalLabel = submitLabel.textContent;

  contactSubmit.disabled = true;
  submitLabel.textContent = "Sending message...";

  showContactStatus("Sending your message securely...", "success");

  try {
    await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      contactForm
    );

    contactForm.reset();

    showContactStatus(
      "Your message was sent successfully! Thank you for reaching out.",
      "success"
    );
  } catch (error) {
    console.error("EmailJS submission failed:", error);

    showContactStatus(
      "Sorry, your message could not be sent. Please try again or contact me through LinkedIn.",
      "error"
    );
  } finally {
    contactSubmit.disabled = false;
    submitLabel.textContent = originalLabel;
  }
});
