const M = require("../meta");

module.exports = {
  filename: "05-Admin-Panel.pptx",
  title: "Admin Panel",
  build(d) {
    d.title_slide({
      kicker: "PART 05",
      title: "The Admin Panel",
      subtitle: M.series + "\nA small, well-guarded tool for managing users.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "A short session. The admin panel is a tiny feature: view users, delete a user, and toggle two permissions. The interesting part " +
        "isn't the size — it's how access is guarded with layered checks. Keep it brief and use it to reinforce the permission model.",
    });

    d.bullets({
      title: "What the admin panel does",
      bullets: [
        "Lists every user account.",
        "Deletes a user.",
        "Toggles a user's admin status on or off.",
        "Toggles a user's ability to create/assign tasks.",
      ],
      notes:
        "Four actions, that's the whole feature. View the user list, remove a user, and flip two yes/no switches per user: 'is an admin' and " +
        "'can assign tasks.' There's no complicated roles system — just these two permission flags, which keeps the model simple to reason " +
        "about.",
    });

    d.bullets({
      title: "The permission model is just two switches",
      intro: "Authorization here is deliberately minimal.",
      bullets: [
        "is_admin — can reach the admin panel and manage users.",
        "can_assign — can create and assign tasks to people.",
        "Everyone logged in can do the everyday things; these two unlock extras.",
        "No per-item permissions — simplicity over granularity.",
      ],
      notes:
        "Reinforce the model from the auth session. Every account carries two true/false flags. 'is_admin' unlocks the admin panel. " +
        "'can_assign' unlocks task creation. Everything else is available to any logged-in user. There is no fine-grained, per-resource " +
        "permission system — a conscious trade of granularity for simplicity, appropriate for a small internal tool with trusted staff.",
    });

    d.steps({
      title: "Two locks on every admin action",
      intro: "Each admin route is guarded twice, in order.",
      steps: [
        { h: "Are you logged in?", d: "if not, you're sent to the login page first." },
        { h: "Are you an admin?", d: "if not, you're bounced back with a 'no permission' message." },
        { h: "Only then", d: "the requested action runs." },
      ],
      notes:
        "This is the takeaway slide. Every admin action passes two gates in sequence: first 'are you logged in at all?' and only then 'are " +
        "you specifically an admin?' The order matters — anonymous visitors are turned away before the admin check even looks at them. This " +
        "'stacked guard' pattern is how the code expresses 'logged in AND admin' cleanly.",
    });

    d.bullets({
      title: "The server enforces the rules — not the buttons",
      bullets: [
        "The web page hides admin buttons from non-admins.",
        "But hiding a button isn't security — anyone could try the action directly.",
        "So the server independently re-checks permission on every action.",
        "Rule of thumb: never trust the browser to police itself.",
      ],
      notes:
        "An important security principle, told simply. The page hides admin buttons from people who shouldn't see them — but that's just " +
        "convenience, not protection, because a determined person could try the underlying action directly. So the server checks permission " +
        "again on its own, every time. The general lesson, which recurs across the system: the front end is for friendliness; the server is " +
        "for enforcement.",
    });

    d.bullets({
      title: "How the buttons talk to the server",
      bullets: [
        "Admin actions are sent as small background messages (no full page reload).",
        "Each message carries the target user's ID.",
        "The server does the change and replies with a simple success/failure.",
        "The page updates the row based on the reply.",
      ],
      notes:
        "Lightly cover the mechanics. When an admin clicks delete or a toggle, the page sends a small background message identifying which " +
        "user to act on, the server makes the change and replies with success or failure, and the page updates that row in place — no full " +
        "reload. Nothing exotic; just a clean split where the page handles presentation and the server handles the actual change and the " +
        "permission check.",
    });

    d.code({
      title: "What 'two locks' looks like in code",
      intro: "Each admin page is wrapped by two guards, in order:",
      code:
"  @login_required     # 1. must be logged in\n" +
"  @admin_required     # 2. must be an admin\n" +
"  def admin_panel():\n" +
"      ... show the user list ...",
      caption: "Read top-down: logged-in check first, admin check second, then the action.",
      notes:
        "Show the layered guards without requiring code fluency. The two lines above the function are 'decorators' — wrappers that run before " +
        "the function. The first checks you're logged in; the second checks you're an admin. They run in that order, so an anonymous visitor is " +
        "turned away before the admin check even looks. Only if both pass does the actual page run. This is exactly how the code expresses " +
        "'logged in AND admin.'",
    });

    d.table({
      title: "The two permission flags",
      headers: ["Flag", "Unlocks", "Set by"],
      rows: [
        ["is_admin", "The admin panel; managing users", "Another admin"],
        ["can_assign", "Creating and assigning tasks", "An admin"],
      ],
      colW: [2.8, 5.6, 3.5],
      notes:
        "Lay out the whole authorization model in one small table. There are exactly two switches per user. 'is_admin' unlocks user management; " +
        "'can_assign' unlocks task creation. Both are set by an existing admin. Everything else is available to any logged-in user. This is the " +
        "entire permission system — deliberately minimal, which makes it easy to reason about and hard to misconfigure.",
    });

    d.bullets({
      title: "Bootstrapping the first admin",
      bullets: [
        "There's no built-in 'first admin' account.",
        "The first admin is set by editing the user record directly in the database.",
        "After that, admins can promote others from the panel.",
        "A maintenance detail worth knowing for a fresh install.",
      ],
      notes:
        "A practical note mainly for a future maintainer. Since admin status is granted by an existing admin, a brand-new system has a " +
        "chicken-and-egg problem: there's no admin yet. The fix is to set the very first admin by editing that user's record directly in the " +
        "database one time. After that, the panel handles everything. Mention it so nobody is stuck on a fresh deployment.",
    });

    d.bullets({
      title: "Removing a user — what it does",
      bullets: [
        "Deletes the account so they can no longer log in.",
        "Past task assignments recorded by name remain as plain text.",
        "There's no 'undo' from the panel — it's a real delete.",
        "Use deliberately; for temporary cases, you might just remove permissions instead.",
      ],
      notes:
        "Set expectations around delete, which is the one destructive admin action. It removes the login account. Note that anywhere their name " +
        "was recorded — like on past tasks — that text remains, since it's stored as a name, not a live link. There's no undo button, so it's a " +
        "considered action. For someone who's only leaving temporarily, removing their permissions may be a gentler choice than deleting the " +
        "account outright.",
    });

    d.bullets({
      title: "Good admin hygiene",
      bullets: [
        "Least privilege: grant admin and can-assign only to those who need them.",
        "Review the user list periodically; remove stale accounts.",
        "Remember admin actions are powerful and currently aren't separately logged.",
        "When in doubt, grant the narrower permission.",
      ],
      notes:
        "Offer practical guidance for whoever holds admin. Follow 'least privilege' — hand out admin and assign rights sparingly, since every " +
        "extra holder is extra risk. Periodically review the user list and clear out accounts that should be gone. Be aware that, unlike the " +
        "chemical inventory, admin actions here aren't written to a separate audit log, so discipline matters. Defaulting to the narrower " +
        "permission is the safe habit.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Small feature: list, delete, and two permission toggles.",
        "Two flags model all authorization: is_admin and can_assign.",
        "Every admin action is double-guarded: logged in, then admin.",
        "The server enforces permissions regardless of what the page shows.",
      ],
      notes:
        "Wrap up. The admin panel is small but it cleanly demonstrates the whole permission philosophy: two simple flags, layered guards, " +
        "and server-side enforcement. Next session moves to the Tasks feature — the everyday to-do list that 'can_assign' unlocks.",
    });
  },
};
