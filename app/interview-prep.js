(function () {
  "use strict";

  const mockAnswers = {
    "8. Mock Interview — Junior Level": [
      "Linux is an open-source, Unix-like operating-system kernel. A Linux distribution combines it with user-space tools, libraries, a package manager and supported defaults.",
      "An absolute path starts at / and is independent of the current directory. A relative path is resolved from the current working directory; pwd shows that starting point.",
      "chmod changes permission bits, chown changes the owning user and optionally group, and chgrp changes only the group owner. Confirm results with ls -l or stat.",
      "Use ps, pgrep or top. For example, pgrep -af nginx finds matching command lines; then inspect the exact PID rather than killing by a broad name.",
      "Use df -hT for filesystem blocks and df -i for inodes. Use du within the affected mount to find visible usage and lsof +L1 for deleted-open files.",
      "Use journalctl -u SERVICE -b for the current boot, systemctl status SERVICE for recent context, and journalctl -f -u SERVICE for live monitoring.",
      "SIGTERM requests graceful shutdown and can be handled by the process. SIGKILL immediately terminates it through the kernel and prevents cleanup, so it should be a last resort.",
      "Use ip -br address to inspect addresses, ip route for routes, and ip route get DESTINATION to see the exact path and source address selected by the kernel.",
      "Create one with ln -s TARGET LINK, inspect it with ls -l or readlink, and use readlink -f LINK to resolve the final path when it exists.",
      "Use a crontab for simple calendar scheduling or a systemd timer when you need service integration, dependency control, reliable logging and missed-run handling."
    ],

    "9. Mock Interview — Mid Level": [
      "Firmware initializes hardware, GRUB loads the kernel and initramfs, the kernel initializes devices and mounts root, then PID 1 starts units until the configured target is reached. Diagnose with journalctl -b and systemd-analyze.",
      "Load includes runnable tasks and tasks in uninterruptible sleep. Storage or NFS waits can therefore produce high load with idle CPU; inspect process state D, I/O latency and kernel logs.",
      "Start with systemctl status and journalctl -u SERVICE -b, then validate the unit and application configuration, dependencies, identity, paths and resources. Apply one safe fix and verify both service health and user-visible behavior.",
      "Traditional permissions and ACLs are discretionary access controls checked against the process identity. SELinux adds mandatory policy; access must pass every applicable layer, so inspect namei, getfacl and AVC logs.",
      "df reads filesystem allocation while du sums reachable files. Deleted-open files, hidden data beneath a mount, sparse files, reserved blocks and unreadable paths can create differences; lsof +L1 is a key check.",
      "Confirm the event in journalctl -k or dmesg, identify the victim and cgroup, compare memory.current and memory.events where relevant, and correlate application growth. Mitigate safely, then fix limits, leaks or workload sizing.",
      "A PID namespace isolates process IDs, a mount namespace isolates the mount table, and a network namespace isolates interfaces, routes and sockets. Containers combine these views while sharing the host kernel.",
      "LVM pools physical volumes into a volume group and allocates logical volumes. Extend the LV only after confirming free extents and backups, then grow the filesystem with its correct tool and verify with lvs and df.",
      "Separate resolver failure from packet loss by testing known IPs, then use resolvectl, getent or dig over time. Inspect multiple resolvers, latency, cache behavior, search domains, packet loss and upstream changes.",
      "Use strict input validation, quoted variables, explicit error handling, meaningful exit codes, logging without secrets, locking, cleanup traps, idempotent operations and tests. Run shellcheck and test failure paths."
    ],

    "10. Mock Interview — Senior / Production Level": [
      "Declare an access incident, stop further rollout and preserve working sessions. Recover through console or a trusted break-glass path, restore a validated configuration, rotate exposed credentials if needed, and prevent recurrence with canaries, sshd -t, automated policy tests and staged deployment.",
      "Follow the request path from DNS and load balancer through network policy, listener, proxy, application and dependencies. Compare health-check scope with real requests, inspect saturation and errors, and verify recovery from an external client.",
      "Compare the deployment window, process and thread CPU, request mix, profiles, retries and dependency behavior against a baseline. Roll back when impact or error-budget criteria are crossed, preserve evidence, and reproduce before optimizing.",
      "Host free memory does not override a container's cgroup limit. Inspect memory.current, memory.max, memory.events, working set and process RSS, then determine whether the cause is a leak, cache, concurrency or an incorrectly sized limit.",
      "Correlate backup timing with device latency, queue depth, throughput and application response time. Separate bandwidth from IOPS contention, then use scheduling, throttling, snapshots, isolation or storage redesign and validate against an SLO.",
      "Monitor golden signals—latency, traffic, errors and saturation—plus service state, capacity and kernel events. Use user-visible probes, actionable thresholds, ownership, runbooks, retention and alert tests rather than collecting metrics without response plans.",
      "Define the symptom, impact, prerequisites, safe diagnostic commands, decision points, rollback, verification and escalation. Test the runbook in a controlled exercise, assign ownership and review it after system changes and incidents.",
      "Build a factual timeline, impact statement, contributing conditions and detection/recovery analysis. Focus actions on system improvements with owners and dates; avoid assigning personal blame while maintaining accountability for follow-through."
    ]
  };

  const extraSections = [
    {
      title: "11. Rapid-Fire Round",
      description: "Answer each in 20–30 seconds. Start with the difference, then give one practical example.",
      items: [
        ["sudo vs direct root login?", "sudo grants audited, policy-controlled privilege to named users for selected commands. Direct root login removes individual accountability and should normally be disabled for remote access."],
        ["127.0.0.1 vs 0.0.0.0?", "127.0.0.1 is loopback and accepts only local access. A listener on 0.0.0.0 accepts IPv4 connections on all local interfaces, subject to routing and firewall rules."],
        ["SIGTERM vs SIGKILL?", "SIGTERM allows graceful cleanup and can be caught; SIGKILL cannot be caught and immediately stops the process. Try the service's normal stop or SIGTERM first."],
        ["df vs du?", "df reports filesystem allocation; du totals reachable file sizes. Deleted-open files, hidden mounts and reserved space can make their values differ."],
        ["Soft limit vs hard limit?", "A process can raise its soft resource limit up to the hard limit. Raising the hard limit generally requires appropriate privilege; inspect both with ulimit -a or /proc/PID/limits."],
        ["stdout vs stderr?", "stdout is file descriptor 1 for normal output; stderr is file descriptor 2 for diagnostics. Keeping them separate lets automation capture results and errors independently."],
        ["CPU usage vs load average?", "CPU usage measures processor time. Load average counts runnable tasks plus uninterruptible waits, so I/O problems can raise load without high CPU utilization."],
        ["Active vs enabled service?", "Active describes the current runtime state. Enabled means the unit is configured to start automatically; either state can exist without the other."],
        ["Why is RAID not a backup?", "RAID can survive selected device failures but also mirrors deletion and corruption. It does not protect against malware, operator error or site loss."],
        ["DAC vs MAC?", "DAC uses ownership, permissions and ACLs controlled by resource owners. MAC adds centrally enforced policy such as SELinux that even an owner cannot bypass."],
        ["TCP vs UDP?", "TCP provides an ordered reliable byte stream with connection state. UDP sends independent datagrams without built-in delivery or ordering guarantees."],
        ["Current boot vs previous boot logs?", "Use journalctl -b for the current boot and journalctl -b -1 for the previous recorded boot. Persistent journaling must be available for older boots."]
      ]
    },
    {
      title: "12. Command Output Interpretation",
      description: "Explain what the evidence means before proposing a fix.",
      items: [
        ["free -h shows very little free memory but high available memory. Is the server unhealthy?", "Not necessarily. Linux uses idle RAM for reclaimable cache. High available memory means the kernel can satisfy new allocations without heavy swapping; confirm pressure with swap activity, PSI and workload trends."],
        ["df reports 100% usage but du is much lower. What is your leading hypothesis?", "A deleted file may still be open, or data may be hidden below a mount. Check sudo lsof +L1, confirm mount boundaries and inspect only the affected filesystem before changing anything."],
        ["ps shows a process in D state. Why does kill -9 appear ineffective?", "D is uninterruptible kernel sleep, usually waiting for I/O. The signal remains pending until the kernel operation returns, so investigate storage, NFS, device and kernel errors rather than repeating kill."],
        ["systemctl shows active (exited). Is that always a failure?", "No. A oneshot service can complete successfully and remain active when RemainAfterExit is configured. Inspect Type, ExecStart, exit status and the unit's intended behavior."],
        ["ss shows 127.0.0.1:8080 LISTEN, but remote clients cannot connect. Why?", "The service is bound only to loopback. Configure an appropriate non-loopback address or proxy, then validate firewall exposure and authentication before opening access."],
        ["The journal says a process was killed by the OOM killer. What do you prove next?", "Identify the victim, allocation context and cgroup, inspect memory limits and memory.events, and correlate RSS or working-set growth. Do not assume total host RAM was exhausted when a cgroup limit may be responsible."]
      ]
    },
    {
      title: "13. Timed Practical Tasks",
      description: "Describe your commands, expected evidence, safety checks and verification in under five minutes.",
      items: [
        ["Design a safe disk-space alert script.", "Select the exact mount with df -P, validate numeric output, compare with a configurable threshold, add timestamped logging and a non-zero failure code, suppress repeated alerts and test normal, warning and command-failure paths."],
        ["Create a production-ready systemd service for an application.", "Use a dedicated unprivileged user, absolute paths, a clear WorkingDirectory, restart policy, environment source, resource limits and sandboxing. Validate with systemd-analyze verify, daemon-reload, start, logs and a real health check before enabling."],
        ["A filesystem fails to mount after reboot. Show your workflow.", "Reproduce safely with mount -av, validate the fstab fields and UUID, confirm the device and filesystem, inspect boot logs and fsck requirements, then fix the smallest error and retest a reboot in a controlled window."],
        ["Find logs larger than 500 MB changed in the last two days.", "Stay on the intended filesystem: find /var/log -xdev -type f -size +500M -mtime -2 -printf '%s %TY-%Tm-%Td %p\\n'. Review ownership, rotation and open descriptors before truncating or removing anything."],
        ["Create a least-privilege deployment account.", "Use a named account and group, key-based SSH, restricted sudo commands in a validated /etc/sudoers.d file, appropriate file ownership and no shared credentials. Test permitted and denied actions and retain a break-glass path."],
        ["Debug an application port that is unreachable remotely.", "Test the application locally, inspect the exact listener address with ss, then check host firewall, cloud rules, routes, proxy and return path. Verify from the original client after each evidence-based change."],
        ["Investigate an unexpected reboot.", "Use last -x and journalctl --list-boots, inspect the end of the previous boot, and correlate watchdog, panic, OOM, power and platform events. Preserve timestamps and external infrastructure logs before concluding root cause."],
        ["A container exceeds its memory limit. What do you change?", "First determine whether usage is expected, a leak or cache by inspecting cgroup metrics and process growth. Reduce concurrency or fix the application before raising the limit; if resizing is justified, validate node capacity and alerting."]
      ]
    },
    {
      title: "14. Behavioral & Incident Communication",
      description: "Use Situation → Action → Evidence → Result → Prevention, and keep ownership clear.",
      items: [
        ["Tell me about a production mistake you made.", "Choose a real bounded example. State the impact without excuses, explain how you detected and contained it, what you personally changed, and the durable guardrail—test, review, automation or staged rollout—that prevents recurrence."],
        ["What do you do when you do not know an interview answer?", "Say what you know, identify the uncertain part and explain how you would verify it using documentation, a safe test or evidence. Do not invent a command or pretend certainty."],
        ["A manager asks for a risky production change during an outage. How do you respond?", "Explain the specific risk and blast radius, propose the fastest safer alternative, request an explicit decision owner when tradeoffs remain, preserve rollback and document the action. Urgency does not remove safety."],
        ["How do you work during a high-pressure incident?", "Establish an incident lead and communication channel, define impact, assign parallel evidence-gathering tasks, time-stamp decisions, prefer reversible mitigation and give regular factual updates until recovery is verified."],
        ["How do you make sure the same incident does not repeat?", "Separate the triggering event from contributing system weaknesses, create prioritized actions with owners and deadlines, add detection and automated controls, test the runbook and later verify that actions actually reduced risk."],
        ["How would you communicate a Linux outage to non-technical stakeholders?", "Lead with user impact, scope, current mitigation and the next update time. Avoid unverified root-cause claims and excessive command detail; after recovery provide the confirmed cause, prevention work and ownership."]
      ]
    }
  ];

  const sprintPlan = [
    ["Day 1", "Foundations, permissions and files", "Explain 15 concepts aloud and complete one permissions lab."],
    ["Day 2", "Processes, systemd and boot", "Practice service-failure and reboot scenarios."],
    ["Day 3", "Storage and memory", "Solve disk-full, inode, mount and OOM incidents."],
    ["Day 4", "Networking, DNS and SSH", "Trace three request paths and debug one SSH failure."],
    ["Day 5", "Shell and automation", "Write one safe script and explain every failure path."],
    ["Day 6", "Containers and security", "Explain namespaces, cgroups, capabilities and MAC."],
    ["Day 7", "Full mock interview", "Run a 45-minute mock, score answers and revise weak areas."]
  ];

  function makeDetails(question, answer) {
    const details = document.createElement("details");
    details.className = "prep-question";

    const summary = document.createElement("summary");
    summary.textContent = question;

    const paragraph = document.createElement("p");
    paragraph.textContent = answer;

    details.append(summary, paragraph);
    return details;
  }

  function convertMockRounds() {
    document.querySelectorAll(".course-content section.card").forEach(function (section) {
      const heading = section.querySelector(":scope > h2");
      if (!heading || !mockAnswers[heading.textContent.trim()]) return;

      const list = section.querySelector(":scope > ol");
      if (!list) return;

      const questions = Array.from(list.children).filter(function (item) {
        return item.tagName === "LI";
      });
      const answers = mockAnswers[heading.textContent.trim()];

      if (questions.length !== answers.length) return;

      const fragment = document.createDocumentFragment();
      questions.forEach(function (question, index) {
        fragment.appendChild(
          makeDetails(question.textContent.trim(), answers[index])
        );
      });
      list.replaceWith(fragment);
    });
  }

  function addExtraSections() {
    const rubricHeading = Array.from(document.querySelectorAll("h2")).find(
      function (heading) {
        return /Self-Scoring Rubric/i.test(heading.textContent);
      }
    );
    const insertionPoint = rubricHeading && rubricHeading.closest("section");
    if (!insertionPoint) return;

    extraSections.forEach(function (sectionData) {
      const section = document.createElement("section");
      section.className = "card interview-generated-section";

      const heading = document.createElement("h2");
      heading.textContent = sectionData.title;

      const description = document.createElement("p");
      description.className = "interview-section-intro";
      description.textContent = sectionData.description;

      section.append(heading, description);
      sectionData.items.forEach(function (item) {
        section.appendChild(makeDetails(item[0], item[1]));
      });
      insertionPoint.parentNode.insertBefore(section, insertionPoint);
    });

    const sprint = document.createElement("section");
    sprint.className = "card interview-sprint-section";
    sprint.innerHTML = `
      <h2>15. Seven-Day Interview Sprint</h2>
      <p class="interview-section-intro">
        Use this plan during the final week. Speak answers aloud and record weak topics instead of only rereading notes.
      </p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Day</th><th>Focus</th><th>Required output</th></tr></thead>
          <tbody>${sprintPlan.map(function (row) {
            return `<tr><td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td></tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    `;
    insertionPoint.parentNode.insertBefore(sprint, insertionPoint);
    refreshTableOfContents();
  }

  function refreshTableOfContents() {
    const links = document.querySelector(".page-toc-links");
    if (!links) return;

    document.querySelectorAll(
      ".interview-generated-section > h2, .interview-sprint-section > h2"
    ).forEach(function (heading) {
      if (!heading.id) {
        heading.id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      if (links.querySelector('a[href="#' + heading.id + '"]')) return;

      const link = document.createElement("a");
      link.className = "page-toc-link";
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.replace(/^\d+\.\s*/, "");
      links.appendChild(link);
    });
  }

  function hash(value) {
    let result = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      result ^= value.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return (result >>> 0).toString(36);
  }

  function loadMastered() {
    try {
      return new Set(JSON.parse(localStorage.getItem("linuxInterviewMastered") || "[]"));
    } catch (error) {
      return new Set();
    }
  }

  function saveMastered(mastered) {
    localStorage.setItem(
      "linuxInterviewMastered",
      JSON.stringify(Array.from(mastered))
    );
  }

  function addPracticeCenter() {
    const content = document.querySelector(".course-content");
    const container = content && content.querySelector("main.container, .container");
    const hero = container && container.querySelector(":scope > .hero");
    if (!container || !hero) return;

    const questionDetails = Array.from(container.querySelectorAll("section.card details"));
    const mastered = loadMastered();

    questionDetails.forEach(function (details, index) {
      details.classList.add("prep-question");
      const summary = details.querySelector("summary");
      const section = details.closest("section.card");
      const sectionTitle = section && section.querySelector("h2");
      const identity =
        (sectionTitle ? sectionTitle.textContent.trim() : "Interview") +
        "|" +
        (summary ? summary.textContent.trim() : index);
      const key = hash(identity);

      details.dataset.questionKey = key;
      details.dataset.category = sectionTitle ? sectionTitle.textContent.trim() : "Other";
      details.dataset.search = identity.toLowerCase();

      const actions = document.createElement("div");
      actions.className = "prep-question-actions";

      const masterButton = document.createElement("button");
      masterButton.type = "button";
      masterButton.className = "secondary-button prep-master-button";
      actions.appendChild(masterButton);
      details.appendChild(actions);

      function paintMastery() {
        const isMastered = mastered.has(key);
        details.classList.toggle("is-mastered", isMastered);
        masterButton.innerHTML = isMastered
          ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i> Mastered'
          : '<i class="bi bi-check-circle" aria-hidden="true"></i> Mark mastered';
        masterButton.setAttribute("aria-pressed", String(isMastered));
      }

      masterButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (mastered.has(key)) mastered.delete(key);
        else mastered.add(key);
        saveMastered(mastered);
        paintMastery();
        updateDashboard();
      });
      paintMastery();
    });

    const categories = Array.from(
      new Set(questionDetails.map(function (details) {
        return details.dataset.category;
      }))
    );

    const dashboard = document.createElement("section");
    dashboard.className = "interview-practice-center";
    dashboard.setAttribute("aria-label", "Interview practice controls");
    dashboard.innerHTML = `
      <div class="interview-practice-heading">
        <div>
          <span class="eyebrow">Interactive practice</span>
          <h2>Interview Practice Center</h2>
          <p>Search, practice a random question and track answers you can explain without help.</p>
        </div>
        <div class="interview-practice-stats" aria-live="polite">
          <div><strong id="interviewMasteredCount">0</strong><span>Mastered</span></div>
          <div><strong id="interviewRemainingCount">0</strong><span>Remaining</span></div>
          <div><strong id="interviewTotalCount">0</strong><span>Total Q&amp;A</span></div>
        </div>
      </div>
      <div class="interview-progress-track" aria-hidden="true">
        <div id="interviewProgressFill"></div>
      </div>
      <div class="interview-practice-filters">
        <label class="interview-search-field">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input id="interviewSearch" type="search" placeholder="Search questions, commands or scenarios..." aria-label="Search interview questions">
        </label>
        <select id="interviewCategory" aria-label="Filter interview category">
          <option value="all">All categories</option>
          ${categories.map(function (category) {
            return `<option value="${category.replace(/&/g, "&amp;").replace(/\"/g, "&quot;")}">${category}</option>`;
          }).join("")}
        </select>
      </div>
      <div class="interview-practice-actions">
        <button type="button" id="randomInterviewQuestion">
          <i class="bi bi-shuffle" aria-hidden="true"></i> Random question
        </button>
        <button type="button" class="secondary-button" id="showInterviewAnswers">Show visible answers</button>
        <button type="button" class="secondary-button" id="hideInterviewAnswers">Hide answers</button>
      </div>
      <p class="interview-filter-status" id="interviewFilterStatus"></p>
    `;

    hero.insertAdjacentElement("afterend", dashboard);

    const search = dashboard.querySelector("#interviewSearch");
    const category = dashboard.querySelector("#interviewCategory");

    function visibleQuestions() {
      return questionDetails.filter(function (details) {
        return !details.hidden;
      });
    }

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const selected = category.value;

      questionDetails.forEach(function (details) {
        const matchesText = !query || details.dataset.search.includes(query);
        const matchesCategory = selected === "all" || details.dataset.category === selected;
        details.hidden = !(matchesText && matchesCategory);
      });

      document.querySelectorAll(".course-content section.card").forEach(function (section) {
        const questions = Array.from(section.querySelectorAll(":scope > details.prep-question"));
        if (!questions.length) return;
        section.classList.toggle(
          "interview-section-filtered",
          questions.every(function (details) { return details.hidden; })
        );
      });
      updateDashboard();
    }

    function updateDashboard() {
      const total = questionDetails.length;
      const masteredCount = questionDetails.filter(function (details) {
        return mastered.has(details.dataset.questionKey);
      }).length;
      const visible = visibleQuestions().length;

      dashboard.querySelector("#interviewMasteredCount").textContent = masteredCount;
      dashboard.querySelector("#interviewRemainingCount").textContent = total - masteredCount;
      dashboard.querySelector("#interviewTotalCount").textContent = total;
      dashboard.querySelector("#interviewProgressFill").style.width =
        (total ? Math.round((masteredCount / total) * 100) : 0) + "%";
      dashboard.querySelector("#interviewFilterStatus").textContent =
        visible === total
          ? total + " answered interview questions available."
          : visible + " of " + total + " questions match this filter.";
    }

    search.addEventListener("input", applyFilters);
    category.addEventListener("change", applyFilters);

    dashboard.querySelector("#showInterviewAnswers").addEventListener("click", function () {
      visibleQuestions().forEach(function (details) { details.open = true; });
    });

    dashboard.querySelector("#hideInterviewAnswers").addEventListener("click", function () {
      questionDetails.forEach(function (details) { details.open = false; });
    });

    dashboard.querySelector("#randomInterviewQuestion").addEventListener("click", function () {
      const available = visibleQuestions();
      if (!available.length) return;
      questionDetails.forEach(function (details) {
        details.open = false;
        details.classList.remove("random-question-active");
      });
      const choice = available[Math.floor(Math.random() * available.length)];
      choice.hidden = false;
      choice.classList.add("random-question-active");
      choice.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(function () {
        choice.classList.remove("random-question-active");
      }, 2400);
    });

    updateDashboard();
  }

  function initializeInterviewPrep() {
    if (document.body.dataset.interviewPrepReady === "true") return;
    convertMockRounds();
    addExtraSections();
    addPracticeCenter();
    document.body.dataset.interviewPrepReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeInterviewPrep);
  } else {
    initializeInterviewPrep();
  }
})();
