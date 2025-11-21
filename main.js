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

