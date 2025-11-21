/* ============================================= DICE ROLLER + 2-D SHAPES ========================== */
/* ============================================= DICE ROLLER + 2-D SVG ===== */
const roll = sides => Math.floor(Math.random() * sides) + 1;

const svgPoints = {
  d4 :'50,5 95,90 5,90',
  d6 :'5,5 95,5 95,95 5,95',
  d8 :'30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30',
  d10:'50,5 95,50 50,95 5,50',
  d12:'50,5 85,25 85,75 50,95 15,75 15,25',
  d20:'50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35'
};

function initDice() {
  const resultEl = document.getElementById('result');
  const detailEl = document.getElementById('details');
  const svgEl    = document.getElementById('diceAnim');
  const shapeEl  = svgEl.querySelector('.dice-shape');
  const textEl   = svgEl.querySelector('text');

  document.querySelectorAll('button.die').forEach(btn => {
    btn.addEventListener('click', () => {
      const sides = parseInt(btn.dataset.dice.replace(/\D/g,''));

      // 1. správny tvar
      shapeEl.setAttribute('points', svgPoints[btn.dataset.dice]);

      // 2. spustíme animáciu (na <svg>)
      textEl.textContent = '?';
      svgEl.classList.add('roll');

      // 3. po skončení dopadne číslo
      setTimeout(() => {
        const res = roll(sides);
        textEl.textContent = res;
        resultEl.textContent = res;
        detailEl.textContent = `hodil si ${btn.dataset.dice}`;
        svgEl.classList.remove('roll');
      }, 600);
    });
  });
}

// spustenie
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDice);
} else {
  initDice();
}
/* ============================================= /DICE ROLLER + 2-D SVG ===== */
/* ============================================= /DICE ROLLER + 2-D SHAPES =========================== */

/* ================================= GENERÁTOR POSTAVY (s validáciou) ================================== */
/* ===== POINT-BUY 27-bodový generátor ===== */
if (document.getElementById('attrGrid')) {
  const rasy  = ['Človek','Elf','Trpaslík','Hobit','Poloorc','Drakonid'];
  const triedy= ['Bojovník','Kňaz','Čarodej','Strážca','Zlodej','Barbar'];
  const attrs = ['sil','obr','kon','int','mud','cha'];
  const attrNames={sil:'Sila',obr:'Obratnosť',kon:'Konštrukcia',int:'Inteligencia',mud:'Múdrosť',cha:'Charizma'};
  
  // cenník 8→15
  const cost=[0,1,2,3,4,5,7,9]; // index 0 = hodnota 8
  
  fillSelect('rasa',rasy);
  fillSelect('trieda',triedy);
  createControls();
  
  function fillSelect(id,arr){
    document.getElementById(id).innerHTML=arr.map(x=>`<option>${x}</option>`).join('');
  }
  
  function createControls(){
    const grid=document.getElementById('attrGrid');
    attrs.forEach(a=>{
      grid.insertAdjacentHTML('beforeend',`
        <div class="abBox">
          <div class="abName">${attrNames[a]}</div>
          <button data-a="${a}" data-d="-">-</button>
          <span class="abVal" id="v-${a}">8</span>
          <button data-a="${a}" data-d="+">+</button>
        </div>`);
    });
    document.getElementById('attrGrid').addEventListener('click',e=>{
      if(e.target.dataset.d) changeAttr(e.target.dataset.a, e.target.dataset.d);
    });
    updateRemain();
  }
  
  function changeAttr(a,dir){
    const el=document.getElementById('v-'+a);
    let val=parseInt(el.textContent);
    let newVal=dir==='+'?val+1:val-1;
    if(newVal<8||newVal>15)return;          // mimo rozsah
    const oldCost=cost[val-8];
    const newCost=cost[newVal-8];
    const rem=getRemain();
    if(dir==='+' && rem<newCost-oldCost){   // už niet bodov
      alert('Nemáš dostatok bodov!');
      return;
    }
    el.textContent=newVal;
    updateRemain();
  }
  
  function getRemain(){
    let spent=0;
    attrs.forEach(a=>spent+=cost[parseInt(document.getElementById('v-'+a).textContent)-8]);
    return 27-spent;
  }
  function updateRemain(){
    document.getElementById('rem').textContent=getRemain();
  }
  
  // validácia
  function validateChar(){
    const meno=document.getElementById('meno').value.trim();
    if(!meno){alert('Zadaj meno postavy.');return false;}
    if(/\d/.test(meno)){alert('Meno nesmie obsahovať číslice.');return false;}
  
    const lvl=parseInt(document.getElementById('uroven').value);
    if(isNaN(lvl)||lvl<1||lvl>20){alert('Úroveň musí byť 1–20.');return false;}
  
    if(getRemain()<0){alert('Prekročil si počet bodov!');return false;}
    return true;
  }
  
  // udalosti
  document.getElementById('saveChar').addEventListener('click',()=>{
    if(!validateChar())return;
    const data={
      meno  :document.getElementById('meno').value,
      rasa  :document.getElementById('rasa').value,
      trieda:document.getElementById('trieda').value,
      uroven:document.getElementById('uroven').value
    };
    attrs.forEach(a=>data[a]=parseInt(document.getElementById('v-'+a).textContent));
    localStorage.setItem('ddchar',JSON.stringify(data));
    alert('Postava uložená!');
  });
  
  document.getElementById('loadChar').addEventListener('click',()=>{
    const raw=localStorage.getItem('ddchar');
    if(!raw){alert('Nič uložené.');return;}
    const data=JSON.parse(raw);
    ['meno','rasa','trieda','uroven'].forEach(k=>{
      const el=document.getElementById(k); if(el)el.value=data[k];
    });
    attrs.forEach(a=>document.getElementById('v-'+a).textContent=data[a]||8);
    updateRemain();
    alert('Postava načítaná.');
  });
  
  document.getElementById('printChar').addEventListener('click',()=>{
    if(!validateChar())return;
    const meno=document.getElementById('meno').value||'Bezmenný';
    const r=document.getElementById('rasa').value;
    const t=document.getElementById('trieda').value;
    const lvl=document.getElementById('uroven').value;
    const rows=attrs.map(a=>{
      const val=parseInt(document.getElementById('v-'+a).textContent);
      const mod=Math.floor((val-10)/2);
      return `${attrNames[a]}: ${val} (${mod>=0?'+':''}${mod})`;
    }).join('\n');
  
    document.getElementById('output').textContent=
  `${meno}, ${r} ${t} ${lvl}
  ----------------------------
  ${rows}`;
  });
}
/* =============================== GENERÁTOR POSTAVY (s validáciou) ============================= */

/* ======================= LIGHT-BOX  (uses jQuery only for class toggle) ====================== */
$(function(){                       // čaká na DOM
  const $overlay = $('#overlay');
  const $img     = $('#overlayImg');

  // otvorí sa po kliku na obrázok s class="enlarge"
  $(document).on('click','img.enlarge',function(){
    $img.attr('src',this.src);
    $overlay.addClass('show');
  });

  // zavrie sa klik na pozadie alebo na samotný obrázok
  $overlay.on('click',()=>$overlay.removeClass('show'));
});
/* ======================= LIGHT-BOX  (uses jQuery only for class toggle) ====================== */
