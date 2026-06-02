const M = require("../meta");

module.exports = {
  filename: "File-Transfer-Scripts.pptx",
  title: "File-Transfer Scripts",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "File-Transfer Scripts",
      subtitle: "The couriers that ship each machine's logs up to the server.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers the small Windows scripts that automatically copy machine log files from each tool's control PC up to the " +
        "server. They're the delivery service that makes machine data appear on the website. No coding background needed. We'll cover why " +
        "they exist, how they work, the difference between the modern and old versions, and how one is set up.",
    });

    d.bullets({
      title: "The problem they solve",
      bullets: [
        "Many tools write their logs to the Windows PC that runs the machine.",
        "Those files just sit there locally — the server can't see them.",
        "For the website to show a tool's data, the logs must get to the server.",
        "These scripts move them automatically, so no one has to remember.",
      ],
      notes:
        "Set up the why. Each cleanroom tool's control PC saves log files locally. The website can only show data the server has, so those " +
        "logs need to travel from the machine's PC up to the server. These scripts are the automated couriers that do exactly that, every day, " +
        "without anyone lifting a finger.",
    });

    d.table({
      title: "The files in this group",
      headers: ["File", "What it is"],
      rows: [
        ["FileTransferTemplate.ps1", "The master template — copy and customize per machine"],
        ["ALDTransfer.ps1", "Template filled in for the ALD tool"],
        ["Dent635Transfer.ps1", "Filled in for the Denton 635"],
        ["CTRFurnaceTransfer.ps1", "Filled in for the furnace controller"],
        ["CTRFurnaceTransfer.bat", "Older version for Windows XP furnace PCs"],
      ],
      colW: [4.2, 7.7],
      notes:
        "The roster. There's one template and several copies of it, each adjusted for a specific machine (different folder to watch, different " +
        "label on the server). The lone .bat file is an older-style version for furnace PCs still running Windows XP. They're all the same " +
        "idea with per-machine details swapped in.",
    });

    d.steps({
      title: "How each one works",
      steps: [
        { h: "Lock", d: "make sure only one copy runs at a time." },
        { h: "Find recent files", d: "look for logs changed in the last 24 hours." },
        { h: "Copy securely", d: "send each one to the server over an encrypted connection." },
        { h: "Repeat daily", d: "wait until midnight and do it again." },
      ],
      notes:
        "Walk the four steps. The script sets a lock so two copies can't run at once, finds files changed in the last day, securely copies each " +
        "to the server using PuTTY's pscp tool over SSH (an encrypted channel), then waits until midnight and repeats. Once set up, each " +
        "machine ships its latest logs every day, untended.",
    });

    d.bullets({
      title: "What 'secure copy over SSH' means",
      bullets: [
        "pscp is a small PuTTY tool for copying files over SSH.",
        "SSH is an encrypted connection — files aren't sent in the clear.",
        "Login uses a key file, not a typed password.",
        "Files land in a per-machine folder on the server.",
      ],
      notes:
        "Demystify the transfer. pscp is part of PuTTY, a common Windows tool; SSH is the standard encrypted way to reach another computer. " +
        "The script authenticates with a key file rather than a password, and drops each file into that machine's folder on the server. The " +
        "encryption means the logs travel safely across the network.",
    });

    d.twocol({
      title: "PowerShell vs. batch",
      left: {
        heading: "PowerShell (.ps1)",
        items: [
          "The modern Windows scripting language.",
          "The current versions.",
          "Loop on their own until midnight.",
        ],
      },
      right: {
        heading: "Batch (.bat)",
        items: [
          "The old Windows scripting style.",
          "For furnace PCs still on Windows XP.",
          "Run once; Windows' scheduler repeats them.",
        ],
      },
      notes:
        "Explain the two flavors. PowerShell is modern Windows scripting — the .ps1 files are current and loop on their own. The single .bat " +
        "file exists because some furnace control PCs still run Windows XP, which can't run modern PowerShell well; it does the same job in the " +
        "older language and relies on Windows' Task Scheduler to run it on a schedule. The developer notes actually recommend the scheduler " +
        "approach for all of them, as it's more reliable.",
    });

    d.bullets({
      title: "Setting one up (the big picture)",
      intro: "Copy the template and edit a few clearly-marked values:",
      bullets: [
        "The folder to watch (where that machine writes its logs).",
        "Where PuTTY's pscp tool lives on that PC.",
        "The key file used to log in to the server.",
        "The destination folder on the server.",
      ],
      notes:
        "Outline deployment without the full procedure. You copy the template and edit a handful of values near the top: which folder to " +
        "watch, where pscp is, which key to use, and where on the server the files go. Then it's set to run automatically. There's a separate " +
        "step-by-step setup guide in the repository for the exact commands.",
    });

    d.bullets({
      title: "Good to know (and a recommendation)",
      bullets: [
        "They only copy files — originals on the machine are never changed.",
        "Only files changed in the last 24h are sent, not the whole history.",
        "Each must be customized per machine.",
        "They log in with a personal account — remove that dependency via either an IT-issued service account OR a purpose-bound SSH key as 'phelan'.",
      ],
      notes:
        "Set expectations and flag the main recommendation. The scripts are read-and-copy only; they never alter or delete the originals. They " +
        "send just the last day's changes to avoid re-uploading everything. Each needs per-machine customization. The one real concern: they " +
        "authenticate with a personal CADE account, so if that account is ever disabled, every machine's uploads stop. There are two ways to " +
        "fix this. The cleanest is to ask University IT for a dedicated service account on nfhistory, but IT controls account creation so " +
        "that's a ticket, not a one-afternoon job. The Nanofab-side alternative is to generate a purpose-bound SSH key that authenticates " +
        "as the shared phelan server account, with command= restrictions in authorized_keys to limit what the key can do. Either fix " +
        "eliminates the personal-account dependency.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Automated couriers: each machine's logs → the server, daily.",
        "Securely copied over SSH with pscp; originals untouched.",
        "One template, customized per machine; a batch version for old PCs.",
        "Recommendation: remove personal-account dependency + use Task Scheduler.",
      ],
      notes:
        "Wrap up. These unattended scripts are how each machine's daily logs reach the server, where the website displays them. They're " +
        "simple, encrypted, and read-only. The two improvements worth making — remove the personal-account dependency (IT service account " +
        "or a purpose-bound shared-account key) and switch to the Windows Task Scheduler instead of self-loops — are in the developer " +
        "notes. Questions welcome.",
    });
  },
};
