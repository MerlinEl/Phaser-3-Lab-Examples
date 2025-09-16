// src/env.js
function isLocalHost() {
  return (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.protocol === "file:"
  );
}

// Expose to global (ať je vidět ve všech scénách)
window.isLocalHost = isLocalHost;