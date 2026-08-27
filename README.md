# Linux Learning App

A free, browser-based Linux and DevOps study app built for learning, revision,
hands-on practice, interview preparation, and production troubleshooting.

The app is completely static and does not require an account, backend, paid API,
or package installation. Study data stays in the browser through `localStorage`.

## Highlights

- 22 Linux learning modules from foundations to container internals
- 440 revision exercises: recall, interview, scenario, and hands-on prompts
- Offline Linux Assistant backed by 645 course sections and 55 curated official references
- Production-style labs, troubleshooting flows, and interview answers
- Topic progress, daily streaks, spaced repetition, notes, and backup/restore
- Responsive light and dark interface
- Free and open source under the MIT License

## Run locally

Clone the repository using the URL shown by GitHub's **Code** button, then run:

```bash
cd linux-learning-app
python3 -m http.server 8081 --directory app
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

No Python libraries are required; Python is used only as a small static file server.

## Run with Docker

```bash
docker build -t linux-learning-app .
docker run --rm -p 8081:80 linux-learning-app
```

Then open [http://localhost:8081](http://localhost:8081).

## GitHub Pages

The included workflow deploys the `app/` directory to GitHub Pages whenever the
`main` branch is updated. In the repository, open **Settings → Pages** and select
**GitHub Actions** as the publishing source.

The public site will use this format:

```text
https://YOUR-GITHUB-USERNAME.github.io/linux-learning-app/
```

## Study data and privacy

Progress, revision history, notes, theme preference, and streak data are stored
only in the current browser. The app sends no personal data to a server. Use the
**Backup & Restore** page before clearing browser storage or changing devices.

## Project structure

```text
app/                         Static website
tools/build_linux_knowledge.py
                             Rebuilds the assistant's local lesson index
.github/workflows/pages.yml  GitHub Pages deployment
Dockerfile                   Nginx production container
```

## Rebuild the offline assistant index

After changing course content, regenerate the lesson index from the repository root:

```bash
python3 tools/build_linux_knowledge.py
```

## Contributing

Bug reports, documentation fixes, new labs, and carefully reviewed Linux content
are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Do not commit API keys, passwords, private keys, exported browser data, or `.env`
files. See [SECURITY.md](SECURITY.md) for responsible reporting guidance.

## License

Licensed under the [MIT License](LICENSE). You may use, copy, modify, and share the
project subject to the license terms.
