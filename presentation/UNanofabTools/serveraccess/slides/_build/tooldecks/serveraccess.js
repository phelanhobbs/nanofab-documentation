const M = require("../meta");

module.exports = {
  filename: "Server-Access.pptx",
  title: "Accessing the Server",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "Accessing the Server",
      subtitle:
        "How to log in to nfhistory — the two-hop route through CADE,\n" +
        "and how to operate the long-running tmux sessions safely.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers the unusual login pattern the cleanroom server requires: you can't reach it directly. You first SSH into a CADE " +
        "lab machine, then SSH from there into the server. Once you're on the server, the website and the data downloader each live inside a " +
        "tmux session that you must never accidentally exit. We'll go through the user procedure, the admin's onboarding job, and what to do " +
        "if a session gets killed. No prior SSH experience required.",
    });

    d.bullets({
      title: "Why two hops?",
      bullets: [
        "The server lives on a private College of Engineering network.",
        "It is not reachable from outside that network — including your laptop.",
        "CADE lab machines ARE on that network, so they serve as a stepping stone.",
        "This pattern is called a 'jump host' or 'bastion'.",
      ],
      notes:
        "Set up the why. The server is intentionally not on the public internet. CADE — the College of Engineering's lab computer pool — sits " +
        "on a network that can talk to it, so we use a CADE machine as a middle hop. Industry calls this a jump host. Once you understand that " +
        "framing, the rest of the procedure follows naturally.",
    });

    d.stats({
      title: "The CADE pool",
      intro: "Any one of these is fine — they're identical and share your home directory.",
      stats: [
        { big: "40", label: "lab1-1 through lab1-40\n(.eng.utah.edu)" },
        { big: "35", label: "lab2-1 through lab2-35\n(.eng.utah.edu)" },
        { big: "75", label: "machines total\npick any one" },
      ],
      notes:
        "Reassure the audience that they don't have to memorize a particular machine. CADE is a pool of 75 interchangeable Linux boxes. They " +
        "share your home directory over NFS, which means once you put your SSH config on any one of them, it's there on all of them. If lab1-10 " +
        "is slow, hop into lab1-11. The number doesn't matter.",
    });

    d.bullets({
      title: "What you need before your first login",
      bullets: [
        "A CADE account — sign up at usertools.eng.utah.edu.",
        "A CADE SSH key (~/.ssh/CADE on your laptop).",
        "An nfhistory SSH key — issued by the cleanroom admin.",
        "Your CADE username (for hop 1). Note: the server username is always 'phelan'.",
      ],
      notes:
        "These are one-time prerequisites. CADE accounts are self-service via the usertools portal. Your CADE key is a small file that proves " +
        "you're you; you generate it on your laptop and upload the public half to CADE. The nfhistory key — the second key, for the second hop " +
        "— is generated and delivered to you by the cleanroom admin. The most important point: your CADE username is yours, but the username " +
        "you use on the server is always 'phelan'. That's a shared cleanroom account, not your name. People trip over this constantly.",
    });

    d.code({
      title: "Hop 1 — laptop to CADE",
      intro: "From a terminal on your laptop:",
      code:
        "ssh -i ~/.ssh/CADE  <your-CADE-username>@lab1-10.eng.utah.edu\n" +
        "\n" +
        "        │           │\n" +
        "        │           └── replace with your CADE username\n" +
        "        └── use the CADE key at this path\n" +
        "\n" +
        "# lab1-10 may be replaced by any of:\n" +
        "#   lab1-1 … lab1-40\n" +
        "#   lab2-1 … lab2-35\n",
      caption: "On success you're at a Linux prompt on the CADE machine.",
      notes:
        "Walk through the command piece by piece. ssh is the secure-shell tool. -i tells it which key file to use. Your CADE username goes " +
        "before the @, the CADE machine after. After this completes you're remotely logged into the CADE box — every command you type now runs " +
        "there, not on your laptop. Cosmetically nothing dramatic changes; just a different prompt.",
    });

    d.code({
      title: "Hop 2 — CADE to nfhistory",
      intro: "Once you're on CADE, just three words:",
      code:
        "ssh nfhistory\n" +
        "\n" +
        "# This works because of this file on CADE: ~/.ssh/config\n" +
        "Host nfhistory\n" +
        "  Hostname    155.98.11.8\n" +
        "  User        phelan\n" +
        "  IdentityFile ~/.ssh/nfhistory\n",
      caption: "The 'phelan' user is fixed — every user authenticates as the same shared account.",
      notes:
        "Hop 2 is shockingly short — three words — because the heavy lifting is in the config file. That file lives at ~/.ssh/config on the " +
        "CADE machine; you write it once and forget it. Walk through each line: Host is the nickname, Hostname is the actual IP, User is the " +
        "fixed shared account name 'phelan', IdentityFile is where the second key lives. Emphasize that User MUST be phelan — that's not your " +
        "name, that's the cleanroom server's shared account.",
    });

    d.steps({
      title: "Recap of the login flow",
      steps: [
        { h: "Open terminal", d: "on your laptop." },
        { h: "Hop 1", d: "ssh -i ~/.ssh/CADE <you>@lab1-X.eng.utah.edu" },
        { h: "Hop 2", d: "ssh nfhistory  (uses the config file on CADE)" },
        { h: "You're on the server", d: "as the shared 'phelan' account." },
      ],
      notes:
        "Reinforce the shape of the procedure. Four steps. Two ssh commands. After this completes you're at a Linux prompt on the cleanroom " +
        "server, where the two long-running services live. The audience should be able to recite this in their sleep after a few logins.",
    });

    d.table({
      title: "On the server: two tmux sessions",
      headers: ["Session name", "What runs in it"],
      rows: [
        ["flaskserver", "The website — the Flask app behind nfhistory.nanofab.utah.edu"],
        ["downloader", "HSCDownloader — pulls per-machine data from CORES, writes HSCDATA CSVs"],
      ],
      colW: [3.2, 8.7],
      notes:
        "Introduce tmux at a high level: it's a 'saved terminal' — a window with a program running in it that keeps going even when nobody's " +
        "logged in. The cleanroom server uses exactly two of them. The website is the one users see; the downloader is the data pipeline that " +
        "keeps the website's machine pages fresh. Both must stay alive 24/7. **Update (2026-06-18):** these two services now run under " +
        "user-level systemd (systemctl --user, auto-restart on failure, linger), so they survive crashes and reboots on their own. The tmux " +
        "sessions remain a convenient way to watch live console output, and the detach hygiene below still matters for clean inspection — " +
        "though an accidental exit no longer takes the website down the way it used to.",
    });

    d.code({
      title: "Looking at a session (attaching)",
      intro: "From the server prompt:",
      code:
        "tmux ls                       # list all sessions\n" +
        "tmux attach -t flaskserver    # look at the website's console\n" +
        "tmux attach -t downloader     # look at the downloader's console\n",
      caption: "Attaching shows you the live output. It does NOT restart anything.",
      notes:
        "Demonstrate the routine inspection commands. tmux ls confirms both sessions are alive — if either is missing the program isn't " +
        "running. tmux attach drops you into the live console of one of them, so you can read recent log output. Attaching is read-mostly: it " +
        "doesn't disturb the process inside.",
    });

    d.bullets({
      title: "★ Leaving WITHOUT killing the program ★",
      intro: "This is the single most important slide. Read it twice.",
      bullets: [
        "Press Ctrl-b, release, then press d.",
        "That's the tmux 'detach' shortcut: it leaves the session running.",
        "DO NOT type 'exit' — that ends the program inside the session.",
        "DO NOT press Ctrl-c — that also ends the program.",
      ],
      notes:
        "Hammer this. The single most common mistake is to attach to a session, read what they wanted, then close the terminal or type exit. " +
        "Either kills the program. The correct way out is to detach: Ctrl-b is tmux's 'prefix' (a signal that the next key is meant for tmux), " +
        "and d is the detach command. Type them as two separate keystrokes. After detaching you're back at the plain server shell; the program " +
        "is still running. From there, exit twice walks you back out of the server and then out of CADE — that's fine.",
    });

    d.steps({
      title: "The safe inspection ritual",
      steps: [
        { h: "Attach", d: "tmux attach -t flaskserver" },
        { h: "Look", d: "Scroll, read the recent output." },
        { h: "Detach", d: "Ctrl-b then d  — you're back at the server prompt." },
        { h: "Walk away", d: "exit, exit — closes the SSH chain. Sessions stay alive." },
      ],
      notes:
        "Synthesize the previous slides into a memorable four-step ritual. Attach. Look. Detach with Ctrl-b d. Then walk away — exiting the " +
        "outer shells is fine; only typing exit INSIDE the session is the problem. If a user can do these four steps every time, they will " +
        "never bring the website down by accident.",
    });

    d.code({
      title: "Recovery: re-create flaskserver",
      intro: "If 'tmux attach -t flaskserver' says no session, the website is down. Bring it back:",
      code:
        "tmux new -s flaskserver\n" +
        "cd ~/server/UNanofabTools\n" +
        "source venv/bin/activate\n" +
        "python run.py\n" +
        "\n" +
        "# then detach with Ctrl-b d\n",
      caption: "Verify by loading nfhistory.nanofab.utah.edu in a browser.",
      notes:
        "If a session is gone — accidental exit, server reboot — recovery is mechanical. Open a new tmux session named after the program, " +
        "change into its folder, activate the Python virtual environment, run the script. Then DETACH (don't forget). Confirm the website " +
        "responds. If the deployment was migrated to gunicorn for production, substitute that command — the runbook in the developer docs has " +
        "the exact form. The SHAPE — new tmux session, cd, activate, run, detach — never changes.",
    });

    d.code({
      title: "Recovery: re-create downloader",
      intro: "Same idea for the data downloader:",
      code:
        "tmux new -s downloader\n" +
        "cd ~/server/UNanofabTools\n" +
        "source venv/bin/activate\n" +
        "python3 HSCDownloader.py\n" +
        "\n" +
        "# then detach with Ctrl-b d\n",
      caption: "Verify by watching fresh CSVs appear in ~/server/UNanofabTools/HSCDATA.",
      notes:
        "Identical pattern for the downloader. New tmux session named downloader, cd into the shared UNanofabTools install, activate venv, run the " +
        "script, detach. Confirmation is that fresh CSV files start landing in ~/server/UNanofabTools/HSCDATA on the next scheduled cycle. Bring the downloader up " +
        "before the website if both are down — fresh data should exist before the site serves it.",
    });

    d.twocol({
      title: "Who does what (Nanofab side)",
      left: {
        heading: "User",
        items: [
          "Sign up for CADE (usertools.eng.utah.edu).",
          "Generate your own CADE key.",
          "Receive nfhistory key from admin.",
          "Place ~/.ssh/config on CADE.",
          "Attach, look, detach with Ctrl-b d.",
        ],
      },
      right: {
        heading: "Nanofab admin (sudo, not root)",
        items: [
          "Generate nfhistory key pair per user.",
          "Install public half in /home/phelan/.ssh/authorized_keys.",
          "Deliver private half + config block securely.",
          "Recreate killed sessions per the runbook.",
          "Remove keys when a user separates.",
        ],
      },
      notes:
        "Split the Nanofab-side responsibilities. The user handles their own CADE side — account, key, config file. The Nanofab admin " +
        "handles the cleanroom side — generating per-user nfhistory keys, installing them under the shared phelan account, and being the " +
        "on-call for recovering killed sessions. Offboarding is just deleting the user's line from authorized_keys, because everyone shares " +
        "the same UNIX account. CRUCIAL: the Nanofab admin has sudo as phelan but NOT root. Anything requiring root — see next slide.",
    });

    d.twocol({
      title: "What goes through IT instead",
      left: {
        heading: "Nanofab admin CAN'T do",
        items: [
          "Create new UNIX accounts on nfhistory.",
          "Modify anything under /root/.",
          "Operate the VM-level backup.",
          "Apply unattended OS-level patches.",
          "Rebuild the VM from scratch.",
        ],
      },
      right: {
        heading: "Ask University IT instead",
        items: [
          "Per-person UNIX accounts → IT ticket.",
          "Tighten /root/.ssh/authorized_keys mode → IT ticket.",
          "Confirm backup scope + restore → IT ticket.",
          "Configure auto-patching on the VM → IT ticket.",
          "Restore from backup after a loss → IT ticket.",
        ],
      },
      notes:
        "Boundary slide. University IT owns the VM, root, the backup pipeline, and base patching. The Nanofab team has sudo as phelan but " +
        "cannot create UNIX users and cannot modify /root/. So the access docs say everyone shares the phelan account not because that's a " +
        "design choice — it's the structural reality of the IT/Nanofab boundary. Anything that requires root is an IT ticket. iceolate is " +
        "IT's admin host; the root SSH key in /root/.ssh/authorized_keys belongs to IT and shouldn't be touched.",
    });

    d.bullets({
      title: "Common confusions (and quick fixes)",
      bullets: [
        "'My CADE name vs server name' — server user is ALWAYS 'phelan'. Not yours.",
        "'Which lab1-X?' — any of them. They're identical.",
        "'Closed my laptop, the site went down' — you didn't detach. Use Ctrl-b d.",
        "'ssh nfhistory' said host not found — you have to be on CADE first.",
        "'Permission denied' on hop 2 — key not at the IdentityFile path, or User isn't phelan.",
      ],
      notes:
        "Anticipate the recurring questions. The username confusion comes up every time. The lab1 number doesn't matter. Closed-laptop = " +
        "didn't-detach is the canonical 'oops, I broke the site' scenario. ssh nfhistory only works after hop 1 — it's defined in the CADE " +
        "config, not your laptop's. Permission denied almost always means the key file isn't at the path the config points at, or the User " +
        "line isn't phelan.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Two hops: laptop → CADE → nfhistory.",
        "Server account is shared as 'phelan' — not your name.",
        "Two tmux sessions: flaskserver (website), downloader (data ETL).",
        "Detach with Ctrl-b d. Never exit. Never Ctrl-c.",
        "If a session is gone, recreate it with tmux new + cd + venv + run + detach.",
      ],
      notes:
        "Wrap up. Two hops to reach the server. Phelan is the shared account name. Two tmux sessions hold the only two services. The single " +
        "rule that prevents almost all outages: detach with Ctrl-b d; never type exit or Ctrl-c inside the session. Recovery is mechanical when " +
        "it happens. Questions welcome.",
    });
  },
};
