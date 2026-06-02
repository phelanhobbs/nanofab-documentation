const M = require("../meta");

module.exports = {
  filename: "04-Authentication-and-Login.pptx",
  title: "Authentication & Login",
  build(d) {
    d.title_slide({
      kicker: "PART 04",
      title: "Authentication & Login",
      subtitle: M.series + "\nHow a stranger becomes a logged-in user — safely.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers how logging in works: passwords, two-factor with Duo, sessions, signup, and password reset. " +
        "The audience should leave understanding that passwords are never stored in plain text, that a second factor (your phone) is " +
        "required in production, and roughly how the server remembers you're logged in. Keep it reassuring and concrete.",
    });

    d.steps({
      title: "What happens when you log in",
      intro: "The path from typing your password to landing on the tasks page.",
      steps: [
        { h: "Submit username + password", d: "the browser sends them over the encrypted connection." },
        { h: "Check the password", d: "compare against the stored scrambled version (never plain text)." },
        { h: "Two-factor (Duo)", d: "in production, a push goes to your phone; you tap approve." },
        { h: "Create a session", d: "the server records that you're logged in and sets a cookie." },
        { h: "Redirect to the app", d: "you land on the tasks page, now authenticated." },
      ],
      notes:
        "Walk the five steps. You submit your username and password over the encrypted connection. The server compares your password to a " +
        "stored scrambled version — it never keeps the real password. In production a Duo push then goes to your phone and you approve it. " +
        "Only then does the server create a 'session' (a record that you're logged in) and hand your browser a cookie that proves it. " +
        "Finally you're redirected into the app. If any step fails, you bounce back to the login page with a message.",
    });

    d.bullets({
      title: "Passwords are never stored",
      intro: "We store a scrambled fingerprint, not the password itself.",
      bullets: [
        "Passwords are run through bcrypt, a one-way scrambler — you can't reverse it.",
        "Logging in re-scrambles what you typed and compares the fingerprints.",
        "bcrypt is intentionally slow, which makes mass guessing impractical.",
        "Even if the database were stolen, the actual passwords aren't in it.",
      ],
      notes:
        "This is the most reassuring point for a general audience. We never store the password. We store a 'hash' — a scrambled fingerprint " +
        "produced by a tool called bcrypt that can't be run backwards. When you log in, the server scrambles what you typed and checks " +
        "whether the two fingerprints match. bcrypt is deliberately slow, so an attacker can't rapidly guess millions of passwords. The " +
        "upshot: if someone stole the user database, they'd get fingerprints, not passwords.",
    });

    d.bullets({
      title: "Two-factor authentication (Duo)",
      bullets: [
        "After the password checks out, the server asks Duo to push to your phone.",
        "You approve on the phone; only an explicit “allow” lets you in.",
        "Used for both logging in and creating a new account.",
        "Skipped only in development mode — never in production.",
      ],
      notes:
        "Two-factor means 'something you know' (password) plus 'something you have' (your phone). After the password is correct, the server " +
        "asks Duo to send a push; you must actively approve it. A denial, a timeout, or any error means no entry. Note it's also required at " +
        "signup, so you can't create an account for a university ID unless that ID's Duo device approves — a nice anti-impersonation check. " +
        "The only time 2FA is skipped is local development mode, which is why that mode must never run in production.",
    });

    d.bullets({
      title: "How the server remembers you",
      intro: "Two records keep you logged in.",
      bullets: [
        "A signed cookie in your browser carries your user ID (tamper-proof).",
        "A matching session record is stored on the server side.",
        "The configured two-hour lifetime is not enforced unless sessions are marked permanent.",
        "Logging out clears the cookie.",
      ],
      notes:
        "After login, the server needs to remember you across page loads. It does this two ways: a 'cookie' stored in your browser that " +
        "carries your user ID and is cryptographically signed so it can't be forged, and a matching record on the server. The app configures " +
        "a two-hour permanent-session lifetime, but the current login flow does not mark sessions permanent, so this is not a forced two-hour " +
        "logout. Logging out clears the cookie. For a general audience the key idea is just: the cookie proves you already logged in, and " +
        "it's tamper-proof.",
    });

    d.twocol({
      title: "Signup and password reset",
      left: {
        heading: "Signup",
        items: [
          "Provide username, password, and university ID (uNID).",
          "Rejected if the username already exists.",
          "Duo must approve before the account is created.",
        ],
      },
      right: {
        heading: "Password reset",
        items: [
          "Provide username + uNID to prove identity.",
          "If they match, set a new password.",
          "Note: reset relies on the uNID, with no Duo step.",
        ],
      },
      notes:
        "Signup collects a username, password, and the university ID (uNID), refuses duplicate usernames, and requires a Duo approval before " +
        "creating the account. Password reset is simpler: you prove who you are by supplying the username and matching uNID, then set a new " +
        "password. Be honest that the reset path leans on the uNID as the secret and doesn't add a Duo step — it's weaker than login, and " +
        "it's on the improvement list (covered in the security session).",
    });

    d.bullets({
      title: "Input is cleaned before use",
      bullets: [
        "Submitted text is trimmed, length-limited, and made safe for display.",
        "This blunts a class of attacks where input tries to become code.",
        "Database lookups use safe, parameterized queries (no string-splicing).",
      ],
      notes:
        "Briefly cover hygiene. Whatever you type is cleaned before the server uses it — trimmed of stray spaces, capped in length, and " +
        "made safe so it can't sneak in as executable code on a page. Separately, all database lookups use 'parameterized' queries, which " +
        "keep user input strictly as data, never as commands — that's the standard defense against injection attacks. The audience doesn't " +
        "need the mechanics; the message is 'user input is treated as suspicious and handled carefully.'",
    });

    d.code({
      title: "Password fingerprints, illustrated",
      intro: "The same password always scrambles to the same fingerprint — but you can't go backwards:",
      code:
"  \"correct horse\"  ──scramble──►  $2b$12$Xk9...   (stored)\n" +
"\n" +
"  Login attempt:\n" +
"  \"correct horse\"  ──scramble──►  $2b$12$Xk9...   ✓ match\n" +
"  \"wrong guess\"    ──scramble──►  $2b$12$Qp3...   ✗ no match",
      caption: "The server compares fingerprints, never the passwords themselves.",
      notes:
        "Make hashing concrete. A password is run through a one-way scrambler that always produces the same fingerprint for the same input, " +
        "but cannot be run backwards to recover the password. At login, the server scrambles what you typed and checks whether the fingerprints " +
        "match. The real password is never stored or compared directly. The strange-looking stored value even embeds the scrambling settings, " +
        "which is how the check knows how to reproduce it.",
    });

    d.bullets({
      title: "Why two factors beat one",
      intro: "Something you know, plus something you have.",
      bullets: [
        "A password alone can be guessed, phished, or reused from another breach.",
        "Adding 'something you have' (your phone) blocks attackers who only have the password.",
        "Even a stolen password is useless without the physical device to approve.",
        "This is why production refuses to skip the Duo step.",
      ],
      notes:
        "Explain the value of two-factor in plain terms. Passwords leak — through guessing, phishing, or reuse across sites. A second factor " +
        "tied to a physical thing you carry (your phone) means a stolen password isn't enough; the attacker would also need your device to " +
        "approve the push. That's a huge jump in protection for minimal user effort, which is why production never skips it.",
    });

    d.bullets({
      title: "If the database were ever stolen",
      intro: "A useful thought experiment.",
      bullets: [
        "The thief gets password fingerprints, not passwords.",
        "Reversing bcrypt fingerprints is impractically slow and expensive.",
        "Accounts are still protected by the second factor (the phone).",
        "Lesson: layers — hashing AND two-factor — limit the damage.",
      ],
      notes:
        "Walk the worst-case scenario because it reassures non-technical stakeholders. If someone stole the user database, they'd get " +
        "fingerprints, not passwords, and those fingerprints are deliberately expensive to crack. On top of that, two-factor means even a " +
        "cracked password can't log in without the user's phone. This is 'defense in depth' — multiple independent layers so one failure isn't " +
        "a total breach.",
    });

    d.steps({
      title: "The login cookie, step by step",
      steps: [
        { h: "Server signs your user ID", d: "and places it in a cookie in your browser." },
        { h: "Browser sends it back", d: "automatically, on every later request." },
        { h: "Server verifies the signature", d: "so a tampered or forged cookie is rejected." },
        { h: "No forced two-hour cutoff", d: "the configured lifetime needs permanent sessions, which login does not set." },
      ],
      notes:
        "Demystify cookies, which sound vaguely sinister to many people. After login the server puts your user ID into a cookie and signs it " +
        "cryptographically. Your browser automatically returns that cookie on every subsequent request, which is how the server knows it's " +
        "still you without re-asking for your password. Because it's signed, anyone editing or forging the cookie gets rejected. The code has " +
        "a two-hour lifetime setting, but it is not active for the current non-permanent login sessions. It's a tamper-proof 'I already logged " +
        "in' wristband, nothing more.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Passwords are stored only as irreversible fingerprints (bcrypt).",
        "Two-factor via Duo is mandatory in production.",
        "A signed cookie plus a server record keep you logged in; there is no enforced two-hour logout today.",
        "Signup needs Duo; reset relies on the uNID (a known weak spot).",
      ],
      notes:
        "Summarize the trust story: real passwords are never kept, a phone-based second factor is required, and being 'logged in' is a " +
        "tamper-proof cookie backed by a server record. The configured two-hour lifetime is not enforced until sessions are marked permanent. " +
        "Flag the one soft spot — password reset — as something the security session revisits. Next up: the Admin Panel, which controls who " +
        "has elevated permissions.",
    });
  },
};
