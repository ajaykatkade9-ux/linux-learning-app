(function(){
  'use strict';

  const id = new URLSearchParams(location.search).get('id');
  const data = (window.DEVOPS_MODULES || {})[id];
  const deep = (window.DEVOPS_DEEP_COURSES || {})[id] || {};
  const $ = key => document.getElementById(key);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  if (!data) {
    document.body.innerHTML = '<main style="padding:40px;font-family:system-ui"><h1>Module not found</h1><p><a href="devops.html">Back to DevOps Hub</a></p></main>';
    return;
  }

  const allTopics = (data.curriculum || []).flatMap(group => group.topics || []);
  const isGenericArchitecture = !deep.architecture && Array.isArray(data.architecture) && data.architecture.some(item => String(typeof item === 'string' ? item : item.title || '').includes('User / Source'));
  const isGenericInternals = !deep.internals && Array.isArray(data.internals) && data.internals.some(item => String(item.title || '').toLowerCase() === 'control logic');

  document.title = `${data.name} | Beginner to Production`;
  $('toolName').textContent = data.name;
  $('sideToolName').textContent = data.name;
  $('toolTrack').textContent = `${data.name} Course`;
  $('toolAvatar').textContent = (data.name.match(/[A-Z0-9]/g) || data.name.split(/\s+/).map(x => x[0])).join('').slice(0,2).toUpperCase();
  $('toolStage').textContent = `DevOps Stage ${String(data.stage).padStart(2,'0')} · ${data.category}`;
  $('toolSubtitle').textContent = `Beginner → practical → architecture → troubleshooting → production → interview`;
  $('toolHeroTitle').textContent = `What is ${data.name} and why do we use it?`;
  $('toolWhy').textContent = data.why || data.purpose;
  $('toolBefore').textContent = (data.prerequisites || data.before || []).slice(0,3).join(' → ') || 'DevOps basics';
  $('toolCurrent').textContent = data.name;
  $('toolAfter').textContent = (data.after || []).slice(0,3).join(' → ') || (data.connectsTo || []).slice(0,3).join(' → ') || 'Production use';
  $('toolRoles').textContent = (data.roles || ['DevOps Engineer']).join(' · ');

  function fallbackRevision() {
    return [
      `${data.name}: ${data.purpose}`,
      `Learn first: ${(data.prerequisites || ['Linux / DevOps basics']).join(', ')}.`,
      `Common connections: ${(data.connectsTo || []).slice(0,5).join(', ') || 'other DevOps systems'}.`,
      `Main learning goal: understand the problem, components, commands, failure modes and production usage—not only syntax.`,
      `Use the official documentation at the end of this module for version-specific behavior and exact current configuration.`
    ];
  }

  $('quickRevision').innerHTML = (deep.quickRevision || fallbackRevision()).map(item => `<li>${esc(item)}</li>`).join('');

  function renderCoverage(query = '') {
    const q = query.trim().toLowerCase();
    const topics = allTopics.filter(topic => !q || topic.toLowerCase().includes(q));
    $('coverageCount').textContent = `${allTopics.length} topics`;
    $('toolCoverage').innerHTML = topics.length
      ? topics.map((topic,index) => `<span class="coverage-chip"><b>${String(index + 1).padStart(2,'0')}</b>${esc(topic)}</span>`).join('')
      : '<div class="module-empty">No matching topics.</div>';
  }

  function renderLessons(query = '') {
    const q = query.trim().toLowerCase();
    if (deep.lessons && deep.lessons.length) {
      const lessons = deep.lessons.filter(lesson => !q || [lesson.title, lesson.summary, ...(lesson.points || []).flat()].join(' ').toLowerCase().includes(q));
      $('toolLessons').innerHTML = lessons.length ? lessons.map((lesson,index) => `
        <details class="panel lesson-card" ${index === 0 && !q ? 'open' : ''}>
          <summary>
            <span class="lesson-number">${String(index + 1).padStart(2,'0')}</span>
            <span class="lesson-summary-copy"><small>${esc(lesson.level || 'Lesson')}</small><strong>${esc(lesson.title)}</strong><span>${esc(lesson.summary || '')}</span></span>
            <i class="bi bi-chevron-down"></i>
          </summary>
          <div class="lesson-body">
            ${(lesson.points || []).map(point => `<div class="explain-row"><strong>${esc(point[0])}</strong><p>${esc(point[1])}</p></div>`).join('')}
          </div>
        </details>`).join('') : '<div class="module-empty">No matching deep lessons.</div>';
      return;
    }

    const groups = (data.curriculum || []).map(group => ({...group, topics:(group.topics || []).filter(topic => !q || [group.group,group.description,topic].join(' ').toLowerCase().includes(q))})).filter(group => group.topics.length);
    $('toolLessons').innerHTML = groups.length ? `
      <div class="authoring-note"><i class="bi bi-info-circle"></i><div><strong>Coverage is mapped, but this module is not yet deep-authored in V2.</strong><p>The old generic filler has been removed. These are the real topics that must be learned; detailed explanations will be added tool-by-tool rather than inventing fake internals.</p></div></div>
      ${groups.map((group,index) => `<article class="panel mapped-chapter"><span class="lesson-number">${String(index + 1).padStart(2,'0')}</span><div><small>${esc(group.group)}</small><h3>${esc(group.description || 'Course chapter')}</h3><ul>${group.topics.map(topic => `<li>${esc(topic)}</li>`).join('')}</ul></div></article>`).join('')}` : '<div class="module-empty">No matching topics.</div>';
  }

  const search = $('topicSearch');
  function refreshLearning() { const q = search.value || ''; renderCoverage(q); renderLessons(q); }
  search.addEventListener('input', refreshLearning);
  renderCoverage();
  renderLessons();

  function renderArchitecture() {
    const architecture = deep.architecture || (!isGenericArchitecture ? data.architecture : []);
    if (!architecture || !architecture.length) {
      $('toolArchitecture').innerHTML = '<div class="authoring-note"><i class="bi bi-shield-check"></i><div><strong>Generic architecture intentionally hidden.</strong><p>This course will only show a diagram after the real components and flow for this tool are authored.</p></div></div>';
    } else {
      $('toolArchitecture').innerHTML = architecture.map((node,index) => {
        const title = Array.isArray(node) ? node[0] : (typeof node === 'string' ? node : node.title);
        const text = Array.isArray(node) ? node[1] : (typeof node === 'object' ? node.text : '');
        return `<div class="architecture-step"><span>${String(index + 1).padStart(2,'0')}</span><div><strong>${esc(title)}</strong>${text ? `<p>${esc(text)}</p>` : ''}</div></div>`;
      }).join('');
    }

    const internals = deep.internals || (!isGenericInternals ? data.internals : []);
    if (!internals || !internals.length) {
      $('toolInternals').innerHTML = '<div class="authoring-note"><i class="bi bi-shield-check"></i><div><strong>Generic internal-working text intentionally hidden.</strong><p>V2 will explain the real internal sequence for this tool instead of repeating the same text across every module.</p></div></div>';
    } else {
      $('toolInternals').innerHTML = internals.map((step,index) => {
        const title = Array.isArray(step) ? step[0] : (step.title || `Step ${index + 1}`);
        const text = Array.isArray(step) ? step[1] : step.text;
        return `<div class="internal-step"><span>${String(index + 1).padStart(2,'0')}</span><div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`;
      }).join('');
    }
  }
  renderArchitecture();

  $('toolCommands').innerHTML = (data.commandGroups || []).map(group => `
    <article class="panel command-card">
      <h3>${esc(group.title)}</h3>
      <div class="command-list">${(group.commands || []).map(command => `<div class="command-row"><code>${esc(command[0])}</code><p><strong>Why:</strong> ${esc(command[1])}</p></div>`).join('')}</div>
    </article>`).join('') || '<div class="module-empty">Tool-specific commands are being authored.</div>';

  const labs = deep.labs || data.labs || [];
  $('toolLabs').innerHTML = labs.map((lab,index) => `
    <article class="panel lab-card">
      <div class="lab-top"><span class="lab-level">${esc(lab.level || 'Lab')}</span><span>#${String(index + 1).padStart(2,'0')}</span></div>
      <h3>${esc(lab.title)}</h3>
      <p><strong>Goal:</strong> ${esc(lab.goal)}</p>
      <ol>${(lab.steps || []).map(step => `<li>${esc(step)}</li>`).join('')}</ol>
      <div class="lab-finish"><strong>Finish only when:</strong> you can explain what happened, how you verified it, and what you would check if it failed.</div>
    </article>`).join('');

  const troubleshooting = deep.troubleshooting || data.troubleshooting || [];
  $('toolTroubleshooting').innerHTML = troubleshooting.map(item => `
    <article class="panel trouble-card">
      <span class="trouble-icon"><i class="bi bi-exclamation-triangle"></i></span>
      <div><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></div>
    </article>`).join('');

  $('toolSecurity').innerHTML = (data.security || []).map(item => `<li>${esc(item)}</li>`).join('');
  $('toolBest').innerHTML = (data.bestPractices || []).map(item => `<li>${esc(item)}</li>`).join('');
  $('toolMistakes').innerHTML = (data.mistakes || []).map(item => `<li>${esc(item)}</li>`).join('');
  $('toolConnections').innerHTML = (data.connectsTo || []).map(item => `<span>${esc(item)}</span>`).join('');

  const interview = deep.interview || (data.interview || []).map(question => [question, 'Try answering from the lessons above. A tool-specific model answer has not yet been authored in V2.']);
  $('toolInterview').innerHTML = interview.map((item,index) => `
    <details class="panel interview-item">
      <summary><span>Q${String(index + 1).padStart(2,'0')}</span><strong>${esc(item[0])}</strong><i class="bi bi-chevron-down"></i></summary>
      <div class="interview-answer"><b>Answer:</b><p>${esc(item[1])}</p></div>
    </details>`).join('');

  const quiz = deep.quiz || [];
  $('toolQuiz').innerHTML = quiz.length ? quiz.map((item,index) => `
    <article class="panel quiz-card" data-answer="${item.answer}">
      <p class="quiz-number">Question ${index + 1}</p>
      <h3>${esc(item.q)}</h3>
      <div class="quiz-options">${item.options.map((option,optIndex) => `<button type="button" data-index="${optIndex}">${esc(option)}</button>`).join('')}</div>
      <p class="quiz-feedback" hidden>${esc(item.why)}</p>
    </article>`).join('') : '<div class="authoring-note"><i class="bi bi-info-circle"></i><div><strong>Quiz not yet authored for this V2 module.</strong><p>We will add tool-specific questions instead of generic multiple-choice filler.</p></div></div>';

  document.querySelectorAll('.quiz-card').forEach(card => {
    card.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      const answer = Number(card.dataset.answer);
      const selected = Number(button.dataset.index);
      card.querySelectorAll('button').forEach((option,index) => {
        option.classList.remove('correct','wrong');
        if (index === answer) option.classList.add('correct');
      });
      if (selected !== answer) button.classList.add('wrong');
      const feedback = card.querySelector('.quiz-feedback');
      feedback.hidden = false;
      feedback.innerHTML = `<strong>${selected === answer ? 'Correct.' : 'Not quite.'}</strong> ${feedback.textContent}`;
    }));
  });

  const project = deep.project || data.project || {};
  const projectArchitecture = project.architecture || deep.architecture || data.architecture || [];
  $('toolProject').innerHTML = `
    <div class="project-heading"><div><p class="panel-kicker">Production project</p><h2>${esc(project.title || `${data.name} Real Project`)}</h2><p>${esc(project.problem || `Use ${data.name} in a realistic DevOps workflow and explain why every part exists.`)}</p></div><span class="production-badge">Build + explain</span></div>
    <div class="project-architecture">${projectArchitecture.slice(0,8).map((node,index,array) => { const title = Array.isArray(node) ? node[0] : (typeof node === 'string' ? node : node.title); return `<span>${esc(title)}</span>${index < array.length - 1 ? '<i class="bi bi-arrow-right"></i>' : ''}`; }).join('')}</div>
    <h3>Why each part exists</h3>
    <div class="why-grid">${(project.why || [[data.name,data.purpose],['Git','Keep every configuration change reviewable.'],['Verification','Prove the expected state actually happened.'],['Troubleshooting','Practice failure recovery instead of only the happy path.']]).map(item => `<div><strong>${esc(item[0])}</strong><p>${esc(item[1])}</p></div>`).join('')}</div>
    <div class="what-happens"><strong>What should you be able to explain at the end?</strong><p>${esc(project.internal || `What enters ${data.name}, what it does internally, what system receives the result, how you verify success, and how you recover when it fails.`)}</p></div>`;

  $('toolDocs').innerHTML = (data.docs || []).map(doc => `<a class="panel docs-card" href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer"><i class="bi bi-box-arrow-up-right"></i><div><strong>${esc(doc.name)}</strong><span>Official source · verify current syntax here</span></div></a>`).join('') || '<div class="module-empty">Official documentation link is being added.</div>';

  const theme = $('toolThemeToggle');
  function syncTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    theme.innerHTML = `<i class="bi ${dark ? 'bi-sun' : 'bi-moon-stars'}"></i><span>${dark ? 'Light theme' : 'Dark theme'}</span>`;
    theme.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  theme.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('linuxStudyTheme', next); } catch (error) {}
    syncTheme();
  });
  syncTheme();

  const sidebar = $('sidebar');
  const overlay = $('sidebarOverlay');
  const menu = $('mobileMenuButton');
  function closeNav() { sidebar?.classList.remove('open'); document.body.classList.remove('sidebar-open'); menu?.setAttribute('aria-expanded','false'); }
  menu?.addEventListener('click', () => { const open = sidebar?.classList.toggle('open'); document.body.classList.toggle('sidebar-open', Boolean(open)); menu.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  overlay?.addEventListener('click', closeNav);
  document.querySelectorAll('.sidebar a').forEach(link => link.addEventListener('click', closeNav));
})();
