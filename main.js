<script>
  const roll = sides => Math.floor(Math.random()*sides)+1;

  document.querySelectorAll('button.die').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const dice = btn.dataset.dice;
      const sides = parseInt(dice.replace(/\D/g,''));
      const result = roll(sides);
      document.getElementById('result').textContent = result;
      document.getElementById('details').textContent = `hodil si ${dice}`;
    });
  });
</script>
