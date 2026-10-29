// Concatenate every file in a folder tree into one bundle: top-level files first
// (numbered: 00-tokens.css, 01-fonts.css...), then sub-folders alphabetically.
// Each component/section owns its own CSS/JS file; nobody edits a shared index.
import fs from "node:fs";
import path from "node:path";

export function bundle(dir, ext) {
  const files = [];
  (function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(ext)) files.push(p);
    }
  })(dir);
  files.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length || a.localeCompare(b));
  return files.map((f) => `/* ${f.replaceAll(path.sep, "/")} */\n${fs.readFileSync(f, "utf8").trim()}\n`).join("\n");
}
