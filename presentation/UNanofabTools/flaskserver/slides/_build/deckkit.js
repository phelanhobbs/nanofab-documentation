/* deckkit.js — reusable PptxGenJS builder for the UNanofabTools layperson decks.
 * Light University of Utah palette (crimson on white), clean/minimal, with
 * speaker (reader's) notes on every slide. LAYOUT_WIDE = 13.33" x 7.5".
 */
const pptxgen = require("pptxgenjs");

// ---- Palette ----
const C = {
  crimson: "CC0000",     // U of U primary
  crimsonDk: "9A0000",   // darker crimson for bands/title
  ink: "1A1A1A",         // near-black body text
  gray: "595959",        // muted text
  grayLt: "8A8A8A",      // captions
  panel: "F2F2F2",       // light panel / code box background
  panelLine: "DDDDDD",   // panel border
  codeInk: "222222",     // code text
  white: "FFFFFF",
};

const FONT_H = "Georgia";     // headers — has personality, professional
const FONT_B = "Calibri";     // body
const FONT_M = "Consolas";    // monospace for code

const PW = 13.33, PH = 7.5;   // page size (LAYOUT_WIDE)
const MX = 0.7;               // left/right margin
const CONTENT_W = PW - MX * 2;

function makeShadow() {
  return { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.12 };
}

class Deck {
  constructor({ title, subtitle, author }) {
    const p = new pptxgen();
    p.layout = "LAYOUT_WIDE";
    p.author = author || "Faith";
    p.title = title;
    this.p = p;
    this.shortTitle = title;
    this.n = 0;
  }

  // crimson footer band + slide number; consistent motif on content slides
  _footer(slide) {
    slide.addShape(this.p.shapes.RECTANGLE, {
      x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type: "none" },
    });
    slide.addText("UNanofabTools — Server Explained", {
      x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0,
      fontFace: FONT_B, fontSize: 9, color: C.white, align: "left", valign: "middle",
    });
    slide.addText(String(this.n), {
      x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0,
      fontFace: FONT_B, fontSize: 9, color: C.white, align: "right", valign: "middle",
    });
  }

  // small crimson square motif + title at top of content slides
  _header(slide, title) {
    slide.addShape(this.p.shapes.RECTANGLE, {
      x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type: "none" },
    });
    slide.addText(title, {
      x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0,
      fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align: "left", valign: "middle",
    });
  }

  _content(title) {
    this.n += 1;
    const slide = this.p.addSlide();
    slide.background = { color: C.white };
    this._header(slide, title);
    this._footer(slide);
    return slide;
  }

  _notes(slide, notes) {
    if (notes) slide.addNotes(notes);
  }

  // ---------- TITLE SLIDE ----------
  title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) {
    this.n += 1;
    const slide = this.p.addSlide();
    slide.background = { color: C.white };
    // left crimson band motif
    slide.addShape(this.p.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type: "none" },
    });
    // kicker (topic number / series)
    slide.addText(kicker || "", {
      x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0,
      fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align: "left",
    });
    // main title
    slide.addText(title, {
      x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0,
      fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align: "left", valign: "top",
    });
    // subtitle
    slide.addText(subtitle || "", {
      x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0,
      fontFace: FONT_B, fontSize: 17, color: C.gray, align: "left", valign: "top",
    });
    // presenter block
    const block = [
      { text: presenter || "Faith", options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } },
    ];
    if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } });
    if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } });
    if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } });
    slide.addText(block, {
      x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align: "left", valign: "top",
      lineSpacingMultiple: 1.15,
    });
    this._notes(slide, notes);
    return slide;
  }

  // ---------- SECTION DIVIDER ----------
  section_slide({ label, title, notes }) {
    this.n += 1;
    const slide = this.p.addSlide();
    slide.background = { color: C.crimsonDk };
    slide.addText(label || "", {
      x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0,
      fontFace: FONT_B, fontSize: 14, bold: true, color: "F2C9C9", charSpacing: 2,
    });
    slide.addText(title, {
      x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0,
      fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign: "top",
    });
    this._notes(slide, notes);
    return slide;
  }

  // ---------- BULLETS ----------
  bullets({ title, intro, bullets, notes }) {
    const slide = this._content(title);
    let y = 1.4;
    if (intro) {
      slide.addText(intro, {
        x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0,
        fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign: "top",
      });
      y += 0.7;
    }
    const items = bullets.map((b, i) => {
      if (typeof b === "string") {
        return { text: b, options: { bullet: { code: "2022", indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } };
      }
      // {t, sub:true}
      return { text: b.t, options: { bullet: { code: "2013", indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } };
    });
    slide.addText(items, {
      x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0,
      fontFace: FONT_B, valign: "top",
    });
    this._notes(slide, notes);
    return slide;
  }

  // ---------- CODE / MONO CALLOUT ----------
  code({ title, intro, code, caption, notes }) {
    const slide = this._content(title);
    let y = 1.4;
    if (intro) {
      slide.addText(intro, {
        x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0,
        fontFace: FONT_B, fontSize: 15, color: C.ink, valign: "top",
      });
      y += 0.65;
    }
    const boxH = PH - y - (caption ? 1.0 : 0.6);
    slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06,
      fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(),
    });
    slide.addText(code, {
      x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0,
      fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align: "left", valign: "top",
    });
    if (caption) {
      slide.addText(caption, {
        x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0,
        fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign: "top",
      });
    }
    this._notes(slide, notes);
    return slide;
  }

  // ---------- TWO COLUMN ----------
  twocol({ title, left, right, notes }) {
    const slide = this._content(title);
    const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6;
    const colX = [MX, MX + colW + 0.5];
    [left, right].forEach((col, idx) => {
      const x = colX[idx];
      // header chip
      slide.addText(col.heading, {
        x, y, w: colW, h: 0.45, margin: 0,
        fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign: "middle",
      });
      const items = col.items.map((b) => ({
        text: typeof b === "string" ? b : b.t,
        options: { bullet: { code: "2022", indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true },
      }));
      slide.addText(items, {
        x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign: "top",
      });
    });
    this._notes(slide, notes);
    return slide;
  }

  // ---------- TABLE ----------
  table({ title, intro, headers, rows, colW, notes }) {
    const slide = this._content(title);
    let y = 1.4;
    if (intro) {
      slide.addText(intro, {
        x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0,
        fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign: "top",
      });
      y += 0.55;
    }
    const head = headers.map((htext) => ({
      text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign: "middle" },
    }));
    const body = rows.map((r, ri) =>
      r.map((cell) => ({
        text: String(cell),
        options: {
          fill: { color: ri % 2 === 0 ? C.white : C.panel },
          color: C.ink, fontSize: 11.5, valign: "middle",
        },
      }))
    );
    slide.addTable([head, ...body], {
      x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined,
      border: { type: "solid", pt: 0.5, color: C.panelLine },
      align: "left", valign: "middle", fontFace: FONT_B,
      rowH: 0.3, autoPage: false,
    });
    this._notes(slide, notes);
    return slide;
  }

  // ---------- NUMBERED STEPS / PROCESS ----------
  steps({ title, intro, steps, notes }) {
    const slide = this._content(title);
    let y = 1.4;
    if (intro) {
      slide.addText(intro, {
        x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0,
        fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign: "top",
      });
      y += 0.6;
    }
    const n = steps.length;
    const avail = PH - y - 0.6;
    const rowH = Math.min(0.95, avail / n);
    steps.forEach((s, i) => {
      const ry = y + i * rowH;
      // number circle
      slide.addShape(this.p.shapes.OVAL, {
        x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type: "none" },
      });
      slide.addText(String(i + 1), {
        x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0,
        fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle",
      });
      const parts = [{ text: s.h + "  ", options: { bold: true, color: C.ink, fontSize: 14 } }];
      if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } });
      slide.addText(parts, {
        x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0,
        fontFace: FONT_B, valign: "middle",
      });
    });
    this._notes(slide, notes);
    return slide;
  }

  // ---------- BIG STAT CALLOUTS (grid of numbers) ----------
  stats({ title, intro, stats, notes }) {
    const slide = this._content(title);
    let y = 1.5;
    if (intro) {
      slide.addText(intro, {
        x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0,
        fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign: "top",
      });
      y += 0.7;
    }
    const n = stats.length;
    const gap = 0.4;
    const cardW = (CONTENT_W - gap * (n - 1)) / n;
    const cardH = 2.4;
    stats.forEach((s, i) => {
      const x = MX + i * (cardW + gap);
      slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, {
        x, y, w: cardW, h: cardH, rectRadius: 0.08,
        fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(),
      });
      slide.addText(s.big, {
        x, y: y + 0.3, w: cardW, h: 1.1, margin: 0,
        fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align: "center", valign: "middle",
      });
      slide.addText(s.label, {
        x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0,
        fontFace: FONT_B, fontSize: 13, color: C.ink, align: "center", valign: "top",
      });
    });
    this._notes(slide, notes);
    return slide;
  }

  async save(absPath) {
    await this.p.writeFile({ fileName: absPath });
    return absPath;
  }
}

module.exports = { Deck, C };
