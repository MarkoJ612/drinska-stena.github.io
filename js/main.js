const track = document.querySelector(".gallery-track");
const slides = Array.from(track.children);
const prev = document.querySelector(".arrow.left");
const next = document.querySelector(".arrow.right");

const slideWidth = 300;
const visibleSlides = 3;

// KLONIRANJE
const firstClones = slides.slice(0, visibleSlides).map(slide => slide.cloneNode(true));
const lastClones = slides.slice(-visibleSlides).map(slide => slide.cloneNode(true));

firstClones.forEach(clone => track.appendChild(clone));
lastClones.reverse().forEach(clone => track.prepend(clone));

let index = visibleSlides;
track.style.transform = `translateX(${-index * slideWidth}px)`;

// NEXT
next.addEventListener("click", () => {
    index++;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(${-index * slideWidth}px)`;
});

// PREV
prev.addEventListener("click", () => {
    index--;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(${-index * slideWidth}px)`;
});

// RESET BEZ ANIMACIJE
track.addEventListener("transitionend", () => {
    if (index >= slides.length + visibleSlides) {
        index = visibleSlides;
        track.style.transition = "none";
        track.style.transform = `translateX(${-index * slideWidth}px)`;
    }

    if (index < visibleSlides) {
        index = slides.length + visibleSlides - 1;
        track.style.transition = "none";
        track.style.transform = `translateX(${-index * slideWidth}px)`;
    }
});


const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // animira se samo jednom
            }
        });
    },
    {
        threshold: 0.2
    }
);

reveals.forEach(reveal => observer.observe(reveal));
