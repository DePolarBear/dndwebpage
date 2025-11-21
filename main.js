/* ===== DICE ROLLER ===== */
const roll = sides => Math.floor(Math.random() * sides) + 1;

function initDice() {
  document.querySelectorAll('button.die').forEach(btn => {
    btn.addEventListener('click', () => {
      const dice  = btn.dataset.dice;
      const sides = parseInt(dice.replace(/\D/g, ''));
      const result = roll(sides);
      document.getElementById('result').textContent  = result;
      document.getElementById('details').textContent = `hodil si ${dice}`;
    });
  });
}

// run when DOM is ready (works in every browser)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDice);
} else {                // already loaded
  initDice();
}
