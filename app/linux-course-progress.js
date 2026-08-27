const linuxTopicProgressMap = {
  "linux-foundations.html": "Linux Foundations",
  "boot-process.html": "Linux Boot Process",
  "storage.html": "Linux Storage",
  "processes.html": "Processes & Services",
  "permissions.html": "Linux Permissions",
  "networking.html": "Linux Networking",
  "troubleshooting.html": "Linux Troubleshooting",
  "logs.html": "Logs & Journal",
  "packages.html": "Package Management",
  "shell-scripting.html": "Shell Scripting",
  "cron.html": "Cron & Scheduling",
  "memory.html": "Memory & Swap",
  "cpu-load.html": "CPU & Load",
  "ssh.html": "SSH & Remote Access",
  "files-text.html": "Files & Text Processing",
  "linux-security.html": "Linux Security",
  "linux-internals.html": "Advanced Linux Internals",
  "container-linux.html": "DevOps / Container Linux",
  "interview.html": "Linux Interview Preparation",
  "practice.html": "Linux Hands-On Labs",
  "docs.html": "Linux Official Documentation",
  "environment.html": "Environment & PATH"
};

function showLinuxTopicProgress() {
  const cards =
    document.querySelectorAll(".topics .card");

  cards.forEach(function (card) {
    const clickAction =
      card.getAttribute("onclick") || "";

    const fileMatch =
      clickAction.match(/location\.href='([^']+)'/);

    if (!fileMatch) {
      return;
    }

    const fileName = fileMatch[1];
    const storageKey =
      linuxTopicProgressMap[fileName];

    if (!storageKey) {
      return;
    }

    const completed =
      localStorage.getItem(storageKey) === "done";

    let status =
      card.querySelector(".topic-progress-status");

    if (!status) {
      status = document.createElement("p");
      status.className = "topic-progress-status";
      card.appendChild(status);
    }

    status.textContent =
      completed
        ? "✅ Completed"
        : "⏳ Not Completed";

    status.style.marginTop = "14px";
    status.style.fontWeight = "bold";
    status.style.fontSize = "14px";
    status.style.color =
      completed ? "#15803d" : "#b45309";

    if (completed) {
      card.style.border = "1px solid #22c55e";
      card.style.background = "#ecfdf5";
    } else {
      card.style.border = "";
      card.style.background = "";
    }
  });
}

showLinuxTopicProgress();

window.addEventListener(
  "pageshow",
  showLinuxTopicProgress
);

window.addEventListener(
  "storage",
  showLinuxTopicProgress
);
