// === Fade-in on scroll ===
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-in");

  const appearOptions = {
    threshold: 0.25,
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // === Dice roll logic ===
  const dice = document.getElementById("dice");
  const rollButton = document.getElementById("roll-button");
  if (dice && rollButton) {
    rollButton.addEventListener("click", () => {
      dice.classList.add("rolling");
      setTimeout(() => {
        dice.classList.remove("rolling");
        const result = Math.floor(Math.random() * 20) + 1;
        dice.textContent = result;
      }, 1000);
    });
  }

 // === Form validation ===
const form = document.getElementById("characterForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const race = document.getElementById("race").value;
    const cls = document.getElementById("class").value;

    const errorEl = document.getElementById("formError");
    const successEl = document.getElementById("formSuccess");

    if (!name || !race || !cls) {
      errorEl.style.display = "block";
      successEl.style.display = "none";
      return;
    }

    errorEl.style.display = "none";
    successEl.style.display = "block";

    // reset form
    form.reset();

    // hide success after 2 seconds
    setTimeout(() => {
      successEl.style.display = "none";
    }, 2000);
  });
}

