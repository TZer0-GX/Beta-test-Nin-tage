const status = document.querySelector("#gamepadStatus");
let activeIndex = null;

function refresh() {
  if (!status || !navigator.getGamepads) return;
  const pads = [...navigator.getGamepads()].filter(Boolean);
  const pad = activeIndex !== null ? pads.find(p => p.index === activeIndex) || pads[0] : pads[0];

  if (pad) {
    activeIndex = pad.index;
    status.textContent = `MANETTE : ${pad.id.slice(0, 26)}`;
    status.title = `${pad.id} • ${pad.buttons.length} boutons`;
    status.style.background = "#65c46b";
  } else {
    status.textContent = "MANETTE : NON DÉTECTÉE";
    status.title = "Connecte une manette puis appuie sur un bouton.";
    status.style.background = "#b9b9b9";
  }
}

window.addEventListener("gamepadconnected", refresh);
window.addEventListener("gamepaddisconnected", refresh);
window.addEventListener("focus", refresh);
setInterval(refresh, 500);
refresh();

export { refresh };
