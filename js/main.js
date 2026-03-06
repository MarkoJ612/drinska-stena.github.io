// ===== GALLERY =====

const track = document.querySelector(".gallery-track");
const slides = Array.from(track.children);
const prev = document.querySelector(".arrow.left");
const next = document.querySelector(".arrow.right");

// Dots kontejner — dodajemo ga dinamički
const dotsContainer = document.createElement("div");
dotsContainer.className = "gallery-dots";
track.closest(".gallery").appendChild(dotsContainer);

const totalSlides = slides.length;
let isMobile = window.innerWidth <= 900;
let visibleSlides = isMobile ? 1 : 3;
let slideWidth = isMobile
    ? track.closest(".gallery-window").offsetWidth
    : 300;

let index = visibleSlides; // počinjemo iza klonova
let isTransitioning = false;

// Klonovi za beskonačni scroll
let firstClones = [];
let lastClones = [];

function buildClones() {
    // Ukloni stare klonove
    document.querySelectorAll(".gallery-track .clone").forEach(c => c.remove());

    visibleSlides = isMobile ? 1 : 3;
    slideWidth = isMobile
        ? track.closest(".gallery-window").offsetWidth
        : 300;

    // Originalni slides (bez klonova)
    const originals = Array.from(track.querySelectorAll("img:not(.clone)"));

    firstClones = originals.slice(0, visibleSlides).map(s => {
        const c = s.cloneNode(true);
        c.classList.add("clone");
        return c;
    });
    lastClones = originals.slice(-visibleSlides).map(s => {
        const c = s.cloneNode(true);
        c.classList.add("clone");
        return c;
    });

    firstClones.forEach(c => track.appendChild(c));
    lastClones.reverse().forEach(c => track.prepend(c));

    index = visibleSlides;
    track.style.transition = "none";
    track.style.transform = `translateX(${-index * slideWidth}px)`;

    buildDots();
    updateDots();
}

function buildDots() {
    dotsContainer.innerHTML = "";
    if (!isMobile) return;
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    if (!isMobile) return;
    const realIndex = ((index - visibleSlides) % totalSlides + totalSlides) % totalSlides;
    document.querySelectorAll(".gallery-dots .dot").forEach((d, i) => {
        d.classList.toggle("active", i === realIndex);
    });
}

function goTo(targetRealIndex) {
    index = targetRealIndex + visibleSlides;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(${-index * slideWidth}px)`;
    updateDots();
}

function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    index++;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(${-index * slideWidth}px)`;
    updateDots();
}

function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    index--;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(${-index * slideWidth}px)`;
    updateDots();
}

next.addEventListener("click", moveNext);
prev.addEventListener("click", movePrev);

track.addEventListener("transitionend", () => {
    isTransitioning = false;
    const origCount = totalSlides;

    if (index >= origCount + visibleSlides) {
        index = visibleSlides;
        track.style.transition = "none";
        track.style.transform = `translateX(${-index * slideWidth}px)`;
    }

    if (index < visibleSlides) {
        index = origCount + visibleSlides - 1;
        track.style.transition = "none";
        track.style.transform = `translateX(${-index * slideWidth}px)`;
    }
    updateDots();
});

// ===== TOUCH / SWIPE PODRŠKA =====

let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50;

track.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

track.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
        diff > 0 ? moveNext() : movePrev();
    }
}, { passive: true });

// ===== RESIZE — rebuild ako se promeni breakpoint =====

let lastMobile = isMobile;
window.addEventListener("resize", () => {
    const nowMobile = window.innerWidth <= 900;
    if (nowMobile !== lastMobile) {
        lastMobile = nowMobile;
        isMobile = nowMobile;
        buildClones();
    } else if (isMobile) {
        // Ažuriraj širinu ako se ekran promenio a ostao mobile
        slideWidth = track.closest(".gallery-window").offsetWidth;
        track.style.transition = "none";
        track.style.transform = `translateX(${-index * slideWidth}px)`;
    }
});

// Init
buildClones();


// ===== SCROLL REVEAL =====

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

reveals.forEach(reveal => observer.observe(reveal));