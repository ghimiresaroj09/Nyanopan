"use strict";

process.env.NODE_ENV = "production";

import("./releases/current/server.js").catch((error) => {
  console.error("[Nyanopan] Failed to start the active standalone release.", error);
  process.exit(1);
});
