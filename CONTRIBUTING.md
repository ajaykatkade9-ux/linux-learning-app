# Contributing

Thanks for helping improve Linux Learning App.

## Before you start

1. Search existing issues before opening a new one.
2. Keep each pull request focused on one improvement.
3. Use accurate commands and link to official documentation for technical claims.
4. Never include credentials, private data, backups, or generated user study data.

## Local development

```bash
python3 -m http.server 8081 --directory app
```

Open `http://localhost:8081`, test both themes, and check desktop and mobile layouts.

If course pages changed, rebuild the offline assistant index:

```bash
python3 tools/build_linux_knowledge.py
```

## Pull requests

Describe what changed, why it helps learners, and how you tested it. Screenshots are
helpful for interface changes. Confirm that navigation, progress tracking, revision,
notes, and backup/restore still work.
