import { uiSound } from "./ui/sound.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");
const section = params.get("section") || "history";

const games = await fetch("./data/games.json").then(r => r.json());
const game = games.find(g => g.id === id) || games[0];

document.title = `Nin-tage // ${game.title} // Infos`;
document.querySelector("#gameTitle").textContent = game.title;
document.querySelector("#gamePlatform").textContent = game.platform.toUpperCase();
document.querySelector("#gameYear").textContent = game.year;
document.querySelector("#gameDescription").textContent = game.description;

const manual = document.querySelector("#manualFrame");
manual.src = game.manual;

if (section === "forum") {
  document.querySelector("#historyPanel").hidden = true;
  document.querySelector("#forumPanel").hidden = false;
}

document.querySelector("#commentForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#commentInput");
  const value = input.value.trim();
  if (!value) return;
  const article = document.createElement("article");
  article.className = "forum-post";
  article.innerHTML = `<b>Membre local</b><span>${escapeHtml(value)}</span>`;
  document.querySelector("#forumPosts").prepend(article);
  input.value = "";
  uiSound("click");
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}
