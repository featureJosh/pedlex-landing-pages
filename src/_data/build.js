// Cache-busting version for CSS/JS URLs and a timestamp shown on the QA hub.
const now = new Date();
export default {
  version: now.getTime().toString(36),
  timestamp: now.toISOString(),
  year: now.getFullYear(),
  commit: (process.env.GITHUB_SHA || "local").slice(0, 7),
};
