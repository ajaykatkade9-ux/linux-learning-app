window.GITLAB_COURSE = {
  meta: {
    name: 'GitLab',
    subtitle: 'Source collaboration, governance, registry, environments and integrated DevSecOps workflows',
    why: 'GitLab builds a shared delivery platform around Git. Teams can organize projects and groups, review changes with merge requests, control branch access, store packages and container images, connect CI/CD runners, manage environments and apply security controls from one platform.',
    prerequisites: ['Git fundamentals', 'Branches and remotes', 'Basic Linux and terminal usage'],
    connectsTo: ['Git', 'GitLab CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'Helm', 'Argo CD', 'Container Registry']
  },

  flow: [
    { title: 'Local Git', text: 'Developer works on an isolated branch and creates commits.', detail: 'git switch -c feature/login' },
    { title: 'GitLab Project', text: 'The branch is pushed to the shared GitLab repository.', detail: 'git push -u origin feature/login' },
    { title: 'Merge Request', text: 'The change receives review, discussion and approvals.', detail: 'feature/login → main' },
    { title: 'Pipeline', text: 'GitLab CI/CD can test, scan, build and package the exact commit.', detail: '.gitlab-ci.yml + runner' },
    { title: 'Registry', text: 'Built container images or packages can be stored for deployment.', detail: 'project registry' },
    { title: 'Environment', text: 'Approved artifacts move toward staging or production.', detail: 'dev → staging → production' }
  ],

  curriculum: [
    { group: '01 · GitLab Foundations', description: 'Understand GitLab and its project model.', topics: [
      'Git vs GitLab', 'GitLab.com vs Self-Managed concepts', 'Projects', 'Namespaces', 'Groups and subgroups',
      'Public/private/internal visibility concepts', 'Project anatomy', 'README, LICENSE and .gitignore',
      'Clone, import and fork concepts', 'Project settings', 'Members and access overview'
    ]},
    { group: '02 · Repository & Branch Management', description: 'Manage source code and critical branches safely.', topics: [
      'Default branch', 'Create/delete branches', 'Remote branches', 'Tags', 'Branch rules',
      'Protected branch concepts', 'Allowed to merge vs allowed to push', 'Force-push controls',
      'Code Owner approval concepts', 'Signed commits concepts', 'Merge methods', 'Repository cleanup concepts'
    ]},
    { group: '03 · Merge Requests & Code Review', description: 'Use merge requests as the main review and integration gate.', topics: [
      'Merge request lifecycle', 'Source vs target branch', 'Draft merge requests', 'Review comments',
      'Approvals', 'Code Owners', 'Merge conflicts', 'Pipelines in merge requests', 'Merge trains concepts',
      'Squash options', 'Auto-merge concepts', 'Merge request templates', 'Linked issues'
    ]},
    { group: '04 · Issues, Planning & Collaboration', description: 'Track why work exists and organize delivery.', topics: [
      'Issues', 'Labels', 'Assignees', 'Milestones', 'Issue boards', 'Iterations concepts',
      'Epics/work-item concepts', 'Wiki', 'Snippets', 'To-dos', 'Discussions/comments', 'Planning workflow'
    ]},
    { group: '05 · Groups, Roles & Permissions', description: 'Understand organization structure and least-privilege access.', topics: [
      'Groups and subgroups', 'Project membership', 'Guest/Planner/Reporter/Developer/Maintainer/Owner concepts',
      'Inherited access', 'Least privilege', 'Protected resources', 'Deploy access thinking',
      'Authentication concepts', 'SSH keys', 'Access tokens concepts', 'Offboarding and auditability'
    ]},
    { group: '06 · Registry, Packages & Releases', description: 'Store and version delivery artifacts.', topics: [
      'Container Registry', 'Package Registry', 'Image tags', 'Release concepts', 'Git tags vs releases',
      'Release assets', 'Artifact immutability thinking', 'Registry permissions', 'Cleanup policies concepts',
      'Promotion from build to deployment', 'Rollback thinking'
    ]},
    { group: '07 · GitLab CI/CD Connection', description: 'Understand how repository events become pipelines.', topics: [
      '.gitlab-ci.yml', 'Stages', 'Jobs', 'Runners', 'Executor concepts', 'Pipeline sources',
      'Merge request pipelines', 'Artifacts', 'Caches', 'CI/CD variables', 'Masked variables',
      'Protected variables', 'Protected runners', 'Environments', 'Manual jobs', 'Deployment approvals concepts'
    ]},
    { group: '08 · Environments & Deployment Safety', description: 'Connect source changes to controlled runtime environments.', topics: [
      'Environment concepts', 'Development/staging/production', 'Protected environments', 'Allowed to deploy',
      'Environment-scoped variables', 'Deployment history', 'Manual deployment gates', 'Deploy freeze concepts',
      'Rollback strategy', 'Review apps concepts', 'Environment URLs', 'Production secret isolation'
    ]},
    { group: '09 · Security & Production Governance', description: 'Operate GitLab repositories with company-grade controls.', topics: [
      'Never commit secrets', 'Security policy concepts', 'Dependency scanning concepts', 'SAST concepts',
      'Container scanning concepts', 'Secret detection concepts', 'Branch rules', 'Code Owner approvals',
      'Required pipeline thinking', 'Protected variables and runners', 'Protected environments',
      'Auditability', 'Backup and disaster-recovery concepts for Self-Managed'
    ]},
    { group: '10 · GitLab in DevOps', description: 'Connect GitLab to the full platform lifecycle.', topics: [
      'GitLab + Git', 'GitLab + GitLab CI/CD', 'GitLab + Docker', 'GitLab Container Registry',
      'GitLab + Terraform', 'GitLab + Kubernetes', 'GitLab + Helm', 'GitLab + Argo CD',
      'GitOps repository patterns', 'Infrastructure merge requests', 'Environment promotion',
      'Production incident change trace', 'GitHub vs GitLab decision factors'
    ]}
  ],

  commandGroups: [
    { title: 'Connect Local Git', commands: [
      ['git remote -v', 'Inspect configured GitLab remotes.'],
      ['git remote add origin <gitlab-repo-url>', 'Connect an existing local repository to GitLab.'],
      ['git push -u origin main', 'Publish main and configure upstream tracking.'],
      ['git fetch origin', 'Download GitLab refs without changing local files.']
    ]},
    { title: 'Merge Request Workflow', commands: [
      ['git switch -c feature/login', 'Create isolated feature work.'],
      ['git add . && git commit -m "Add login"', 'Create a reviewable snapshot.'],
      ['git push -u origin feature/login', 'Publish the branch so a merge request can be opened.'],
      ['git switch main && git pull --ff-only', 'Update local main safely after the MR is merged.']
    ]},
    { title: 'Tags & Releases', commands: [
      ['git tag -a v1.0.0 -m "Release v1.0.0"', 'Create an annotated version tag.'],
      ['git push origin v1.0.0', 'Publish the tag to GitLab.'],
      ['git show v1.0.0', 'Inspect the commit and tag metadata.']
    ]},
    { title: 'GitLab CLI Examples', commands: [
      ['glab repo view', 'Inspect the current GitLab project from the CLI.'],
      ['glab mr list', 'List merge requests.'],
      ['glab mr create', 'Create a merge request from the terminal.'],
      ['glab issue list', 'List project issues.']
    ]}
  ],

  labs: [
    { level: 'Beginner', title: 'Create & Publish GitLab Project', goal: 'Connect local Git with a GitLab project.', steps: ['Create project', 'Add README', 'Connect origin', 'Push main', 'Verify commits and branches'] },
    { level: 'Beginner', title: 'Merge Request Lab', goal: 'Understand branch → push → MR → review → merge.', steps: ['Create feature branch', 'Commit change', 'Push branch', 'Open merge request', 'Review diff', 'Merge', 'Update local main'] },
    { level: 'Intermediate', title: 'Group & Permission Lab', goal: 'Understand team organization and least privilege.', steps: ['Create group structure', 'Add project', 'Review roles', 'Assign developer/maintainer access', 'Test protected-branch behavior'] },
    { level: 'Intermediate', title: 'Branch Rules Lab', goal: 'Protect the production source branch.', steps: ['Open Branch rules', 'Restrict direct push', 'Require merge request flow', 'Review merge permissions', 'Test controlled merge'] },
    { level: 'Advanced', title: 'Registry Delivery Lab', goal: 'Connect source code with a versioned container artifact.', steps: ['Prepare container app', 'Build image in CI/CD module later', 'Push tagged image to registry', 'Inspect registry', 'Use immutable version tag for deployment'] },
    { level: 'Production', title: 'Protected Delivery Platform', goal: 'Model a secure team workflow from issue to production environment.', steps: ['Issue', 'Feature branch', 'Merge request', 'Code review', 'Pipeline/security checks', 'Protected main', 'Registry artifact', 'Protected production environment'] }
  ],

  troubleshooting: [
    ['Push rejected to protected branch', 'Check Branch rules and your role. Use a feature branch and merge request when direct push is intentionally restricted.'],
    ['Merge request cannot merge', 'Check conflicts, approvals, discussions, pipeline status, branch rules and your merge permission.'],
    ['Pipeline cannot access a variable', 'Check whether the variable is protected, masked/hidden, environment-scoped, and whether the pipeline is allowed to access protected resources.'],
    ['Runner does not pick up a job', 'Check runner availability, scope, tags, protection settings and whether the runner can execute the requested job.'],
    ['Production deploy is blocked', 'Check protected-environment rules, allowed deployers, manual approvals and environment-specific pipeline conditions.'],
    ['Container registry authentication fails', 'Verify project path, registry permissions, token/CI credentials and runner context.'],
    ['Secret committed to repository', 'Rotate/revoke the credential first, then remove it from current files and clean history where required.']
  ],

  project: {
    title: 'Production GitLab DevSecOps Delivery Project',
    problem: 'A team needs one controlled platform for source code, planning, review, automated verification, artifact storage and protected production deployment.',
    architecture: ['Developer', 'Git branch', 'GitLab Project', 'Issue / Merge Request', 'Review + Branch Rules', 'GitLab Pipeline', 'Container Registry', 'Protected Environment', 'Kubernetes / Cloud'],
    why: [
      ['GitLab Project', 'Provides the shared source of truth and delivery context around Git history.'],
      ['Merge Request', 'Creates the human review and approval checkpoint before integration.'],
      ['Branch Rules', 'Restrict risky changes to critical branches and define who can push or merge.'],
      ['Pipeline', 'Validates the exact commit with repeatable automated jobs.'],
      ['Registry', 'Stores versioned build artifacts separately from source code.'],
      ['Protected Environment', 'Restricts who can deploy to sensitive environments such as production.'],
      ['Kubernetes / Cloud', 'Runs the approved artifact in the target runtime platform.']
    ]
  },

  interview: [
    'Git vs GitLab?', 'GitHub vs GitLab?', 'Project vs group vs subgroup?',
    'What is a merge request?', 'What are Branch rules and why do they matter?',
    'How do protected branches control push and merge access?', 'What are GitLab roles?',
    'What is the Container Registry?', 'What is a GitLab Runner?', 'What is .gitlab-ci.yml?',
    'Protected vs masked CI/CD variables?', 'What is a protected environment?',
    'How does a merge request connect to CI/CD?', 'How would you secure a production GitLab project?',
    'Explain GitLab → Registry → Kubernetes deployment flow.'
  ],

  docs: [
    { name: 'GitLab User Documentation', url: 'https://docs.gitlab.com/user/' },
    { name: 'Projects & Repositories', url: 'https://docs.gitlab.com/user/project/' },
    { name: 'Merge Requests', url: 'https://docs.gitlab.com/user/project/merge_requests/' },
    { name: 'Protected Branches / Branch Rules', url: 'https://docs.gitlab.com/user/project/repository/branches/protected/' },
    { name: 'Container Registry', url: 'https://docs.gitlab.com/user/packages/container_registry/' },
    { name: 'GitLab CI/CD', url: 'https://docs.gitlab.com/ci/' },
    { name: 'CI/CD Variables', url: 'https://docs.gitlab.com/ci/variables/' },
    { name: 'Protected Environments', url: 'https://docs.gitlab.com/ci/environments/protected_environments/' }
  ]
};
