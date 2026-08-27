window.GITHUB_COURSE = {
  meta: {
    name: 'GitHub',
    subtitle: 'Repository collaboration, governance, automation and secure delivery',
    why: 'Git tracks history locally. GitHub adds the shared collaboration layer: hosted repositories, pull requests, reviews, issues, releases, packages, security controls and automation around Git-based work.',
    prerequisites: ['Git fundamentals', 'Branches and remotes', 'Basic terminal usage'],
    connectsTo: ['Git', 'GitHub Actions', 'Docker', 'Kubernetes', 'Terraform', 'Argo CD', 'SonarQube', 'Trivy']
  },

  flow: [
    { title: 'Local Git', text: 'Developer creates commits and branches locally.', detail: 'git switch -c feature/login' },
    { title: 'GitHub Repository', text: 'Branch is pushed to a shared remote.', detail: 'git push -u origin feature/login' },
    { title: 'Pull Request', text: 'Changes are proposed, discussed and reviewed.', detail: 'feature/login → main' },
    { title: 'Checks & Review', text: 'CI, security and human approval protect main.', detail: 'tests + review + policies' },
    { title: 'Merge & Release', text: 'Approved code enters the source of truth and can trigger delivery.', detail: 'merge → tag/release → deploy' }
  ],

  curriculum: [
    { group: '01 · GitHub Foundations', description: 'Understand what GitHub adds on top of Git.', topics: [
      'Git vs GitHub', 'GitHub account and profile basics', 'Repositories', 'Public vs private repositories',
      'Repository anatomy', 'README.md', 'LICENSE', '.gitignore', 'CONTRIBUTING.md', 'SECURITY.md',
      'Repository visibility and access basics', 'Clone, fork and template concepts'
    ]},
    { group: '02 · Repository & Branch Management', description: 'Manage shared source code safely.', topics: [
      'Default branch', 'Create and delete branches', 'Remote branches', 'Protected branches', 'Rulesets',
      'Merge methods: merge, squash and rebase', 'Require status checks', 'Require pull requests',
      'Signed commits concepts', 'CODEOWNERS', 'Branch naming', 'Repository settings'
    ]},
    { group: '03 · Pull Requests & Code Review', description: 'Use pull requests as the team quality gate.', topics: [
      'Pull request lifecycle', 'Draft pull requests', 'Base vs compare branch', 'Review comments',
      'Approve / request changes', 'Resolve conversations', 'PR templates', 'Link issues', 'Merge conflicts',
      'Required reviews', 'Auto-merge concepts', 'Stacked pull request concepts', 'Fork-based contributions'
    ]},
    { group: '04 · Issues, Discussions & Project Work', description: 'Track work around the repository.', topics: [
      'Issues', 'Labels', 'Assignees', 'Milestones', 'Issue templates and forms', 'Task lists',
      'Link commits and PRs to issues', 'GitHub Discussions', 'Projects concepts', 'Roadmap workflow',
      'Bug vs feature vs task', 'Triage workflow'
    ]},
    { group: '05 · Collaboration & Permissions', description: 'Understand who can do what in a real team.', topics: [
      'Personal repository collaborators', 'Organization concepts', 'Teams', 'Repository roles',
      'Least privilege', 'Review ownership', 'CODEOWNERS', 'Protected environments concept',
      'Auditability', 'Offboarding considerations', 'SSH vs HTTPS authentication', 'Tokens concepts'
    ]},
    { group: '06 · Releases, Tags & Packages', description: 'Turn merged code into consumable versions and artifacts.', topics: [
      'Git tags vs GitHub Releases', 'Release notes', 'Semantic versioning connection', 'Release assets',
      'Pre-releases', 'GitHub Packages overview', 'Container registry concepts', 'Package permissions',
      'Artifact promotion concepts', 'Release rollback thinking'
    ]},
    { group: '07 · GitHub Actions Connection', description: 'Understand how repository events start automation.', topics: [
      'Workflow files', 'Events and triggers', 'Jobs', 'Steps', 'Runners', 'Actions marketplace concepts',
      'Secrets and variables', 'Artifacts', 'Caches', 'Environments', 'Approvals', 'Reusable workflows',
      'Repository → CI → image → deployment flow'
    ]},
    { group: '08 · Security & Supply Chain', description: 'Protect repositories and delivery pipelines.', topics: [
      'Never commit secrets', 'Security policy', 'Dependabot alerts', 'Dependabot updates',
      'Dependency review', 'Secret scanning', 'Push protection concepts', 'Code scanning concepts',
      'Security advisories', 'Workflow security', 'Pin third-party actions concept', 'Least-privilege tokens'
    ]},
    { group: '09 · Repository Governance & Production', description: 'Operate GitHub safely in company environments.', topics: [
      'Protected main strategy', 'Rulesets vs branch protection', 'Required CI checks', 'Required reviewers',
      'CODEOWNERS for critical paths', 'Release policy', 'Repository standards', 'Documentation standards',
      'Archive vs delete', 'Backup/mirroring concepts', 'Monorepo vs multi-repo concepts', 'Change audit trail'
    ]},
    { group: '10 · GitHub in DevOps', description: 'Connect source control to the complete delivery lifecycle.', topics: [
      'GitHub + Git', 'GitHub + Actions', 'GitHub + Jenkins', 'GitHub + Docker', 'GitHub + GHCR/ECR',
      'GitHub + Terraform', 'GitHub + Kubernetes', 'GitHub + Helm', 'GitHub + Argo CD',
      'GitOps repositories', 'Infrastructure pull requests', 'Environment promotion', 'Production incident change trace'
    ]}
  ],

  commandGroups: [
    { title: 'Connect Local Git', commands: [
      ['git remote -v', 'Inspect configured GitHub remotes.'],
      ['git remote add origin <repo-url>', 'Connect a local repository to GitHub.'],
      ['git push -u origin main', 'Publish main and configure upstream tracking.'],
      ['git fetch origin', 'Download remote refs without modifying local work.']
    ]},
    { title: 'Feature Workflow', commands: [
      ['git switch -c feature/login', 'Create isolated feature work.'],
      ['git push -u origin feature/login', 'Publish the feature branch for a pull request.'],
      ['git fetch origin', 'Refresh knowledge of GitHub branches before integration.'],
      ['git switch main && git pull --ff-only', 'Update local main safely after merge.']
    ]},
    { title: 'Tags & Releases', commands: [
      ['git tag -a v1.0.0 -m "Release v1.0.0"', 'Create an annotated release tag locally.'],
      ['git push origin v1.0.0', 'Publish the tag to GitHub.'],
      ['git tag', 'List local tags.'],
      ['git show v1.0.0', 'Inspect the commit and metadata behind a release tag.']
    ]},
    { title: 'GitHub CLI Examples', commands: [
      ['gh repo view', 'Inspect the current GitHub repository from the CLI.'],
      ['gh pr status', 'See pull requests relevant to the current repository.'],
      ['gh pr create', 'Create a pull request interactively.'],
      ['gh issue list', 'List repository issues.']
    ]}
  ],

  labs: [
    { level: 'Beginner', title: 'Create & Publish Repository', goal: 'Connect local Git to a hosted GitHub repository.', steps: ['Create repository', 'Add README', 'Connect origin', 'Push main', 'Verify repository history'] },
    { level: 'Beginner', title: 'Feature Branch Pull Request', goal: 'Understand branch → push → PR → review → merge.', steps: ['Create feature branch', 'Commit change', 'Push branch', 'Open PR', 'Review diff', 'Merge', 'Update local main'] },
    { level: 'Intermediate', title: 'Issue-to-PR Workflow', goal: 'Connect tracked work to code changes.', steps: ['Create issue', 'Label and assign it', 'Create branch', 'Implement change', 'Open linked PR', 'Close issue through merge'] },
    { level: 'Intermediate', title: 'Protected Main Lab', goal: 'Understand why production branches should not accept uncontrolled changes.', steps: ['Define branch/ruleset policy', 'Require pull request', 'Require review', 'Require CI check', 'Attempt direct change', 'Merge through approved PR'] },
    { level: 'Advanced', title: 'Repository Security Lab', goal: 'Build a practical security baseline.', steps: ['Add SECURITY.md', 'Review dependency graph', 'Enable relevant Dependabot features', 'Review secret/code scanning concepts', 'Set least-privilege workflow permissions'] },
    { level: 'Production', title: 'Team Delivery Repository', goal: 'Model a company repository with governance and automation.', steps: ['Repository standards', 'CODEOWNERS', 'PR template', 'Protected main', 'CI checks', 'Security checks', 'Release tag', 'Deployment handoff'] }
  ],

  troubleshooting: [
    ['Push rejected', 'Fetch remote changes, inspect divergence and integrate intentionally instead of force pushing blindly.'],
    ['Pull request has merge conflict', 'Update the feature branch with the target branch, resolve conflicts locally, test, then push the resolved commit.'],
    ['Required check is failing', 'Open the check/workflow details, identify the failed job, fix the underlying code or workflow, then push a new commit.'],
    ['Cannot merge PR', 'Check required reviews, unresolved conversations, status checks, branch rules and repository permissions.'],
    ['Wrong base branch selected', 'Change the PR base carefully and re-check the diff because the comparison can change.'],
    ['Secret exposed in repository', 'Treat it as compromised: revoke/rotate the credential first, then remove it from current files and address history where necessary.'],
    ['Repository access problem', 'Verify repository visibility, collaborator/team role and authentication method before changing code.']
  ],

  project: {
    title: 'Production GitHub Collaboration & Delivery Project',
    problem: 'A team needs one controlled place for code, review, work tracking, security checks and automated delivery without allowing risky direct production changes.',
    architecture: ['Developer', 'Git feature branch', 'GitHub repository', 'Issue / Pull Request', 'Review + CODEOWNERS', 'CI & security checks', 'Protected main', 'Release / Registry', 'Deployment pipeline'],
    why: [
      ['GitHub Repository', 'Provides the shared source of truth around Git history and collaboration.'],
      ['Issue', 'Explains why a change exists and tracks work before implementation.'],
      ['Pull Request', 'Creates a reviewable checkpoint before code enters main.'],
      ['CODEOWNERS', 'Routes sensitive changes to responsible reviewers.'],
      ['Required Checks', 'Prevents known-bad code from merging when automated verification fails.'],
      ['Protected Main', 'Keeps the production source branch controlled and auditable.'],
      ['Release', 'Marks a deliberate version that downstream delivery can reference.']
    ]
  },

  interview: [
    'Git vs GitHub?',
    'What is a pull request and why do teams use it?',
    'Fork vs branch?',
    'What is the difference between a protected branch and a ruleset?',
    'What does CODEOWNERS solve?',
    'What are required status checks?',
    'Squash merge vs merge commit vs rebase merge?',
    'How would you secure a production repository?',
    'What happens after a developer pushes a feature branch?',
    'How do GitHub Issues connect to pull requests?',
    'Tags vs GitHub Releases?',
    'How do GitHub Actions connect GitHub to Docker and Kubernetes?',
    'How would you handle an accidentally exposed secret?',
    'How would you design a protected-main workflow for a DevOps team?'
  ],

  docs: [
    { name: 'GitHub Repositories Docs', url: 'https://docs.github.com/en/repositories' },
    { name: 'GitHub Pull Requests Docs', url: 'https://docs.github.com/en/pull-requests' },
    { name: 'GitHub Issues Docs', url: 'https://docs.github.com/en/issues' },
    { name: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions' },
    { name: 'GitHub Security Docs', url: 'https://docs.github.com/en/code-security' },
    { name: 'GitHub Packages Docs', url: 'https://docs.github.com/en/packages' }
  ]
};