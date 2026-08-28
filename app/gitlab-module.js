(function () {
  const course = window.GITLAB_COURSE || {};
  const byId = id => document.getElementById(id);
  const topicSearch = byId('gitlabTopicSearch');
  const themeToggle = byId('gitlabThemeToggle');
  const sidebar = byId('sidebar');
  const overlay = byId('sidebarOverlay');
  const mobileMenuButton = byId('mobileMenuButton');
  const esc = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function renderMeta() {
    byId('gitlabSubtitle').textContent = course.meta?.subtitle || '';
    byId('gitlabWhy').textContent = course.meta?.why || '';
    byId('gitlabConnections').innerHTML = (course.meta?.connectsTo || []).map(item => `<span>${esc(item)}</span>`).join('');
  }

  function renderFlow() {
    byId('gitlabFlow').innerHTML = (course.flow || []).map((item, index) => `
      <article class="panel workflow-card"><span class="workflow-step">${String(index + 1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p><code>${esc(item.detail)}</code></article>
    `).join('');
  }

  function renderCurriculum() {
    const query = (topicSearch?.value || '').trim().toLowerCase();
    const groups = (course.curriculum || []).map(group => ({...group, topics:(group.topics || []).filter(topic => !query || [group.group, group.description, topic].join(' ').toLowerCase().includes(query))})).filter(group => group.topics.length);
    byId('gitlabCurriculum').innerHTML = groups.length ? groups.map(group => `
      <article class="panel curriculum-card"><p class="curriculum-number">${esc(group.group)}</p><p class="curriculum-description">${esc(group.description)}</p><ul>${group.topics.map(topic => `<li><i class="bi bi-check2"></i>${esc(topic)}</li>`).join('')}</ul></article>
    `).join('') : '<div class="module-empty">No matching GitLab topics found.</div>';
  }

  function renderCommands() {
    byId('gitlabCommands').innerHTML = (course.commandGroups || []).map(group => `
      <article class="panel command-card"><h3>${esc(group.title)}</h3><div class="command-list">${(group.commands || []).map(([cmd, why]) => `<div class="command-row"><code>${esc(cmd)}</code><p>${esc(why)}</p></div>`).join('')}</div></article>
    `).join('');
  }

  function renderLabs() {
    byId('gitlabLabs').innerHTML = (course.labs || []).map((lab, index) => `
      <article class="panel lab-card"><div class="lab-top"><span class="lab-level">${esc(lab.level)}</span><span>#${String(index + 1).padStart(2,'0')}</span></div><h3>${esc(lab.title)}</h3><p><strong>Goal:</strong> ${esc(lab.goal)}</p><ol>${(lab.steps || []).map(step => `<li>${esc(step)}</li>`).join('')}</ol></article>
    `).join('');
  }

  function renderTroubleshooting() {
    byId('gitlabTroubleshooting').innerHTML = (course.troubleshooting || []).map(([problem, response]) => `<article class="panel trouble-card"><div class="trouble-icon"><i class="bi bi-exclamation-triangle"></i></div><div><h3>${esc(problem)}</h3><p>${esc(response)}</p></div></article>`).join('');
  }

  function renderProject() {
    const p = course.project;
    byId('gitlabProject').innerHTML = `
      <div class="project-heading"><div><p class="panel-kicker">Production project</p><h2>${esc(p.title)}</h2><p>${esc(p.problem)}</p></div><span class="production-badge">Production</span></div>
      <div class="project-architecture">${p.architecture.map((node, i) => `<span>${esc(node)}</span>${i < p.architecture.length - 1 ? '<i class="bi bi-arrow-right"></i>' : ''}`).join('')}</div>
      <h3>Why each part exists</h3>
      <div class="why-grid">${p.why.map(([name, why]) => `<div><strong>${esc(name)}</strong><p>${esc(why)}</p></div>`).join('')}</div>
      <div class="what-happens"><strong>What is happening?</strong><p>A developer pushes a feature branch. GitLab turns it into a reviewable merge request, policy and CI/CD validate the change, a versioned artifact is stored in the registry, and protected deployment controls decide when it can move into production.</p></div>`;
  }

  function renderInterview() {
    byId('gitlabInterview').innerHTML = (course.interview || []).map((q, index) => `<article class="panel interview-card"><span>Q${String(index + 1).padStart(2,'0')}</span><p>${esc(q)}</p></article>`).join('');
  }

  function renderDocs() {
    byId('gitlabDocs').innerHTML = (course.docs || []).map(doc => `<a class="panel docs-card" href="${esc(doc.url)}" target="_blank" rel="noopener noreferrer"><i class="bi bi-box-arrow-up-right"></i><div><strong>${esc(doc.name)}</strong><span>Official source</span></div></a>`).join('');
  }

  function syncThemeButton() {
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
    const open = sidebar?.classList.toggle('open');
    document.body.classList.toggle('sidebar-open', Boolean(open));
    mobileMenuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar a').forEach(link => link.addEventListener('click', closeSidebar));
  topicSearch?.addEventListener('input', renderCurriculum);

  renderMeta(); renderFlow(); renderCurriculum(); renderCommands(); renderLabs(); renderTroubleshooting(); renderProject(); renderInterview(); renderDocs(); syncThemeButton();
})();
