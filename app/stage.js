(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const params=new URLSearchParams(window.location.search);
  const requested=parseInt(params.get('stage')||'1',10);
  const stage=Math.min(12,Math.max(1,Number.isFinite(requested)?requested:1));
  const iconFor=c=>({'Foundation':'bi-terminal','Cloud Native Foundations':'bi-cloud-check','Source Control':'bi-git','Containers':'bi-box-seam','Build & Package':'bi-box','CI/CD':'bi-arrow-repeat','IaC & Automation':'bi-braces','Kubernetes':'bi-hexagon','GitOps':'bi-diagram-3','Cloud':'bi-cloud','Observability':'bi-activity','DevSecOps':'bi-shield-check','Networking':'bi-router','Storage & Data':'bi-database','SRE & Platform':'bi-building-gear'}[c]||'bi-tools');

  function render(){
    const path=Array.isArray(window.DEVOPS_PATH)?window.DEVOPS_PATH:[];
    const tools=Array.isArray(window.DEVOPS_TOOLS)?window.DEVOPS_TOOLS:[];
    const meta=path.find(item=>Number(item.step)===stage)||path[stage-1]||{step:String(stage).padStart(2,'0'),title:'DevOps Stage',text:'Connected DevOps tools'};
    const stageTools=tools.filter(tool=>Number(tool.stage)===stage);

    document.title=`${meta.title} | DevOps Learning`;
    $('stageEyebrow').textContent=`Stage ${meta.step} · Recommended learning order`;
    $('stageTitle').textContent=meta.title;
    $('stageDescription').textContent=meta.text;
    $('stageBadge').textContent=`Stage ${meta.step}`;
    $('stageHeroTitle').textContent=`Learn ${meta.title} properly`;
    $('stageHeroText').textContent=`This stage contains ${stageTools.length} connected module${stageTools.length===1?'':'s'}. Open a module to study the complete content instead of just seeing the roadmap card.`;
    $('stageNumber').textContent=meta.step;
    $('stageToolCount').textContent=String(stageTools.length);

    $('stageFlow').innerHTML=stageTools.length?stageTools.slice(0,8).map((tool,index)=>`${index?'<i class="bi bi-arrow-right"></i>':''}<a class="stage-flow-link" href="${tool.href}">${tool.name}</a>`).join(''):'<span>No modules found</span>';

    $('stageTools').innerHTML=stageTools.length?stageTools.map(tool=>{
      const connected=(tool.connectsTo||[]).slice(0,3).join(' · ')||'Core platform';
      return `<article class="panel tool-card stage-tool-card">
        <div class="tool-card-top">
          <span class="tool-icon"><i class="bi ${iconFor(tool.category)}" aria-hidden="true"></i></span>
          <span class="tool-status available">Available</span>
        </div>
        <p class="tool-category">${tool.category}</p>
        <h3>${tool.name}</h3>
        <p class="tool-purpose">${tool.purpose}</p>
        <div class="tool-meta"><span>Connects with</span><strong>${connected}</strong></div>
        <a class="tool-link" href="${tool.href}" aria-label="Open ${tool.name} learning module">Open full module <i class="bi bi-arrow-right"></i></a>
      </article>`;
    }).join(''):'<div class="empty-state">No modules were found for this stage.</div>';
  }

  const themeToggle=$('stageThemeToggle');
  function syncTheme(){
    if(!themeToggle)return;
    const dark=document.documentElement.dataset.theme==='dark';
    themeToggle.innerHTML=`<i class="bi ${dark?'bi-sun':'bi-moon-stars'}" aria-hidden="true"></i><span>${dark?'Light theme':'Dark theme'}</span>`;
    themeToggle.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
  }
  themeToggle?.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem('linuxStudyTheme',next)}catch(error){}
    syncTheme();
  });

  const sidebar=$('sidebar'),overlay=$('sidebarOverlay'),menu=$('mobileMenuButton');
  function close(){sidebar?.classList.remove('open');document.body.classList.remove('sidebar-open');menu?.setAttribute('aria-expanded','false')}
  menu?.addEventListener('click',()=>{const open=sidebar?.classList.toggle('open');document.body.classList.toggle('sidebar-open',Boolean(open));menu.setAttribute('aria-expanded',open?'true':'false')});
  overlay?.addEventListener('click',close);
  document.querySelectorAll('.sidebar a').forEach(a=>a.addEventListener('click',close));

  window.addEventListener('devops:registry-ready',render);
  render();
  syncTheme();
})();
