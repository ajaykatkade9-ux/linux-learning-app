window.revisionIntervals = [1, 3, 7, 15, 30];

window.revisionTopics = [
  {
    id: "foundations",
    name: "Linux Foundations",
    page: "linux-foundations.html",
    keywords:
      "architecture kernel user space filesystem paths links help",

    recallQuestion:
      "Explain Linux architecture and the purpose of the kernel.",

    recallAnswer:
      "Applications run mainly in user space. They request protected operations through system calls. The kernel manages CPU scheduling, memory, devices, filesystems, networking, processes and security.",

    interviewQuestion:
      "What is the difference between kernel space and user space?",

    interviewAnswer:
      "Kernel space has privileged access to hardware and protected resources. User-space applications run with restricted access and enter the kernel through controlled system calls.",

    scenarioQuestion:
      "You receive an unfamiliar Linux server. What basic information would you collect first?",

    scenarioAnswer: [
      "Identify the distribution and kernel version.",
      "Check hostname, uptime and logged-in users.",
      "Inspect CPU, memory, storage and network basics.",
      "Check failed services and recent warnings."
    ],

    taskLabel:
      "Collect a basic system identity report.",

    commands: [
      "cat /etc/os-release",
      "uname -a",
      "hostnamectl",
      "uptime",
      "lsblk -f",
      "ip -br address"
    ]
  },

  {
    id: "boot",
    name: "Linux Boot Process",
    page: "boot-process.html",
    keywords:
      "bios uefi grub kernel initramfs systemd boot targets",

    recallQuestion:
      "Recall the complete Linux boot flow in order.",

    recallAnswer:
      "Firmware initializes hardware, the bootloader loads the kernel and initramfs, the kernel initializes the system and mounts the root filesystem, then PID 1 starts services and reaches the configured target.",

    interviewQuestion:
      "What is the role of GRUB?",

    interviewAnswer:
      "GRUB is a bootloader. It presents boot choices, loads the selected kernel and initramfs into memory and passes kernel command-line parameters.",

    scenarioQuestion:
      "A service did not start after a server reboot. What would you check?",

    scenarioAnswer: [
      "Check failed units and the current boot logs.",
      "Inspect service status and dependencies.",
      "Confirm required mounts, networking and configuration.",
      "Compare manual start behaviour with boot-time behaviour."
    ],

    taskLabel:
      "Inspect the current boot and startup performance.",

    commands: [
      "systemctl get-default",
      "systemctl --failed",
      "systemd-analyze",
      "systemd-analyze critical-chain",
      "journalctl -b -p warning"
    ]
  },

  {
    id: "storage",
    name: "Linux Storage",
    page: "storage.html",
    keywords:
      "disk partition filesystem mount lvm raid inode block device",

    recallQuestion:
      "Explain the path from a physical disk to an accessible file.",

    recallAnswer:
      "A disk may contain partitions, RAID, encryption or LVM layers. A filesystem organizes data on a resulting block device, and a mount attaches that filesystem to the Linux directory tree.",

    interviewQuestion:
      "What is the difference between a block device, filesystem and mount point?",

    interviewAnswer:
      "A block device provides addressable storage blocks. A filesystem organizes files and metadata on that storage. A mount point is the directory where the filesystem becomes accessible.",

    scenarioQuestion:
      "A new disk is visible in lsblk but the application cannot use it. What would you verify?",

    scenarioAnswer: [
      "Check whether the correct partition or LVM layer exists.",
      "Identify the filesystem with lsblk and blkid.",
      "Confirm it is mounted at the expected path.",
      "Check mount options, ownership and free space."
    ],

    taskLabel:
      "Map devices, filesystems and mount points.",

    commands: [
      "lsblk -f",
      "sudo blkid",
      "findmnt",
      "df -hT",
      "df -i"
    ]
  },

  {
    id: "processes",
    name: "Processes & Services",
    page: "processes.html",
    keywords:
      "process pid ppid state signal job systemd service",

    recallQuestion:
      "Explain PID, PPID, process states and signals.",

    recallAnswer:
      "PID identifies a process and PPID identifies its parent. Process states describe whether it is running, sleeping, stopped or exited. Signals asynchronously request actions such as reload, stop, continue or terminate.",

    interviewQuestion:
      "Why should SIGTERM normally be used before SIGKILL?",

    interviewAnswer:
      "SIGTERM allows an application to handle shutdown, close connections and flush data. SIGKILL is enforced by the kernel and gives the process no cleanup opportunity.",

    scenarioQuestion:
      "A process does not stop after SIGTERM. What would you investigate?",

    scenarioAnswer: [
      "Inspect its process state and waiting channel.",
      "Check application and service logs.",
      "Check open files, sockets and dependencies.",
      "Determine whether it is blocked in uninterruptible I/O.",
      "Use SIGKILL only after understanding the impact."
    ],

    taskLabel:
      "Inspect process hierarchy, services and failed units.",

    commands: [
      "ps auxf",
      "ps -eo pid,ppid,stat,etime,comm",
      "systemctl --failed",
      "systemctl --type=service --state=running",
      "kill -l"
    ]
  },

  {
    id: "permissions",
    name: "Linux Permissions",
    page: "permissions.html",
    keywords:
      "users groups chmod chown acl sudo uid gid permissions",

    recallQuestion:
      "Explain owner, group, other and rwx permissions.",

    recallAnswer:
      "Each file has an owner and group. Read, write and execute permissions are evaluated for the matching owner, group or other class. Directory execute permission controls traversal.",

    interviewQuestion:
      "Why can a file show readable permission but still return permission denied?",

    interviewAnswer:
      "A parent directory may lack execute permission, an ACL may restrict access, the filesystem may be mounted read-only or noexec, or SELinux/AppArmor may deny the operation.",

    scenarioQuestion:
      "A systemd service receives permission denied for one application file. What would you check?",

    scenarioAnswer: [
      "Identify the service user and group.",
      "Inspect every directory component with namei.",
      "Check normal permissions and ACLs.",
      "Check mount options.",
      "Check SELinux or AppArmor denials."
    ],

    taskLabel:
      "Inspect identity and a complete filesystem path.",

    commands: [
      "id",
      "getent passwd root",
      "namei -l /etc/ssh/sshd_config",
      "getfacl /etc/ssh/sshd_config",
      "sudo -l"
    ]
  },

  {
    id: "networking",
    name: "Linux Networking",
    page: "networking.html",
    keywords:
      "ip route dns port socket firewall tcp udp connectivity",

    recallQuestion:
      "Explain the path of a request from DNS lookup to an application socket.",

    recallAnswer:
      "The client resolves the hostname, selects a route, sends packets through an interface and firewall, and connects to the server address and port. The server kernel delivers accepted traffic to the listening application socket.",

    interviewQuestion:
      "What is the difference between connection refused and timeout?",

    interviewAnswer:
      "Refused usually means the destination responded but no service accepted the connection. Timeout usually points toward dropped traffic, routing failure, firewall filtering or an unreachable host.",

    scenarioQuestion:
      "An application works through localhost but not through the server IP. What would you inspect?",

    scenarioAnswer: [
      "Check the address on which the service listens.",
      "Test the server IP locally.",
      "Check host firewall rules.",
      "Check routing and external security rules.",
      "Confirm proxy or load-balancer configuration."
    ],

    taskLabel:
      "Inspect addresses, routes, sockets and connectivity.",

    commands: [
      "ip -br address",
      "ip route",
      "ip neigh",
      "ss -s",
      "sudo ss -lntup",
      "ip route get 1.1.1.1"
    ]
  },

  {
    id: "troubleshooting",
    name: "Linux Troubleshooting",
    page: "troubleshooting.html",
    keywords:
      "incident debugging production evidence root cause recovery",

    recallQuestion:
      "Recall the evidence-first production troubleshooting sequence.",

    recallAnswer:
      "Clarify symptom, scope and time; check recent changes; collect logs and metrics; isolate the failing layer; apply the smallest reversible fix; validate from the user perspective; document root cause and prevention.",

    interviewQuestion:
      "Why should you avoid restarting immediately during an incident?",

    interviewAnswer:
      "A restart can destroy process state, rotate logs and temporarily hide the real problem. Collect relevant evidence first unless immediate restart is required to protect the system or restore critical service.",

    scenarioQuestion:
      "Users report that the server is slow. How do you avoid guessing?",

    scenarioAnswer: [
      "Define the affected requests and time window.",
      "Measure CPU, memory, load and storage latency.",
      "Inspect network and dependency latency.",
      "Compare with normal metrics and recent changes.",
      "Test a specific hypothesis before changing anything."
    ],

    taskLabel:
      "Perform a five-minute server health check.",

    commands: [
      "uptime",
      "free -h",
      "df -hT",
      "df -i",
      "vmstat 1 5",
      "systemctl --failed",
      "journalctl -p warning -n 20"
    ]
  },

  {
    id: "logs",
    name: "Logs & Journal",
    page: "logs.html",
    keywords:
      "journalctl journald logs dmesg kernel boot investigation",

    recallQuestion:
      "Explain how you would narrow a large log investigation.",

    recallAnswer:
      "Define the precise time window, affected service or process, severity and correlation identifier. Then compare application, service, kernel and dependency logs around the same event.",

    interviewQuestion:
      "How do you inspect logs from the previous boot?",

    interviewAnswer:
      "Use journalctl --list-boots to identify boots, journalctl -b -1 for the previous boot and journalctl -k -b -1 for its kernel messages.",

    scenarioQuestion:
      "A service failed at approximately 10:15. How would you collect useful logs?",

    scenarioAnswer: [
      "Confirm server time and timezone.",
      "Query the service journal around the failure window.",
      "Check kernel warnings and dependent services.",
      "Search using request ID, PID, user, IP or error code."
    ],

    taskLabel:
      "Practice filtered journal queries.",

    commands: [
      "journalctl --list-boots",
      "journalctl -p warning -n 50",
      "journalctl -b",
      "journalctl -k -b",
      "journalctl --disk-usage"
    ]
  },

  {
    id: "packages",
    name: "Package Management",
    page: "packages.html",
    keywords:
      "apt dpkg dnf rpm repository package update dependency",

    recallQuestion:
      "Explain the relationship between repositories, packages and package managers.",

    recallAnswer:
      "Repositories publish signed package metadata and package files. Low-level tools such as dpkg or rpm manage installed package records, while higher-level tools such as apt or dnf resolve dependencies and retrieve packages.",

    interviewQuestion:
      "Why should you not delete a package-manager lock file immediately?",

    interviewAnswer:
      "The lock may belong to a valid active operation. Removing it can permit concurrent package database changes and cause corruption. First identify the owning process and wait or recover safely.",

    scenarioQuestion:
      "A package installation fails after an interrupted update. What would you check?",

    scenarioAnswer: [
      "Confirm no package manager is currently running.",
      "Check free disk space and inodes.",
      "Inspect package database status.",
      "Verify repositories, DNS and system time.",
      "Use distribution recovery commands only after diagnosis."
    ],

    taskLabel:
      "Inspect package state without installing anything.",

    commands: [
      "cat /etc/os-release",
      "command -v apt dnf rpm dpkg",
      "dpkg --audit 2>/dev/null",
      "sudo apt-get check 2>/dev/null",
      "sudo dnf check 2>/dev/null"
    ]
  },

  {
    id: "shell",
    name: "Shell Scripting",
    page: "shell-scripting.html",
    keywords:
      "bash script variables functions loops conditions automation",

    recallQuestion:
      "What makes a Bash script safer for production use?",

    recallAnswer:
      "Use strict error handling, validate inputs, quote variable expansions, use functions, log important actions, return meaningful exit codes and test failure paths.",

    interviewQuestion:
      "Why should shell variables usually be quoted?",

    interviewAnswer:
      "Quoting prevents unintended word splitting and pathname expansion. For example, use \"$variable\" when passing a variable as one argument.",

    scenarioQuestion:
      "A script works manually but fails in cron. What would you compare?",

    scenarioAnswer: [
      "PATH and other environment variables.",
      "Working directory and relative paths.",
      "The executing user and permissions.",
      "Shell selection and script interpreter.",
      "Standard output, error and exit status."
    ],

    taskLabel:
      "Validate and trace a Bash script.",

    commands: [
      "bash -n SCRIPT_NAME.sh",
      "bash -x SCRIPT_NAME.sh",
      "command -v shellcheck",
      "shellcheck SCRIPT_NAME.sh"
    ]
  },

  {
    id: "cron",
    name: "Cron & Scheduling",
    page: "cron.html",
    keywords:
      "cron crontab timer schedule automation recurring jobs",

    recallQuestion:
      "Recall the five standard cron time fields.",

    recallAnswer:
      "Minute, hour, day of month, month and day of week are followed by the command. System crontabs may include an additional user field.",

    interviewQuestion:
      "Cron vs systemd timer?",

    interviewAnswer:
      "Cron provides traditional time-based command scheduling. systemd timers integrate with unit dependencies, journald, missed-run persistence, randomized delays and service resource controls.",

    scenarioQuestion:
      "A scheduled job did not run. What would you check?",

    scenarioAnswer: [
      "Validate schedule syntax.",
      "Confirm the cron daemon or timer is active.",
      "Check the executing user and environment.",
      "Use absolute paths.",
      "Inspect logs, output and exit status."
    ],

    taskLabel:
      "Inspect current scheduled jobs.",

    commands: [
      "crontab -l",
      "systemctl status cron crond",
      "systemctl list-timers --all",
      "journalctl -u cron -u crond -n 50"
    ]
  },

  {
    id: "memory",
    name: "Memory & Swap",
    page: "memory.html",
    keywords:
      "ram swap cache available oom memory pressure",

    recallQuestion:
      "Explain free, available, cache and swap memory.",

    recallAnswer:
      "Free memory is completely unused. Available estimates memory usable without heavy swapping. Cache uses spare RAM to improve performance and is reclaimable. Swap stores selected memory pages on disk.",

    interviewQuestion:
      "Why is low free memory not automatically a problem?",

    interviewAnswer:
      "Linux intentionally uses idle RAM for filesystem cache. Available memory, swap activity, reclaim pressure and application behaviour are more useful than the free value alone.",

    scenarioQuestion:
      "An application was killed by the OOM killer. What would you investigate?",

    scenarioAnswer: [
      "Confirm the event in kernel logs.",
      "Identify the killed process.",
      "Check system-wide and cgroup memory limits.",
      "Inspect memory growth and swap activity.",
      "Determine whether the cause is a leak, spike or incorrect limit."
    ],

    taskLabel:
      "Inspect memory and OOM evidence.",

    commands: [
      "free -h",
      "cat /proc/meminfo | head -30",
      "vmstat 1 5",
      "swapon --show",
      "journalctl -k | grep -Ei 'oom|out of memory|killed process'"
    ]
  },

  {
    id: "cpu",
    name: "CPU & Load",
    page: "cpu-load.html",
    keywords:
      "cpu load average iowait steal process performance",

    recallQuestion:
      "Explain CPU usage and load average without treating them as identical.",

    recallAnswer:
      "CPU usage measures processor time. Load average counts runnable tasks and tasks blocked in uninterruptible sleep. High load can therefore occur with low CPU when tasks wait on I/O.",

    interviewQuestion:
      "What do user, system, I/O wait and steal CPU mean?",

    interviewAnswer:
      "User is application execution, system is kernel execution, I/O wait is idle time with outstanding I/O, and steal is time a virtual CPU waited while the hypervisor ran another workload.",

    scenarioQuestion:
      "Load is high but CPU usage is low. What would you check?",

    scenarioAnswer: [
      "Inspect runnable and D-state processes.",
      "Measure storage latency and queue depth.",
      "Check network filesystems and devices.",
      "Inspect kernel logs for I/O errors.",
      "Compare with recent workload changes."
    ],

    taskLabel:
      "Measure CPU, load and blocked tasks.",

    commands: [
      "uptime",
      "nproc",
      "vmstat 1 5",
      "mpstat -P ALL 1 5",
      "ps -eo state,pid,ppid,wchan:30,comm | head -30"
    ]
  },

  {
    id: "ssh",
    name: "SSH & Remote Access",
    page: "ssh.html",
    keywords:
      "ssh sshd keys remote scp sftp authentication",

    recallQuestion:
      "Explain SSH key authentication at a high level.",

    recallAnswer:
      "The client proves possession of a private key. The server checks whether the corresponding public key is authorized for the target account. The private key is never sent to the server.",

    interviewQuestion:
      "Why must authorized_keys and .ssh permissions be restricted?",

    interviewAnswer:
      "Overly broad ownership or permissions allow key tampering and may cause sshd to reject the files for security reasons.",

    scenarioQuestion:
      "Key authentication fails while password authentication works. What would you inspect?",

    scenarioAnswer: [
      "Use ssh -vvv from the client.",
      "Check the target username and offered key.",
      "Inspect home, .ssh and authorized_keys ownership and permissions.",
      "Check effective sshd configuration.",
      "Check server authentication and SELinux/AppArmor logs."
    ],

    taskLabel:
      "Review SSH configuration safely.",

    commands: [
      "ssh -V",
      "sudo sshd -t",
      "sudo sshd -T | head -40",
      "sudo ss -ltnp | grep ':22'",
      "journalctl -u ssh -u sshd -n 30"
    ]
  },

  {
    id: "files",
    name: "Files & Text Processing",
    page: "files-text.html",
    keywords:
      "find grep sed awk sort cut pipes redirection files text",

    recallQuestion:
      "Explain how pipes and redirection differ.",

    recallAnswer:
      "A pipe connects one process standard output to another process standard input. Redirection connects standard input, output or error to a file or another file descriptor.",

    interviewQuestion:
      "When would you use grep, sed and awk?",

    interviewAnswer:
      "grep selects matching lines, sed performs stream-oriented transformations, and awk is suited to field-based filtering, calculations and structured text reporting.",

    scenarioQuestion:
      "You need to find the largest recently changed log files. How would you approach it?",

    scenarioAnswer: [
      "Limit find to the correct filesystem and file type.",
      "Filter by modification time and size.",
      "Print exact size and path.",
      "Sort numerically.",
      "Avoid deleting anything until ownership and retention are known."
    ],

    taskLabel:
      "Practice a safe text-processing pipeline.",

    commands: [
      "find /var/log -type f -mtime -1 -printf '%s %p\\n' 2>/dev/null | sort -n | tail",
      "grep -Rni 'error' /var/log 2>/dev/null | head",
      "printf 'a 10\\nb 20\\n' | awk '{sum += $2} END {print sum}'"
    ]
  },

  {
    id: "environment",
    name: "Environment & PATH",
    page: "environment.html",
    keywords:
      "environment variables path export profile shell systemd",

    recallQuestion:
      "Explain environment variables and PATH.",

    recallAnswer:
      "Environment variables are inherited name-value settings passed to child processes. PATH is a colon-separated list of directories searched when a command is invoked without an explicit path.",

    interviewQuestion:
      "Why can a command work in your shell but fail in systemd or cron?",

    interviewAnswer:
      "The service or job can have a different user, PATH, environment, working directory, shell and resource limits from the interactive session.",

    scenarioQuestion:
      "A service says command not found after deployment. What would you inspect?",

    scenarioAnswer: [
      "Inspect the service ExecStart and environment.",
      "Use an absolute executable path.",
      "Check the service user and PATH.",
      "Check file execute permission and mount options.",
      "Reload and restart only after validation."
    ],

    taskLabel:
      "Compare command resolution and environment.",

    commands: [
      "env | sort",
      "echo \"$PATH\"",
      "command -v bash",
      "type -a sh",
      "systemctl show ssh.service -p Environment -p ExecStart"
    ]
  },

  {
    id: "security",
    name: "Linux Security",
    page: "linux-security.html",
    keywords:
      "hardening firewall selinux apparmor audit capabilities pam",

    recallQuestion:
      "Recall the main layers of Linux defence in depth.",

    recallAnswer:
      "Identity, least privilege, permissions, sudo, firewall, patching, SSH hardening, capabilities, SELinux/AppArmor, service sandboxing, auditing, monitoring, encryption, backups and incident response work together.",

    interviewQuestion:
      "Why should SELinux not simply be disabled after a denial?",

    interviewAnswer:
      "The denial may reveal incorrect labels, access design or an application compromise. Investigate the AVC event and apply the smallest correct label, boolean or policy fix while retaining enforcement.",

    scenarioQuestion:
      "An unexpected port starts listening on a production server. What would you do?",

    scenarioAnswer: [
      "Identify the process, binary, user and parent.",
      "Check service, container and scheduled-job ownership.",
      "Preserve logs and evidence.",
      "Contain according to the incident plan.",
      "Rotate exposed credentials and recover from a trusted state if compromised."
    ],

    taskLabel:
      "Perform a read-only security baseline.",

    commands: [
      "sudo ss -lntup",
      "systemctl --type=service --state=running",
      "getenforce 2>/dev/null",
      "sudo aa-status 2>/dev/null",
      "sudo nft list ruleset",
      "sudo journalctl -p warning --since today"
    ]
  },

  {
    id: "internals",
    name: "Advanced Linux Internals",
    page: "linux-internals.html",
    keywords:
      "proc sys system calls descriptors modules namespaces cgroups",

    recallQuestion:
      "Explain how /proc, /sys and system calls relate to the kernel.",

    recallAnswer:
      "/proc exposes process and kernel runtime information, /sys represents kernel objects and devices, and system calls are controlled entry points through which applications request kernel operations.",

    interviewQuestion:
      "What is a file descriptor?",

    interviewAnswer:
      "It is a small per-process integer referring to an open kernel-managed resource such as a file, socket, directory or pipe.",

    scenarioQuestion:
      "An application reports too many open files. What would you investigate?",

    scenarioAnswer: [
      "Check the process soft and hard limits.",
      "Count descriptors under /proc/PID/fd.",
      "Classify descriptors using lsof.",
      "Check whether usage grows continuously.",
      "Fix the descriptor leak before only raising limits."
    ],

    taskLabel:
      "Inspect the current shell through /proc.",

    commands: [
      "cat /proc/$$/status",
      "cat /proc/$$/limits",
      "ls -l /proc/$$/fd",
      "ls -l /proc/$$/ns",
      "cat /proc/$$/cgroup"
    ]
  },

  {
    id: "containers",
    name: "DevOps / Container Linux",
    page: "container-linux.html",
    keywords:
      "docker podman container namespaces cgroups overlayfs volumes",

    recallQuestion:
      "Explain a Linux container without calling it a lightweight VM.",

    recallAnswer:
      "A container is an isolated group of host-kernel processes. Namespaces isolate views, cgroups control resources, layered filesystems provide the root filesystem, and security controls reduce privilege.",

    interviewQuestion:
      "Why is PID 1 important inside a container?",

    interviewAnswer:
      "The primary container process receives shutdown signals and must reap exited children. Poor PID 1 behaviour can cause failed graceful shutdowns and zombie processes.",

    scenarioQuestion:
      "A container exits immediately after starting. What would you check?",

    scenarioAnswer: [
      "Inspect status, exit code and OOM state.",
      "Read container logs.",
      "Check entrypoint and command.",
      "Verify configuration, secrets and mounts.",
      "Check resource limits and host kernel logs."
    ],

    taskLabel:
      "Inspect container processes and runtime state.",

    commands: [
      "docker ps -a",
      "docker info",
      "docker stats --no-stream",
      "docker network ls",
      "docker system df"
    ]
  },

  {
    id: "interview",
    name: "Linux Interview Preparation",
    page: "interview.html",
    keywords:
      "interview concepts commands scenarios architecture mock",

    recallQuestion:
      "Recall the structure of a strong Linux troubleshooting answer.",

    recallAnswer:
      "Clarify symptom and scope, check changes, collect evidence, isolate the layer, apply a safe fix, verify user-visible recovery and explain prevention.",

    interviewQuestion:
      "What makes an interview answer production-ready?",

    interviewAnswer:
      "It explains the concept, gives relevant commands, describes expected evidence, includes safety and tradeoffs, verifies recovery and proposes monitoring or prevention.",

    scenarioQuestion:
      "You do not know an interview answer completely. What should you do?",

    scenarioAnswer: [
      "State what you know accurately.",
      "Clarify assumptions.",
      "Explain how you would verify using documentation or a lab.",
      "Do not invent commands or behaviour.",
      "Connect the answer to a related concept you understand."
    ],

    taskLabel:
      "Answer one question aloud without notes.",

    commands: [
      "Explain Linux boot in 60 seconds",
      "Explain high load with low CPU",
      "Explain df vs du mismatch",
      "Explain namespace vs cgroup"
    ]
  },

  {
    id: "labs",
    name: "Linux Hands-On Labs",
    page: "practice.html",
    keywords:
      "labs practice users lvm network ssh systemd incidents",

    recallQuestion:
      "What safety rules apply before a system-changing Linux lab?",

    recallAnswer:
      "Use a disposable VM, take a snapshot, verify exact targets, read cleanup steps first, avoid production resources and keep console access during networking or SSH changes.",

    interviewQuestion:
      "Why are verification and cleanup part of a lab?",

    interviewAnswer:
      "Verification proves the expected behaviour was achieved. Cleanup confirms you understand resource ownership and prevents lab users, services, mounts or devices from affecting later work.",

    scenarioQuestion:
      "A lab command behaves differently from the documentation. What would you check?",

    scenarioAnswer: [
      "Check distribution and software versions.",
      "Read installed manual pages.",
      "Confirm privileges and prerequisites.",
      "Inspect exact command output and logs.",
      "Reset the isolated lab and reproduce one change at a time."
    ],

    taskLabel:
      "Choose one safe read-only lab.",

    commands: [
      "uptime",
      "free -h",
      "df -hT",
      "systemctl --failed",
      "ip -br address",
      "journalctl -p warning -n 20"
    ]
  },

  {
    id: "docs",
    name: "Linux Official Documentation",
    page: "docs.html",
    keywords:
      "documentation man info apropos kernel gnu systemd openssh",

    recallQuestion:
      "Recall the preferred order for finding reliable Linux information.",

    recallAnswer:
      "Start with installed help and manual pages, then distribution documentation, then upstream project documentation. Use third-party explanations only after verifying the official source.",

    interviewQuestion:
      "Why can an online example be correct but wrong for your server?",

    interviewAnswer:
      "It may target a different distribution, release, package version, init system, filesystem, firewall framework or configuration layout.",

    scenarioQuestion:
      "You encounter an unfamiliar command option in production. How do you verify it?",

    scenarioAnswer: [
      "Check the installed command version.",
      "Read its local man page and --help output.",
      "Check distribution documentation.",
      "Confirm upstream documentation for that version.",
      "Test safely in a matching lab."
    ],

    taskLabel:
      "Practice local documentation discovery.",

    commands: [
      "man man",
      "man 5 fstab",
      "man 7 signal",
      "apropos namespace",
      "info coreutils",
      "systemctl --help"
    ]
  }
];
