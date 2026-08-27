(function () {
  "use strict";

  const topicMap = window.linuxTopicProgressMap ||
    (typeof linuxTopicProgressMap !== "undefined" ? linuxTopicProgressMap : {});
  const topics = Object.entries(topicMap).map(([page, name]) => ({ page, name }));
  const revisions = Array.isArray(window.revisionTopics) ? window.revisionTopics : [];

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getReviewData(id) {
    try {
      return JSON.parse(
        localStorage.getItem("review_" + id) ||
          '{"level":0,"nextReview":null}'
      );
    } catch {
      return { level: 0, nextReview: null };
    }
  }

  function isDue(topic) {
    const data = getReviewData(topic.id);
    return !data.nextReview || data.nextReview <= localDateString();
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderDueTopics(dueTopics) {
    const list = document.getElementById("dueTopics");
    if (!list) return;

    list.innerHTML = "";

    if (!dueTopics.length) {
      const item = document.createElement("li");
      item.className = "empty-state";
      item.textContent = "Nothing due today. Great work!";
      list.appendChild(item);
      return;
    }

    dueTopics.slice(0, 3).forEach((topic) => {
      const item = document.createElement("li");
      item.className = "due-item";

      const icon = document.createElement("span");
      icon.className = "due-item-icon";
      icon.innerHTML = '<i class="bi bi-arrow-repeat" aria-hidden="true"></i>';

      const copy = document.createElement("span");
      copy.className = "due-item-copy";

      const name = document.createElement("strong");
      name.textContent = topic.name;

      const status = document.createElement("span");
      status.textContent = getReviewData(topic.id).nextReview
        ? "Due today"
        : "Ready for first review";

      copy.append(name, status);
      item.append(icon, copy);
      list.appendChild(item);
    });
  }

  function renderNextTopics(incompleteTopics) {
    const list = document.getElementById("nextTopics");
    if (!list) return;

    list.innerHTML = "";
    const selection = incompleteTopics.slice(0, 3);

    if (!selection.length) {
      const item = document.createElement("li");
      item.className = "empty-state";
      item.textContent = "All topics completed. Review your progress or start revision.";
      list.appendChild(item);
      return;
    }

    selection.forEach((topic, index) => {
      const row = document.createElement("a");
      row.className = "topic-row";
      row.href = topic.page;

      const main = document.createElement("span");
      main.className = "topic-main";
      main.innerHTML = `
        <span class="topic-icon">
          <i class="bi bi-journal-code" aria-hidden="true"></i>
        </span>
        <span>
          <span class="topic-name"></span>
          <span class="topic-detail">Next topic in your Linux path</span>
        </span>
      `;
      main.querySelector(".topic-name").textContent = topic.name;

      const progress = document.createElement("span");
      progress.className = "mini-progress";
      progress.innerHTML = `
        <span>${index === 0 ? "Start here" : "Upcoming"}</span>
        <span class="mini-track"><span class="mini-fill" style="width:0%"></span></span>
      `;

      const arrow = document.createElement("i");
      arrow.className = "bi bi-chevron-right row-arrow";
      arrow.setAttribute("aria-hidden", "true");

      row.append(main, progress, arrow);
      const item = document.createElement("li");
      item.appendChild(row);
      list.appendChild(item);
    });
  }

  function loadDashboard() {
    const completedTopics = topics.filter(
      (topic) => localStorage.getItem(topic.name) === "done"
    );
    const incompleteTopics = topics.filter(
      (topic) => localStorage.getItem(topic.name) !== "done"
    );
    const continueTopic = incompleteTopics[0] || topics[0] || {
      name: "Linux Course",
      page: "linux.html"
    };
    const dueTopics = revisions.filter(isDue);
    const total = topics.length;
    const completed = completedTopics.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const streak = localStorage.getItem("studyStreak") || "0";

    setText("homeStreak", streak);
    setText("homeCompleted", completed);
    setText("homeTotal", total);
    setText("homePercent", percent + "%");
    setText("homeDue", dueTopics.length);
    setText("continueTopic", continueTopic.name);

    const fill = document.getElementById("homeProgressFill");
    if (fill) fill.style.width = percent + "%";

    const track = document.getElementById("homeProgressTrack");
    if (track) track.setAttribute("aria-valuenow", String(percent));

    const continueLink = document.getElementById("continueLink");
    if (continueLink) continueLink.href = continueTopic.page;

    renderDueTopics(dueTopics);
    renderNextTopics(incompleteTopics);
  }

  const menuButton = document.getElementById("mobileMenuButton");
  const overlay = document.getElementById("sidebarOverlay");
  const themeButton = document.getElementById("homeThemeToggle");

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;

    if (!themeButton) return;
    const dark = nextTheme === "dark";
    themeButton.innerHTML = dark
      ? '<i class="bi bi-sun" aria-hidden="true"></i><span>Light theme</span>'
      : '<i class="bi bi-moon-stars" aria-hidden="true"></i><span>Dark theme</span>';
    themeButton.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  function closeMenu() {
    document.body.classList.remove("nav-open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  if (overlay) overlay.addEventListener("click", closeMenu);
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("linuxStudyTheme", nextTheme);
      applyTheme(nextTheme);
    });
  }
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("pageshow", loadDashboard);
  window.addEventListener("storage", loadDashboard);

  applyTheme(document.documentElement.dataset.theme);
  loadDashboard();
})();
