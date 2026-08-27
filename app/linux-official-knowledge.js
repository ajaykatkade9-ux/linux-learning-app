window.LINUX_OFFICIAL_KNOWLEDGE = {
  version: 1,
  verifiedAt: "2026-08-27",
  entries: [
    {
      id: "kernel-docs-index",
      category: "Kernel",
      title: "Linux Kernel Documentation",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/",
      summary: "The upstream Linux kernel documentation is the primary reference for kernel subsystems, administration, filesystems, security, tracing, drivers and development. Match the online documentation to the kernel version installed on the target system whenever behaviour is version-sensitive.",
      commands: ["uname -r\ncat /proc/version"],
      keywords: "kernel upstream documentation admin guide subsystem driver version"
    },
    {
      id: "kernel-procfs",
      category: "Kernel",
      title: "The /proc Filesystem",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/filesystems/proc.html",
      summary: "/proc is a virtual filesystem that exposes live process and kernel information. Per-process directories such as /proc/PID contain status, file descriptor, memory and command-line data, while files such as /proc/meminfo, /proc/cpuinfo and /proc/loadavg expose system-wide state. Some settings below /proc/sys are writable through sysctl and must be changed carefully.",
      commands: ["cat /proc/meminfo\ncat /proc/loadavg\nls -l /proc/$$/fd"],
      keywords: "proc procfs pid process meminfo cpuinfo loadavg fd virtual filesystem"
    },
    {
      id: "kernel-sysfs",
      category: "Kernel",
      title: "sysfs — Kernel Objects and Devices",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/filesystems/sysfs.html",
      summary: "/sys is a virtual filesystem that represents kernel objects, devices, drivers, buses, classes and their attributes. It is commonly used with udev and hardware troubleshooting. Attribute files usually expose one value, and writable attributes change live kernel or device state, so confirm the documented interface before writing.",
      commands: ["findmnt /sys\nls /sys/class\nreadlink -f /sys/class/net/eth0"],
      keywords: "sys sysfs device driver class bus udev hardware kernel object"
    },
    {
      id: "kernel-sysctl",
      category: "Kernel",
      title: "Kernel Parameters and sysctl",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/admin-guide/sysctl/index.html",
      summary: "sysctl reads and changes supported runtime kernel parameters exposed below /proc/sys. Use sysctl.d files for persistent settings and test workload-specific changes before production. Networking, forwarding, memory and security parameters can break applications, containers, routers or VPNs when applied blindly.",
      commands: ["sysctl -a\nsysctl net.ipv4.ip_forward\nls /etc/sysctl.d/", "sudo sysctl --system"],
      keywords: "sysctl proc sys kernel parameter tuning persistent sysctl.d ip forward hardening"
    },
    {
      id: "kernel-cgroup-v2",
      category: "Kernel",
      title: "Control Group v2",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/admin-guide/cgroup-v2.html",
      summary: "Control groups organize processes hierarchically and let the kernel account for and control resources such as CPU, memory, I/O and process count. Cgroup v2 provides one unified hierarchy. systemd normally manages cgroups on modern distributions, so service resource controls are usually safer than editing cgroupfs directly.",
      commands: ["stat -fc %T /sys/fs/cgroup\nsystemd-cgls\nsystemd-cgtop"],
      keywords: "cgroup cgroups v2 cpu memory io pids resource limit container systemd"
    },
    {
      id: "kernel-namespaces",
      category: "Kernel",
      title: "Linux Namespaces",
      source: "Linux man-pages project",
      url: "https://man7.org/linux/man-pages/man7/namespaces.7.html",
      summary: "Namespaces isolate selected system resources so processes see separate views of process IDs, mounts, networks, users, hostnames, IPC and cgroups. Containers combine namespaces with cgroups, capabilities, filesystems and security controls; a namespace alone is not a complete security boundary.",
      commands: ["lsns\nreadlink /proc/$$/ns/pid\nunshare --help"],
      keywords: "namespace namespaces pid mount mnt net user uts ipc cgroup container isolation lsns unshare"
    },
    {
      id: "kernel-capabilities",
      category: "Kernel",
      title: "Linux Capabilities",
      source: "Linux man-pages project",
      url: "https://man7.org/linux/man-pages/man7/capabilities.7.html",
      summary: "Linux capabilities split traditional root privilege into smaller units such as CAP_NET_BIND_SERVICE and CAP_SYS_ADMIN. A process can receive only the privileges it needs through executable file capabilities, its credential sets or a service manager. Capabilities remain powerful and should be granted minimally.",
      commands: ["capsh --print\ngetpcaps $$\nsudo getcap -r / 2>/dev/null"],
      keywords: "capability capabilities root privilege getcap setcap capsh bounding ambient container"
    },
    {
      id: "kernel-signals",
      category: "Kernel",
      title: "Signals",
      source: "Linux man-pages project",
      url: "https://man7.org/linux/man-pages/man7/signal.7.html",
      summary: "Signals notify a process that an event occurred. SIGTERM requests a graceful shutdown and can be handled, while SIGKILL cannot be caught or ignored. Use the least disruptive signal first, inspect process state, and allow cleanup time before escalation.",
      commands: ["kill -TERM PID\nkill -KILL PID\nps -o pid,ppid,stat,cmd -p PID", "kill -l"],
      keywords: "signal sigterm sigkill sighup stop process kill graceful shutdown zombie"
    },
    {
      id: "kernel-sockets",
      category: "Kernel",
      title: "Sockets",
      source: "Linux man-pages project",
      url: "https://man7.org/linux/man-pages/man7/socket.7.html",
      summary: "Sockets are communication endpoints used by network protocols and local Unix-domain IPC. Socket type, address family, bind address, port, state and owning process are central to connection troubleshooting. A service listening only on loopback is not reachable through an external interface.",
      commands: ["ss -lntup\nss -tanp\nsudo lsof -i"],
      keywords: "socket tcp udp unix bind listen port connection network ipc ss lsof"
    },
    {
      id: "kernel-tracing",
      category: "Kernel",
      title: "Linux Kernel Tracing",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/trace/index.html",
      summary: "Kernel tracing facilities such as ftrace and tracepoints help investigate scheduling, latency, functions and kernel events. Tracing can create overhead and large output, so collect the smallest useful event set for a limited time and preserve timestamps for correlation.",
      commands: ["sudo trace-cmd list 2>/dev/null\nsudo perf list 2>/dev/null | head"],
      keywords: "trace tracing ftrace tracepoint perf latency scheduler kernel debugging observability"
    },

    {
      id: "systemd-overview",
      category: "systemd",
      title: "systemd System and Service Manager",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd.html",
      summary: "systemd is the system and service manager used as PID 1 on many Linux distributions. It starts and supervises units, tracks dependencies, manages cgroups, activates services on demand and coordinates boot and shutdown. Unit configuration and available directives depend on the installed systemd version.",
      commands: ["systemctl --version\nps -p 1 -o pid,comm,args\nsystemctl get-default"],
      keywords: "systemd pid 1 init boot unit dependency target service manager"
    },
    {
      id: "systemd-systemctl",
      category: "systemd",
      title: "systemctl — Control systemd Units",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemctl.html",
      summary: "systemctl inspects and controls systemd units and the manager. status combines runtime state with recent logs; is-active and is-enabled answer different questions. Enabling controls boot-time activation, while starting changes current runtime state. Validate the exact unit name before production changes.",
      commands: ["systemctl status SERVICE\nsystemctl is-active SERVICE\nsystemctl is-enabled SERVICE", "sudo systemctl enable --now SERVICE"],
      keywords: "systemctl status start stop restart reload enable disable mask failed unit service"
    },
    {
      id: "systemd-journalctl",
      category: "systemd",
      title: "journalctl — Query the systemd Journal",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/journalctl.html",
      summary: "journalctl prints structured logs collected by systemd-journald. Filter by unit, boot, priority, time, process or executable instead of reading the entire journal. Use the current boot for reboot-related failures and follow mode for a controlled live reproduction.",
      commands: ["journalctl -u SERVICE --since today\njournalctl -b -p warning\njournalctl --disk-usage", "journalctl -u SERVICE -f"],
      keywords: "journalctl journald logs unit boot priority since until follow service failure"
    },
    {
      id: "systemd-service",
      category: "systemd",
      title: "systemd Service Units",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd.service.html",
      summary: "Service units describe how systemd starts, stops, reloads and monitors processes. Type determines how readiness is detected, ExecStart launches the workload, Restart controls restart policy and dependencies express ordering or requirements. Use drop-in overrides instead of editing vendor unit files.",
      commands: ["systemctl cat SERVICE\nsystemctl show SERVICE\nsudo systemctl edit SERVICE", "sudo systemd-analyze verify /etc/systemd/system/example.service"],
      keywords: "systemd service unit execstart restart type notify forking oneshot override drop-in"
    },
    {
      id: "systemd-unit",
      category: "systemd",
      title: "systemd Unit Configuration",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd.unit.html",
      summary: "Unit files can be supplied by packages, administrators and runtime generators with defined precedence. Wants and Requires express dependency strength; After and Before express ordering. Dependency and ordering are separate concepts, so a robust unit often needs both where appropriate.",
      commands: ["systemctl cat UNIT\nsystemctl list-dependencies UNIT\nsystemd-analyze critical-chain UNIT"],
      keywords: "unit wants requires after before dependency ordering target drop-in override"
    },
    {
      id: "systemd-resource-control",
      category: "systemd",
      title: "systemd Resource Control",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html",
      summary: "systemd maps units to cgroups and exposes controls for CPU, memory, I/O, process count and device access. Limits such as MemoryMax and CPUQuota should be introduced with monitoring because an overly strict limit can cause throttling or OOM termination.",
      commands: ["systemctl show SERVICE -p MemoryCurrent -p MemoryMax -p CPUQuotaPerSecUSec\nsystemd-cgtop", "sudo systemctl set-property SERVICE MemoryMax=1G"],
      keywords: "systemd cgroup resource cpuquota memorymax tasksmax io limit service container"
    },
    {
      id: "systemd-exec-security",
      category: "systemd",
      title: "systemd Execution and Sandboxing",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd.exec.html",
      summary: "systemd service execution settings control users, groups, environments, working directories, filesystem access, capabilities and sandboxing. Directives such as NoNewPrivileges, ProtectSystem and PrivateTmp can reduce service attack surface, but they must be tested against legitimate application behaviour.",
      commands: ["systemd-analyze security SERVICE\nsystemctl show SERVICE -p User -p Group -p NoNewPrivileges"],
      keywords: "systemd exec sandbox hardening nonewprivileges protectsystem privatetmp user capability"
    },
    {
      id: "systemd-analyze",
      category: "systemd",
      title: "systemd-analyze — Boot and Unit Analysis",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd-analyze.html",
      summary: "systemd-analyze measures boot timing, shows critical dependency chains, verifies unit files and estimates service sandbox exposure. Blame output shows elapsed activation time but does not alone prove that a unit caused the entire boot delay; confirm with critical-chain and logs.",
      commands: ["systemd-analyze\nsystemd-analyze blame\nsystemd-analyze critical-chain", "systemd-analyze verify UNIT_FILE\nsystemd-analyze security SERVICE"],
      keywords: "systemd analyze boot slow blame critical chain verify security unit"
    },
    {
      id: "systemd-timer",
      category: "systemd",
      title: "systemd Timer Units",
      source: "systemd",
      url: "https://www.freedesktop.org/software/systemd/man/systemd.timer.html",
      summary: "Timer units activate another unit according to calendar or monotonic schedules. OnCalendar supports wall-clock schedules, Persistent can catch up missed calendar runs, and RandomizedDelaySec spreads load. Inspect the linked service and its journal when a timer appears not to run.",
      commands: ["systemctl list-timers --all\nsystemctl status NAME.timer\njournalctl -u NAME.timer -u NAME.service"],
      keywords: "systemd timer schedule oncalendar persistent randomizeddelay cron automation"
    },

    {
      id: "openssh-client",
      category: "OpenSSH",
      title: "ssh — OpenSSH Client",
      source: "OpenSSH / OpenBSD manuals",
      url: "https://man.openbsd.org/ssh.1",
      summary: "ssh creates an encrypted connection for remote login, command execution and forwarding. Client configuration is assembled from command-line options, user configuration and system configuration. Verbose mode exposes key selection, negotiation and authentication decisions without changing the server.",
      commands: ["ssh -vvv user@host\nssh -G host | less", "ssh -i ~/.ssh/id_ed25519 user@host"],
      keywords: "ssh client remote login verbose forwarding config identity key authentication"
    },
    {
      id: "openssh-server",
      category: "OpenSSH",
      title: "sshd — OpenSSH Daemon",
      source: "OpenSSH / OpenBSD manuals",
      url: "https://man.openbsd.org/sshd.8",
      summary: "sshd is the server daemon that accepts SSH connections, authenticates clients and starts sessions or requested subsystems. Validate configuration before reload and keep a working session open while testing remote access changes.",
      commands: ["sudo sshd -t\nsudo sshd -T\nsudo systemctl status ssh sshd"],
      keywords: "sshd daemon server remote login authentication validate test config service"
    },
    {
      id: "openssh-server-config",
      category: "OpenSSH",
      title: "sshd_config — Server Configuration",
      source: "OpenSSH / OpenBSD manuals",
      url: "https://man.openbsd.org/sshd_config",
      summary: "sshd_config controls server authentication, access, forwarding, listening and session policy. The first obtained value normally applies, and Include or Match blocks can change effective behaviour. Inspect effective configuration with sshd -T and, when Match rules matter, supply connection parameters.",
      commands: ["sudo sshd -t\nsudo sshd -T | sort", "sudo sshd -T -C user=deploy,host=server,addr=192.0.2.10"],
      keywords: "sshd_config permitrootlogin passwordauthentication pubkeyauthentication allowusers match include maxauthtries"
    },
    {
      id: "openssh-client-config",
      category: "OpenSSH",
      title: "ssh_config — Client Configuration",
      source: "OpenSSH / OpenBSD manuals",
      url: "https://man.openbsd.org/ssh_config",
      summary: "ssh_config defines reusable client options such as HostName, User, Port, IdentityFile, ProxyJump and connection multiplexing. Options are applied using first-obtained-value rules, so put specific host blocks before broad wildcard defaults.",
      commands: ["ssh -G HOST | sort\nssh -F CONFIG_FILE HOST"],
      keywords: "ssh_config host hostname user port identityfile proxyjump bastion wildcard client"
    },
    {
      id: "openssh-keygen",
      category: "OpenSSH",
      title: "ssh-keygen — SSH Key Management",
      source: "OpenSSH / OpenBSD manuals",
      url: "https://man.openbsd.org/ssh-keygen.1",
      summary: "ssh-keygen creates and manages SSH keys, fingerprints, certificates, known-host entries and key revocation lists. Protect private keys, distribute only public keys and verify fingerprints through a trusted channel.",
      commands: ["ssh-keygen -t ed25519 -a 64\nssh-keygen -lf ~/.ssh/id_ed25519.pub", "ssh-keygen -R HOSTNAME"],
      keywords: "ssh-keygen ed25519 rsa key fingerprint known_hosts certificate revoke public private"
    },
    {
      id: "openssh-scp-sftp",
      category: "OpenSSH",
      title: "Secure File Transfer with scp and sftp",
      source: "OpenSSH / OpenBSD manuals",
      url: "https://man.openbsd.org/scp.1",
      summary: "scp copies files through SSH and modern implementations use the SFTP protocol by default. sftp provides an interactive and batch file-transfer interface. Apply the same host verification, authentication and least-privilege controls used for SSH sessions.",
      commands: ["scp FILE user@host:/destination/\nsftp user@host"],
      keywords: "scp sftp copy transfer remote file ssh recursive batch"
    },

    {
      id: "gnu-bash",
      category: "GNU Tools",
      title: "GNU Bash Reference Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/bash/manual/",
      summary: "The Bash manual is the authoritative reference for shell syntax, quoting, expansion, redirection, pipelines, functions, arrays, job control and builtins. Quote variable expansions unless intentional splitting or globbing is required, and use strict checks thoughtfully rather than as a substitute for error handling.",
      commands: ["bash --version\nhelp BUILTIN\nhelp set", "bash -n script.sh\nbash -x script.sh"],
      keywords: "bash shell quoting expansion variable array function pipeline redirection script builtin"
    },
    {
      id: "gnu-coreutils",
      category: "GNU Tools",
      title: "GNU Coreutils Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/coreutils/manual/",
      summary: "GNU Coreutils documents common file, text and system utilities including ls, cp, mv, rm, chmod, chown, df, du, sort, cut, date and timeout. Check the installed utility version because options and behaviour can differ across releases or non-GNU systems.",
      commands: ["COMMAND --version\nCOMMAND --help\ninfo coreutils 'COMMAND invocation'"],
      keywords: "coreutils ls cp mv rm chmod chown df du sort cut date timeout manual"
    },
    {
      id: "gnu-findutils",
      category: "GNU Tools",
      title: "GNU Findutils Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/findutils/manual/",
      summary: "GNU Findutils covers find, locate, updatedb and xargs. Expression order matters in find, and actions such as -delete or -exec should be tested first with -print. Use null-delimited paths when filenames may contain whitespace or newlines.",
      commands: ["find /path -type f -name '*.log' -print\nfind /path -type f -print0 | xargs -0 COMMAND"],
      keywords: "find findutils locate updatedb xargs exec delete print0 files search"
    },
    {
      id: "gnu-grep",
      category: "GNU Tools",
      title: "GNU grep Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/grep/manual/",
      summary: "grep selects lines matching basic, extended or fixed-string patterns. Recursive searches, binary files, locale and regular-expression syntax affect results. Use fixed-string mode for literal text and null delimiters when composing filename-safe pipelines.",
      commands: ["grep -Rni -- 'pattern' /path\ngrep -F -- 'literal.text' FILE"],
      keywords: "grep regex regular expression recursive fixed string pattern text search"
    },
    {
      id: "gnu-sed",
      category: "GNU Tools",
      title: "GNU sed Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/sed/manual/",
      summary: "sed is a stream editor for selecting and transforming text. Preview output before in-place editing, understand address ranges and quoting, and keep a recoverable copy for important configuration files.",
      commands: ["sed -n '1,40p' FILE\nsed 's/old/new/g' FILE", "sed -i.backup 's/old/new/g' FILE"],
      keywords: "sed stream editor substitute address range inplace text transform"
    },
    {
      id: "gnu-gawk",
      category: "GNU Tools",
      title: "GNU Awk User’s Guide",
      source: "GNU Project",
      url: "https://www.gnu.org/software/gawk/manual/",
      summary: "awk processes records and fields using pattern-action rules. It is useful for structured text, reports and small transformations. Set field separators explicitly when input is not ordinary whitespace and avoid assuming every record has the expected fields.",
      commands: ["awk '{print $1}' FILE\nawk -F: '{print $1, $3}' /etc/passwd"],
      keywords: "awk gawk field record pattern action separator report text processing"
    },
    {
      id: "gnu-tar",
      category: "GNU Tools",
      title: "GNU tar Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/tar/manual/",
      summary: "GNU tar creates, lists and extracts archive files. Inspect untrusted archives before extraction and extract into a controlled directory because paths, links and ownership metadata can have security impact. A tar archive is not automatically encrypted.",
      commands: ["tar -tf archive.tar\ntar -czf backup.tar.gz DIRECTORY", "mkdir -p /tmp/extract\ntar -xf archive.tar -C /tmp/extract"],
      keywords: "tar archive backup compress gzip extract list security path traversal"
    },
    {
      id: "gnu-make",
      category: "GNU Tools",
      title: "GNU make Manual",
      source: "GNU Project",
      url: "https://www.gnu.org/software/make/manual/",
      summary: "GNU make updates targets from prerequisites according to rules in a makefile. Correct dependency declarations enable incremental and parallel builds. Recipe lines, variable expansion and shell invocation follow make-specific rules that differ from a standalone shell script.",
      commands: ["make --version\nmake -n TARGET\nmake -j2 TARGET"],
      keywords: "make makefile target prerequisite dependency recipe build automation variable"
    },

    {
      id: "network-ip",
      category: "Networking",
      title: "ip — Address, Link and Route Management",
      source: "Linux man-pages / iproute2",
      url: "https://man7.org/linux/man-pages/man8/ip.8.html",
      summary: "The ip command displays and manages interfaces, addresses, routes, neighbours, rules and network namespaces. Start troubleshooting with read-only views of link state, addresses and routes. Runtime changes may disconnect a remote system, so preserve console recovery before modifying production networking.",
      commands: ["ip -br link\nip -br address\nip route\nip rule", "ip route get 1.1.1.1"],
      keywords: "iproute2 ip address link route neighbour rule interface network namespace"
    },
    {
      id: "network-ss",
      category: "Networking",
      title: "ss — Socket Statistics",
      source: "Linux man-pages / iproute2",
      url: "https://man7.org/linux/man-pages/man8/ss.8.html",
      summary: "ss reports listening and connected sockets with protocol, state, addresses, queues and owning processes. It is usually the first tool for confirming whether a service is listening on the expected address and port.",
      commands: ["ss -lntup\nss -tan state established\nss -s"],
      keywords: "ss socket statistics tcp udp listen port process queue connection established"
    },
    {
      id: "networkmanager",
      category: "Networking",
      title: "NetworkManager Documentation",
      source: "NetworkManager",
      url: "https://networkmanager.dev/docs/",
      summary: "NetworkManager manages network devices and persistent connection profiles. nmcli separates device runtime state from stored connection settings. Inspect active profiles, addresses, routes and DNS before changing a remote system.",
      commands: ["nmcli general status\nnmcli device status\nnmcli connection show --active", "nmcli device show"],
      keywords: "networkmanager nmcli connection profile device dns route address wifi ethernet"
    },
    {
      id: "bind9-dns",
      category: "Networking",
      title: "BIND 9 Administrator Reference",
      source: "Internet Systems Consortium",
      url: "https://bind9.readthedocs.io/",
      summary: "BIND 9 documentation covers authoritative DNS servers, recursive resolvers, zones, DNSSEC, configuration and operations. Validate named configuration and zone files before reload, and distinguish resolver failure from authoritative data problems.",
      commands: ["named-checkconf\nnamed-checkzone example.com /path/to/zone", "dig example.com\ndig +trace example.com"],
      keywords: "bind named dns resolver authoritative zone dnssec dig resolution"
    },
    {
      id: "nftables",
      category: "Networking",
      title: "nftables Documentation",
      source: "nftables project",
      url: "https://wiki.nftables.org/wiki-nftables/index.php/Main_Page",
      summary: "nftables is the modern Linux packet-filtering framework and replaces legacy iptables-family front ends in many environments. Rules are organized into tables, chains and sets. Review the complete ruleset and preserve remote management access before applying firewall changes.",
      commands: ["sudo nft list ruleset\nsudo nft list tables\nsudo nft -c -f RULES_FILE"],
      keywords: "nftables nft firewall packet filter table chain set rule iptables"
    },

    {
      id: "storage-lvm",
      category: "Storage",
      title: "Configuring and Managing LVM",
      source: "Red Hat Enterprise Linux",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_managing_logical_volumes/index",
      summary: "LVM combines physical volumes into volume groups and allocates logical volumes from pooled capacity. Inspect the device, filesystem and backup state before resizing or removing anything. Extending an LV and growing its filesystem are related but distinct operations.",
      commands: ["sudo pvs\nsudo vgs\nsudo lvs -a -o +devices\nlsblk -f", "sudo lvextend -r -L +10G VG/LV"],
      keywords: "lvm physical volume pv volume group vg logical volume lv extend resize snapshot thin"
    },
    {
      id: "storage-mount",
      category: "Storage",
      title: "mount and Filesystem Attachment",
      source: "Linux man-pages project",
      url: "https://man7.org/linux/man-pages/man8/mount.8.html",
      summary: "mount attaches a filesystem to the directory tree. Runtime mounts and persistent /etc/fstab configuration are separate. Use findmnt to inspect effective mounts and validate fstab before reboot because an invalid required entry can disrupt boot.",
      commands: ["findmnt\nfindmnt --verify\nmount | column -t", "sudo mount -a"],
      keywords: "mount umount findmnt fstab filesystem attachment option boot failure"
    },
    {
      id: "storage-lsblk",
      category: "Storage",
      title: "lsblk — List Block Devices",
      source: "Linux man-pages project",
      url: "https://man7.org/linux/man-pages/man8/lsblk.8.html",
      summary: "lsblk reports block devices and their relationships using sysfs and udev data. Select explicit output columns in scripts because default columns can change. Combine it with findmnt and blkid to connect devices, filesystems, UUIDs and mount points.",
      commands: ["lsblk -o NAME,TYPE,SIZE,FSTYPE,UUID,MOUNTPOINTS\nfindmnt\nsudo blkid"],
      keywords: "lsblk block device disk partition filesystem uuid mountpoint udev"
    },
    {
      id: "storage-ext4",
      category: "Storage",
      title: "ext4 Filesystem Documentation",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/filesystems/ext4/",
      summary: "The kernel ext4 documentation describes on-disk structures, allocation, journaling, checksums and mount behaviour. Filesystem repair must normally run against an unmounted filesystem and should follow backup and recovery planning.",
      commands: ["findmnt -t ext4\ntune2fs -l /dev/DEVICE | less", "sudo e2fsck -f /dev/UNMOUNTED_DEVICE"],
      keywords: "ext4 filesystem journal inode allocation checksum fsck e2fsck tune2fs"
    },

    {
      id: "security-selinux",
      category: "Security",
      title: "Using SELinux",
      source: "Red Hat Enterprise Linux",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux/index",
      summary: "SELinux adds mandatory access control labels and policy decisions beyond normal Unix permissions. Investigate AVC denials, confirm expected contexts and booleans, and apply the smallest correct change. Disabling enforcing mode is not a production root-cause fix.",
      commands: ["getenforce\nls -Z PATH\nsudo ausearch -m AVC -ts recent", "sudo restorecon -Rv PATH"],
      keywords: "selinux enforcing permissive avc denial context label restorecon semanage boolean"
    },
    {
      id: "security-apparmor",
      category: "Security",
      title: "AppArmor",
      source: "Ubuntu Security Documentation",
      url: "https://documentation.ubuntu.com/security/docs/security-features/privilege-restriction/apparmor/",
      summary: "AppArmor confines applications with profiles that define allowed access. Enforce mode blocks and logs violations; complain mode logs without blocking and is useful during controlled profile development. Review kernel audit messages before changing a profile.",
      commands: ["sudo aa-status\nsudo journalctl -k | grep -i apparmor", "sudo apparmor_parser -r /etc/apparmor.d/PROFILE"],
      keywords: "apparmor profile enforce complain denial audit confinement ubuntu security"
    },
    {
      id: "security-lsm",
      category: "Security",
      title: "Linux Security Modules",
      source: "The Linux Kernel",
      url: "https://docs.kernel.org/admin-guide/LSM/index.html",
      summary: "Linux Security Modules provide kernel hooks used by security frameworks such as SELinux, AppArmor, Smack, TOMOYO, Yama and Landlock. Active modules vary by distribution, kernel configuration and boot parameters.",
      commands: ["cat /sys/kernel/security/lsm 2>/dev/null\ncat /proc/cmdline"],
      keywords: "lsm linux security module selinux apparmor landlock yama smack tomoyo"
    },
    {
      id: "security-ubuntu",
      category: "Security",
      title: "Ubuntu Security Documentation",
      source: "Ubuntu",
      url: "https://documentation.ubuntu.com/security/",
      summary: "Ubuntu security documentation covers updates, hardening, cryptography, vulnerability management and platform security features. Package support and security status depend on the Ubuntu release, enabled repositories and subscription coverage.",
      commands: ["pro security-status 2>/dev/null || ubuntu-security-status 2>/dev/null\napt list --upgradable"],
      keywords: "ubuntu security update vulnerability hardening livepatch usn apparmor"
    },

    {
      id: "containers-docker-engine",
      category: "Containers",
      title: "Docker Engine Documentation",
      source: "Docker",
      url: "https://docs.docker.com/engine/",
      summary: "Docker Engine manages container images, processes, storage and networking through a daemon and API. Containers share the host kernel and should use minimal images, non-root users, restricted capabilities, resource limits and controlled mounts.",
      commands: ["docker version\ndocker info\ndocker ps --no-trunc"],
      keywords: "docker engine container daemon image runtime security process"
    },
    {
      id: "containers-docker-network",
      category: "Containers",
      title: "Docker Container Networking",
      source: "Docker",
      url: "https://docs.docker.com/engine/network/",
      summary: "Docker networking connects containers through drivers such as bridge, host, overlay, ipvlan and macvlan. Published ports create host-side reachability, while container DNS and network membership control service discovery.",
      commands: ["docker network ls\ndocker network inspect NETWORK\ndocker port CONTAINER"],
      keywords: "docker container network bridge host overlay dns published port inspect"
    },
    {
      id: "containers-docker-resources",
      category: "Containers",
      title: "Docker Resource Constraints",
      source: "Docker",
      url: "https://docs.docker.com/engine/containers/resource_constraints/",
      summary: "Docker resource options map container limits to kernel cgroups. Memory, CPU and process limits protect the host and neighbouring workloads, but values require monitoring and workload testing. Without limits a container can compete for host resources.",
      commands: ["docker stats\ndocker inspect CONTAINER --format '{{json .HostConfig}}'", "docker run --memory 512m --cpus 1 IMAGE"],
      keywords: "docker resource constraint memory cpu pids cgroup limit container stats"
    },
    {
      id: "containers-podman",
      category: "Containers",
      title: "Podman Documentation",
      source: "Podman",
      url: "https://docs.podman.io/",
      summary: "Podman manages OCI containers and pods without requiring a central daemon and supports rootless operation. Rootless networking, user namespaces, storage paths and privileged port behaviour differ from rootful execution.",
      commands: ["podman info\npodman ps\npodman inspect CONTAINER"],
      keywords: "podman container pod rootless daemonless oci user namespace image"
    },
    {
      id: "containers-oci",
      category: "Containers",
      title: "Open Container Initiative Specifications",
      source: "Open Container Initiative",
      url: "https://opencontainers.org/",
      summary: "OCI specifications standardize container images, runtime bundles and distribution. The image specification defines portable image content, while the runtime specification defines how a filesystem bundle and configuration become a running container process.",
      commands: ["runc --version 2>/dev/null\ncrun --version 2>/dev/null"],
      keywords: "oci open container initiative image runtime distribution specification runc crun"
    },

    {
      id: "distro-ubuntu-server",
      category: "Distributions",
      title: "Ubuntu Server Documentation",
      source: "Ubuntu",
      url: "https://documentation.ubuntu.com/server/",
      summary: "Ubuntu Server documentation covers installation, networking, storage, packages, security and common services using Ubuntu-specific paths and tooling. Always select documentation that matches the installed Ubuntu release.",
      commands: ["cat /etc/os-release\nlsb_release -a 2>/dev/null\nubuntu-security-status 2>/dev/null"],
      keywords: "ubuntu server apt netplan release package service documentation"
    },
    {
      id: "distro-debian-reference",
      category: "Distributions",
      title: "Debian Reference",
      source: "Debian",
      url: "https://www.debian.org/doc/manuals/debian-reference/",
      summary: "The Debian Reference introduces Debian administration, package management, shell usage, services, networking, storage and security. Behaviour can vary between stable releases, so combine it with installed man pages and release notes.",
      commands: ["cat /etc/debian_version\napt-cache policy PACKAGE\ndpkg-query -W PACKAGE"],
      keywords: "debian apt dpkg package stable administration reference release"
    },
    {
      id: "distro-rhel",
      category: "Distributions",
      title: "Red Hat Enterprise Linux Documentation",
      source: "Red Hat",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/",
      summary: "RHEL documentation provides release-specific guidance for installation, dnf and rpm packages, systemd, NetworkManager, firewalld, SELinux, storage, performance and enterprise operations. Select the exact major release used by the server.",
      commands: ["cat /etc/redhat-release\nrpm -E %rhel\ndnf repolist"],
      keywords: "rhel red hat dnf rpm selinux firewalld networkmanager enterprise release"
    },
    {
      id: "distro-fedora",
      category: "Distributions",
      title: "Fedora Documentation",
      source: "Fedora Project",
      url: "https://docs.fedoraproject.org/",
      summary: "Fedora documentation covers current releases, installation, system administration and project tooling. Fedora changes quickly, so check the installed release and current documentation before applying configuration or package guidance.",
      commands: ["cat /etc/fedora-release\ndnf repolist\nrpm -q fedora-release"],
      keywords: "fedora dnf rpm selinux system administration release documentation"
    }
  ]
};
