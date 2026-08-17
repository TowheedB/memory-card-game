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
      <span class="full-divider"></span><span class="full-description">${card.name === "Phoenix" ? "From a crown of living flame, the Phoenix rises whenever hope seems lost, turning every ending into a brilliant beginning." : card.name === "Griffin" ? "The Griffin watches from mountain peaks, combining a lion’s courage with an eagle’s sight to guard what matters most." : "With a single cry, the Thunderbird gathers the clouds and sends ribbons of lightning racing across the open sky."}</span><span class="full-footer"><em>${card.name.toUpperCase()} SERIES</em><em>${card.code}</em></span>
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
startGame();
