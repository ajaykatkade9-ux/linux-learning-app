(function(){
  const custom=[
    {id:'linux',name:'Linux',category:'Foundation',stage:1,status:'available',href:'index.html',purpose:'Operating-system fundamentals, administration, troubleshooting and production operations.',connectsTo:['Bash & Shell','Networking','Git','Docker','Kubernetes','Ansible'],prerequisites:[],nextTools:['Git','Docker','Networking']},
    {id:'git',name:'Git',category:'Source Control',stage:2,status:'available',href:'git.html',purpose:'Version code, infrastructure and configuration safely.',connectsTo:['GitHub','GitLab','GitHub Actions','Jenkins','Argo CD','Terraform'],prerequisites:['Linux'],nextTools:['GitHub','GitLab','CI/CD']},
    {id:'github',name:'GitHub',category:'Source Control',stage:2,status:'available',href:'github.html',purpose:'Host repositories, collaborate with pull requests, issues, packages and automation.',connectsTo:['Git','GitHub Actions','Docker','Argo CD'],prerequisites:['Git'],nextTools:['GitHub Actions','Docker']},
    {id:'gitlab',name:'GitLab',category:'Source Control',stage:2,status:'available',href:'gitlab.html',purpose:'Source control, merge requests, registry and integrated CI/CD.',connectsTo:['Git','GitLab CI/CD','Docker','Kubernetes'],prerequisites:['Git'],nextTools:['GitLab CI/CD','Docker']}
  ];
  window.DEVOPS_PATH=[
    {step:'01',title:'Foundation',text:'Linux, networking, Bash, Python, PowerShell, virtualization, cloud-native basics'},
    {step:'02',title:'Source Control',text:'Git, GitHub, GitLab, Bitbucket and collaboration workflows'},
    {step:'03',title:'Containers',text:'Docker, Compose, Podman, Buildah, Skopeo, containerd and registries'},
    {step:'04',title:'Build & CI/CD',text:'Maven, Gradle, npm, Jenkins, GitHub Actions, GitLab CI/CD, Azure Pipelines, CircleCI, Tekton'},
    {step:'05',title:'IaC & Automation',text:'Terraform, OpenTofu, Ansible, Pulumi, CloudFormation, Bicep, configuration management'},
    {step:'06',title:'Kubernetes',text:'Core Kubernetes, Helm, Kustomize, OpenShift, local clusters, networking, storage and operators'},
    {step:'07',title:'GitOps',text:'Argo CD and Flux reconciliation workflows'},
    {step:'08',title:'Cloud',text:'AWS, Azure and Google Cloud services and production architectures'},
    {step:'09',title:'Multi-Cloud',text:'Identity, networking, Kubernetes, GitOps, DR and cost across clouds'},
    {step:'10',title:'Observability',text:'Prometheus, Grafana, Loki, OpenTelemetry, ELK/OpenSearch, tracing and commercial monitoring'},
    {step:'11',title:'Security, Network & Data',text:'DevSecOps, policy, secrets, service mesh, proxies, storage, databases and messaging'},
    {step:'12',title:'SRE & Platform',text:'SLI/SLO/SLA, incidents, chaos, FinOps, Backstage and platform engineering'}
  ];
  function build(){
    const generated=Object.values(window.DEVOPS_MODULES||{}).map(m=>({id:m.id,name:m.name,category:m.category,stage:m.stage,status:'available',href:`tool.html?id=${encodeURIComponent(m.id)}`,purpose:m.purpose,connectsTo:m.connectsTo||[],prerequisites:m.prerequisites||[],nextTools:m.after||[]}));
    const seen=new Set(custom.map(x=>x.id));
    window.DEVOPS_TOOLS=[...custom,...generated.filter(x=>!seen.has(x.id))].sort((a,b)=>a.stage-b.stage||a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
    window.dispatchEvent(new CustomEvent('devops:registry-ready'));
  }
  if(window.DEVOPS_MODULES){build();return;}
  window.DEVOPS_TOOLS=custom;
  const script=document.createElement('script');script.src='devops-tool-data.js';script.onload=build;script.onerror=()=>console.error('Unable to load DevOps tool catalog.');document.head.appendChild(script);
})();