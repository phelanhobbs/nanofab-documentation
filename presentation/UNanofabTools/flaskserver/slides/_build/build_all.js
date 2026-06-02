const fs = require("fs");
const path = require("path");
const { Deck } = require("./deckkit");
const M = require("./meta");

const OUT = process.env.OUT || path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });

// Optional filter: `node build_all.js 01` builds only modules whose file starts with 01
const filter = process.argv[2];

const dir = path.join(__dirname, "decks");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort();

(async () => {
  for (const f of files) {
    if (filter && !f.startsWith(filter)) continue;
    const mod = require(path.join(dir, f));
    const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter });
    mod.build(d);
    const outPath = path.join(OUT, mod.filename);
    await d.save(outPath);
    console.log("wrote", mod.filename, "(" + d.n + " slides)");
  }
  console.log("done →", OUT);
})();
