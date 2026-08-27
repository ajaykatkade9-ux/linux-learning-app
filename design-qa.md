# Design QA — Today's Study

- Source visual: user screenshot of the updated Linux Hands-On Labs screen.
- Target viewport: desktop, approximately 1920 × 1080.
- Implementation: `app/today.html` with the shared `app-shell.css` and `app-shell.js`.
- Static checks: HTML parsed, JavaScript syntax passed, CSS braces balanced, local links resolved, HTTP 200.
- Visual comparison: waiting for a rendered screenshot from the user's installed localhost app.

final result: blocked

The current environment cannot capture the user's localhost browser. Re-run visual comparison after the user installs the patch and supplies a screenshot of `today.html`.
