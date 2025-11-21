// Skrytie nav baru
<script>
let lastScrollY = window.scrollY;
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
        // Scroll dole → skryť navbar
        nav.style.transform = "translateY(-100%)";
    } else {
        // Scroll hore → zobraziť navbar
        nav.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
});
</script>

//Rolovanie kocky
document.addEventListener("DOMContentLoaded", () => {
  // --- Fade-in (unchanged) ---
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.25 };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(f => appearOnScroll.observe(f));

  // --- Robust dice roll (supports multiple buttons / dice via data attributes) ---
  // HTML example: <div id="dice">-</div> <button class="roll-button" data-dice="20" data-target="dice">Hodiť d20</button>
  document.body.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".roll-button");
    if (!btn) return;

    // find target element to show result
    const targetId = btn.dataset.target || btn.getAttribute("data-target");
    const targetEl = targetId ? document.getElementById(targetId) : null;
    const diceSides = parseInt(btn.dataset.dice || btn.getAttribute("data-dice") || "20", 10);

    // safety checks
    if (!targetEl) {
      console.warn("Roll button nemá platný target element (data-target).");
      return;
    }
    if (!Number.isInteger(diceSides) || diceSides <= 0) {
      console.warn("Neplatný počet stránok kocky (data-dice). Používam d20.");
    }

    // disable button to prevent spamming
    btn.disabled = true;
    targetEl.classList.add("rolling");

    // animation / fake rolling time
    const rollDuration = 900; // ms
    const interimInterval = 80;
    let interim = setInterval(() => {
      targetEl.textContent = Math.floor(Math.random() * Math.max(2, diceSides)) + 1;
    }, interimInterval);

    setTimeout(() => {
      clearInterval(interim);
      const result = Math.floor(Math.random() * (Number.isInteger(diceSides) && diceSides > 0 ? diceSides : 20)) + 1;
      targetEl.classList.remove("rolling");
      targetEl.textContent = String(result);
      btn.disabled = false;

      // Optional: flash effect when high roll (e.g. natural 20)
      if (diceSides === 20 && result === 20) {
        targetEl.animate([
          { transform: "scale(1)" },
          { transform: "scale(1.15)" },
          { transform: "scale(1)" }
        ], { duration: 600 });
      }
    }, rollDuration);
  });


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

