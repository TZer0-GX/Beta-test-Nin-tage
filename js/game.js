import { getFavorites, toggleFavorite, getRating, setRating } from "./storage.js";
import { startEmulator } from "./emulator/emulator.js";
import "./controllers/gamepad.js";
import { uiSound } from "./ui/sound.js";
import { bindButtonSounds } from "./ui/navigation.js";

let games = [];
let game = null;

const params = new URLSearchParams(location.search);
const gameId = params.get("id");

async function init() {
  const response = await fetch("./data/games.json");
  games = await response.json();
  game = games.find(item => item.id === gameId) || games[0];

  renderGame();
  setupActions();
  renderRecommendations();
  startEmulator(game);

  document.querySelector("#fullscreenBtn").addEventListener("click", () => {
    const frame = document.querySelector(".emulator-frame");
    if (document.fullscreenElement) document.exitFullscreen();
    else frame.requestFullscreen?.();
  });
  bindButtonSounds(document);
}

function renderGame() {
  document.title = `Nin-tage // ${game.title}`;
  document.querySelector("#gameTitle").textContent = game.title;
  document.querySelector("#gameTicker").textContent = `${game.title} // ${game.platform.toUpperCase()} // ${game.year} // ${game.developer}`;
  document.querySelector("#gamePlatform").textContent = game.platform === "nes" ? "NINTENDO ENTERTAINMENT SYSTEM" : "GAME BOY";
  document.querySelector("#gameMeta").textContent = `${game.year} • ${game.publisher}`;
  document.querySelector("#gameDeveloper").textContent = game.developer;
  document.querySelector("#gamePublisher").textContent = game.publisher;
  document.querySelector("#gameYear").textContent = game.year;
  document.querySelector("#gameGenre").textContent = game.genre;

  const tags = document.querySelector("#gameTags");
  tags.innerHTML = game.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");

  const status = document.querySelector("#romStatus");
  status.textContent = `ROM : ${game.romUrl}`;
  document.querySelector("#emulatorMessage").textContent = `Chargement de ${game.title}...`;
}

function setupActions() {
  const favorite = document.querySelector("#favoriteBtn");
  const syncFavorite = () => {
    const active = getFavorites().includes(game.id);
    favorite.classList.toggle("active", active);
    favorite.querySelector("span:last-child").textContent = active ? "FAVORI" : "AJOUTER AUX FAVORIS";
  };
  syncFavorite();

  favorite.addEventListener("click", () => {
    toggleFavorite(game.id);
    syncFavorite();
    uiSound("favorite");
  });

  const stars = document.querySelector("#ratingStars");
  const current = getRating(game.id);
  renderRating(stars, current);

  stars.addEventListener("click", event => {
    const button = event.target.closest("[data-rating]");
    if (!button) return;
    const value = Number(button.dataset.rating);
    setRating(game.id, value);
    renderRating(stars, value);
    uiSound("click");
  });

  document.querySelector("#historyTab").href = `./game-info.html?id=${encodeURIComponent(game.id)}&section=history`;
  document.querySelector("#forumTab").href = `./game-info.html?id=${encodeURIComponent(game.id)}&section=forum`;
}

function renderRating(container, value) {
  container.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const half = i / 2;
    const star = document.createElement("button");
    star.type = "button";
    star.className = `rating-star ${value !== null && half <= value ? "active" : ""}`;
    star.dataset.rating = half;
    star.textContent = "★";
    star.title = `${half}/5`;
    star.setAttribute("aria-label", `Noter ${half} sur 5`);
    container.appendChild(star);
  }
  document.querySelector("#ratingValue").textContent = value ? `${value.toFixed(1)}/5` : "—";
}

function renderRecommendations() {
  const box = document.querySelector("#recommendations");
  games.filter(item => item.id !== game.id).slice(0, 4).forEach(item => {
    const link = document.createElement("a");
    link.className = "mini-item";
    link.href = `./game.html?id=${encodeURIComponent(item.id)}`;
    link.innerHTML = `<img src="${item.thumbnail}" alt=""><strong>${escapeHtml(item.title)}</strong>`;
    box.appendChild(link);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

init().catch(error => {
  document.querySelector("#gameTitle").textContent = "Erreur";
  document.querySelector("#gameMeta").textContent = error.message;
});
