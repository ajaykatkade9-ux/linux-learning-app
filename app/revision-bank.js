(function (global) {
  "use strict";

  const knowledge = global.LINUX_KNOWLEDGE || { chunks: [] };
  const officialKnowledge = global.LINUX_OFFICIAL_KNOWLEDGE || { entries: [] };
  const targetCount = 20;
  const typeOrder = ["Recall", "Interview", "Scenario", "Hands-On"];

  const typeMeta = {
    "Recall": { icon: "🧠", button: "Show Answer" },
    "Interview": { icon: "🎯", button: "Show Answer" },
    "Scenario": { icon: "🔥", button: "Show Approach" },
    "Hands-On": { icon: "🧪", button: "Show Task" }
  };

  const skippedHeadings = new Set([
    "overview",
    "topic progress",
    "completion standard",
    "official documentation",
    "official study references"
  ]);

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function shorten(value, length) {
    const text = clean(value);
    if (text.length <= length) return text;
    return text.slice(0, length).replace(/\s+\S*$/, "") + "…";
  }

  function headingLabel(value) {
    return clean(value)
      .replace(/\s+— Part \d+$/, "")
      .replace(/^\d+\.\s*/, "");
  }

  function coreExercises(topic) {
    return [
      {
        id: topic.id + "-core-recall",
        type: "Recall",
        title: "30-Second Recall",
        question: topic.recallQuestion,
        answer: topic.recallAnswer,
        commands: []
      },
      {
        id: topic.id + "-core-interview",
        type: "Interview",
        title: "Interview Recall",
        question: topic.interviewQuestion,
        answer: topic.interviewAnswer,
        commands: []
      },
      {
        id: topic.id + "-core-scenario",
        type: "Scenario",
        title: "Production Scenario",
        question: topic.scenarioQuestion,
        answer: topic.scenarioAnswer,
        commands: []
      },
      {
        id: topic.id + "-core-hands-on",
        type: "Hands-On",
        title: "Hands-On Task",
        question: topic.taskLabel,
        answer: "Run the commands in a safe learning environment. Explain what each output proves before marking the exercise complete.",
        commands: topic.commands || []
      }
    ];
  }

  function courseSources(topic) {
    if (topic.id === "docs") {
      return officialKnowledge.entries.map(function (entry) {
        return {
          id: "official-" + entry.id,
          heading: entry.title,
          text: entry.summary,
          commands: entry.commands || [],
          source: entry.source,
          url: entry.url
        };
      });
    }

    const seen = new Set();
    return knowledge.chunks.filter(function (chunk) {
      if (chunk.page !== topic.page) return false;
      const label = headingLabel(chunk.heading).toLowerCase();
      if (skippedHeadings.has(label)) return false;
      const key = label + "|" + shorten(chunk.text, 120).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return clean(chunk.text).length > 35;
    }).map(function (chunk) {
      return {
        id: chunk.id,
        heading: headingLabel(chunk.heading),
        text: chunk.text,
        commands: chunk.commands || [],
        source: chunk.pageTitle,
        url: chunk.page + "#" + chunk.anchor
      };
    });
  }

  function fallbackCommands(topic, index) {
    const commands = topic.commands || [];
    if (!commands.length) return [];
    const start = index % commands.length;
    return [
      commands[start],
      commands[(start + 1) % commands.length],
      commands[(start + 2) % commands.length]
    ].filter(function (command, position, list) {
      return command && list.indexOf(command) === position;
    });
  }

  function exerciseFromSource(
    topic,
    source,
    type,
    number,
    variant
  ) {
    const label = source.heading || topic.name;
    const summary = shorten(source.text, 850);
    const commands = (source.commands || []).slice(0, 2);
    const variation = variant % 3;

    if (type === "Recall") {
      const questions = [
        "Without notes, explain “" + label + "” and why it matters.",
        "List the key facts and one common mistake related to “" + label + "”.",
        "Teach “" + label + "” to a new Linux administrator in three clear points."
      ];
      return {
        id: topic.id + "-generated-" + number,
        type: type,
        title: "Concept Recall",
        question: questions[variation],
        answer: summary,
        commands: [],
        source: source.source,
        href: source.url
      };
    }

    if (type === "Interview") {
      const questions = [
        "What would a strong interview answer cover about “" + label + "”?",
        "What follow-up question might an interviewer ask about “" + label + "”, and how would you answer it?",
        "Give a concise production-focused explanation of “" + label + "”."
      ];
      return {
        id: topic.id + "-generated-" + number,
        type: type,
        title: "Interview Check",
        question: questions[variation],
        answer: summary,
        commands: [],
        source: source.source,
        href: source.url
      };
    }

    if (type === "Scenario") {
      const questions = [
        "During a " + topic.name + " incident, how could “" + label + "” help your investigation?",
        "A recent change affects “" + label + "”. Which evidence would you collect before attempting a fix?",
        "A production symptom points toward “" + label + "”. How would you confirm or reject that hypothesis?"
      ];
      return {
        id: topic.id + "-generated-" + number,
        type: type,
        title: "Troubleshooting Scenario",
        question: questions[variation],
        answer: [
          summary,
          "Collect evidence first, confirm the affected scope and test the smallest reversible change.",
          "Validate the result from the user or application perspective."
        ],
        commands: commands,
        source: source.source,
        href: source.url
      };
    }

    const questions = [
      "Practice “" + label + "” and explain what each result proves.",
      "Perform a safe read-only inspection of “" + label + "” and record your observations.",
      "Design a small lab for “" + label + "”, including validation and cleanup."
    ];
    return {
      id: topic.id + "-generated-" + number,
      type: type,
      title: "Command Practice",
      question: questions[variation],
      answer: summary,
      commands: commands.length ? commands : fallbackCommands(topic, number),
      source: source.source,
      href: source.url
    };
  }

  function fallbackExercise(topic, number) {
    const keywords = clean(topic.keywords).split(" ").filter(Boolean);
    const keyword = keywords[number % Math.max(1, keywords.length)] || topic.name;
    const type = typeOrder[number % typeOrder.length];
    return {
      id: topic.id + "-fallback-" + number,
      type: type,
      title: type === "Hands-On" ? "Command Practice" : type + " Review",
      question: "Explain how “" + keyword + "” relates to " + topic.name + ".",
      answer: topic.recallAnswer,
      commands: type === "Hands-On" ? fallbackCommands(topic, number) : []
    };
  }

  function build(topic) {
    const exercises = coreExercises(topic);
    const sources = courseSources(topic);
    let generated = 0;

    while (exercises.length < targetCount && sources.length) {
      const source = sources[generated % sources.length];
      const type = typeOrder[generated % typeOrder.length];
      exercises.push(
        exerciseFromSource(
          topic,
          source,
          type,
          exercises.length + 1,
          Math.floor(generated / sources.length)
        )
      );
      generated += 1;
    }

    while (exercises.length < targetCount) {
      exercises.push(fallbackExercise(topic, exercises.length + 1));
    }

    return exercises.slice(0, targetCount).map(function (exercise, index) {
      exercise.number = index + 1;
      exercise.meta = typeMeta[exercise.type];
      return exercise;
    });
  }

  global.RevisionBank = {
    build: build,
    count: targetCount,
    types: typeOrder.slice(),
    typeMeta: typeMeta
  };
})(window);
