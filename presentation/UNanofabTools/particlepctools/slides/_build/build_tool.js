// Build a single tool deck: node build_tool.js tooldecks/dattools.js
const path = require("path");
const fs = require("fs");
const { Deck } = require("./deckkit");
const M = require("./meta");

const modPath = process.argv[2];
if (!modPath) { console.error("usage: node build_tool.js tooldecks/<name>.js"); process.exit(1); }
const OUT = process.env.OUT || path.join(__dirname, "out_tools");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const mod = require(path.join(__dirname, modPath));
  const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer: "UNanofabTools — " + mod.title });
  mod.build(d);
  const outPath = path.join(OUT, mod.filename);
  await d.save(outPath);
  console.log("wrote", mod.filename, "(" + d.n + " slides) →", outPath);
})();
