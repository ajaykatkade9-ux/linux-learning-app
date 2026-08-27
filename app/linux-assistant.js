(function () {
  "use strict";

  const engine = window.LinuxAssistantEngine;
  const chatLog = document.getElementById("assistantChatLog");
  const form = document.getElementById("assistantForm");
  const questionInput = document.getElementById("assistantQuestion");
  const thinking = document.getElementById("assistantThinking");
  const clearButton = document.getElementById("clearAssistantChat");
  const status = document.getElementById("assistantKnowledgeStatus");
  const historyKey = "offlineLinuxAssistantHistory";
  let history = loadHistory();

  if (!engine || !chatLog || !form || !questionInput) return;

  status.textContent =
    engine.stats.pages + " course pages · " +
    engine.stats.chunks + " lesson sections · " +
    engine.stats.officialEntries + " official references";

  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(historyKey) || "[]");
      return Array.isArray(saved) ? saved.slice(-16) : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem(historyKey, JSON.stringify(history.slice(-16)));
  }

  function makeIcon(className) {
    const icon = document.createElement("i");
    icon.className = "bi " + className;
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function makeMessage(role) {
    const article = document.createElement("article");
    article.className = "assistant-message assistant-message-" + role;

    const avatar = document.createElement("span");
    avatar.className = "assistant-message-avatar";
    avatar.appendChild(makeIcon(role === "user" ? "bi-person" : "bi-chat-dots"));

    const content = document.createElement("div");
    content.className = "assistant-message-content";

    const label = document.createElement("p");
    label.className = "assistant-message-label";
    label.textContent = role === "user" ? "You" : "Linux Assistant";

    content.appendChild(label);
    article.append(avatar, content);
    return { article: article, content: content };
  }

  function renderUserMessage(question) {
    const message = makeMessage("user");
    const bubble = document.createElement("div");
    bubble.className = "assistant-user-bubble";
    bubble.textContent = question;
    message.content.appendChild(bubble);
    chatLog.appendChild(message.article);
  }

  function copyText(value, button) {
    const fallback = function () {
      const input = document.createElement("textarea");
      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    };

    const action = navigator.clipboard && window.isSecureContext
      ? navigator.clipboard.writeText(value)
      : Promise.resolve().then(fallback);

    action.then(function () {
      const original = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> Copied';
      window.setTimeout(function () { button.innerHTML = original; }, 1300);
    }).catch(function () {
      button.textContent = "Select manually";
    });
  }

  function answerAsText(answer) {
    const parts = [answer.title, answer.summary];
    if (answer.commands && answer.commands.length) {
      parts.push("Commands:\n" + answer.commands.join("\n\n"));
    }
    if (answer.sources && answer.sources.length) {
      parts.push(
        "Sources:\n" + answer.sources.map(function (source) {
          return source.title + " — " + source.section +
            (source.official ? "\n" + source.href : "");
        }).join("\n")
      );
    }
    return parts.filter(Boolean).join("\n\n");
  }

  function makeSuggestionButtons(questions) {
    const suggestions = document.createElement("div");
    suggestions.className = "assistant-inline-suggestions";
    questions.forEach(function (question) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = question;
      button.addEventListener("click", function () {
        askQuestion(question);
      });
      suggestions.appendChild(button);
    });
    return suggestions;
  }

  function renderAssistantMessage(answer) {
    const message = makeMessage("bot");
    const card = document.createElement("div");
    card.className = "assistant-answer-card";

    if (!answer.found) {
      const title = document.createElement("h2");
      title.textContent = "No exact course match";
      const paragraph = document.createElement("p");
      paragraph.textContent = answer.message;
      card.append(title, paragraph);
      if (answer.suggestions) {
        card.appendChild(makeSuggestionButtons(answer.suggestions));
      }
      message.content.appendChild(card);
      chatLog.appendChild(message.article);
      return;
    }

    const header = document.createElement("div");
    header.className = "assistant-answer-header";
    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = answer.title;
    titleWrap.appendChild(title);

    if (answer.context) {
      const context = document.createElement("p");
      context.className = "assistant-answer-context";
      context.textContent = "From " + answer.context;
      titleWrap.appendChild(context);
    }
    header.appendChild(titleWrap);

    if (!answer.greeting) {
      const confidence = document.createElement("span");
      confidence.className = "assistant-match-badge";
      confidence.textContent = answer.confidence;
      header.appendChild(confidence);
    }
    card.appendChild(header);

    const summary = document.createElement("p");
    summary.className = "assistant-answer-summary";
    summary.textContent = answer.summary;
    card.appendChild(summary);

    if (answer.commands && answer.commands.length) {
      const commandHeading = document.createElement("h3");
      commandHeading.textContent = "Useful commands";
      card.appendChild(commandHeading);

      answer.commands.forEach(function (command) {
        const wrapper = document.createElement("div");
        wrapper.className = "assistant-command-block";
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = command;
        pre.appendChild(code);

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "assistant-command-copy";
        copyButton.setAttribute("aria-label", "Copy commands");
        copyButton.append(makeIcon("bi-copy"), document.createTextNode("Copy"));
        copyButton.addEventListener("click", function () {
          copyText(command, copyButton);
        });
        wrapper.append(pre, copyButton);
        card.appendChild(wrapper);
      });
    }

    if (answer.sources && answer.sources.length) {
      const sourceHeading = document.createElement("h3");
      sourceHeading.textContent = "Course and official sources";
      const sources = document.createElement("div");
      sources.className = "assistant-source-list";
      answer.sources.forEach(function (source) {
        const link = document.createElement("a");
        link.href = source.href;
        if (source.official) {
          link.classList.add("assistant-source-official");
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        const copy = document.createElement("span");
        if (source.official) {
          const badge = document.createElement("em");
          badge.className = "assistant-source-badge";
          badge.textContent = "Official";
          copy.appendChild(badge);
        }
        const strong = document.createElement("strong");
        strong.textContent = source.title;
        const small = document.createElement("small");
        small.textContent = source.section;
        copy.append(strong, small);
        link.append(copy, makeIcon("bi-arrow-right"));
        sources.appendChild(link);
      });
      card.append(sourceHeading, sources);
    }

    const footer = document.createElement("div");
    footer.className = "assistant-answer-footer";
    const copyAnswer = document.createElement("button");
    copyAnswer.type = "button";
    copyAnswer.className = "assistant-copy-answer";
    copyAnswer.append(makeIcon("bi-copy"), document.createTextNode("Copy answer"));
    copyAnswer.addEventListener("click", function () {
      copyText(answerAsText(answer), copyAnswer);
    });
    footer.appendChild(copyAnswer);
    card.appendChild(footer);

    message.content.appendChild(card);
    chatLog.appendChild(message.article);
  }

  function scrollToLatest() {
    window.requestAnimationFrame(function () {
      chatLog.scrollTop = chatLog.scrollHeight;
      chatLog.lastElementChild && chatLog.lastElementChild.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  }

  function setThinking(active) {
    thinking.hidden = !active;
    form.querySelector("button[type='submit']").disabled = active;
    if (active) thinking.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function askQuestion(question, save) {
    const cleanQuestion = String(question || "").trim().slice(0, 500);
    if (!cleanQuestion) return;

    renderUserMessage(cleanQuestion);
    questionInput.value = "";
    resizeInput();
    setThinking(true);
    scrollToLatest();

    window.setTimeout(function () {
      const answer = engine.answer(cleanQuestion);
      setThinking(false);
      renderAssistantMessage(answer);
      if (save !== false) {
        history.push({ question: cleanQuestion, answer: answer });
        history = history.slice(-16);
        saveHistory();
      }
      scrollToLatest();
      questionInput.focus();
    }, 260);
  }

  function resizeInput() {
    questionInput.style.height = "auto";
    questionInput.style.height = Math.min(150, questionInput.scrollHeight) + "px";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    askQuestion(questionInput.value);
  });

  questionInput.addEventListener("input", resizeInput);
  questionInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  document.getElementById("assistantStarterPrompts").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-question]");
    if (button) askQuestion(button.dataset.question);
  });

  clearButton.addEventListener("click", function () {
    history = [];
    localStorage.removeItem(historyKey);
    chatLog.querySelectorAll(".assistant-message:not(:first-child)").forEach(function (message) {
      message.remove();
    });
    questionInput.focus();
  });

  history.forEach(function (item) {
    if (!item || !item.question || !item.answer) return;
    renderUserMessage(item.question);
    renderAssistantMessage(item.answer);
  });
  scrollToLatest();
})();
