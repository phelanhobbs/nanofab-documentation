const M = require("../meta");

module.exports = {
  filename: "11-Particle-Demo.pptx",
  title: "Particle Demo",
  build(d) {
    d.title_slide({
      kicker: "PART 11",
      title: "The Particle Demo Page",
      subtitle: M.series + "\nA small, standalone viewer for outreach and visitors.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "A deliberately short session. This is the smallest piece of the server: a tiny feature that serves one self-contained demo web page " +
        "(and its files) for the particle counter. It's a good example of how minimal a feature can be, and of a simpler file-safety check. " +
        "Use it as a palate cleanser between the heavier sessions.",
    });

    d.bullets({
      title: "What it is",
      bullets: [
        "A single self-contained demo page for the particle counter.",
        "Lives at its own address: /particle-demo.",
        "No login, no database — just serves files.",
        "Built for kiosks, visitor demos, and outreach.",
      ],
      notes:
        "Keep it simple. This feature exists to show off the particle counter to visitors. It serves one standalone HTML page and whatever " +
        "files that page needs. It doesn't log anyone in or touch a database — it just hands over files. It's perfect for a lobby kiosk or an " +
        "outreach event where there's no account to log into.",
    });

    d.bullets({
      title: "How it works",
      bullets: [
        "Visiting /particle-demo serves the main demo HTML page.",
        "Requests for other files under it serve those supporting files.",
        "The page itself fetches live data from the public sensor address.",
        "That's the entire feature — about thirty lines of code.",
      ],
      notes:
        "The whole thing is about thirty lines. Hitting the base address serves the main demo page; asking for any other file under that " +
        "address serves that supporting file (styles, scripts, images). The demo page, running in the browser, then pulls live particle data " +
        "from the public sensor endpoint we covered in Part 08. So it reuses the existing data pipeline and just adds a friendly front-end.",
    });

    d.steps({
      title: "Its small safety check",
      intro: "Even a tiny file server needs a guard.",
      steps: [
        { h: "Reject suspicious names", d: "anything containing '..' or starting with '/' is refused." },
        { h: "Otherwise serve the file", d: "if it exists in the demo folder." },
        { h: "Missing file → not found", d: "a clean 404 response." },
      ],
      notes:
        "Even this minimal feature guards against the same path-escape trick we saw in the machines session. Here the check is simpler: " +
        "reject any filename containing '..' or starting with a slash, since those are the building blocks of an escape attempt. Otherwise " +
        "serve the file if it's there, or return a clean 'not found.' It's a lighter check than the machines downloader, which is fine " +
        "because this folder has no shortcuts to exploit — match the guard to the risk.",
    });

    d.bullets({
      title: "Why it's separate",
      bullets: [
        "Keeps the demo's address stable and obvious (/particle-demo).",
        "Visually and logically separated from the main app.",
        "No login means visitors can use it without an account.",
        "Easy to retire or replace without touching anything else.",
      ],
      notes:
        "Why give this its own little corner instead of folding it in? A stable, obvious address; clean separation from the logged-in app; " +
        "and no-login access for visitors. It's also self-contained enough to retire or swap out later without disturbing the rest of the " +
        "system. Small, focused features like this are easy to reason about — a nice contrast to the inventory.",
    });

    d.twocol({
      title: "What it does — and deliberately doesn't",
      left: {
        heading: "Does",
        items: [
          "Serve one demo page and its files.",
          "Pull live data from the public sensor endpoint.",
          "Run with no account, anywhere.",
        ],
      },
      right: {
        heading: "Doesn't",
        items: [
          "Require a login.",
          "Touch any database.",
          "Expose anything sensitive.",
        ],
      },
      notes:
        "Frame the feature by its boundaries, which is the clearest way to understand something this small. It serves a page and reuses the " +
        "existing public sensor data; it does not log anyone in, touch a database, or expose anything private. Defining what a component " +
        "deliberately doesn't do is often as useful as listing what it does — it tells a maintainer exactly how far its responsibilities go.",
    });

    d.bullets({
      title: "A lesson in 'right-sized' code",
      bullets: [
        "Not every feature needs to be complex.",
        "This one is a tidy door to a static page — and that's all it should be.",
        "Small, focused pieces are easy to understand, test, and replace.",
        "Contrast with the inventory, which is large because its job is large.",
      ],
      notes:
        "Use this tiny feature to make a broader point about software. Good systems mix big and small parts, each sized to its job. The " +
        "inventory is large because chemical tracking is genuinely complex; the demo viewer is thirty lines because serving one page is " +
        "genuinely simple. Resisting the urge to over-engineer the small things is a sign of healthy code, and it makes the small things easy " +
        "to maintain or retire.",
    });

    d.bullets({
      title: "Static pages vs. dynamic pages",
      intro: "This page is mostly static — a useful contrast.",
      bullets: [
        "Dynamic page: the server builds it fresh each time (e.g. the tasks page).",
        "Static page: the server hands over a ready-made file unchanged.",
        "The demo is static HTML; the live data is fetched separately, in the browser.",
        "Static is simpler and faster when the content doesn't need server assembly.",
      ],
      notes:
        "Introduce a distinction that helps across the whole system. Most pages we've discussed are 'dynamic' — the server assembles them from " +
        "data every time. This demo is 'static' — a fixed file the server just hands over. The live numbers it shows are fetched separately by " +
        "the browser from the sensor endpoint. Static content is the simplest, fastest thing a server can do, and it's the right choice when " +
        "there's nothing to assemble.",
    });

    d.bullets({
      title: "It reuses the sensor pipeline",
      bullets: [
        "The demo doesn't have its own data source.",
        "It calls the same public particle-data endpoint from Part 08.",
        "So the live counts you see are the real cleanroom readings.",
        "One data pipeline, multiple front-ends.",
      ],
      notes:
        "Connect it back to the sensor session. The demo page has no special data of its own — it asks the same public particle-data endpoint " +
        "that everything else uses. That means the numbers on the demo are genuine, current cleanroom readings, not a canned demo. It's a nice " +
        "illustration that once you have a clean data endpoint, you can build many different displays on top of it.",
    });

    d.bullets({
      title: "Where to find and change it",
      bullets: [
        "The page and its files live in the app's templates area.",
        "Updating the demo is editing those files — no database or logic involved.",
        "The address (/particle-demo) stays stable for kiosks and links.",
        "Easy and safe for a non-developer to refresh the visuals.",
      ],
      notes:
        "Close with the practical 'how do I change it' note, since this is the one feature a non-developer might actually edit. The demo's " +
        "files live in the app's templates area; updating the look is just editing those files, with no database or server logic to worry " +
        "about. The web address stays constant so existing kiosks and links keep working. It's the safest place in the whole system to make a " +
        "change.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "A ~30-line feature that serves one demo page and its files.",
        "No login, no database; reuses the public sensor data.",
        "A simple, appropriate path-safety check.",
        "Cleanly separated so it's easy to maintain or remove.",
      ],
      notes:
        "Wrap up the shortest session. It shows that not every feature is complex — some are just a tidy door to a static page. Next session " +
        "looks at the programs on the other side of the sensor API: the Raspberry Pi firmware and the desktop apps that produce and consume " +
        "the data.",
    });
  },
};
