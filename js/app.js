import { getFavorites, toggleFavorite, getRating, setDemoUser, getDemoUser } from "./storage.js";
import { bindButtonSounds } from "./ui/navigation.js";
import { uiSound } from "./ui/sound.js";

const grid = document.querySelector("#gameGrid");
const empty = document.querySelector("#emptyState");
const search = document.querySelector("#gameSearch");
const sort = document.querySelector("#sortGames");
const favCount = document.querySelector("#favCount");
const gameCount = document.querySelector("#gameCount");
const favoriteList = document.querySelector("#favoriteList");
const loginDialog = document.querySelector("#loginDialog");

let games = [];
let platform = new URLSearchParams(location.search).get("platform") || "all";

async function loadGames() {
  const response = await fetch("./data/games.json");
  if (!response.ok) throw new Error("Impossible de charger data/games.json");
  games = await response.json();
  render();
}

function visibleGames() {
  const term = search.value.trim().toLowerCase();
  return games
    .filter(game => platform === "all" || game.platform === platform)
    .filter(game => !term || `${game.title} ${game.developer} ${game.genre}`.toLowerCase().includes(term))
    .sort((a,b) => {
      if (sort.value === "year") return a.year - b.year;
      if (sort.value === "rating") return (getRating(b.id) ?? 0) - (getRating(a.id) ?? 0);
      return a.title.localeCompare(b.title);
    });
}

function render() {
  const list = visibleGames();
  grid.innerHTML = "";
  empty.classList.toggle("hidden", list.length !== 0);
  list.forEach(game => grid.appendChild(createCard(game)));
  gameCount.textContent = games.length;
  favCount.textContent = getFavorites().length;
  renderFavorites();
  bindButtonSounds(grid);
}

function createCard(game) {
  const article = document.createElement("article");
  article.className = "game-card";
  article.innerHTML = `
    <a href="./game.html?id=${encodeURIComponent(game.id)}" aria-label="Ouvrir ${escapeHtml(game.title)}">
      <img class="game-thumb" src="${game.thumbnail}" alt="Miniature de ${escapeHtml(game.title)}" loading="lazy">
      <div class="game-info">
        <h2 class="game-title">${escapeHtml(game.title)}</h2>
        <div class="game-sub">${game.platform.toUpperCase()} • ${game.year} • ${escapeHtml(game.genre)}</div>
      </div>
    </a>
    <span class="game-badge">${game.platform === "nes" ? "NES" : "GB"}</span>
    <button class="card-fav ${getFavorites().includes(game.id) ? "active" : ""}" title="Favori" aria-label="Favori">${getFavorites().includes(game.id) ? "♥" : "♡"}</button>
  `;
  article.querySelector(".card-fav").addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    const active = toggleFavorite(game.id);
    event.currentTarget.classList.toggle("active", active);
    event.currentTarget.textContent = active ? "♥" : "♡";
    favCount.textContent = getFavorites().length;
    renderFavorites();
    uiSound("favorite");
  });
  return article;
}

function renderFavorites() {
  const favorites = getFavorites();
  favoriteList.innerHTML = "";
  const favoriteGames = games.filter(g => favorites.includes(g.id)).slice(0, 5);
  if (!favoriteGames.length) {
    favoriteList.innerHTML = `<div class="mini-item"><span class="muted small">Aucun favori pour l'instant.</span></div>`;
    return;
  }
  favoriteGames.forEach(game => {
    const item = document.createElement("a");
    item.className = "mini-item";
    item.href = `./game.html?id=${encodeURIComponent(game.id)}`;
    item.innerHTML = `<img src="${game.thumbnail}" alt=""><strong>${escapeHtml(game.title)}</strong>`;
    favoriteList.appendChild(item);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

document.querySelectorAll(".platform-btn[data-platform]").forEach(btn => {
  btn.addEventListener("click", () => {
    platform = btn.dataset.platform;
    document.querySelectorAll(".platform-btn[data-platform]").forEach(b => b.classList.toggle("active", b === btn));
    render();
  });
});

search.addEventListener("input", render);
sort.addEventListener("change", render);

document.querySelector("#loginDemo").addEventListener("click", () => {
  const user = getDemoUser();
  if (user) {
    alert(`Connecté localement en tant que ${user.username}. Le vrai système de compte viendra avec le backend.`);
    return;
  }
  loginDialog.showModal();
});

loginDialog.querySelector("form").addEventListener("submit", event => {
  const username = document.querySelector("#demoUsername").value.trim();
  if (username) setDemoUser(username);
  event.currentTarget.close();
});

loadGames().catch(error => {
  grid.innerHTML = `<div class="empty-state">Erreur de chargement : ${escapeHtml(error.message)}</div>`;
});
