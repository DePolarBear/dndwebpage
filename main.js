/* ============================================= DICE ROLLER =================================== */
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
/* ========================================== DICE ROLLER ============================================== */

/* ================================= GENERÁTOR POSTAVY (s validáciou) ================================== */
const rasy  = ['Človek','Elf','Trpaslík','Hobit','Poloorc','Drakonid'];
const triedy= ['Bojovník','Kňaz','Čarodej','Strážca','Zlodej','Barbar'];

// naplnenie selectov
function fillSelect(id,arr){
  const s=document.getElementById(id);
  s.innerHTML=arr.map(x=>`<option>${x}</option>`).join('');
}
fillSelect('rasa',rasy);
fillSelect('trieda',triedy);

// 4d6 drop lowest
function roll4d6drop(){
  const rolls=Array.from({length:4},()=>Math.floor(Math.random()*6)+1);
  rolls.sort((a,b)=>a-b);
  return rolls.slice(1).reduce((a,b)=>a+b,0);
}

// hod všetky atribúty
document.getElementById('rollStats').addEventListener('click',()=>{
  const attrs=['sil','obr','kon','int','mud','cha'];
  let rolls,safe=0;                       // safe = poistka proti nekonečnému loopu
  do{
    rolls=attrs.map(()=>roll4d6drop());
    safe++;
  }while(rolls.reduce((a,b)=>a+b,0)>28 && safe<1000); // max 1000 pokusov

  rolls.forEach((v,i)=> document.getElementById(attrs[i]).value=v );

  const sum=rolls.reduce((a,b)=>a+b,0);
  alert(`Hodená sada (súčet ${sum}) – všetko v poriadku!`);
});

// validácia
function validateChar(){
  // 1. meno – povinné, bez číslic
  const meno=document.getElementById('meno').value.trim();
  if(!meno){alert('Zadaj meno postavy.');return false;}
  if(/\d/.test(meno)){alert('Meno nesmie obsahovať číslice.');return false;}

  // 2. úroveň
  const lvl=parseInt(document.getElementById('uroven').value);
  if(isNaN(lvl)||lvl<1||lvl>20){alert('Úroveň musí byť 1–20.');return false;}

  // 3. atribúty 3–18 + súčet ≤ 28
  const attrs=['sil','obr','kon','int','mud','cha'];
  let sum=0;
  for(const id of attrs){
    const v=parseInt(document.getElementById(id).value);
    if(isNaN(v)||v<3||v>18){alert('Atribúty musia byť 3–18.');return false;}
    sum+=v;
  }
  if(sum>28){alert(`Súčet atribútov nesmie presiahnuť 28 (máš ${sum}).`);return false;}

  return true; // všetko OK
}

// udalosti s validáciou
document.getElementById('saveChar').addEventListener('click',()=>{
  if(!validateChar())return;
  const data={
    meno  :document.getElementById('meno').value,
    rasa  :document.getElementById('rasa').value,
    trieda:document.getElementById('trieda').value,
    uroven:document.getElementById('uroven').value,
    sil:document.getElementById('sil').value,
    obr:document.getElementById('obr').value,
    kon:document.getElementById('kon').value,
    int:document.getElementById('int').value,
    mud:document.getElementById('mud').value,
    cha:document.getElementById('cha').value
  };
  localStorage.setItem('ddchar',JSON.stringify(data));
  alert('Postava uložená!');
});

document.getElementById('loadChar').addEventListener('click',()=>{
  const raw=localStorage.getItem('ddchar');
  if(!raw){alert('Nič uložené.');return;}
  const data=JSON.parse(raw);
  Object.keys(data).forEach(k=>{
    const el=document.getElementById(k);
    if(el)el.value=data[k];
  });
  alert('Postava načítaná.');
});

document.getElementById('printChar').addEventListener('click',()=>{
  if(!validateChar())return;
  const meno=document.getElementById('meno').value||'Bezmenný';
  const r=document.getElementById('rasa').value;
  const t=document.getElementById('trieda').value;
  const lvl=document.getElementById('uroven').value;
  const attrs=['sil','obr','kon','int','mud','cha'].map(id=>{
    const name=id.toUpperCase();
    const val=document.getElementById(id).value;
    const mod=Math.floor((val-10)/2);
    return `${name}: ${val} (${mod>=0?'+':''}${mod})`;
  }).join('\n');

  document.getElementById('output').textContent=
`${meno}, ${r} ${t} ${lvl}
----------------------------
${attrs}`;
});
/* =============================== GENERÁTOR POSTAVY (s validáciou) ============================= */
