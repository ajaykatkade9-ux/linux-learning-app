(function () {
  const course = window.GIT_COURSE || {};
  const meta = course.meta || {};
  const byId = id => document.getElementById(id);
  const themeToggle = byId('gitThemeToggle');
  const sidebar = byId('sidebar');
  const overlay = byId('sidebarOverlay');
  const mobileMenuButton = byId('mobileMenuButton');
  const topicSearch = byId('gitTopicSearch');

  if (byId('gitSubtitle')) byId('gitSubtitle').textContent = meta.subtitle || '';
  if (byId('gitWhy')) byId('gitWhy').textContent = meta.why || '';

  if (byId('gitConnections')) {
    byId('gitConnections').innerHTML = (meta.connectsTo || []).map(item => `<span><i class="bi bi-link-45deg"></i>${item}</span>`).join('');
  }

  if (byId('gitPrerequisites')) {
    byId('gitPrerequisites').innerHTML = (meta.prerequisites || []).map(item => `<span><i class="bi bi-check-circle"></i>${item}</span>`).join('');
  }

  if (byId('gitFlow')) {
    byId('gitFlow').innerHTML = (course.flow || []).map((item, index, all) => `
      <article class="panel flow-card">
        <span class="flow-number">0${index + 1}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <code>${item.command}</code>
      </article>${index < all.length - 1 ? '<span class="flow-arrow"><i class="bi bi-arrow-right"></i></span>' : ''}
    `).join('');
  }

  function renderCurriculum() {
    const target = byId('gitCurriculum');
    if (!target) return;
    const query = (topicSearch?.value || '').trim().toLowerCase();
    const groups = (course.curriculum || []).map(group => {
      const filteredTopics = group.topics.filter(topic => !query || `${group.group} ${group.description} ${topic}`.toLowerCase().includes(query));
      return { ...group, filteredTopics };
    }).filter(group => group.filteredTopics.length);

    target.innerHTML = groups.length ? groups.map(group => `
      <article class="panel curriculum-card">
        <div class="curriculum-heading">
          <h3>${group.group}</h3>
          <span>${group.filteredTopics.length} topics</span>
        </div>
        <p>${group.description}</p>
        <div class="topic-chip-grid">
          ${group.filteredTopics.map(topic => `<span>${topic}</span>`).join('')}
        </div>
      </article>
    `).join('') : '<div class="empty-state">No Git topics matched your search.</div>';
  }

  if (byId('gitCommands')) {
    byId('gitCommands').innerHTML = (course.commandGroups || []).map(group => `
      <article class="panel command-card">
        <h3>${group.title}</h3>
        <div class="command-list">
          ${group.commands.map(([command, purpose]) => `
            <div class="command-row"><code>${command}</code><p>${purpose}</p></div>
          `).join('')}
        </div>
      </article>
    `).join('');
  }

  if (byId('gitLabs')) {
    byId('gitLabs').innerHTML = (course.labs || []).map((lab, index) => `
      <article class="panel git-lab-card">
        <div class="lab-top"><span class="lab-level">${lab.level}</span><span class="lab-number">Lab ${String(index + 1).padStart(2, '0')}</span></div>
        <h3>${lab.title}</h3>
        <p><strong>Goal:</strong> ${lab.goal}</p>
        <ol>${lab.steps.map(step => `<li>${step}</li>`).join('')}</ol>
      </article>
    `).join('');
  }

  if (byId('gitTroubleshooting')) {
    byId('gitTroubleshooting').innerHTML = (course.troubleshooting || []).map(([problem, response]) => `
      <article class="panel troubleshoot-row">
        <div><span class="trouble-icon"><i class="bi bi-exclamation-triangle"></i></span><strong>${problem}</strong></div>
        <p>${response}</p>
      </article>
    `).join('');
  }

  const project = course.project || {};
  if (byId('gitProjectTitle')) byId('gitProjectTitle').textContent = project.title || '';
  if (byId('gitProjectProblem')) byId('gitProjectProblem').textContent = project.problem || '';
  if (byId('gitProjectFlow')) {
    byId('gitProjectFlow').innerHTML = (project.architecture || []).map((item, index, all) => `
      <span class="project-node">${item}</span>${index < all.length - 1 ? '<i class="bi bi-arrow-right"></i>' : ''}
    `).join('');
  }
  if (byId('gitProjectWhy')) {
    byId('gitProjectWhy').innerHTML = (project.why || []).map(([tool, reason]) => `
      <div class="why-card"><strong>Why ${tool}?</strong><p>${reason}</p></div>
    `).join('');
  }

  if (byId('gitInterview')) {
    byId('gitInterview').innerHTML = (course.interview || []).map((question, index) => `
      <article class="panel interview-card"><span>${String(index + 1).padStart(2, '0')}</span><p>${question}</p></article>
    `).join('');
  }

  if (byId('gitDocs')) {
    byId('gitDocs').innerHTML = (course.docs || []).map(doc => `
      <a href="${doc.url}" target="_blank" rel="noopener noreferrer"><i class="bi bi-box-arrow-up-right"></i><span>${doc.name}</span></a>
    `).join('');
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
    const open = sidebar?.classList.toggle('open');
    document.body.classList.toggle('sidebar-open', Boolean(open));
    mobileMenuButton?.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar a').forEach(link => link.addEventListener('click', closeSidebar));
  topicSearch?.addEventListener('input', renderCurriculum);

  renderCurriculum();
  syncThemeButton();
})();
