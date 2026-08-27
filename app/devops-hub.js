(function () {
  const tools = Array.isArray(window.DEVOPS_TOOLS) ? window.DEVOPS_TOOLS : [];
  const path = Array.isArray(window.DEVOPS_PATH) ? window.DEVOPS_PATH : [];
  const toolGrid = document.getElementById('toolGrid');
  const toolSearch = document.getElementById('toolSearch');
  const toolFilters = document.getElementById('toolFilters');
  const learningPath = document.getElementById('learningPath');
  const themeToggle = document.getElementById('devopsThemeToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const mobileMenuButton = document.getElementById('mobileMenuButton');

  let activeCategory = 'All';

  function iconFor(category) {
    const icons = {
      'Foundation': 'bi-terminal',
      'Source Control': 'bi-git',
      'Containers': 'bi-box-seam',
      'CI/CD': 'bi-arrow-repeat',
      'IaC & Automation': 'bi-braces',
      'Kubernetes': 'bi-hexagon',
      'GitOps': 'bi-diagram-3',
      'Cloud': 'bi-cloud',
      'Observability': 'bi-activity',
      'DevSecOps': 'bi-shield-check',
      'SRE & Platform': 'bi-building-gear'
    };
    return icons[category] || 'bi-tools';
  }

  function renderPath() {
    if (!learningPath) return;
    learningPath.innerHTML = path.map(item => `
      <article class="path-card">
        <span class="path-step">${item.step}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join('');
  }

  function renderFilters() {
    if (!toolFilters) return;
    const categories = ['All', ...new Set(tools.map(tool => tool.category))];
    toolFilters.innerHTML = categories.map(category => `
      <button type="button" class="tool-filter${category === activeCategory ? ' active' : ''}" data-category="${category}">${category}</button>
    `).join('');

    toolFilters.querySelectorAll('.tool-filter').forEach(button => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.category;
        renderFilters();
        renderTools();
      });
    });
  }

  function renderTools() {
    if (!toolGrid) return;
    const query = (toolSearch?.value || '').trim().toLowerCase();
    const filtered = tools.filter(tool => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const haystack = [tool.name, tool.category, tool.purpose, ...(tool.connectsTo || [])].join(' ').toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });

    if (!filtered.length) {
      toolGrid.innerHTML = '<div class="empty-state">No matching tools found.</div>';
      return;
    }

    toolGrid.innerHTML = filtered.map(tool => {
      const connected = (tool.connectsTo || []).slice(0, 3).join(' · ') || 'Core platform';
      const link = tool.href || '#';
      const available = tool.status === 'available';
      return `
        <article class="panel tool-card">
          <div class="tool-card-top">
            <span class="tool-icon"><i class="bi ${iconFor(tool.category)}"></i></span>
            <span class="tool-status ${available ? 'available' : ''}">${available ? 'Available' : 'Planned'}</span>
          </div>
          <p class="tool-category">${tool.category}</p>
          <h3>${tool.name}</h3>
          <p class="tool-purpose">${tool.purpose}</p>
          <div class="tool-meta"><span>Connects with</span><strong>${connected}</strong></div>
          <a class="tool-link ${available ? '' : 'disabled'}" href="${link}" ${available ? '' : 'aria-disabled="true"'}>
            ${available ? 'Open module' : 'Module coming next'} <i class="bi bi-arrow-right"></i>
          </a>
        </article>
      `;
    }).join('');

    toolGrid.querySelectorAll('a[aria-disabled="true"]').forEach(link => {
      link.addEventListener('click', event => event.preventDefault());
    });
  }

  function syncThemeButton() {
    if (!themeToggle) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    themeToggle.innerHTML = `<i class="bi ${dark ? 'bi-sun' : 'bi-moon-stars'}" aria-hidden="true"></i><span>${dark ? 'Light theme' : 'Dark theme'}</span>`;
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
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
  toolSearch?.addEventListener('input', renderTools);

  renderPath();
  renderFilters();
  renderTools();
  syncThemeButton();
})();
