const flyers = [
  { id: "phoenix", name: "Phoenix", type: "Fantastic Flyers", rarity: "Mythic", icon: "🔥", art: "🦅", hp: 460, power: 271, magnification: 79, code: "MY-001" },
  { id: "griffin", name: "Griffin", type: "Fantastic Flyers", rarity: "Legendary", icon: "🦁", art: "🪽", hp: 390, power: 195, magnification: 100, code: "MY-002" },
  { id: "thunderbird", name: "Thunderbird", type: "Fantastic Flyers", rarity: "Rare", icon: "⚡", art: "🦅", hp: 365, power: 295, magnification: 85, code: "MY-003" }
];

const board = document.querySelector("#board");
const movesEl = document.querySelector("#moves");
const matchesEl = document.querySelector("#matches");
const statusEl = document.querySelector("#status");
const winScreen = document.querySelector("#win-screen");
const winMoves = document.querySelector("#win-moves");
let flipped = [], moves = 0, matches = 0, locked = false;

function shuffledCards() {
  return [...flyers, ...flyers].sort(() => Math.random() - 0.5);
}

function cardMarkup(card, index) {
  return `<button class="memory-card" type="button" data-id="${card.id}" aria-label="Face-down card ${index + 1}">
    <span class="card-face card-back" aria-hidden="true"></span>
    <span class="card-face card-front ${card.id}">
      <span class="full-header"><span><small>${card.type}</small><h2>${card.name}</h2></span><span class="badge">✦ ${card.rarity}</span></span>
      <span class="full-art" aria-hidden="true"><span class="glow"></span><span class="orbit">${card.icon}</span><span class="creature">${card.icon}<b>${card.art}</b></span><span class="art-caption"><em>Fantastic Flyers</em><b>${card.name === "Phoenix" ? "Rekindle" : card.name === "Griffin" ? "Skyward oath" : "Tempest cry"}</b></span></span>
      <span class="full-stats"><span>HP <b>${card.hp}</b><small>/ 500</small><i style="--value:${card.hp / 5}%"></i></span><span>Power <b>${card.power}</b><small>/ 300</small><i style="--value:${card.power / 3}%"></i></span><span>Card Magnification <b>${card.magnification}</b><small>/ 100</small><i style="--value:${card.magnification}%"></i></span></span>
      <span class="full-divider"></span><span class="full-description">${card.name === "Phoenix" ? "From a crown of living flame, the Phoenix rises whenever hope seems lost, turning every ending into a brilliant beginning." : card.name === "Griffin" ? "The Griffin watches from mountain peaks, combining a lion’s courage with an eagle’s sight to guard what matters most." : card.name === "Thunderbird" ? "With a single cry, the Thunderbird gathers the clouds and sends ribbons of lightning racing across the open sky." : "A mysterious wildcard with an unknown origin. Its true form reveals itself only when fate chooses."}</span><span class="full-footer"><em>${card.name.toUpperCase()} SERIES</em><em>${card.code}</em></span>
    </span>
  </button>`;
}

function startGame() {
  flipped = []; moves = 0; matches = 0; locked = false;
  movesEl.textContent = "0"; matchesEl.textContent = "0"; statusEl.textContent = "Choose two cards to begin."; winScreen.hidden = true;
  board.innerHTML = shuffledCards().map(cardMarkup).join("");
  board.querySelectorAll(".memory-card").forEach(card => card.addEventListener("click", () => chooseCard(card)));
}

function chooseCard(card) {
  if (locked || card.classList.contains("flipped") || card.classList.contains("matched") || flipped.length === 2) return;
  card.classList.add("flipped"); flipped.push(card);
  if (flipped.length < 2) { statusEl.textContent = "Now find its match."; return; }
  moves++; movesEl.textContent = moves; locked = true;
  const [first, second] = flipped;
  if (first.dataset.id === second.dataset.id) {
    first.classList.add("matched"); second.classList.add("matched"); matches++; matchesEl.textContent = matches; flipped = []; locked = false;
    statusEl.textContent = matches === flyers.length ? "Collection complete!" : "A match! Choose two more cards.";
    if (matches === flyers.length) { winMoves.textContent = moves; setTimeout(() => { winScreen.hidden = false; }, 650); }
  } else {
    statusEl.textContent = "Not a match — try again.";
    setTimeout(() => { first.classList.remove("flipped"); second.classList.remove("flipped"); flipped = []; locked = false; statusEl.textContent = "Choose two cards to begin."; }, 900);
  }
}

document.querySelector("#new-game").addEventListener("click", startGame);
document.querySelector("#play-again").addEventListener("click", startGame);

const home = document.querySelector("#home-screen"), modes = document.querySelector("#mode-screen"), game = document.querySelector(".game-shell"), challenge = document.querySelector("#challenge-screen");
let challengeCards = [], challengeFlipped = [], challengeLocked = false, challengeMoves = 0, challengeMatches = 0, challengePlayer = 1, challengeStart = 0, challengeTimer;
function hideAll() { home.hidden = true; modes.hidden = true; game.hidden = true; challenge.hidden = true; clearInterval(challengeTimer); }
function showHome() { hideAll(); home.hidden = false; }
function showClassic() { hideAll(); game.hidden = false; startGame(); }
function showModes() { hideAll(); modes.hidden = false; }
function challengeCardMarkup(card, index) { return cardMarkup(card, index); }
function startChallenge() {
  hideAll(); challenge.hidden = false; challengePlayer = 1; challengeMoves = 0; challengeMatches = 0; challengeFlipped = []; challengeLocked = false; challengeCards = shuffledCards(); challengeStart = Date.now();
  document.querySelector("#player-turn").textContent = "Player 1's turn"; document.querySelector("#challenge-status").textContent = "Find every pair."; document.querySelector("#p1-score").textContent = "—"; document.querySelector("#p2-score").textContent = "—"; renderChallenge();
  clearInterval(challengeTimer); challengeTimer = setInterval(() => { document.querySelector("#timer").textContent = Math.floor((Date.now() - challengeStart) / 1000); }, 250);
}
function renderChallenge() { const el = document.querySelector("#challenge-board"); el.innerHTML = challengeCards.map(challengeCardMarkup).join(""); el.querySelectorAll(".memory-card").forEach(c => c.addEventListener("click", () => chooseChallengeCard(c))); }
function chooseChallengeCard(card) { if (challengeLocked || card.classList.contains("flipped") || card.classList.contains("matched")) return; card.classList.add("flipped"); challengeFlipped.push(card); if (challengeFlipped.length < 2) return; challengeLocked = true; challengeMoves++; const [a,b] = challengeFlipped; if (a.dataset.id === b.dataset.id) { a.classList.add("matched"); b.classList.add("matched"); challengeMatches++; challengeFlipped=[]; challengeLocked=false; if (challengeMatches === 3) finishChallengeTurn(); } else setTimeout(() => { a.classList.remove("flipped"); b.classList.remove("flipped"); challengeFlipped=[]; challengeLocked=false; }, 850); }
function finishChallengeTurn() { const seconds = Math.max(1, Math.floor((Date.now()-challengeStart)/1000)); const score = seconds * challengeMoves; document.querySelector(`#p${challengePlayer}-score`).textContent = score; if (challengePlayer === 1) { challengePlayer = 2; challengeMatches = 0; challengeMoves = 0; challengeStart = Date.now(); document.querySelector("#player-turn").textContent = "Player 2's turn"; document.querySelector("#challenge-status").textContent = "Same deck, new turn. Go!"; challengeCards = shuffledCards(); renderChallenge(); } else { clearInterval(challengeTimer); const p1 = Number(document.querySelector("#p1-score").textContent), p2 = score; const winner = p1 < p2 ? "PLAYER 1 WINS!" : p2 < p1 ? "PLAYER 2 WINS!" : "IT’S A TIE!"; document.querySelector("#challenge-status").textContent = `${winner} Lower score wins.`; setTimeout(() => showWinner(winner,"Lowest score takes the arena.",`<span>Player 1<b>${p1}</b></span><span>Player 2<b>${p2}</b></span>`,startChallenge),100); } }
const joker = { id:"joker", name:"Joker", type:"Fantastic Flyers", rarity:"Legendary", icon:"?", art:"?", hp:"?", power:"?", magnification:"?", code:"JOKER" };
let mysteryDeck=[], mysteryTurn=1, mysteryFlipped=[], mysteryLocked=false, owned=[[],[]], duelHp={}, duelChoices=[null,null], mysteryMatchedIds=new Set();
function startMystery(){ hideAll(); document.querySelector("#mystery-screen").hidden=false; mysteryTurn=1; mysteryFlipped=[]; mysteryLocked=false; owned=[[],[]]; mysteryMatchedIds=new Set(); document.querySelector("#duel-panel").hidden=true; mysteryDeck=flyers.flatMap(c=>[c,c]).concat([joker,joker]).sort(()=>Math.random()-.5); updateMysteryTurn(); renderMystery(); renderOwned(); }
function renderMystery(){const el=document.querySelector("#mystery-board");el.innerHTML=mysteryDeck.map((c,i)=>cardMarkup(c,i)).join("");el.querySelectorAll(".memory-card").forEach(c=>c.addEventListener("click",()=>chooseMystery(c)));}
function renderOwned(){[0,1].forEach(p=>{document.querySelector(`#mystery-p${p+1}`).innerHTML=owned[p].map(c=>`<span class="owned-card ${c.dead?"dead":""}">${c.art||c.icon}<b>${c.name}</b></span>`).join("")||"<span class=\"empty-deck\">No cards yet</span>";});}
function updateMysteryTurn(message="Choose two cards to match."){document.querySelector("#mystery-turn-banner").textContent=`PLAYER ${mysteryTurn}’S TURN`;document.querySelector("#mystery-status").textContent=message;}
function chooseMystery(card){if(mysteryLocked||card.classList.contains("flipped")||card.classList.contains("matched"))return;card.classList.add("flipped");mysteryFlipped.push(card);if(mysteryFlipped.length<2)return;mysteryLocked=true;const[a,b]=mysteryFlipped;if(a.dataset.id===b.dataset.id){a.classList.add("matched");b.classList.add("matched");let found=flyers.find(x=>x.id===a.dataset.id)||joker;if(found.id==="joker"){const choice=prompt("Joker matched! Choose: Phoenix, Griffin, or Thunderbird", "Phoenix");found=flyers.find(x=>x.name.toLowerCase()===(choice||"").toLowerCase())||flyers[0];}owned[mysteryTurn-1].push({...found});mysteryFlipped=[];mysteryLocked=false;renderOwned();if(owned[0].length>=2||owned[1].length>=2)finishMysteryDraft();else{mysteryTurn=mysteryTurn===1?2:1;updateMysteryTurn("Pair found! The other player’s turn.");}}else setTimeout(()=>{a.classList.remove("flipped");b.classList.remove("flipped");mysteryFlipped=[];mysteryLocked=false;mysteryTurn=mysteryTurn===1?2:1;updateMysteryTurn("No match. The other player’s turn.");},800);}
function finishMysteryDraft(){
  const leader=owned[0].length>=2?0:1, other=leader===0?1:0;
  const matchedIds=new Set([...document.querySelectorAll("#mystery-board .memory-card.matched")].map(card=>card.dataset.id));
  let remaining=[...new Map([...flyers,joker].filter(c=>!matchedIds.has(c.id)).map(c=>[c.id,c])).values()];
  if(remaining.some(c=>c.id==="joker")){
    const choice=prompt(`✨ JOKER AWAKENS! ✨\n\nPlayer ${other+1}, choose the Joker’s legendary form:\n🔥 Phoenix  ·  🦁 Griffin  ·  ⚡ Thunderbird`,"Phoenix");
    const chosen=flyers.find(c=>c.name.toLowerCase()===(choice||"").toLowerCase())||flyers[0];
    remaining=remaining.map(c=>c.id==="joker"?{...chosen}:c);
  }
  document.querySelectorAll("#mystery-board .memory-card").forEach(card=>{if(!card.classList.contains("matched")){card.classList.add("flipped","matched");}});
  // The other player may already have won a pair on an earlier turn. Keep it
  // and add every still-unmatched card instead of replacing their deck.
  owned[other].push(...remaining.map(c=>({...c})));
  renderOwned();
  document.querySelector("#mystery-title").textContent="Cards distributed";
  document.querySelector("#mystery-status").textContent=`Player ${other+1} receives the remaining cards. Choose your duel cards.`;
  document.querySelector("#mystery-board").hidden=true;
  document.querySelector("#duel-panel").hidden=false;
  renderDuel();
}
function renderDuel(){const el=document.querySelector("#duel-cards");el.innerHTML=owned.map((deck,p)=>`<div class="duel-player"><h3>Player ${p+1}</h3>${deck.map((c,i)=>`<button class="duel-card ${c.dead?"dead":""}" data-player="${p}" data-index="${i}" ${c.dead?"disabled":""}>${c.art}<b>${c.name}</b><small>HP ${c.hp} · Power ${c.power}</small></button>`).join("")}</div>`).join("");el.querySelectorAll(".duel-card").forEach(b=>b.onclick=()=>pickDuel(b));}
function pickDuel(btn){const p=Number(btn.dataset.player),i=Number(btn.dataset.index);duelChoices[p]=owned[p][i];btn.classList.add("selected");if(!duelChoices[0]||!duelChoices[1])return;const a=duelChoices[0],b=duelChoices[1];let da=Math.round(a.power*a.magnification/100),db=Math.round(b.power*b.magnification/100);if((a.id==="griffin"&&b.id==="thunderbird")||(a.id==="thunderbird"&&b.id==="phoenix")||(a.id==="phoenix"&&b.id==="griffin")){if(a.id==="griffin"&&b.id==="thunderbird")db=Math.round(db*.75);if(a.id==="thunderbird"&&b.id==="phoenix")da=Math.round(da*.75);if(a.id==="phoenix"&&b.id==="griffin")db=Math.round(db*.75);}a.hp-=db;b.hp-=da;if(a.hp<=0)a.dead=true;if(b.hp<=0)b.dead=true;const status=document.querySelector("#duel-status");status.textContent=`Player 1 dealt ${db} damage. Player 2 dealt ${da} damage.`;renderDuel();duelChoices=[null,null];if(owned[0].every(c=>c.dead)||owned[1].every(c=>c.dead)){const winner=owned[0].every(c=>c.dead)?"PLAYER 2 IS THE WINNER!":"PLAYER 1 IS THE WINNER!";setTimeout(()=>showWinner(winner,"The final duel has ended.","",startMystery),500);}}
function showWinner(title,detail,scores,replay){const overlay=document.querySelector("#winner-overlay");document.querySelector("#winner-title").textContent=title;document.querySelector("#winner-detail").textContent=detail;document.querySelector("#winner-scores").innerHTML=scores||"";overlay.hidden=false;document.querySelector("#winner-again").onclick=()=>{overlay.hidden=true;replay()};document.querySelector("#winner-home").onclick=()=>{overlay.hidden=true;showHome()};}
document.querySelector("#classic-mode").addEventListener("click", showClassic); document.querySelector("#two-player-mode").addEventListener("click", showModes); document.querySelector("#home-from-modes").addEventListener("click", showHome); document.querySelector("#challenge-mode").addEventListener("click", startChallenge); document.querySelector("#home-from-challenge").addEventListener("click", showHome); document.querySelector("#mystery-mode").addEventListener("click", startMystery); document.querySelector("#home-from-mystery").addEventListener("click", showHome);
game.hidden = true; showHome();
