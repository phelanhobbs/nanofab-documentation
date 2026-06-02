const M = require("../meta");

module.exports = {
  filename: "ParalyneReader.pptx",
  repo: "NanofabToolkit",
  title: "ParalyneReader",
  build(d) {
    d.title_slide({
      kicker: "NANOFABTOOLKIT · TOOL",
      title: "ParalyneReader",
      subtitle: "Browse, download, and compare Parylene coater run data from your desk.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers ParalyneReader, the desktop app that pulls Parylene coater run data back off the server so you can look at it. " +
        "It's the desk-side counterpart to the coater's automatic uploads. No coding background needed. We'll cover what it does, where the " +
        "data comes from, the workflow, and a few practical notes.",
    });

    d.bullets({
      title: "Where the data comes from",
      bullets: [
        "The Parylene coater's Raspberry Pi streams analog readings up to the server during each run.",
        "The server stitches those streams into one CSV file per completed run.",
        "Those run files live in a folder on the server.",
        "ParalyneReader is the desktop app for browsing and downloading them.",
      ],
      notes:
        "Frame the pipeline. During every coating run, a Pi by the Parylene tool streams analog readings (pressure, vapor, temperature) up to " +
        "the server. The server combines those streams into one CSV per finished run and keeps them in a folder. ParalyneReader is what you " +
        "open at your desk to pull those files back out.",
    });

    d.steps({
      title: "A typical session",
      steps: [
        { h: "Open the app", d: "and ask the server what Parylene files are available." },
        { h: "Pick the runs you care about", d: "newest are listed first." },
        { h: "Download them", d: "in the background — the window stays responsive." },
        { h: "View the chart", d: "smooth, normalize, or time-align as needed." },
      ],
      notes:
        "Walk a typical session. The app fetches the list of Parylene runs from the server (newest first, with size and date). You select one " +
        "or more, click download, and the app fetches them in the background using worker threads so the UI doesn't freeze. The downloaded " +
        "data plots in the chart, where you can smooth, normalize, or align runs for comparison.",
    });

    d.bullets({
      title: "What it talks to (server side)",
      bullets: [
        "Two addresses on the cleanroom server, under /api/paralyne/analog/...",
        "'list' returns the available files with size and modified date.",
        "'download/<filename>' returns the bytes of one file.",
        "Same addresses documented in the flask server's sensor-API session.",
      ],
      notes:
        "Tie it to the server. ParalyneReader uses two of the sensor-API addresses we covered in the flaskserver sessions: list and download. " +
        "These exist exactly so desktop tools like this one can grab run files programmatically rather than someone having to SCP them. The " +
        "app is read-only — it never deletes or alters files on the server.",
    });

    d.bullets({
      title: "Background downloads keep the UI responsive",
      bullets: [
        "Each download runs in a worker thread (a thread pool).",
        "The window stays clickable while files come down.",
        "Large or slow downloads don't appear to freeze the app.",
        "A clean shutdown waits for any in-flight transfers.",
      ],
      notes:
        "Explain the responsiveness story. Naive download code would block the window until each file finishes — annoying on big files or " +
        "slow connections. ParalyneReader uses a thread pool so downloads happen in the background and the UI stays responsive. When you " +
        "close the app, the shutdown handler tells the thread pool to stop accepting new work and exits cleanly.",
    });

    d.bullets({
      title: "Smoothing, normalization, and time alignment",
      bullets: [
        "Smoothing helps you see trends through noisy analog signals.",
        "Normalization puts runs on the same scale for comparison.",
        "Time alignment lets you slide one run forward or back to overlay another.",
        "Useful when comparing the shape of two runs, not their absolute values.",
      ],
      notes:
        "Cover the analysis features. Analog signals can be noisy; smoothing reduces that noise so trends are visible. Normalization rescales " +
        "runs so they overlay cleanly even if absolute values differ. Time alignment is the same idea as in ALDPeakCounter — slide a run in " +
        "time so its features line up with another. The combination makes side-by-side comparison practical.",
    });

    d.bullets({
      title: "Diagnostics and logging",
      bullets: [
        "Every action is recorded in a log file under logs/paralyne_reader.log.",
        "Dependency check at startup tells you exactly what's missing if anything is.",
        "Shutdown is graceful: worker threads are stopped first.",
        "A startup error appears as a friendly message box, not a silent crash.",
      ],
      notes:
        "Operational details. The app keeps a log file so problems can be diagnosed after the fact. At startup it checks for required " +
        "libraries (tkinter, requests, matplotlib, numpy, scipy) and tells you what's missing if anything. Shutdown stops background workers " +
        "first. And startup failures show a clear dialog rather than vanishing without trace — useful when shipped to non-developers.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "Read-only with respect to the server.",
        "Connections are encrypted; certificate validation is currently off (internal cert).",
        "Downloads save next to the executable by default.",
        "Same data set the server's machines portal references for Parylene runs.",
      ],
      notes:
        "Practical notes. The app never modifies the server. Connections are encrypted, but with the internal certificate the app doesn't " +
        "verify the certificate chain — the developer notes flag this. Downloads currently land in the executable's folder; that's worth " +
        "knowing if you don't see your files. The runs you pull are the same ones the website's machines portal would link to for Parylene.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Browse → download → view Parylene runs from your desk.",
        "Server is the source of truth; the app is a viewer.",
        "Background downloads + smoothing + alignment make comparison easy.",
        "Read-only, encrypted, logging-friendly.",
      ],
      notes:
        "Wrap up. ParalyneReader is a focused desk-side tool: ask the server for runs, download what you want, and visualize/compare them " +
        "with sensible analysis options. It does one job well. Questions welcome.",
    });
  },
};
