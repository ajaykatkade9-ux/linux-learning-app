(function () {
  "use strict";

  const page =
    window.location.pathname.split("/").pop() || "index.html";

  if (
    page === "index.html" ||
    page === "review-queue.html" ||
    page === "users-groups.html" ||
    document.body.dataset.appShellReady === "true"
  ) {
    return;
  }

  const pageMeta = {
    "linux.html": { section: "learn", label: "Learn" },
    "linux-roadmap.html": { section: "learn", label: "Linux Roadmap" },
    "linux-assistant.html": { section: "assistant", label: "Offline Linux Assistant" },
    "revision.html": { section: "revision", label: "Revision" },
    "practice.html": { section: "practice", label: "Practice" },
    "challenge.html": { section: "practice", label: "Challenge" },
    "interview.html": { section: "interview", label: "Interview" },
    "progress.html": { section: "progress", label: "Progress" },
    "notes.html": { section: "notes", label: "Quick Notes" },
    "backup.html": { section: "backup", label: "Backup & Restore" },
    "docs.html": { section: "docs", label: "Official Docs" },
    "today.html": { section: "dashboard", label: "Today's Study" }
  };

  const modulePages = new Set([
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
    "linux-security.html",
    "linux-internals.html",
    "container-linux.html",
    "environment.html"
  ]);

  const topicPages = {
    "Linux Foundations": "linux-foundations.html",
    "Linux Boot Process": "boot-process.html",
    "Linux Storage": "storage.html",
    "Processes & Services": "processes.html",
    "Linux Permissions": "permissions.html",
    "Linux Networking": "networking.html",
    "Linux Troubleshooting": "troubleshooting.html",
    "Logs & Journal": "logs.html",
    "Package Management": "packages.html",
    "Shell Scripting": "shell-scripting.html",
    "Cron & Scheduling": "cron.html",
    "Memory & Swap": "memory.html",
    "CPU & Load": "cpu-load.html",
    "SSH & Remote Access": "ssh.html",
    "Files & Text Processing": "files-text.html",
    "Linux Security": "linux-security.html",
    "Advanced Linux Internals": "linux-internals.html",
    "DevOps / Container Linux": "container-linux.html",
    "Linux Interview Preparation": "interview.html",
    "Linux Hands-On Labs": "practice.html",
    "Linux Official Documentation": "docs.html",
    "Environment & PATH": "environment.html"
  };

  const navItems = [
    ["dashboard", "index.html", "bi-house-door", "Dashboard"],
    ["learn", "linux.html", "bi-book", "Learn"],
    ["assistant", "linux-assistant.html", "bi-chat-dots", "Linux Assistant"],
    ["revision", "revision.html", "bi-arrow-repeat", "Revision"],
    ["practice", "practice.html", "bi-tools", "Practice"],
    ["interview", "interview.html", "bi-bullseye", "Interview"],
    ["progress", "progress.html", "bi-bar-chart", "Progress", true],
    ["notes", "notes.html", "bi-journal-text", "Quick Notes"],
    ["backup", "backup.html", "bi-floppy", "Backup & Restore"],
    ["docs", "docs.html", "bi-file-earmark-text", "Official Docs"]
  ];

  function cleanHeadingText(value) {
    return String(value || "")
      .replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, "")
      .trim();
  }

  const firstHeading = document.querySelector("h1");
  const fallbackTitle = document.title.replace(/\s*[-|].*$/, "").trim();
  const title = cleanHeadingText(
    firstHeading ? firstHeading.textContent : fallbackTitle
  ) || fallbackTitle;

  if (firstHeading) {
    firstHeading.textContent = title;
  }

  const meta = pageMeta[page] || {
    section: modulePages.has(page) ? "learn" : "dashboard",
    label: title
  };

  document.body.dataset.appShellReady = "true";
  document.body.classList.add(
    "course-app",
    "page-" + meta.section,
    "file-" + page.replace(/\.html$/, "")
  );

  if (page === "linux.html") document.body.classList.add("page-linux");
  if (page === "linux-assistant.html") document.body.classList.add("page-assistant");
  if (page === "progress.html") document.body.classList.add("page-progress");
  if (page === "notes.html") document.body.classList.add("page-notes");
  if (page === "backup.html") document.body.classList.add("page-backup");
  if (page === "revision.html") document.body.classList.add("page-revision");
  if (page === "practice.html") document.body.classList.add("page-practice");
  if (page === "interview.html") document.body.classList.add("page-interview");
  if (page === "today.html") document.body.classList.add("page-today");
  if (modulePages.has(page)) document.body.classList.add("page-module");

  function createSidebar() {
    const aside = document.createElement("aside");
    aside.className = "course-sidebar";
    aside.id = "courseSidebar";
    aside.setAttribute("aria-label", "Main navigation");

    const navMarkup = navItems
      .map(function (item) {
        const [section, href, icon, label, spaced] = item;
        const active = section === meta.section;
        return `
          <li>
            <a class="course-nav-link${active ? " active" : ""}${
              spaced ? " nav-spaced" : ""
            }" href="${href}"${active ? ' aria-current="page"' : ""}>
              <i class="bi ${icon}" aria-hidden="true"></i>
              <span>${label}</span>
            </a>
          </li>
        `;
      })
      .join("");

    aside.innerHTML = `
      <a class="course-brand" href="index.html">
        <span class="course-brand-mark">
          <i class="bi bi-terminal" aria-hidden="true"></i>
        </span>
        <span>Linux Learning</span>
      </a>
      <nav>
        <ul class="course-nav-list">${navMarkup}</ul>
      </nav>
      <div class="course-sidebar-footer">
        <button class="theme-toggle" id="themeToggle" type="button">
          <i class="bi bi-moon-stars" aria-hidden="true"></i>
          <span>Dark mode</span>
        </button>
        <div class="course-profile">
          <span class="course-avatar" aria-hidden="true">LL</span>
          <span class="course-profile-copy">
            <strong>Learner</strong>
            <span>Keep learning!</span>
          </span>
        </div>
      </div>
    `;

    return aside;
  }

  function createBreadcrumbs() {
    const breadcrumbs = document.createElement("nav");
    breadcrumbs.className = "course-breadcrumbs";
    breadcrumbs.setAttribute("aria-label", "Breadcrumb");

    const parts = [
      '<a href="index.html">Dashboard</a>',
      '<i class="bi bi-chevron-right" aria-hidden="true"></i>'
    ];

    const sectionItem = navItems.find(function (item) {
      return item[0] === meta.section;
    });

    if (
      sectionItem &&
      meta.section !== "dashboard" &&
      cleanHeadingText(sectionItem[3]) !== title
    ) {
      parts.push(`<a href="${sectionItem[1]}">${sectionItem[3]}</a>`);
      parts.push('<i class="bi bi-chevron-right" aria-hidden="true"></i>');
    }

    parts.push(`<span class="course-breadcrumb-current">${title}</span>`);
    breadcrumbs.innerHTML = parts.join("");
    return breadcrumbs;
  }

  function createTopbar() {
    const topbar = document.createElement("header");
    topbar.className = "course-topbar";
    topbar.appendChild(createBreadcrumbs());

    const actions = document.createElement("div");
    actions.className = "course-top-actions";

    if (page !== "today.html") {
      const todayLink = document.createElement("a");
      todayLink.className = "course-top-action";
      todayLink.href = "today.html";
      todayLink.innerHTML =
        '<i class="bi bi-lightning-charge" aria-hidden="true"></i><span>Today\'s Study</span>';
      actions.appendChild(todayLink);
    }

    const menu = document.createElement("button");
    menu.className = "course-mobile-menu";
    menu.id = "courseMobileMenu";
    menu.type = "button";
    menu.setAttribute("aria-controls", "courseSidebar");
    menu.setAttribute("aria-expanded", "false");
    menu.innerHTML =
      '<i class="bi bi-list" aria-hidden="true"></i><span>Menu</span>';
    actions.appendChild(menu);
    topbar.appendChild(actions);
    return topbar;
  }

  const shell = document.createElement("div");
  shell.className = "course-shell";
  shell.appendChild(createSidebar());

  const overlay = document.createElement("button");
  overlay.className = "course-overlay";
  overlay.id = "courseOverlay";
  overlay.type = "button";
  overlay.setAttribute("aria-label", "Close navigation");
  shell.appendChild(overlay);

  const main = document.createElement("main");
  main.className = "course-main";
  const mainInner = document.createElement("div");
  mainInner.className = "course-main-inner";
  mainInner.appendChild(createTopbar());

  const content = document.createElement("div");
  content.className = "course-content";

  Array.from(document.body.childNodes).forEach(function (node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName === "SCRIPT"
    ) {
      return;
    }
    content.appendChild(node);
  });

  mainInner.appendChild(content);
  main.appendChild(mainInner);
  shell.appendChild(main);
  document.body.appendChild(shell);

  const existingBackLink = content.querySelector(
    'a[href="index.html"], a[href="linux.html"]'
  );
  if (existingBackLink) existingBackLink.classList.add("legacy-back-link");

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;

    const button = document.getElementById("themeToggle");
    if (!button) return;

    const dark = nextTheme === "dark";
    button.innerHTML = dark
      ? '<i class="bi bi-sun" aria-hidden="true"></i><span>Light mode</span>'
      : '<i class="bi bi-moon-stars" aria-hidden="true"></i><span>Dark mode</span>';
    button.setAttribute("aria-label", dark ? "Use light mode" : "Use dark mode");
  }

  const storedTheme = localStorage.getItem("linuxStudyTheme") || "light";
  applyTheme(storedTheme);

  document.getElementById("themeToggle").addEventListener("click", function () {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("linuxStudyTheme", next);
    applyTheme(next);
  });

  const menuButton = document.getElementById("courseMobileMenu");

  function closeNavigation() {
    document.body.classList.remove("course-nav-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.addEventListener("click", function () {
    const open = document.body.classList.toggle("course-nav-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  overlay.addEventListener("click", closeNavigation);
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNavigation();
  });

  document.querySelectorAll("button").forEach(function (button) {
    if (!button.hasAttribute("type")) button.type = "button";
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (error) {
        reject(error);
      } finally {
        input.remove();
      }
    });
  }

  function addCopyButtons() {
    content.querySelectorAll("pre").forEach(function (pre) {
      if (pre.closest(".code-block-wrap") || !pre.textContent.trim()) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrap";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const button = document.createElement("button");
      button.className = "copy-code-button";
      button.type = "button";
      button.innerHTML =
        '<i class="bi bi-copy" aria-hidden="true"></i><span>Copy</span>';
      button.setAttribute("aria-label", "Copy code block");
      button.addEventListener("click", function () {
        copyText(pre.textContent.trim())
          .then(function () {
            button.innerHTML =
              '<i class="bi bi-check2" aria-hidden="true"></i><span>Copied</span>';
            window.setTimeout(function () {
              button.innerHTML =
                '<i class="bi bi-copy" aria-hidden="true"></i><span>Copy</span>';
            }, 1400);
          })
          .catch(function () {
            button.querySelector("span").textContent = "Select manually";
          });
      });
      wrapper.appendChild(button);
    });
  }

  function uniqueSlug(value, used) {
    const base = cleanHeadingText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "section";
    let slug = base;
    let index = 2;
    while (used.has(slug)) {
      slug = base + "-" + index;
      index += 1;
    }
    used.add(slug);
    return slug;
  }

  function assignContentAnchors() {
    const used = new Set(
      Array.from(content.querySelectorAll("[id]")).map(function (element) {
        return element.id;
      })
    );

    content.querySelectorAll("h2, h3").forEach(function (heading) {
      if (!heading.id) heading.id = uniqueSlug(heading.textContent, used);
    });
  }

  function addTableOfContents() {
    const headings = Array.from(content.querySelectorAll("h2")).filter(
      function (heading) {
        return !heading.closest(".page-toc") && heading.textContent.trim();
      }
    );

    if (headings.length < 4) return false;

    const used = new Set();
    const toc = document.createElement("details");
    toc.className = "page-toc";
    if (window.innerWidth > 820) toc.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML =
      '<i class="bi bi-list-ul" aria-hidden="true"></i><span>On this page</span>';
    toc.appendChild(summary);

    const links = document.createElement("div");
    links.className = "page-toc-links";

    headings.forEach(function (heading) {
      if (!heading.id) heading.id = uniqueSlug(heading.textContent, used);
      const link = document.createElement("a");
      link.className = "page-toc-link";
      link.href = "#" + heading.id;
      link.textContent = cleanHeadingText(heading.textContent);
      links.appendChild(link);
    });

    toc.appendChild(links);

    const root = content.querySelector("main.container, .container");
    if (!root) return false;

    const hero = root.querySelector(":scope > .hero");
    const firstCard = root.querySelector(":scope > .card, :scope > .panel");

    if (hero) {
      hero.insertAdjacentElement("afterend", toc);
    } else if (firstCard) {
      firstCard.parentNode.insertBefore(toc, firstCard);
    } else {
      root.prepend(toc);
    }

    return true;
  }

  function addReadingTools(enabled) {
    if (!enabled) return;

    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    const topButton = document.createElement("button");
    topButton.className = "back-to-top";
    topButton.type = "button";
    topButton.setAttribute("aria-label", "Back to top");
    topButton.innerHTML = '<i class="bi bi-arrow-up" aria-hidden="true"></i>';
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(topButton);

    function updateReadingProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      progress.style.width = percent + "%";
      topButton.classList.toggle("visible", window.scrollY > 520);
    }

    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    updateReadingProgress();
  }

  function enhanceClickableCards() {
    content.querySelectorAll(".card[onclick]").forEach(function (card) {
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
    });
  }

  function enhanceLinuxBrowser() {
    if (page !== "linux.html") return;

    const topics = content.querySelector(".topics");
    const container = content.querySelector(".container");
    if (!topics || !container || container.querySelector(".featured-grid")) return;

    const featured = Array.from(container.children).filter(function (element) {
      return (
        element !== topics &&
        element.matches(".card, a.card")
      );
    });

    if (featured.length) {
      const grid = document.createElement("div");
      grid.className = "featured-grid";
      container.insertBefore(grid, topics);
      featured.forEach(function (element) {
        grid.appendChild(element);
      });
    }
  }

  function enhanceProgressPage() {
    if (page !== "progress.html") return;

    const container = content.querySelector(".container");
    const topicContainer = document.getElementById("topics");
    if (!container || !topicContainer) return;

    const overview = document.createElement("section");
    overview.className = "progress-overview";
    overview.setAttribute("aria-label", "Progress summary");
    overview.innerHTML = `
      <div class="progress-stat">
        <span>Overall progress</span>
        <strong id="progressPercent">0%</strong>
        <div class="overall-progress-track" aria-hidden="true">
          <div class="overall-progress-fill" id="overallProgressFill"></div>
        </div>
      </div>
      <div class="progress-stat">
        <span>Completed</span>
        <strong id="progressCompleted">0</strong>
      </div>
      <div class="progress-stat">
        <span>Remaining</span>
        <strong id="progressRemaining">0</strong>
      </div>
    `;

    const filters = document.createElement("div");
    filters.className = "progress-filter-bar";
    filters.innerHTML = `
      <input id="progressSearch" type="search" placeholder="Search progress topics..." aria-label="Search progress topics">
      <select id="progressStatusFilter" aria-label="Filter progress status">
        <option value="all">All topics</option>
        <option value="completed">Completed</option>
        <option value="remaining">Not completed</option>
      </select>
    `;

    container.insertBefore(filters, topicContainer);
    container.insertBefore(overview, filters);

    const search = filters.querySelector("#progressSearch");
    const statusFilter = filters.querySelector("#progressStatusFilter");

    function updateSummaryAndFilter() {
      const cards = Array.from(topicContainer.querySelectorAll(".card"));
      const completed = Object.keys(topicPages).filter(function (topic) {
        return localStorage.getItem(topic) === "done";
      }).length;
      const total = Object.keys(topicPages).length;
      const percent = total ? Math.round((completed / total) * 100) : 0;

      document.getElementById("progressPercent").textContent = percent + "%";
      document.getElementById("progressCompleted").textContent = completed;
      document.getElementById("progressRemaining").textContent = total - completed;
      document.getElementById("overallProgressFill").style.width = percent + "%";

      const query = search.value.trim().toLowerCase();
      const filter = statusFilter.value;

      cards.forEach(function (card) {
        const heading = card.querySelector("h3");
        if (!heading) return;
        const name = heading.textContent.trim();
        const done = localStorage.getItem(name) === "done";
        const matchesQuery = name.toLowerCase().includes(query);
        const matchesStatus =
          filter === "all" ||
          (filter === "completed" && done) ||
          (filter === "remaining" && !done);
        card.hidden = !(matchesQuery && matchesStatus);

        const button = card.querySelector("button");
        if (button) button.dataset.kind = done ? "secondary" : "primary";

        if (!card.dataset.appDecorated && topicPages[name]) {
          const link = document.createElement("a");
          link.className = "progress-topic-link";
          link.href = topicPages[name];
          link.innerHTML =
            'Open topic <i class="bi bi-arrow-right" aria-hidden="true"></i>';
          card.appendChild(link);
          card.dataset.appDecorated = "true";
        }
      });
    }

    search.addEventListener("input", updateSummaryAndFilter);
    statusFilter.addEventListener("change", updateSummaryAndFilter);
    window.addEventListener("storage", updateSummaryAndFilter);

    const observer = new MutationObserver(updateSummaryAndFilter);
    observer.observe(topicContainer, { childList: true });
    updateSummaryAndFilter();
  }

  function enhanceNotes() {
    if (page !== "notes.html") return;
    const notes = document.getElementById("notes");
    if (!notes) return;

    let count = document.getElementById("notesCount");

    if (!count) {
      const metaRow = document.createElement("div");
      metaRow.className = "notes-meta";
      metaRow.innerHTML =
        '<span id="notesCount">0 words · 0 characters</span><span>Your notes stay in this browser.</span>';
      notes.insertAdjacentElement("afterend", metaRow);
      count = metaRow.querySelector("#notesCount");
    }

    function updateCount() {
      const value = notes.value;
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      count.textContent = words + " words · " + value.length + " characters";
    }

    notes.addEventListener("input", updateCount);
    updateCount();
  }

  function enhanceBackup() {
    if (page !== "backup.html") return;
    const cards = content.querySelectorAll(".card");
    const icons = ["bi-download", "bi-upload"];
    cards.forEach(function (card, index) {
      if (card.querySelector(".backup-card-icon")) return;
      const icon = document.createElement("span");
      icon.className = "backup-card-icon";
      icon.innerHTML = `<i class="bi ${icons[index] || "bi-shield-check"}" aria-hidden="true"></i>`;
      card.prepend(icon);
    });
    const status = document.getElementById("status");
    if (status) status.setAttribute("aria-live", "polite");
  }

  function enhanceCompletionCards() {
    content.querySelectorAll("#topicCompleteBox, .card").forEach(function (card) {
      if (
        card.id === "topicCompleteBox" ||
        card.querySelector(".complete-button, #completeStatus")
      ) {
        card.classList.add("completion-card");
      }
    });
  }

  function loadInterviewAnswers() {
    if (!modulePages.has(page) || document.getElementById("interviewAnswersScript")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "interviewAnswersScript";
    script.src = "interview-answers.js";
    document.body.appendChild(script);
  }

  assignContentAnchors();
  addCopyButtons();
  enhanceClickableCards();
  enhanceLinuxBrowser();
  enhanceProgressPage();
  enhanceNotes();
  enhanceBackup();
  enhanceCompletionCards();
  addReadingTools(page !== "today.html" && addTableOfContents());
  loadInterviewAnswers();
})();
