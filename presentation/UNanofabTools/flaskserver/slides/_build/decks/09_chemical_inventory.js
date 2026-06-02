const M = require("../meta");

module.exports = {
  filename: "09-Chemical-Inventory.pptx",
  title: "Chemical Inventory",
  build(d) {
    d.title_slide({
      kicker: "PART 09",
      title: "The Chemical Inventory",
      subtitle: M.series + "\nThe largest feature: barcodes, containers, scans, and reports.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This is the biggest feature in the system, so it's the longest session. It tracks every chemical container in the lab: what's in it, " +
        "where it is, who owns it, when it expires, and a full history of every action. We'll cover the core idea (items vs. containers), the " +
        "main pages, barcodes, scanning audits, reporting, and the audit trail. Managers and safety staff will care most about this one.",
    });

    d.bullets({
      title: "What it tracks",
      bullets: [
        "Every physical container (bottle) in the lab, by barcode.",
        "What chemical it holds, the vendor, and the size.",
        "Where it lives: room, storage location, sub-location, device.",
        "Dates: received, manufactured, expiry, and NMR checks.",
        "Owner, notes, and status (active or removed).",
      ],
      notes:
        "Set the scope. Every bottle gets a barcode and a record covering what it is, who made it, how big it is, exactly where it's stored, " +
        "the relevant dates, who owns it, and whether it's still active. This is the kind of tracking that supports safety audits and " +
        "expiry management. It's substantial because real chemical management is detailed.",
    });

    d.bullets({
      title: "The key idea: items vs. containers",
      intro: "Separate the chemical from the bottle.",
      bullets: [
        "An item is a chemical product — e.g. 'Acetone, ACS grade.'",
        "A container is one physical bottle of that item.",
        "One item can have many containers (seventeen bottles of acetone = one item, 17 containers).",
        "Containers also link to a vendor and a room.",
      ],
      notes:
        "This is the single most important concept. The system distinguishes the chemical product (the 'item') from the physical bottle (the " +
        "'container'). 'Acetone, ACS grade' is one item; the seventeen bottles of it on the shelves are seventeen containers. This avoids " +
        "duplicating the chemical's details on every bottle and makes counts and reports clean. Each container also points to who supplied it " +
        "and which room it's in.",
    });

    d.code({
      title: "How the pieces relate",
      intro: "A simplified map of the data:",
      code:
"  categories ─┐\n" +
"  vendors ────┼─►  items  ──►  containers  ──►  rooms\n" +
"                              (one bottle)\n" +
"                                   │\n" +
"                                   ▼\n" +
"                            container_scans  ──►  inventory_cycles\n" +
"                            (was seen during)     (a scan / audit)",
      caption: "Items hold many containers; each container lives in a room and appears in scans.",
      notes:
        "Walk the map slowly. Items belong to a category and a vendor and contain many containers. Each container lives in a room. When " +
        "someone does an inventory audit, they create a 'cycle' and scan barcodes; each successful scan becomes a record linking that bottle " +
        "to that audit. So the structure mirrors reality: products contain bottles, bottles sit in rooms, and audits record which bottles " +
        "were seen when.",
    });

    d.bullets({
      title: "What you can do with it",
      bullets: [
        "Search and browse the inventory; export it to a spreadsheet.",
        "Add containers (and auto-generate their barcodes).",
        "Move containers to new locations — one at a time or in bulk.",
        "Remove containers (a soft delete that keeps the history).",
        "Edit a container's details.",
        "Upload barcode scans from an audit; print barcode labels.",
      ],
      notes:
        "The everyday actions. You can search the whole inventory and export it. You can add new bottles, which automatically get unique " +
        "barcodes. You can move bottles between locations individually or in bulk. You can remove bottles — but as a 'soft delete' that keeps " +
        "the record for history. You can edit details. And you can run scanning audits and print labels. That's a full lifecycle for a " +
        "chemical container.",
    });

    d.bullets({
      title: "Barcodes from a counter",
      bullets: [
        "New containers get the next number from a database counter (starts at 100001).",
        "The counter guarantees uniqueness even if two people add bottles at once.",
        "Labels print in sheets of thirty (5 across, 6 down).",
        "A queue tracks which barcodes still need printing.",
      ],
      notes:
        "Barcodes are simple and robust. The database has a 'sequence' — an ever-incrementing counter starting at 100001 — and each new " +
        "container takes the next number. Because the database hands out numbers atomically, two people adding bottles simultaneously can't " +
        "collide. Labels print thirty to a page for a label printer, and a queue tracks which ones haven't been printed yet so nothing gets " +
        "missed.",
    });

    d.steps({
      title: "Inventory scans (audits)",
      intro: "How a walk-around inventory check is recorded.",
      steps: [
        { h: "Start a cycle", d: "an audit gets its own ID and metadata (who, where, when)." },
        { h: "Upload the scanned barcodes", d: "paste them or upload a file from the scanner." },
        { h: "Match each barcode", d: "found ones are linked to the audit and stamped 'last seen now.'" },
        { h: "Tally results", d: "the audit records how many matched and how many didn't." },
      ],
      notes:
        "Explain audits. Periodically staff walk around scanning barcodes. They start a 'cycle' (the audit), then upload the list of scanned " +
        "codes — pasted in or from a file. The server matches each code to a known container, links the matches to the audit, and updates " +
        "each matched bottle's 'last seen' time. It records how many scans matched and how many didn't (an unknown or mistyped label). Later, " +
        "a coverage report shows which active bottles were and weren't seen — i.e., what might be missing.",
    });

    d.bullets({
      title: "Reports and the audit trail",
      bullets: [
        "Reports: totals, expiring soon, already expired, NMR due, and counts by room/vendor/system/owner.",
        "Scan coverage: which active containers were seen vs. unseen.",
        "Every add, move, edit, remove, and scan is logged in a transactions record.",
        "The transactions page is a searchable history of who did what.",
      ],
      notes:
        "Two things safety folks love. First, the reports: how many containers, what's expiring in the next month, what's already expired, " +
        "what's due for an NMR check, and breakdowns by room, vendor, system, and owner. Second, the audit trail: every single action — add, " +
        "move, edit, remove, scan upload — is recorded with who did it and when, and there's a searchable page to review it. Accountability " +
        "is built in.",
    });

    d.bullets({
      title: "Soft delete: nothing really vanishes",
      bullets: [
        "Removing a container marks it 'REMOVED' instead of erasing it.",
        "Removed items drop out of normal views but stay in the records.",
        "The removal reason and notes are kept.",
        "This preserves history for audits and reports.",
      ],
      notes:
        "Emphasize this for compliance. 'Remove' doesn't delete the record — it flags the container as removed, with a reason and notes. It " +
        "disappears from the everyday inventory view but remains in the data and the audit trail. For a lab that may need to prove what it " +
        "had and when, never truly deleting is exactly the right behavior.",
    });

    d.bullets({
      title: "Built to be safe and consistent",
      bullets: [
        "Multi-step actions are wrapped so they fully succeed or fully undo — no half-changes.",
        "All database queries keep user input strictly as data (injection-safe).",
        "It runs on PostgreSQL, a heavier database than the rest of the system uses.",
      ],
      notes:
        "Two reliability notes. Complex actions — like adding a product, its bottles, and their history together — are wrapped in a " +
        "'transaction' so they either complete entirely or roll back entirely; you never get half-written data if something fails midway. " +
        "And every query treats typed-in values strictly as data, never as commands, which prevents injection attacks. This module runs on " +
        "PostgreSQL because it needs those stronger guarantees and more advanced features than the simple databases provide.",
    });

    d.twocol({
      title: "Two honest notes for maintainers",
      left: {
        heading: "Type-ahead is a stub",
        items: [
          "The 'suggest' and 'auto-fill' helpers return nothing yet.",
          "So those convenience features are effectively off.",
          "On the to-fix list.",
        ],
      },
      right: {
        heading: "Access is open",
        items: [
          "The inventory pages don't currently require login.",
          "Fine for reading at a kiosk; risky for the edit/remove pages.",
          "Recommended to gate the changing actions behind login.",
        ],
      },
      notes:
        "Two candid maintenance notes, kept off the main story but recorded for whoever maintains this. First, the type-ahead and " +
        "auto-fill helpers are unfinished stubs that return nothing, so those niceties don't work yet. Second — more important — the " +
        "inventory pages currently don't require login, including the pages that change or remove data. That's convenient for a read-only " +
        "kiosk but a real gap for the editing actions; the recommendation is to require login on at least the changing pages. Both items are " +
        "in the separate issues list.",
    });

    d.steps({
      title: "Adding bottles, step by step",
      steps: [
        { h: "Enter the details", d: "chemical, vendor, size, location, dates, owner, quantity." },
        { h: "Reuse or create the chemical", d: "match an existing item by name, or add it." },
        { h: "Generate barcodes", d: "one unique number per bottle from the counter." },
        { h: "Record each bottle + its history", d: "all in one all-or-nothing save." },
      ],
      notes:
        "Detail the add flow because it shows several concepts together. You enter the chemical and location details and a quantity. The " +
        "system reuses the chemical's 'item' record if it already exists (matching by name) or creates it. It then pulls a fresh barcode for " +
        "each bottle and writes the containers plus their history entries — all wrapped so it either fully succeeds or fully undoes. You're " +
        "then sent straight to the label-printing queue for the new barcodes.",
    });

    d.bullets({
      title: "Search that actually finds things",
      bullets: [
        "One search box matches across many fields at once.",
        "Name, catalog number, vendor, barcode, lot, owner, system, location, room, notes.",
        "Case-insensitive and partial — type a fragment, get matches.",
        "Removed bottles are hidden unless you ask to include them.",
      ],
      notes:
        "Highlight the search because it's what people use daily. A single box searches across roughly a dozen fields simultaneously — name, " +
        "catalog number, vendor, barcode, lot, owner, system, storage location, room, and notes — case-insensitive and partial, so a fragment " +
        "is enough. By default it hides removed bottles, with an option to include them. It's broad on purpose: you rarely remember which field " +
        "your search term lives in.",
    });

    d.table({
      title: "The reports menu",
      headers: ["Report", "Answers"],
      rows: [
        ["Totals", "How many containers and distinct chemicals"],
        ["Expiring soon", "What expires within 30 days"],
        ["Expired", "What's already past expiry"],
        ["NMR due", "What needs an NMR check soon"],
        ["By room / vendor / system / owner", "Counts grouped each way"],
        ["Scan coverage", "Which active bottles were seen vs. unseen"],
      ],
      colW: [4.6, 7.3],
      notes:
        "Enumerate the reports because this is what makes the inventory valuable to safety and management. At a glance: overall counts, what's " +
        "expiring within a month, what's already expired, what's due for an NMR check, breakdowns by room, vendor, system, and owner, and scan " +
        "coverage showing what an audit did and didn't find. Each is a single click. This is the payoff of all the structured tracking.",
    });

    d.bullets({
      title: "Moving bottles, one or many",
      bullets: [
        "Move one bottle: scan its barcode, pick the new location.",
        "Bulk move: paste many barcodes, send them all to one destination.",
        "Only the fields you fill in change; blanks leave the old value alone.",
        "Every move is logged with from-and-to detail.",
      ],
      notes:
        "Cover relocation since bottles move constantly. You can move a single bottle by scanning it and choosing a destination, or paste a " +
        "whole list of barcodes to move them together. A nice touch: only the location fields you actually fill in get changed; anything left " +
        "blank keeps its current value, so a partial move doesn't wipe details. And like everything here, each move is recorded in the audit " +
        "trail with both the old and new location.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Separate items (chemicals) from containers (bottles).",
        "Barcodes from a counter; labels print in sheets.",
        "Audits link scanned bottles to a cycle and flag what's unseen.",
        "Soft delete plus a full transactions log keep complete history.",
      ],
      notes:
        "Summarize the biggest feature: a complete chemical-container lifecycle built on the item/container distinction, with barcodes, " +
        "scanning audits, rich reports, and an unerasable audit trail. Next session zooms into the databases themselves — the tables behind " +
        "this and the rest of the system.",
    });
  },
};
