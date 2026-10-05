const PREFIX = "nintage:";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function isFavorite(gameId) {
  return read("favorites", []).includes(gameId);
}

export function toggleFavorite(gameId) {
  const favorites = read("favorites", []);
  const next = favorites.includes(gameId)
    ? favorites.filter(id => id !== gameId)
    : [...favorites, gameId];
  write("favorites", next);
  return next.includes(gameId);
}

export function getFavorites() {
  return read("favorites", []);
}

export function getRating(gameId) {
  return read("ratings", {})[gameId] ?? null;
}

export function setRating(gameId, rating) {
  const ratings = read("ratings", {});
  ratings[gameId] = rating;
  write("ratings", ratings);
}

export function getDemoUser() {
  return read("demoUser", null);
}

export function setDemoUser(username) {
  write("demoUser", { username });
}
