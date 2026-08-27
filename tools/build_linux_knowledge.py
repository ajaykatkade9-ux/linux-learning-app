#!/usr/bin/env python3
"""Build the browser-only Linux Assistant knowledge index."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from html.parser import HTMLParser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
APP_DIR = PROJECT_ROOT / "app"
OUTPUT = APP_DIR / "linux-knowledge.js"

SOURCE_PAGES = [
    "linux-foundations.html",
    "boot-process.html",
    "storage.html",
    "processes.html",
    "permissions.html",
    "networking.html",
    "troubleshooting.html",
    "logs.html",
    "packages.html",
    "shell-scripting.html",
    "cron.html",
    "memory.html",
    "cpu-load.html",
    "ssh.html",
    "files-text.html",
    "environment.html",
    "linux-security.html",
    "linux-internals.html",
    "container-linux.html",
    "interview.html",
    "practice.html",
    "linux-roadmap.html",
]

SKIP_HEADINGS = {
    "topic progress",
    "completion standard",
    "official documentation",
    "official study references",
}


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def clean_heading(value: str) -> str:
    value = re.sub(r"^[^A-Za-z0-9/]+", "", clean_text(value))
    return value.strip()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", clean_heading(value).lower()).strip("-")
    return slug or "section"


class LearningPageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ignore_depth = 0
        self.capture_heading: str | None = None
        self.heading_parts: list[str] = []
        self.capture_pre = False
        self.pre_parts: list[str] = []
        self.page_title = ""
        self.current_heading = "Overview"
        self.current_level = 1
        self.sections: list[dict[str, object]] = []
        self.current_section: dict[str, object] | None = None
        self.text_buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "svg", "noscript"}:
            self.ignore_depth += 1
            return
        if self.ignore_depth:
            return
        if tag in {"h1", "h2", "h3"}:
            self._flush_text()
            self.capture_heading = tag
            self.heading_parts = []
        elif tag == "pre":
            self.capture_pre = True
            self.pre_parts = []
        elif tag in {"p", "li", "td", "th", "summary", "br"}:
            self.text_buffer.append(" ")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "svg", "noscript"}:
            if self.ignore_depth:
                self.ignore_depth -= 1
            return
        if self.ignore_depth:
            return
        if self.capture_heading == tag:
            heading = clean_heading("".join(self.heading_parts))
            self.capture_heading = None
            self.heading_parts = []
            if heading:
                if tag == "h1" and not self.page_title:
                    self.page_title = heading
                else:
                    self._start_section(heading, int(tag[1]))
        elif tag == "pre" and self.capture_pre:
            command = "\n".join(
                line.rstrip()
                for line in "".join(self.pre_parts).strip().splitlines()
                if line.strip()
            )
            if command and self.current_section is not None:
                commands = self.current_section["commands"]
                assert isinstance(commands, list)
                commands.append(command[:1600])
                self.text_buffer.append(" " + command + " ")
            self.capture_pre = False
            self.pre_parts = []
        elif tag in {"p", "li", "td", "th", "summary", "details", "section", "div"}:
            self.text_buffer.append(" ")

    def handle_data(self, data: str) -> None:
        if self.ignore_depth:
            return
        if self.capture_heading:
            self.heading_parts.append(data)
            return
        if self.capture_pre:
            self.pre_parts.append(data)
            return
        self.text_buffer.append(data)

    def finish(self) -> None:
        self._flush_text()

    def _start_section(self, heading: str, level: int) -> None:
        self.current_heading = heading
        self.current_level = level
        self.current_section = {
            "heading": heading,
            "level": level,
            "text": [],
            "commands": [],
        }
        self.sections.append(self.current_section)

    def _flush_text(self) -> None:
        text = clean_text("".join(self.text_buffer))
        self.text_buffer = []
        if not text:
            return
        if self.current_section is None:
            self._start_section(self.current_heading, self.current_level)
        text_parts = self.current_section["text"]
        assert isinstance(text_parts, list)
        text_parts.append(text)


def split_long_text(text: str, limit: int = 1700) -> list[str]:
    if len(text) <= limit:
        return [text]
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks: list[str] = []
    current: list[str] = []
    length = 0
    for sentence in sentences:
        if current and length + len(sentence) + 1 > limit:
            chunks.append(" ".join(current))
            current = []
            length = 0
        current.append(sentence)
        length += len(sentence) + 1
    if current:
        chunks.append(" ".join(current))
    return chunks


def build_index() -> dict[str, object]:
    pages: list[dict[str, object]] = []
    chunks: list[dict[str, object]] = []

    for filename in SOURCE_PAGES:
        path = APP_DIR / filename
        if not path.is_file():
            continue

        parser = LearningPageParser()
        parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
        parser.finish()
        title = parser.page_title or filename.removesuffix(".html").replace("-", " ").title()
        page_chunk_count = 0
        used_anchors: dict[str, int] = {}

        for section in parser.sections:
            heading = str(section["heading"])

            # Match app-shell.js exactly: every visible h2/h3 consumes an
            # anchor, even when that section is intentionally excluded from
            # the search index. This keeps deep links reliable when headings
            # repeat on the same page.
            base_anchor = slugify(heading)
            used_anchors[base_anchor] = used_anchors.get(base_anchor, 0) + 1
            anchor = base_anchor
            if used_anchors[base_anchor] > 1:
                anchor = f"{base_anchor}-{used_anchors[base_anchor]}"

            if clean_heading(heading).lower() in SKIP_HEADINGS:
                continue
            text_parts = section["text"]
            commands = section["commands"]
            assert isinstance(text_parts, list)
            assert isinstance(commands, list)
            body = clean_text(" ".join(str(part) for part in text_parts))
            if len(body) < 35 and not commands:
                continue

            body_chunks = split_long_text(body)
            for part_number, body_chunk in enumerate(body_chunks, start=1):
                display_heading = heading
                if len(body_chunks) > 1:
                    display_heading = f"{heading} — Part {part_number}"
                chunks.append(
                    {
                        "id": f"{filename.removesuffix('.html')}:{slugify(heading)}:{part_number}",
                        "page": filename,
                        "pageTitle": title,
                        "heading": display_heading,
                        "anchor": anchor,
                        "level": section["level"],
                        "text": body_chunk,
                        "commands": commands[:4] if part_number == 1 else [],
                    }
                )
                page_chunk_count += 1

        pages.append({"page": filename, "title": title, "chunks": page_chunk_count})

    return {
        "version": 1,
        "generatedAt": datetime.now(UTC).isoformat(timespec="seconds"),
        "pages": pages,
        "chunks": chunks,
    }


def main() -> None:
    payload = json.dumps(build_index(), ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text(
        "window.LINUX_KNOWLEDGE = " + payload + ";\n",
        encoding="utf-8",
    )
    data = json.loads(payload)
    print(
        f"Built {len(data['chunks'])} knowledge chunks from "
        f"{len(data['pages'])} Linux pages: {OUTPUT}"
    )


if __name__ == "__main__":
    main()
