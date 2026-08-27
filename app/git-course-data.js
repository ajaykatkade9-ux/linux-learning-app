window.GIT_COURSE = {
  meta: {
    name: 'Git',
    subtitle: 'Version control from first commit to production workflows',
    why: 'Git gives teams a safe, reviewable history of application code, infrastructure, configuration and documentation. It is the foundation for GitHub, GitLab, CI/CD and GitOps.',
    prerequisites: ['Linux basics', 'Files and directories', 'Terminal basics'],
    connectsTo: ['GitHub', 'GitLab', 'GitHub Actions', 'Jenkins', 'Docker', 'Terraform', 'Argo CD']
  },

  flow: [
    { title: 'Working Tree', text: 'Files you are editing right now.', command: 'git status' },
    { title: 'Staging Area', text: 'Exact changes selected for the next commit.', command: 'git add <file>' },
    { title: 'Local Repository', text: 'Committed snapshots and history stored inside .git.', command: 'git commit -m "message"' },
    { title: 'Remote Repository', text: 'Shared copy hosted on GitHub, GitLab or another Git server.', command: 'git push origin main' }
  ],

  curriculum: [
    {
      group: '01 · Git Foundations',
      description: 'Understand what Git is and how a repository stores history.',
      topics: [
        'Why version control exists', 'Git vs GitHub vs GitLab', 'Install and configure Git',
        'Repository anatomy and .git directory', 'Working tree, staging area and repository',
        'git init and git clone', 'git status', 'git add', 'git commit', 'git log'
      ]
    },
    {
      group: '02 · Everyday Workflow',
      description: 'Build the daily command flow used by developers and DevOps engineers.',
      topics: [
        'Track new and modified files', 'Stage selected hunks', 'Commit messages', 'View diffs',
        'Rename and remove files', '.gitignore', 'Aliases', 'HEAD and commit references',
        'Relative refs HEAD~ and HEAD^', 'Tags and releases'
      ]
    },
    {
      group: '03 · Branching & Integration',
      description: 'Work safely on multiple changes and combine them.',
      topics: [
        'Branches internally', 'git branch', 'git switch', 'git checkout concepts',
        'Fast-forward merge', 'Three-way merge', 'Merge conflicts', 'Conflict resolution',
        'Rebase fundamentals', 'Interactive rebase', 'Cherry-pick', 'Merge vs rebase'
      ]
    },
    {
      group: '04 · Remote Repositories',
      description: 'Connect local work with shared repositories.',
      topics: [
        'git remote', 'origin and upstream', 'Fetch', 'Pull', 'Push', 'Tracking branches',
        'Push a new branch', 'Delete remote branches', 'Fork workflow', 'Sync a fork',
        'HTTPS vs SSH authentication', 'Credential helpers'
      ]
    },
    {
      group: '05 · Undo, Recovery & Troubleshooting',
      description: 'Recover safely from common mistakes without losing work.',
      topics: [
        'git restore', 'git reset --soft', 'git reset --mixed', 'git reset --hard',
        'git revert', 'git reflog', 'Recover deleted commits', 'Restore deleted files',
        'Amend a commit', 'Unstage changes', 'Abort merge', 'Abort rebase', 'Detached HEAD'
      ]
    },
    {
      group: '06 · Git Internals',
      description: 'See what Git actually stores under the hood.',
      topics: [
        'Content-addressable storage', 'Blob objects', 'Tree objects', 'Commit objects',
        'Annotated tag objects', 'Object IDs and hashes', 'refs and HEAD', 'Index file',
        'Packfiles', 'Garbage collection', 'git cat-file', 'git ls-tree', 'git rev-parse'
      ]
    },
    {
      group: '07 · Collaboration Workflows',
      description: 'Understand how real teams organize Git work.',
      topics: [
        'Feature branch workflow', 'Trunk-based development', 'GitHub Flow', 'GitFlow concepts',
        'Pull request lifecycle', 'Code review', 'Protected branches', 'CODEOWNERS concept',
        'Release branches', 'Hotfix workflow', 'Semantic versioning connection'
      ]
    },
    {
      group: '08 · Advanced Repository Management',
      description: 'Handle large, complex and multi-repository codebases.',
      topics: [
        'Stash', 'Worktrees', 'Submodules', 'Subtree concepts', 'Sparse checkout',
        'Shallow clones', 'Partial clone concepts', 'Large repositories', 'Git LFS concepts',
        'Bisect', 'Blame', 'Archive', 'Bundles'
      ]
    },
    {
      group: '09 · Security & Production Practices',
      description: 'Keep repositories safe and suitable for company environments.',
      topics: [
        'Never commit secrets', 'Secret scanning concepts', 'Signed commits and tags',
        'SSH keys', 'Least-privilege repository access', 'Branch protection', 'Review requirements',
        'Safe force push with --force-with-lease', 'History rewriting risks', 'Auditability',
        'Backup and mirroring concepts'
      ]
    },
    {
      group: '10 · Git in DevOps',
      description: 'Connect Git to the rest of the delivery lifecycle.',
      topics: [
        'Git + GitHub Actions', 'Git + Jenkins', 'Git + Docker build', 'Git + Terraform',
        'Git + Kubernetes manifests', 'Git + Helm', 'Git + Kustomize', 'Git + Argo CD',
        'GitOps desired state', 'Infrastructure pull requests', 'Environment promotion'
      ]
    }
  ],

  commandGroups: [
    {
      title: 'Start & Inspect',
      commands: [
        ['git init', 'Create a new local repository.'],
        ['git clone <url>', 'Copy an existing repository and its history.'],
        ['git status', 'Show working tree and staging-area state.'],
        ['git log --oneline --graph --decorate --all', 'See compact branch and commit history.']
      ]
    },
    {
      title: 'Stage & Commit',
      commands: [
        ['git add <file>', 'Stage selected file changes.'],
        ['git add -p', 'Interactively stage individual hunks.'],
        ['git diff', 'View unstaged changes.'],
        ['git diff --staged', 'View staged changes.'],
        ['git commit -m "message"', 'Create a commit from the staging area.']
      ]
    },
    {
      title: 'Branches',
      commands: [
        ['git branch', 'List local branches.'],
        ['git switch -c feature/login', 'Create and switch to a branch.'],
        ['git merge feature/login', 'Merge another branch into the current branch.'],
        ['git rebase main', 'Replay current-branch commits on top of main.']
      ]
    },
    {
      title: 'Remote',
      commands: [
        ['git remote -v', 'Show configured remotes.'],
        ['git fetch origin', 'Download remote history without merging it.'],
        ['git pull --ff-only', 'Fetch and update only when fast-forward is possible.'],
        ['git push -u origin feature/login', 'Publish branch and set upstream tracking.']
      ]
    },
    {
      title: 'Recover',
      commands: [
        ['git restore <file>', 'Discard unstaged changes in a file.'],
        ['git restore --staged <file>', 'Remove a file from staging without deleting changes.'],
        ['git revert <commit>', 'Create a new commit that reverses an older commit.'],
        ['git reflog', 'Find recent HEAD movements and recover lost commits.']
      ]
    }
  ],

  labs: [
    {
      level: 'Beginner',
      title: 'Create Your First Repository',
      goal: 'Understand init → add → commit → log.',
      steps: ['Create a project folder', 'Initialize Git', 'Create README.md', 'Stage it', 'Commit it', 'Inspect history']
    },
    {
      level: 'Beginner',
      title: 'Branch and Merge Lab',
      goal: 'Understand parallel work and merge behavior.',
      steps: ['Create feature branch', 'Modify a file', 'Commit', 'Switch to main', 'Merge feature', 'Inspect graph']
    },
    {
      level: 'Intermediate',
      title: 'Merge Conflict Lab',
      goal: 'Learn exactly why conflicts happen and how Git resolves them.',
      steps: ['Change same lines on two branches', 'Attempt merge', 'Read conflict markers', 'Resolve manually', 'Stage and complete merge']
    },
    {
      level: 'Intermediate',
      title: 'Remote Collaboration Lab',
      goal: 'Connect local Git with GitHub/GitLab safely.',
      steps: ['Add remote', 'Push branch', 'Fetch remote changes', 'Inspect remote-tracking branch', 'Pull/update local branch']
    },
    {
      level: 'Advanced',
      title: 'Recover a Lost Commit',
      goal: 'Use reflog instead of panic when history moves.',
      steps: ['Create commits', 'Move branch pointer', 'Inspect reflog', 'Find old commit', 'Restore it safely']
    },
    {
      level: 'Production',
      title: 'Team Delivery Workflow',
      goal: 'Model a real protected-main pull-request workflow.',
      steps: ['Feature branch', 'Small commits', 'Push', 'Open PR', 'CI checks', 'Review', 'Merge', 'Tag release']
    }
  ],

  troubleshooting: [
    ['I committed to the wrong branch', 'Create/switch to the correct branch at that commit, then carefully move the original branch back if required.'],
    ['Push rejected: non-fast-forward', 'Fetch first, inspect what changed remotely, then merge/rebase intentionally instead of force pushing blindly.'],
    ['Merge conflict', 'Inspect conflicted files, choose the correct final content, stage resolved files, then finish the merge/rebase.'],
    ['Detached HEAD', 'Create a branch if the commits should be kept, or switch back to an existing branch.'],
    ['Deleted commit appears lost', 'Check git reflog before assuming the commit is gone.'],
    ['Secret committed', 'Treat the secret as exposed: rotate/revoke it first, then clean repository history where appropriate.']
  ],

  project: {
    title: 'Git-Based DevOps Delivery Project',
    problem: 'A team needs safe code history, peer review, automated testing and a controlled path to production.',
    architecture: ['Developer', 'Git feature branch', 'GitHub/GitLab', 'Pull Request', 'CI pipeline', 'Container image', 'Deployment repository', 'Argo CD / Kubernetes'],
    why: [
      ['Git', 'Tracks every reviewed change and makes rollback/history analysis possible.'],
      ['Feature branch', 'Isolates unfinished work from the protected production branch.'],
      ['Pull Request', 'Creates a review and approval checkpoint before merge.'],
      ['CI', 'Tests the exact commit before it is accepted.'],
      ['GitOps repo', 'Stores deployment desired state separately and provides an auditable production history.']
    ]
  },

  interview: [
    'What is the difference between Git and GitHub?',
    'Explain working tree, staging area and repository.',
    'What happens internally when you create a commit?',
    'What is the difference between fetch and pull?',
    'Merge vs rebase: when would you use each?',
    'reset vs revert vs restore?',
    'How does git reflog help recovery?',
    'What is detached HEAD?',
    'What is a remote-tracking branch?',
    'Why is --force-with-lease safer than --force?',
    'How would you handle a secret accidentally committed to Git?',
    'How does Git connect to CI/CD and GitOps?'
  ],

  docs: [
    { name: 'Git Reference Manual', url: 'https://git-scm.com/docs' },
    { name: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2' },
    { name: 'Git Glossary', url: 'https://git-scm.com/docs/gitglossary' },
    { name: 'Git Internals', url: 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain' }
  ]
};
