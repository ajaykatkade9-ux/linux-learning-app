(function () {
  const course = window.GITHUB_COURSE || {};
  const byId = id => document.getElementById(id);
  const topicSearch = byId('githubTopicSearch');
  const themeToggle = byId('githubThemeToggle');
  const sidebar = byId('sidebar');
  const overlay = byId('sidebarOverlay');
  const mobileMenuButton = byId('mobileMenuButton');

  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function renderMeta() {
    if (byId('githubSubtitle')) byId('githubSubtitle').textContent = course.meta?.subtitle || '';
    if (byId('githubWhy')) byId('githubWhy').textContent = course.meta?.why || '';
    const connections = byId('githubConnections');
    if (connections) connections.innerHTML = (course.meta?.connectsTo || []).map(item => `<span>${esc(item)}</span>`).join('');
  }

  function renderFlow() {
    const root = byId('githubFlow');
    if (!root) return;
    root.innerHTML = (course.flow || []).map((item, index) => `
      <article class="panel workflow-card">
        <span class="workflow-step">0${index + 1}</span>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
        <code>${esc(item.detail)}</code>
      </article>
    `).join('');
  }

  function renderCurriculum() {
    const root = byId('githubCurriculum');
    if (!root) return;
    const query = (topicSearch?.value || '').trim().toLowerCase();
    const groups = (course.curriculum || []).map(group => {
      const topics = (group.topics || []).filter(topic => !query || [group.group, group.description, topic].join(' ').toLowerCase().includes(query));
      return {...group, topics};
    }).filter(group => group.topics.length);

    root.innerHTML = groups.length ? groups.map(group => `
      <article class="panel curriculum-card">
        <p class="curriculum-number">${esc(group.group)}</p>
        <p class="curriculum-description">${esc(group.description)}</p>
        <ul>${group.topics.map(topic => `<li><i class="bi bi-check2"></i>${esc(topic)}</li>`).join('')}</ul>
      </article>
    `).join('') : '<div class="module-empty">No matching GitHub topics found.</div>';
  }

  function renderCommands() {
    const root = byId('githubCommands');
    if (!root) return;
    root.innerHTML = (course.commandGroups || []).map(group => `
      <article class="panel command-card">
        <h3>${esc(group.title)}</h3>
        <div class="command-list">${(group.commands || []).map(([cmd, why]) => `
          <div class="command-row"><code>${esc(cmd)}</code><p>${esc(why)}</p></div>
        `).join('')}</div>
      </article>
    `).join('');
  }

  function renderLabs() {
    const root = byId('githubLabs');
    if (!root) return;
    root.innerHTML = (course.labs || []).map((lab, index) => `
      <article class="panel lab-card">
        <div class="lab-top"><span class="lab-level">${esc(lab.level)}</span><span>#${String(index + 1).padStart(2, '0')}</span></div>
        <h3>${esc(lab.title)}</h3>
        <p><strong>Goal:</strong> ${esc(lab.goal)}</p>
        <ol>${(lab.steps || []).map(step => `<li>${esc(step)}</li>`).join('')}</ol>
      </article>
    `).join('');
  }

  function renderTroubleshooting() {
    const root = byId('githubTroubleshooting');
    if (!root) return;
    root.innerHTML = (course.troubleshooting || []).map(([problem, response]) => `
      <article class="panel trouble-card"><div class="trouble-icon"><i class="bi bi-exclamation-triangle"></i></div><div><h3>${esc(problem)}</h3><p>${esc(response)}</p></div></article>
    `).join('');
  }

  function renderProject() {
    const root = byId('githubProject');
    const project = course.project;
    if (!root || !project) return;
    root.innerHTML = `
      <div class="project-heading"><div><p class="panel-kicker">Production project</p><h2>${esc(project.title)}</h2><p>${esc(project.problem)}</p></div><span class="production-badge">Production</span></div>
      <div class="project-architecture">${(project.architecture || []).map((node, index, arr) => `<span>${esc(node)}</span>${index < arr.length - 1 ? '<i class="bi bi-arrow-right"></i>' : ''}`).join('')}</div>
      <h3>Why each part exists</h3>
      <div class="why-grid">${(project.why || []).map(([name, why]) => `<div><strong>${esc(name)}</strong><p>${esc(why)}</p></div>`).join('')}</div>
      <div class="what-happens"><strong>What is happening?</strong><p>A developer pushes an isolated change. GitHub creates a shared review context, automated checks validate the exact commit, governance decides whether it can enter main, and an approved version becomes the input to packaging and deployment.</p></div>
    `;
  }

  function renderInterview() {
    const root = byId('githubInterview');
    if (!root) return;
    root.innerHTML = (course.interview || []).map((q, index) => `<article class="panel interview-card"><span>Q${String(index + 1).padStart(2,'0')}</span><p>${esc(q)}</p></article>`).join('');
  }

  function renderDocs() {
    const root = byId('githubDocs');
    if (!root) return;
    root.innerHTML = (course.docs || []).map(doc => `<a class="panel docs-card" href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer"><i class="bi bi-box-arrow-up-right"></i><div><strong>${esc(doc.name)}</strong><span>Official source</span></div></a>`).join('');
  }

  function syncThemeButton() {
    if (!themeToggle) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    themeToggle.innerHTML = `<i class="bi ${dark ? 'bi-sun' : 'bi-moon-stars'}"></i><span>${dark ? 'Light theme' : 'Dark theme'}</span>`;
  }

  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('linuxStudyTheme', next); } catch (error) {}
    syncThemeButton();
  });

  function closeSidebar() {
    sidebar?.classList.remove('open');
    document.body.classList.remove('sidebar-open');
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
  }

  mobileMenuButton?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.toggle('open');
    document.body.classList.toggle('sidebar-open', Boolean(isOpen));
    mobileMenuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar a').forEach(link => link.addEventListener('click', closeSidebar));
  topicSearch?.addEventListener('input', renderCurriculum);

  renderMeta(); renderFlow(); renderCurriculum(); renderCommands(); renderLabs(); renderTroubleshooting(); renderProject(); renderInterview(); renderDocs(); syncThemeButton();
})();