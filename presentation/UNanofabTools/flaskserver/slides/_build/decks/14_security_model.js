const M = require("../meta");

module.exports = {
  filename: "14-Security-Model.pptx",
  title: "Security Model",
  build(d) {
    d.title_slide({
      kicker: "PART 14",
      title: "The Security Picture",
      subtitle: M.series + "\nWhat's protected, how, and the honest trade-offs.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session consolidates everything security-related into one clear picture. We'll cover what's well-protected (the human login " +
        "path) and be candid about the deliberate gaps (the machine endpoints and the inventory). The goal is an honest, balanced view — " +
        "the kind you'd want before signing off on the system. Managers and anyone security-minded should see this one.",
    });

    d.bullets({
      title: "Six areas of security",
      bullets: [
        "Transport — encryption in transit.",
        "Authentication — proving who you are.",
        "Authorization — what you're allowed to do.",
        "Input handling — treating user input as suspicious.",
        "File safety — preventing downloads from escaping their folders.",
        "Known gaps — deliberate trade-offs for an internal tool.",
      ],
      notes:
        "Frame the session around six areas. The first five are where the system does well; the sixth is where it makes conscious " +
        "compromises. We'll go through each briefly. The overall message: the part real people use with passwords is solid; the machine-facing " +
        "and inventory parts trade some protection for convenience, justified by the private network.",
    });

    d.bullets({
      title: "Transport: encryption in transit",
      bullets: [
        "All outside traffic is HTTPS; nginx handles the encryption.",
        "The app itself only listens locally — never directly exposed.",
        "Devices encrypt but skip certificate validation (internal certificate).",
        "Acceptable on a private network; encrypted, just not verified.",
      ],
      notes:
        "Transport is strong. Everything from the outside is encrypted, and nginx — purpose-built for it — does the encryption while the app " +
        "hides on a local-only address. The one caveat is the devices skip certificate validation because the server uses an internal " +
        "certificate; their traffic is still encrypted, just not verified, which is fine inside the private lab network.",
    });

    d.bullets({
      title: "Authentication & authorization",
      bullets: [
        "Passwords stored only as irreversible bcrypt fingerprints.",
        "Two-factor (Duo) required in production for login and signup.",
        "Login cookie is signed (tamper-proof) and HTTPS-only in production.",
        "Permissions are two flags — admin and can-assign — enforced on the server.",
      ],
      notes:
        "This is the strongest area. Real passwords are never stored; only irreversible fingerprints. Two-factor via Duo is mandatory in " +
        "production. The login cookie is cryptographically signed so it can't be forged and is only sent over encryption in production. The " +
        "configured two-hour lifetime applies only to permanent sessions, and the current login flow does not mark sessions permanent. " +
        "Permissions are simple but enforced server-side, not just hidden in the page. For the human-facing app, this is a solid, conventional " +
        "security posture.",
    });

    d.bullets({
      title: "Input handling & file safety",
      bullets: [
        "Database queries keep user input strictly as data — injection-safe.",
        "Page templates auto-escape values, blunting cross-site scripting.",
        "Downloads use a resolve-then-verify check to stay inside their folder.",
        "Uploads are type-checked and given safe, unique filenames.",
      ],
      notes:
        "Two more solid areas. All database access treats typed-in values as data, never commands, which stops injection attacks — the most " +
        "common web vulnerability. The page templates automatically escape values, which blunts cross-site scripting. File downloads use the " +
        "proper resolve-then-verify path check from the machines session. Uploads are restricted by type and given safe, unique names. The " +
        "fundamentals are handled correctly.",
    });

    d.table({
      title: "The honest gaps",
      headers: ["Gap", "Why it exists / risk"],
      rows: [
        ["Inventory has no login", "Convenient kiosk reads, but edit/remove are open"],
        ["Device endpoints have no login", "Trusted via private network, not authentication"],
        ["Cross-origin access is wide open", "Broad by default; could be narrowed"],
        ["Password reset uses only the uNID", "No second factor on reset"],
      ],
      colW: [5.0, 6.9],
      notes:
        "Be transparent about the trade-offs. The chemical inventory pages, including editing and removing, currently require no login — fine " +
        "for a read-only kiosk, a real gap for the changing actions. The device endpoints have no login, relying on the private network " +
        "instead. Cross-origin access is broad by default. And password reset leans on the university ID without a second factor. None of " +
        "these are catastrophic for an internal tool on a trusted network, but they're the things to fix first if exposure ever increases. " +
        "All are itemized in the separate issues list with recommended fixes.",
    });

    d.bullets({
      title: "What to harden first",
      intro: "If asked 'what would you fix first?', this is the order.",
      bullets: [
        "Require login on the inventory's editing/removing pages.",
        "Add an access key (or similar) to the device endpoints if ever exposed.",
        "Narrow cross-origin access to the known internal tools.",
        "Add a second factor to the password-reset flow.",
      ],
      notes:
        "Give a concrete priority list. First and easiest with the biggest payoff: require login on the inventory pages that change data. " +
        "Then, only if the server's exposure ever grows, add a shared key to the device endpoints. Then narrow cross-origin access. Then " +
        "strengthen password reset with a second factor. This is the practical roadmap a successor would follow.",
    });

    d.steps({
      title: "Defense in depth, illustrated",
      intro: "An attacker has to beat several independent layers.",
      steps: [
        { h: "Reach the server", d: "blocked unless you can get onto the network / past nginx." },
        { h: "Get a password", d: "and even then it's only a fingerprint in the database." },
        { h: "Pass two-factor", d: "you'd also need the user's physical phone." },
        { h: "Forge a session", d: "the signed cookie rejects tampering." },
      ],
      notes:
        "Explain 'defense in depth' as a series of independent walls. To truly break in, an attacker would need to reach the server, then " +
        "obtain a password (which is only stored as a fingerprint), then pass two-factor (needing the user's phone), then somehow forge a " +
        "tamper-proof signed cookie. Each layer is independent, so one weakness isn't game over. This layered thinking is the right way to " +
        "judge security — not 'is there one perfect wall' but 'how many walls, and how independent.'",
    });

    d.bullets({
      title: "Privacy of stored data",
      bullets: [
        "Passwords: stored only as irreversible fingerprints.",
        "Sensor and machine data: operational readings, not personal data.",
        "Chemical inventory: who-did-what is logged for accountability.",
        "Secrets (keys, DB passwords) live in the settings file, not the code.",
      ],
      notes:
        "Address what data the system holds and how it's protected, since people will wonder. Passwords are only fingerprints. The bulk of the " +
        "data is operational — pressure, particle counts, chemical locations — not sensitive personal information. The inventory does log who " +
        "performed each action, which is for accountability. And the genuine secrets — signing keys, database passwords — live in the protected " +
        "settings file, never in the shared code. There's little here that would be damaging if read, with the secrets being the exception, " +
        "and those are guarded.",
    });

    d.bullets({
      title: "Putting the gaps in perspective",
      bullets: [
        "Context: an internal tool on a private university network.",
        "Not internet-facing; users are known staff and trusted devices.",
        "The gaps would be serious for a public site — here they're manageable risks.",
        "They're documented with fixes, so they're choices, not surprises.",
      ],
      notes:
        "Give the audience a fair way to weigh the gaps. This is an internal tool on a private network used by known staff and trusted devices, " +
        "not a public website handling strangers' data. The same gaps that would be alarming on a public site are manageable here. Crucially, " +
        "they're written down with recommended fixes — they're informed trade-offs, not things nobody noticed. That distinction matters: a " +
        "known, documented risk is very different from a hidden one.",
    });

    d.bullets({
      title: "The bottom line",
      bullets: [
        "The human login path is well-secured (bcrypt + Duo + hardened cookies + safe queries).",
        "The machine and inventory paths trade auth for convenience, leaning on the private network.",
        "That's a reasonable posture for an internal cleanroom tool.",
        "The three or four gaps are known, documented, and fixable.",
      ],
      notes:
        "End with a fair verdict. The part of the system real people log into is secured the way you'd expect a professional web app to be. " +
        "The machine-facing and inventory parts consciously trade authentication for convenience and rely on the network perimeter — a " +
        "defensible choice for an internal tool, with a short, known list of improvements if the threat model changes. Honesty here builds " +
        "trust with the audience. Next, the final session: a reference list of every address the server answers.",
    });
  },
};
