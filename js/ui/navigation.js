import { uiSound } from "./sound.js";

export function bindButtonSounds(root = document) {
  root.querySelectorAll("button, .game-card, .platform-btn, .tab, .mini-item").forEach(el => {
    el.addEventListener("mouseenter", () => uiSound("hover"), { passive:true });
    el.addEventListener("click", () => uiSound("click"));
  });
}
