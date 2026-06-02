const M = require("../meta");

module.exports = {
  filename: "ALDPeakCounter.pptx",
  repo: "NanofabToolkit",
  title: "ALDPeakCounter",
  build(d) {
    d.title_slide({
      kicker: "NANOFABTOOLKIT · TOOL",
      title: "ALDPeakCounter",
      subtitle: "Count cycles in an ALD run and compare runs side by side.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers ALDPeakCounter — a desktop app that counts and visualizes pressure peaks in ALD log files. Each peak corresponds " +
        "to a deposition cycle, so counting them is one way to count cycles. We'll cover what it does, the four detection knobs, the time " +
        "alignment feature for comparing runs, and the chart interactions. No coding background needed.",
    });

    d.bullets({
      title: "What it does, in one breath",
      bullets: [
        "Opens one or more pressure-vs-time data files.",
        "Detects peaks (= deposition cycles) in each.",
        "Plots them together, each file in its own color, peaks marked.",
        "Lets you shift files in time to overlay and compare them.",
      ],
      notes:
        "Set the scope. The app loads ALD pressure log files, finds the peaks (each peak is roughly one deposition cycle), and overlays the " +
        "curves with peaks marked. The standout feature: per-file time sliders so two runs that started at different moments can be aligned " +
        "for visual comparison. It's a focused, single-purpose tool.",
    });

    d.steps({
      title: "How a session goes",
      steps: [
        { h: "Add files", d: "pick one or several text data files." },
        { h: "Tune parameters (optional)", d: "set what counts as a peak." },
        { h: "Process Files", d: "the app counts and plots; totals appear in the results panel." },
        { h: "Align in time (optional)", d: "use per-file sliders to overlay runs." },
        { h: "Zoom in", d: "click-and-drag a box on the chart; Reset Zoom to return." },
      ],
      notes:
        "Walk a typical session. Open files, tweak parameters if needed, click Process Files, optionally use the per-file time-offset sliders " +
        "to line runs up, and box-zoom on the chart. The results panel lists each file's peak count and the times of the detected peaks.",
    });

    d.table({
      title: "The four detection parameters",
      headers: ["Parameter", "What it means"],
      rows: [
        ["Min Height", "Peaks must reach at least this pressure (0 = ignore)"],
        ["Prominence (default 0.01)", "How much a peak must stand out from its surroundings"],
        ["Min Distance (default 10)", "Minimum samples between peaks — avoids noise being counted"],
        ["Min Width", "Peaks must be at least this wide (0 = ignore)"],
      ],
      colW: [3.6, 8.3],
      notes:
        "Cover the knobs. Min Height ignores peaks below a pressure threshold. Prominence is how much a bump stands out from the curve around " +
        "it — the default of 0.01 is usually a good starting point. Min Distance is in samples (not seconds) and stops the detector from " +
        "calling every wiggle a peak. Min Width filters out anything too narrow. Tighten to count fewer peaks; loosen to catch more.",
    });

    d.bullets({
      title: "Time alignment, the secret weapon",
      bullets: [
        "Each loaded file gets its own row of controls.",
        "Slider (-50 to +50) or type a number; Apply commits, Zero resets that file.",
        "Reset All Offsets zeros everything at once.",
        "Purely visual — the underlying files are never changed.",
      ],
      notes:
        "Emphasize the time alignment, the feature that sets this app apart. After processing, each file has a row with a slider and a number " +
        "box. Slide or type to shift that file forward or backward in time, click Apply, and the chart redraws. Zero clears just that file; " +
        "Reset All clears everyone. This is purely a display offset — the files on disk aren't modified. Great for comparing two runs that " +
        "started at different moments.",
    });

    d.code({
      title: "What an input file looks like",
      intro: "Plain text, header row, tab-separated; first two columns are time and pressure:",
      code:
"  time    pressure   (other columns ignored)\n" +
"  0.0     1.2e-2\n" +
"  0.5     1.5e-2\n" +
"  1.0     2.0e-2\n" +
"  1.5     1.8e-2\n" +
"  ...",
      caption: "Non-numeric rows are skipped; everything else is just data.",
      notes:
        "Show the expected file shape so people know what to feed in. A header row, then tab-separated columns: the first is time, the second " +
        "is pressure. Anything else in the file is ignored. Non-numeric rows are skipped without complaint. If the app reports zero peaks on " +
        "a file that should have many, this format is the first thing to check.",
    });

    d.bullets({
      title: "Chart interactions",
      bullets: [
        "Each file plotted in its own color, with a unique marker shape for peaks.",
        "Legend shows the filename, peak count, and any time offset.",
        "Click and drag a box on the chart to zoom in.",
        "Reset Zoom returns to the full view.",
      ],
      notes:
        "Cover the chart UX. Files get distinct colors and marker shapes so you can tell them apart. The legend lists each file's name, peak " +
        "count, and any applied time offset. To zoom, click and drag a rectangle; Reset Zoom returns to the full view. It's straightforward " +
        "and doesn't require menu diving.",
    });

    d.bullets({
      title: "About the peak detector",
      bullets: [
        "Uses a standard, well-tested algorithm (SciPy's find_peaks).",
        "Adds a small extra rule to catch a peak right at the end of a run.",
        "The detector is the same code used by UNanofabTools' peakCount.py.",
        "Returns peak count, peak times, and peak pressures — shown in the results panel.",
      ],
      notes:
        "Reassure on the math. The detector is SciPy's well-trusted find_peaks, with a tailored extra rule for the end of a run (since " +
        "boundary peaks are easy to miss). The same code is used by the command-line peakCount in UNanofabTools — this GUI is the friendly " +
        "wrapper. For each file you get the count, the times, and the pressures at each peak.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "Read-only: never changes the source files.",
        "Runs locally; no network connection needed.",
        "If startup fails, a windowed error dialog shows full diagnostics.",
        "Packaged as a Windows executable via PyInstaller for non-developer users.",
      ],
      notes:
        "Practical points. The app only reads files, never modifies them. It runs entirely on your computer with no network. On any startup " +
        "error it pops up a detailed, copyable dialog — handy when shipped to a non-developer. It's packaged as a single Windows executable " +
        "by PyInstaller so users don't need Python installed.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "A focused desktop tool for counting ALD cycles and comparing runs.",
        "Four detection knobs let you tune sensitivity.",
        "Per-file time alignment overlays runs without altering files.",
        "Same detection logic as UNanofabTools' peakCount.py.",
      ],
      notes:
        "Wrap up. ALDPeakCounter is a small, focused, well-bounded tool: count cycles, compare runs visually, with one really useful feature " +
        "(time alignment) and a clean chart UI. Questions welcome.",
    });
  },
};
