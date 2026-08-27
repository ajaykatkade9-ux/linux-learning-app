(function (global) {
  "use strict";

  const knowledge = global.LINUX_KNOWLEDGE || { pages: [], chunks: [] };
  const officialKnowledge = global.LINUX_OFFICIAL_KNOWLEDGE || { entries: [] };

  const stopWords = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "can", "could",
    "do", "does", "for", "from", "give", "how", "i", "in", "is", "it",
    "ka", "ke", "ki", "kya", "kaise", "me", "mera", "mujhe", "of", "on",
    "or", "please", "should", "show", "tell", "that", "the", "this", "to",
    "use", "using", "what", "when", "where", "which", "why", "with", "would"
  ]);

  const synonymGroups = [
    ["disk", "storage", "filesystem", "volume", "mount", "partition"],
    ["memory", "ram", "swap", "oom"],
    ["cpu", "processor", "load", "performance", "slow"],
    ["process", "pid", "service", "daemon", "systemd"],
    ["network", "networking", "ip", "route", "connectivity"],
    ["dns", "resolver", "hostname", "resolution"],
    ["permission", "access", "chmod", "chown", "acl", "denied"],
    ["boot", "startup", "grub", "kernel", "initramfs", "reboot"],
    ["log", "logs", "journal", "journalctl", "dmesg"],
    ["ssh", "remote", "sshd", "key", "login"],
    ["container", "docker", "namespace", "cgroup", "isolation"],
    ["package", "apt", "dnf", "rpm", "repository"],
    ["shell", "bash", "script", "scripting", "automation"],
    ["cron", "timer", "schedule", "scheduling"],
    ["file", "text", "grep", "find", "awk", "sed"],
    ["security", "selinux", "apparmor", "firewall", "hardening"],
    ["troubleshoot", "debug", "diagnose", "problem", "issue", "failure", "fix"]
  ];

  const synonymMap = new Map();
  synonymGroups.forEach(function (group) {
    group.forEach(function (word) {
      synonymMap.set(word, group);
    });
  });

  function normalizeToken(value) {
    let token = value.toLowerCase();
    if (token.length > 5 && token.endsWith("ies")) token = token.slice(0, -3) + "y";
    else if (token.length > 5 && token.endsWith("ses")) token = token.slice(0, -2);
    else if (token.length > 5 && token.endsWith("ing")) token = token.slice(0, -3);
    else if (token.length > 4 && token.endsWith("ed")) token = token.slice(0, -2);
    else if (token.length > 4 && token.endsWith("s")) token = token.slice(0, -1);
    return token;
  }

  function tokenize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9_+./:-]+/g, " ")
      .split(/\s+/)
      .map(normalizeToken)
      .filter(function (token) {
        return token.length > 1 && !stopWords.has(token);
      });
  }

  function tokenCounts(tokens) {
    const counts = new Map();
    tokens.forEach(function (token) {
      counts.set(token, (counts.get(token) || 0) + 1);
    });
    return counts;
  }

  function expandQuery(tokens) {
    const expanded = new Set(tokens);
    tokens.forEach(function (token) {
      const group = synonymMap.get(token);
      if (!group) return;
      group.forEach(function (word) {
        expanded.add(normalizeToken(word));
      });
    });
    return Array.from(expanded);
  }

  const courseChunks = knowledge.chunks.map(function (chunk) {
    return Object.assign({ sourceType: "course" }, chunk);
  });

  const officialChunks = officialKnowledge.entries.map(function (entry) {
    return {
      id: "official:" + entry.id,
      page: "",
      pageTitle: entry.source,
      heading: entry.title,
      anchor: "",
      level: 2,
      text: entry.summary,
      keywords: entry.keywords || "",
      commands: entry.commands || [],
      sourceType: "official",
      category: entry.category,
      url: entry.url
    };
  });

  const documents = courseChunks.concat(officialChunks).map(function (chunk) {
    const titleTokens = tokenize(chunk.pageTitle);
    const headingTokens = tokenize(chunk.heading);
    const textTokens = tokenize(chunk.text + " " + (chunk.keywords || ""));
    const commandTokens = tokenize((chunk.commands || []).join(" "));
    return {
      chunk: chunk,
      title: tokenCounts(titleTokens),
      heading: tokenCounts(headingTokens),
      text: tokenCounts(textTokens),
      commands: tokenCounts(commandTokens),
      all: new Set(titleTokens.concat(headingTokens, textTokens, commandTokens)),
      length: Math.max(20, textTokens.length)
    };
  });

  const documentFrequency = new Map();
  documents.forEach(function (document) {
    document.all.forEach(function (token) {
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
    });
  });

  function frequency(map, token) {
    return Math.min(4, map.get(token) || 0);
  }

  function search(query, limit) {
    const rawQuery = String(query || "").trim().toLowerCase();
    const directTokens = Array.from(new Set(tokenize(rawQuery)));
    const queryTokens = expandQuery(directTokens);
    const resultLimit = Math.max(1, Math.min(20, Number(limit) || 5));

    if (!directTokens.length) return [];

    const troubleshootingIntent = directTokens.some(function (token) {
      return ["troubleshoot", "debug", "diagnose", "problem", "issue", "failure", "fix", "down", "full", "slow"].includes(token);
    });
    const officialIntent = directTokens.some(function (token) {
      return ["official", "documentation", "manual", "reference", "upstream"].includes(token);
    });

    return documents
      .map(function (document) {
        let score = 0;
        let directMatches = 0;

        queryTokens.forEach(function (token) {
          const df = documentFrequency.get(token) || 0;
          const idf = Math.log((documents.length + 1) / (df + 1)) + 1;
          const titleFrequency = frequency(document.title, token);
          const headingFrequency = frequency(document.heading, token);
          const textFrequency = frequency(document.text, token);
          const commandFrequency = frequency(document.commands, token);

          score += idf * (
            titleFrequency * 2.4 +
            headingFrequency * 5.2 +
            textFrequency * 1.25 +
            commandFrequency * 1.6
          );
          if (directTokens.includes(token) && (headingFrequency || textFrequency || commandFrequency)) {
            directMatches += 1;
          }
        });

        const heading = document.chunk.heading.toLowerCase();
        const pageTitle = document.chunk.pageTitle.toLowerCase();
        const text = document.chunk.text.toLowerCase();

        if (rawQuery.length > 3 && heading.includes(rawQuery)) score += 22;
        if (rawQuery.length > 3 && pageTitle.includes(rawQuery)) score += 12;
        if (rawQuery.length > 6 && text.includes(rawQuery)) score += 8;
        if (directMatches === directTokens.length) score += 5 + directMatches * 1.5;
        if (troubleshootingIntent && /troubleshoot|scenario|incident|failure|problem/.test(heading)) {
          score += 7;
        }

        if (document.chunk.sourceType === "official") {
          score *= 1.06;
          if (officialIntent) score += 12;
        }

        if (document.chunk.page === "linux-roadmap.html") score *= 0.48;
        if (document.chunk.text.length < 90) score *= 0.72;

        score /= 1 + Math.max(0, document.length - 100) / 1300;

        return {
          score: score,
          directMatches: directMatches,
          chunk: document.chunk
        };
      })
      .filter(function (result) {
        return result.score >= 2.2 && result.directMatches > 0;
      })
      .sort(function (left, right) {
        if (right.directMatches !== left.directMatches) {
          return right.directMatches - left.directMatches;
        }
        return right.score - left.score;
      })
      .slice(0, resultLimit);
  }

  function relevantSummary(text, query, maxLength) {
    const queryTokens = new Set(expandQuery(tokenize(query)));
    const sentences = String(text || "")
      .split(/(?<=[.!?])\s+/)
      .map(function (sentence, index) {
        const sentenceTokens = tokenize(sentence);
        const matches = sentenceTokens.reduce(function (total, token) {
          return total + (queryTokens.has(token) ? 1 : 0);
        }, 0);
        return { sentence: sentence.trim(), index: index, score: matches };
      })
      .filter(function (item) {
        return item.sentence.length > 15;
      });

    const selected = sentences
      .slice()
      .sort(function (left, right) {
        return right.score - left.score || left.index - right.index;
      })
      .slice(0, 4)
      .sort(function (left, right) {
        return left.index - right.index;
      });

    const useful = selected.some(function (item) { return item.score > 0; })
      ? selected
      : sentences.slice(0, 3);
    let summary = useful.map(function (item) { return item.sentence; }).join(" ");

    if (summary.length > maxLength) {
      summary = summary.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
    }
    return summary;
  }

  function distinctSources(results) {
    const used = new Set();
    const unique = results.filter(function (result) {
      const key = result.chunk.sourceType === "official"
        ? result.chunk.url
        : result.chunk.page + "#" + result.chunk.anchor;
      if (used.has(key)) return false;
      used.add(key);
      return true;
    });

    const selected = [];
    const top = unique[0];
    const bestCourse = unique.find(function (result) {
      return result.chunk.sourceType === "course";
    });
    const bestOfficial = unique.find(function (result) {
      return result.chunk.sourceType === "official";
    });

    [top, bestCourse, bestOfficial].forEach(function (result) {
      if (result && !selected.includes(result)) selected.push(result);
    });
    unique.forEach(function (result) {
      if (selected.length < 5 && !selected.includes(result)) selected.push(result);
    });

    return selected.slice(0, 5).map(function (result) {
      if (result.chunk.sourceType === "official") {
        return {
          title: result.chunk.pageTitle,
          section: result.chunk.heading,
          href: result.chunk.url,
          official: true,
          category: result.chunk.category
        };
      }
      return {
        title: result.chunk.pageTitle,
        section: result.chunk.heading.replace(/\s+— Part \d+$/, ""),
        href: result.chunk.page + "#" + result.chunk.anchor,
        official: false,
        category: "Course"
      };
    });
  }

  function answer(query) {
    const trimmed = String(query || "").trim();
    if (!trimmed) {
      return { found: false, message: "Type a Linux question to search the course and official references." };
    }

    if (/^(hi|hello|hey|namaste|hii|bro|bhai)[!. ]*$/i.test(trimmed)) {
      return {
        found: true,
        greeting: true,
        title: "Hello!",
        summary: "Ask me any Linux concept, command, interview question or troubleshooting scenario. I search your course and curated official references locally—no API, internet or payment required.",
        commands: [],
        sources: []
      };
    }

    const results = search(trimmed, 20);
    if (!results.length) {
      return {
        found: false,
        message: "I could not find a strong match in the current Linux lessons or official reference index. Try a shorter keyword such as ‘high CPU’, ‘permission denied’, ‘disk full’, ‘SSH failure’ or ‘systemd service’.",
        suggestions: [
          "How do I troubleshoot high CPU?",
          "Why do df and du differ?",
          "Explain Linux permissions",
          "SSH permission denied"
        ]
      };
    }

    const top = results[0];
    const commandBlocks = [];
    results.slice(0, 3).forEach(function (result) {
      (result.chunk.commands || []).forEach(function (command) {
        if (commandBlocks.length < 2 && !commandBlocks.includes(command)) {
          commandBlocks.push(command);
        }
      });
    });

    return {
      found: true,
      greeting: false,
      title: top.chunk.heading.replace(/\s+— Part \d+$/, ""),
      context: top.chunk.sourceType === "official"
        ? "Official documentation · " + top.chunk.pageTitle
        : top.chunk.pageTitle,
      summary: relevantSummary(top.chunk.text, trimmed, 900),
      commands: commandBlocks,
      sources: distinctSources(results),
      confidence: top.chunk.sourceType === "official"
        ? "Official documentation match"
        : (top.score >= 18 ? "Course + official match" : "Related documentation match")
    };
  }

  global.LinuxAssistantEngine = {
    answer: answer,
    search: search,
    stats: {
      pages: knowledge.pages.length,
      chunks: knowledge.chunks.length,
      officialEntries: officialKnowledge.entries.length,
      totalDocuments: documents.length
    }
  };
})(window);
