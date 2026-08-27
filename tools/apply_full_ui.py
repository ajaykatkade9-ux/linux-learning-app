from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
APP_DIR = PROJECT_ROOT / "app"
SKIP = {"index.html", "review-queue.html", "users-groups.html"}

HEAD_SNIPPET = """  <script>
    try {
      document.documentElement.dataset.theme =
        localStorage.getItem("linuxStudyTheme") || "light";
    } catch (error) {
      document.documentElement.dataset.theme = "light";
    }
  </script>
  <link rel="stylesheet" href="app-shell.css">
  <script defer src="app-shell.js"></script>
"""


def main() -> None:
    updated = []

    for page in sorted(APP_DIR.glob("*.html")):
        if page.name in SKIP:
            continue

        html = page.read_text(encoding="utf-8")
        if 'href="app-shell.css"' in html:
            continue
        if "</head>" not in html:
            raise SystemExit(f"Missing </head>: {page.name}")

        html = html.replace("</head>", HEAD_SNIPPET + "</head>", 1)
        page.write_text(html, encoding="utf-8")
        updated.append(page.name)

    print(f"Updated {len(updated)} pages")
    for name in updated:
        print(f"  {name}")


if __name__ == "__main__":
    main()
