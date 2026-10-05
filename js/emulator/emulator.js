const EJS_DATA_PATH = "https://cdn.emulatorjs.org/stable/data/";

export function startEmulator(game, mount = "#emulator") {
  const host = document.querySelector(mount);
  if (!host) return;

  if (!game.romUrl) {
    showMessage(host, "Aucune ROM configurée", "Ajoute romUrl dans data/games.json.");
    return;
  }

  const globals = {
    EJS_player: "#game",
    EJS_core: game.platform === "gameboy" ? "gb" : "nes",
    EJS_gameUrl: game.romUrl,
    EJS_gameName: game.title,
    EJS_pathtodata: EJS_DATA_PATH,
    EJS_startOnLoaded: true,
    EJS_controlScheme: game.platform === "gameboy" ? "gb" : "nes",
    EJS_screenCapture: {
      saveState: true,
      loadState: true,
      quickSave: true,
      quickLoad: true,
      gamepad: true,
      volume: true,
      fullscreen: true
    }
  };

  Object.assign(window, globals);

  host.classList.add("emulator-ready");
  host.innerHTML = `<div id="game"></div>`;

  const script = document.createElement("script");
  script.src = `${EJS_DATA_PATH}loader.js`;
  script.async = true;
  script.onerror = () => showMessage(host, "Échec du chargement de l'émulateur", "Vérifie la connexion réseau ou héberge EmulatorJS localement.");
  document.body.appendChild(script);
}

function showMessage(host, title, detail) {
  host.innerHTML = `
    <div class="emulator-placeholder">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(detail)}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}
