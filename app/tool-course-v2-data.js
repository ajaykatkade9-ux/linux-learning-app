(function(){
  'use strict';

  window.DEVOPS_DEEP_COURSES = {
    containerd: {
      quickRevision: [
        'containerd is a container runtime daemon. It manages images, snapshots, containers and running tasks.',
        'Kubernetes commonly talks to containerd through the CRI plugin.',
        'containerd normally uses a low-level OCI runtime such as runc to create the Linux container process.',
        'A container in containerd is metadata; a task is the running process created from that container.',
        'Images are stored through a content store plus snapshotter, not as one big file.',
        'ctr is mainly a low-level containerd client; crictl is better for troubleshooting Kubernetes through CRI.',
        'containerd does not replace Kubernetes networking, scheduling or orchestration.',
        'Namespaces separate containerd resources such as Kubernetes resources under the k8s.io namespace.'
      ],
      lessons: [
        {title:'What is containerd?',level:'Beginner',summary:'Understand exactly where containerd sits between Kubernetes or another client and the Linux runtime.',points:[
          ['Simple meaning','containerd is the service that manages the container lifecycle on a node.'],
          ['Why it exists','Higher-level systems should not implement image pulling, snapshot handling, runtime execution and lifecycle management themselves.'],
          ['What it is not','It is not a scheduler, not a Kubernetes control plane and not a full developer platform like Docker Desktop.'],
          ['Where you see it','On Kubernetes worker nodes, in Docker Engine internals and in other systems that need OCI container runtime services.']
        ]},
        {title:'Architecture: who talks to whom?',level:'Beginner',summary:'Learn the real request path before memorizing commands.',points:[
          ['Kubernetes path','kubelet → CRI gRPC → containerd CRI plugin → containerd services → shim → runc → Linux process'],
          ['Direct client path','ctr or another client → containerd gRPC API → services/plugins → runtime'],
          ['Why the shim exists','The shim keeps container processes independent from the main containerd daemon lifecycle and handles runtime I/O and process supervision details.'],
          ['Why runc exists','runc is the low-level OCI runtime that asks the Linux kernel to create namespaces, cgroups and the container process.']
        ]},
        {title:'Images and the content store',level:'Beginner',summary:'Understand what happens when an image is pulled.',points:[
          ['Image reference','A name such as registry.example.com/app:1.0 resolves to a manifest or index.'],
          ['Content store','containerd stores content-addressed blobs such as manifests, configs and compressed layers.'],
          ['Unpacking','Image layers are unpacked into snapshots by a snapshotter.'],
          ['Why digests matter','Content-addressed storage lets containerd verify and reuse identical content safely.']
        ]},
        {title:'Snapshots and snapshotters',level:'Intermediate',summary:'Learn how the container root filesystem is assembled efficiently.',points:[
          ['Snapshot','A filesystem view created from image layers and optionally a writable layer.'],
          ['Snapshotter','A plugin that implements snapshot operations. overlayfs is common on Linux.'],
          ['Why copy-on-write','Containers can share read-only image data while keeping their own changes separate.'],
          ['Troubleshooting clue','Disk pressure, snapshot corruption or unsupported filesystem features can break container creation even when the image pull succeeded.']
        ]},
        {title:'Containers vs tasks',level:'Intermediate',summary:'This distinction explains many containerd commands and troubleshooting cases.',points:[
          ['Container object','Stores metadata such as image, runtime and OCI specification. It does not automatically mean a process is running.'],
          ['Task','The live runtime process created from the container object.'],
          ['Practical effect','A container can exist without an active task.'],
          ['Kubernetes view','CRI hides some of these lower-level details, so use crictl for pod/container runtime troubleshooting and ctr mainly when you intentionally need containerd-level inspection.']
        ]},
        {title:'Namespaces',level:'Intermediate',summary:'Do not confuse containerd namespaces with Linux namespaces.',points:[
          ['containerd namespace','A logical partition inside containerd for resources such as images, containers and snapshots.'],
          ['Linux namespace','A kernel isolation feature such as PID, mount or network namespace.'],
          ['Kubernetes namespace','A Kubernetes API grouping mechanism. It is a third different concept.'],
          ['Common example','Kubernetes runtime resources are commonly visible in containerd namespace k8s.io.']
        ]},
        {title:'CRI and Kubernetes',level:'Intermediate',summary:'Understand the exact contract between kubelet and the runtime.',points:[
          ['CRI','Container Runtime Interface is the API kubelet uses for runtime operations.'],
          ['Runtime service','Handles pod sandboxes and container lifecycle operations.'],
          ['Image service','Handles image pull, list, remove and related operations.'],
          ['Important boundary','Kubernetes decides desired state and scheduling; containerd performs runtime work on the node.']
        ]},
        {title:'ctr, crictl and nerdctl',level:'Practical',summary:'Know which CLI to use and why.',points:[
          ['ctr','Low-level containerd debugging/admin client. Powerful but not designed as a Docker-compatible daily UX.'],
          ['crictl','CRI debugging client. Use it when investigating Kubernetes runtime problems from the node.'],
          ['nerdctl','Docker-like CLI for containerd environments when installed.'],
          ['Rule of thumb','Kubernetes problem → start with kubectl; node runtime problem → crictl; deep containerd inspection → ctr.']
        ]},
        {title:'Configuration and plugins',level:'Advanced',summary:'Understand how containerd is composed internally.',points:[
          ['Plugin model','containerd functionality is implemented through plugins for services such as CRI, snapshotters, runtimes and metadata.'],
          ['Configuration','Configuration controls plugin behavior, runtimes, registry behavior and other daemon settings.'],
          ['Change safety','Back up configuration, validate syntax and understand restart impact before changing production nodes.'],
          ['Version awareness','Configuration keys can differ by containerd release; use the documentation that matches the installed version.']
        ]},
        {title:'Networking boundary',level:'Advanced',summary:'Understand why a container can exist but still have no useful network connectivity.',points:[
          ['Runtime responsibility','containerd starts the workload process and integrates with CRI/runtime plumbing.'],
          ['Kubernetes networking','CNI plugins configure pod networking; Kubernetes Services and DNS are separate layers.'],
          ['Troubleshooting order','Container/task running → pod sandbox state → CNI → routes → DNS → Service/Ingress.'],
          ['Common mistake','Blaming containerd for every pod networking failure before checking CNI and node networking.']
        ]},
        {title:'Security and production operation',level:'Production',summary:'Know what matters when containerd runs on real worker nodes.',points:[
          ['Least privilege','Protect the containerd socket because clients with access can control node workloads.'],
          ['Image trust','Use controlled registries, image scanning and digest pinning where appropriate.'],
          ['Runtime hardening','Use Kubernetes security controls, seccomp/AppArmor/SELinux where applicable, capabilities and non-root workloads.'],
          ['Operations','Monitor disk usage, image/snapshot growth, runtime health, node pressure and version compatibility.'],
          ['Upgrades','Coordinate containerd, Kubernetes and runtime compatibility; drain nodes when the maintenance plan requires workload movement.']
        ]}
      ],
      architecture:[
        ['Kubelet / Client','Requests image or container operations.'],
        ['CRI / gRPC API','Defines how the caller communicates with containerd.'],
        ['containerd services','Manage metadata, images, content, snapshots and tasks.'],
        ['containerd-shim','Supervises the runtime process and separates task lifecycle from the daemon.'],
        ['runc / OCI runtime','Creates the Linux container using namespaces, cgroups and mounts.'],
        ['Linux kernel process','The application finally runs as isolated host processes.']
      ],
      internals:[
        ['1. Request arrives','Kubelet or a client sends an API request to containerd.'],
        ['2. Image data is resolved','containerd locates/pulls manifests and layers into the content store.'],
        ['3. Filesystem is prepared','The snapshotter creates the root filesystem view.'],
        ['4. OCI spec is prepared','Runtime configuration describes process, mounts, namespaces, capabilities and resources.'],
        ['5. Shim and runtime start','containerd starts a shim; the shim invokes the OCI runtime such as runc.'],
        ['6. Kernel creates isolation','Linux namespaces, cgroups and mounts are applied and the application process starts.'],
        ['7. State is reported back','containerd tracks task state and CRI reports runtime state to kubelet.']
      ],
      labs:[
        {level:'Beginner',title:'See Kubernetes workloads inside containerd',goal:'Connect kubectl view to node runtime view.',steps:['Create or identify a test pod','Use kubectl get pod -o wide to find its node','On that node run crictl ps','Compare container IDs and image information','Explain kubelet → CRI → containerd in your own words']},
        {level:'Intermediate',title:'Inspect the k8s.io namespace',goal:'Understand containerd namespaces without confusing them with Kubernetes namespaces.',steps:['Run ctr namespaces list','Run ctr -n k8s.io containers list','Run ctr -n k8s.io images list','Compare with crictl ps and crictl images','Write down why the views are different']},
        {level:'Production',title:'Runtime failure investigation',goal:'Diagnose a pod that cannot start because of a node runtime problem.',steps:['Check kubectl describe pod events','Check node Ready condition','Use crictl info and crictl ps -a','Check containerd service status and logs','Check disk/snapshot pressure','Identify whether failure is image, CRI, snapshot, runtime or CNI related','Document safe recovery before restarting services']}
      ],
      troubleshooting:[
        ['Pod stuck in ContainerCreating','Check pod events first, then image pull, snapshotter, CNI and node disk pressure. Do not assume containerd is the cause until the event points toward runtime work.'],
        ['crictl cannot connect','Verify the CRI endpoint and containerd service/socket. Confirm the CRI plugin is available.'],
        ['Image pull fails','Check registry DNS/network/TLS/authentication, image name/tag/digest and registry rate/policy issues.'],
        ['Task fails to start','Inspect runtime/shim errors, OCI spec, mounts, permissions, seccomp/LSM rules and filesystem support.'],
        ['Node disk fills up','Inspect image/content/snapshot usage and Kubernetes image garbage collection behavior before manually deleting runtime data.'],
        ['Networking fails after container starts','Move investigation to pod sandbox/CNI/node networking rather than treating it as only a containerd problem.']
      ],
      interview:[
        ['What is containerd?','A high-level container runtime daemon that manages images, content, snapshots, containers and running tasks and exposes APIs used by systems such as Kubernetes.'],
        ['containerd vs runc?','containerd manages lifecycle and services; runc is the low-level OCI runtime that creates the actual Linux container process.'],
        ['How does Kubernetes use containerd?','kubelet calls the CRI API. containerd\'s CRI plugin translates those requests into image, sandbox and task operations on the node.'],
        ['ctr vs crictl?','ctr talks directly to containerd and is low-level. crictl talks through CRI and is normally more useful for Kubernetes runtime troubleshooting.'],
        ['Container vs task in containerd?','Container is stored metadata/configuration. Task is the running process created from it.'],
        ['What is a snapshotter?','A plugin that prepares filesystem snapshots/layers used as container root filesystems.']
      ],
      quiz:[
        {q:'Which component normally creates the final Linux container process?',options:['etcd','runc','CoreDNS','kube-proxy'],answer:1,why:'containerd commonly invokes an OCI runtime such as runc through a shim.'},
        {q:'Which CLI is normally best for Kubernetes CRI troubleshooting?',options:['crictl','helm','terraform','git'],answer:0,why:'crictl speaks the Container Runtime Interface used by kubelet.'},
        {q:'A containerd container object always means the application is running.',options:['True','False'],answer:1,why:'The live process is represented by a task; container metadata may exist without an active task.'}
      ]
    },

    docker: {
      quickRevision:[
        'Docker packages an application and its dependencies into an image and runs that image as a container.',
        'Images are immutable layered templates; containers add a writable runtime layer.',
        'Docker uses Linux namespaces and cgroups underneath.',
        'Dockerfile describes how to build an image; BuildKit performs modern builds.',
        'Volumes persist data outside the container writable layer.',
        'Networks connect containers; published ports expose container services to the host/network.',
        'Registries store and distribute images.',
        'Production images should be minimal, non-root where practical, scanned and reproducibly built.'
      ],
      lessons:[
        {title:'Containers vs virtual machines',level:'Beginner',summary:'Build the correct mental model first.',points:[['Container','An isolated process sharing the host kernel.'],['VM','A virtual machine runs its own guest operating-system kernel.'],['Why containers start fast','No guest OS boot is required for each container.'],['Important limit','Containers are not a magical security boundary; kernel and runtime security still matter.']]},
        {title:'Docker architecture',level:'Beginner',summary:'Understand CLI, daemon, registry and runtime.',points:[['Client','docker CLI sends API requests.'],['Docker daemon','Manages build, image, network, volume and container operations.'],['containerd/runc','Docker Engine uses lower runtime layers to create containers.'],['Registry','Stores and distributes images.']]},
        {title:'Images and layers',level:'Beginner',summary:'Understand why Docker builds are cached and images are reusable.',points:[['Layer','Filesystem changes produced by build steps.'],['Image','Read-only ordered layers plus metadata/config.'],['Digest','Content-based identity used to verify exact image content.'],['Cache','Unchanged build inputs can reuse previous results.']]},
        {title:'Dockerfile and build context',level:'Practical',summary:'Learn how source becomes an image.',points:[['FROM','Selects the base image/stage.'],['COPY','Copies files from build context.'],['RUN','Executes a build-time command.'],['CMD/ENTRYPOINT','Defines default runtime process.'],['.dockerignore','Prevents unnecessary files/secrets from entering build context.']]},
        {title:'Container lifecycle',level:'Practical',summary:'Create, start, inspect, stop and remove containers safely.',points:[['docker run','Create + start a container.'],['docker ps -a','See current and stopped containers.'],['docker inspect','Read runtime configuration and state.'],['docker logs','Read application stdout/stderr logs.'],['docker exec','Run an extra process inside an existing container.']]},
        {title:'Storage',level:'Intermediate',summary:'Know when to use writable layer, bind mounts and volumes.',points:[['Writable layer','Temporary container-specific changes.'],['Bind mount','Host path mounted into container; useful but tightly couples to host path.'],['Volume','Docker-managed persistent storage abstraction.'],['Production rule','Do not depend on container writable layer for important persistent data.']]},
        {title:'Networking',level:'Intermediate',summary:'Follow traffic from host to container.',points:[['Bridge network','Common local Docker network with container interfaces and host bridge/NAT behavior.'],['Port publishing','Maps host address/port to container port.'],['Container DNS','Docker networks can provide name resolution between containers.'],['Troubleshooting','Check process listen address, container port, published port, firewall and routing in that order.']]},
        {title:'Security and production images',level:'Production',summary:'Reduce attack surface and improve reproducibility.',points:[['Non-root','Run as an unprivileged user when the app allows it.'],['Minimal base','Fewer packages reduce size and attack surface.'],['Multi-stage build','Keep build tools out of the final runtime image.'],['Secrets','Do not bake credentials into image layers.'],['Scanning','Scan dependencies/images and patch intentionally.']]}
      ],
      interview:[
        ['Image vs container?','An image is an immutable template; a container is a runtime instance with process state and a writable layer.'],
        ['CMD vs ENTRYPOINT?','ENTRYPOINT defines the executable; CMD commonly supplies default arguments or a default command depending on form.'],
        ['Volume vs bind mount?','A volume is managed by Docker; a bind mount maps a specific host path.'],
        ['Why multi-stage builds?','They separate build dependencies from runtime output, producing smaller and cleaner final images.']
      ],
      quiz:[
        {q:'Where should durable application data normally live?',options:['Only in container writable layer','A persistent volume/storage system','Inside image layers changed at runtime'],answer:1,why:'Container writable layers are not a reliable persistence strategy.'},
        {q:'Which file reduces unnecessary build-context files?',options:['.dockerignore','.gitconfig','compose.lock'],answer:0,why:'.dockerignore filters build-context content.'}
      ]
    },

    kubernetes: {
      quickRevision:[
        'Kubernetes is a container orchestration system built around declarative desired state.',
        'The API server is the front door of the control plane; etcd stores cluster state.',
        'Controllers continuously reconcile desired state with actual state.',
        'The scheduler chooses a node for unscheduled Pods; kubelet makes assigned Pods run on that node.',
        'A Pod is the smallest Kubernetes scheduling unit and can contain one or more tightly coupled containers.',
        'Deployments manage stateless rollout/rollback through ReplicaSets; StatefulSets add stable identity for stateful workloads.',
        'Services provide stable discovery/load-balancing to changing Pods; DNS is commonly provided by CoreDNS.',
        'CNI handles Pod networking; CSI handles storage integration; CRI connects kubelet to the container runtime.',
        'RBAC controls API authorization; ServiceAccounts represent workload identities inside the cluster.',
        'Production troubleshooting follows the request path: workload → Pod → logs/events → Service → DNS → Ingress/Gateway → network/load balancer.'
      ],
      lessons:[
        {title:'Why Kubernetes exists',level:'Beginner',summary:'Understand the problem before learning YAML.',points:[['Problem','Running one container is easy; operating many services across many machines requires scheduling, self-healing, rollout, networking, storage and policy.'],['Desired state','You declare what should exist; controllers work continuously to make reality match it.'],['Self-healing','Failed Pods can be replaced and workloads can be rescheduled according to controllers and node state.'],['Not magic','Kubernetes still depends on healthy nodes, container runtime, networking, storage, DNS and correctly designed applications.']]},
        {title:'Cluster architecture',level:'Beginner',summary:'Learn every major component and its job.',points:[['API server','Validates and serves the Kubernetes API. All control-plane interactions go through it.'],['etcd','Strongly consistent key-value store containing cluster state used by the control plane.'],['Scheduler','Selects a suitable node for a Pod that has no node assignment.'],['Controller manager','Runs reconciliation controllers such as Deployment/ReplicaSet/node-related controllers.'],['kubelet','Node agent that watches assigned Pods and works with the runtime to make them run.'],['Container runtime','Runs containers on the node through CRI, commonly containerd.']]},
        {title:'The Kubernetes API and desired state',level:'Beginner',summary:'Understand what happens when you run kubectl apply.',points:[['Manifest','YAML/JSON describes an API object such as Deployment or Service.'],['kubectl','Client sends the object to the API server.'],['API server','Authenticates, authorizes, validates/admission-processes and stores accepted state.'],['Controllers','Notice the new desired state and create/update dependent resources.'],['Key idea','kubectl does not directly create a container on a worker node.']]},
        {title:'Pods',level:'Beginner',summary:'Learn the smallest scheduling unit properly.',points:[['Pod','One or more containers sharing network namespace and selected storage.'],['Pod IP','Containers in the same Pod share the Pod network identity and can communicate through localhost.'],['Ephemeral nature','A replacement Pod can get a new UID and IP. Do not build stable identity assumptions around ordinary Pods.'],['Use controllers','Production apps are normally managed by Deployment, StatefulSet, DaemonSet, Job or another controller rather than naked Pods.']]},
        {title:'ReplicaSet and Deployment',level:'Beginner',summary:'Understand how stateless apps stay available and roll out safely.',points:[['ReplicaSet','Maintains a requested number of matching Pod replicas.'],['Deployment','Manages ReplicaSets and rollout history for declarative stateless application updates.'],['Rolling update','Gradually brings new Pods up while old Pods are removed according to strategy.'],['Rollback','Deployment revision history can be used to return to a previous rollout state.']]},
        {title:'StatefulSet, DaemonSet, Job and CronJob',level:'Intermediate',summary:'Choose the correct workload controller.',points:[['StatefulSet','Stable ordinal identity and storage association for workloads that require it.'],['DaemonSet','Ensures a Pod runs on selected nodes; common for node agents.'],['Job','Runs work to completion.'],['CronJob','Creates Jobs on a schedule.'],['Decision rule','Choose based on lifecycle and identity requirements, not because one object is more advanced.']]},
        {title:'Services and EndpointSlices',level:'Intermediate',summary:'Understand stable networking to changing Pods.',points:[['Service','Stable virtual access point selecting backend Pods.'],['Selector','Matches Pods using labels.'],['EndpointSlice','Represents groups of actual network endpoints backing a Service.'],['ClusterIP','Common internal service type.'],['LoadBalancer','Requests external load-balancer integration where supported.']]},
        {title:'DNS and CoreDNS',level:'Intermediate',summary:'Learn how services find each other.',points:[['Service DNS','Kubernetes DNS creates names for Services and other supported records.'],['CoreDNS','Common cluster DNS implementation.'],['Troubleshooting','Check Service exists → endpoints exist → DNS record resolves → network path works.'],['Common error','A DNS failure can look like an application or Service failure even when Pods are healthy.']]},
        {title:'ConfigMaps and Secrets',level:'Intermediate',summary:'Separate configuration from container images.',points:[['ConfigMap','Stores non-confidential configuration data.'],['Secret','API object for sensitive values, but base64 encoding alone is not encryption.'],['Consumption','Can be exposed through environment variables or mounted files depending on use case.'],['Production','Use RBAC, encryption-at-rest configuration and external secret management where appropriate.']]},
        {title:'Requests, limits and QoS',level:'Intermediate',summary:'Understand scheduling capacity and runtime resource control.',points:[['Request','Resource amount used by scheduler for placement decisions.'],['Limit','Maximum resource boundary where supported/enforced by runtime/kernel behavior.'],['CPU','CPU limit throttles rather than killing the process.'],['Memory','Exceeding memory limit can cause OOM termination.'],['Why it matters','Bad requests cause poor scheduling; bad limits can cause instability or wasted capacity.']]},
        {title:'Liveness, readiness and startup probes',level:'Intermediate',summary:'Know exactly what each probe changes.',points:[['Readiness','Controls whether the Pod is considered ready to receive Service traffic.'],['Liveness','Can trigger container restart when the app is considered unhealthy.'],['Startup','Protects slow-starting applications before liveness/readiness behavior takes over.'],['Common mistake','Using an expensive or dependency-heavy liveness check can create restart loops.']]},
        {title:'Scheduling, affinity, taints and PDB',level:'Advanced',summary:'Control where workloads run and how maintenance affects them.',points:[['Node selector/affinity','Express placement preferences or requirements.'],['Pod affinity/anti-affinity','Place Pods together or apart based on labels/topology.'],['Taint','Repels Pods unless they have a matching toleration.'],['PDB','Limits voluntary disruption of a replicated application; it does not prevent every failure.']]},
        {title:'Storage: PV, PVC, StorageClass and CSI',level:'Advanced',summary:'Follow the storage request from application to backend volume.',points:[['PVC','Workload/user request for persistent storage.'],['PV','Cluster storage resource bound to a claim.'],['StorageClass','Describes a class/provisioning policy used for dynamic provisioning.'],['CSI','Standard interface through which storage vendors integrate drivers.'],['StatefulSet','Often pairs stable Pod identity with per-replica PVC templates.']]},
        {title:'Networking: CNI, NetworkPolicy, Ingress and Gateway API',level:'Advanced',summary:'Understand different layers instead of treating networking as one feature.',points:[['CNI','Plugin system used to configure Pod network connectivity.'],['NetworkPolicy','Declares allowed Pod traffic when the chosen networking implementation enforces it.'],['Ingress','HTTP/HTTPS routing API that requires an Ingress controller.'],['Gateway API','Newer extensible traffic-management APIs with explicit infrastructure and route roles.'],['Request path','Client → cloud/LB → gateway/ingress → Service → Pod.']]},
        {title:'RBAC, ServiceAccounts and workload security',level:'Advanced',summary:'Build the authorization model.',points:[['Authentication','Determines who the caller is.'],['Authorization','RBAC evaluates whether that identity may perform the requested API action.'],['ServiceAccount','Identity used by workloads for Kubernetes API access.'],['Role/ClusterRole','Set of allowed API actions.'],['RoleBinding/ClusterRoleBinding','Associates permissions with users/groups/service accounts.'],['SecurityContext','Configures runtime security properties such as user IDs, capabilities and filesystem settings.']]},
        {title:'Autoscaling',level:'Advanced',summary:'Understand what Kubernetes can and cannot scale.',points:[['HPA','Changes replica count using observed metrics.'],['VPA concept','Recommends or adjusts resource requests depending on setup.'],['Cluster autoscaling','Adds/removes nodes based on scheduling/capacity logic when integrated.'],['Requirement','Autoscaling is only useful when metrics, resource requests and application behavior are sensible.']]},
        {title:'CRDs and Operators',level:'Advanced',summary:'Understand how Kubernetes becomes an extensible platform.',points:[['CRD','Adds a new API resource type to the cluster.'],['Custom controller','Reconciles custom resources.'],['Operator pattern','Packages operational knowledge into controllers/custom resources.'],['Risk','A controller is production software with permissions; review RBAC, upgrade behavior and failure modes.']]},
        {title:'Helm and Kustomize',level:'Practical',summary:'Know why these tools exist and where GitOps fits.',points:[['Helm','Packages and templates Kubernetes resources into versioned charts/releases.'],['Kustomize','Customizes plain YAML resources using overlays/patches without template syntax.'],['GitOps','Tools such as Argo CD reconcile manifests/charts from Git rather than relying on manual kubectl changes.'],['Rule','Keep rendered desired state understandable and reviewable.']]},
        {title:'Troubleshooting Kubernetes',level:'Production',summary:'Use a repeatable order instead of random commands.',points:[['Step 1','Is the API object created? kubectl get.'],['Step 2','What does describe/events say?'],['Step 3','Is the Pod scheduled and containers started?'],['Step 4','What do application and previous-container logs say?'],['Step 5','Does the Service select ready endpoints?'],['Step 6','Does DNS resolve and network policy allow traffic?'],['Step 7','Does Ingress/Gateway/LB route correctly?'],['Step 8','If node-specific, inspect kubelet/runtime/CNI/storage on that node.']]},
        {title:'Upgrades, etcd backup and production architecture',level:'Production',summary:'Operate the cluster as a system, not just an application target.',points:[['Version skew','Follow supported Kubernetes component and client version-skew rules.'],['etcd backup','Back up and test restoration according to your cluster architecture/distribution procedures.'],['HA control plane','Production clusters normally avoid a single control-plane failure domain.'],['Observability','Monitor control plane, nodes, workloads, events, metrics and logs.'],['Disaster recovery','Document what is backed up: cluster state, persistent application data, Git desired state, secrets and external dependencies.']]}
      ],
      architecture:[
        ['kubectl / CI / GitOps','A client submits or reconciles desired state.'],
        ['API Server','Authenticates, authorizes, validates and serves the Kubernetes API.'],
        ['etcd','Stores control-plane cluster state.'],
        ['Controllers','Continuously compare desired state with observed state and create/update resources.'],
        ['Scheduler','Chooses a node for unscheduled Pods.'],
        ['Kubelet + CRI','Kubelet asks the container runtime to create the assigned Pod containers.'],
        ['CNI / CSI','Networking and storage plugins attach required infrastructure.'],
        ['Pod / Service','Application runs and becomes reachable through Kubernetes networking.']
      ],
      internals:[
        ['1. Manifest reaches API server','kubectl apply sends desired state to the API server; kubectl itself does not create the container.'],
        ['2. Admission and persistence','The API server processes authentication, authorization, validation/admission and stores accepted state.'],
        ['3. Controllers reconcile','A Deployment controller creates/updates ReplicaSets, which create Pods to satisfy replica count.'],
        ['4. Scheduler binds','The scheduler finds an appropriate node for each pending unscheduled Pod.'],
        ['5. Kubelet acts','The node kubelet sees the assigned Pod and prepares volumes, network/runtime requirements.'],
        ['6. Runtime starts containers','Kubelet calls CRI; containerd or another CRI runtime pulls the image and starts containers.'],
        ['7. Readiness becomes traffic eligibility','Probe/status changes cause endpoints to represent ready backends for Services.'],
        ['8. Reconciliation never stops','Controllers continue watching and correcting drift or failures.']
      ],
      labs:[
        {level:'Beginner',title:'Deployment → Service → verification',goal:'Understand the full basic object relationship.',steps:['Create a Deployment with 2 replicas','Run kubectl get deployment,rs,pods -o wide','Expose it with a ClusterIP Service','Inspect Service selector and EndpointSlices','Test connectivity from another Pod','Delete one Pod and watch the ReplicaSet replace it','Explain what self-healing actually happened']},
        {level:'Intermediate',title:'Break readiness and troubleshoot traffic',goal:'Learn why a running Pod may not receive traffic.',steps:['Add a readiness probe','Verify endpoints while healthy','Intentionally make the readiness check fail','Compare Pod Running vs Ready state','Inspect EndpointSlices','Restore readiness and verify traffic returns']},
        {level:'Advanced',title:'Scheduling and storage lab',goal:'Connect scheduler decisions with persistent storage.',steps:['Create a PVC using an available StorageClass','Mount it in a workload','Inspect PVC/PV binding','Add node affinity or selector in a lab cluster','Observe Pending state when constraints cannot be met','Use events to identify why scheduling fails']},
        {level:'Production',title:'Application down troubleshooting chain',goal:'Diagnose systematically from API object to external request path.',steps:['Check Deployment rollout status','Check Pods and events','Check logs and probes','Check Service selector and EndpointSlices','Check DNS resolution','Check NetworkPolicy','Check Ingress/Gateway and external load balancer','Record root cause and the minimum safe fix']}
      ],
      troubleshooting:[
        ['Pod Pending','Check scheduler events: insufficient CPU/memory, taints, affinity, PVC binding, quotas or topology constraints.'],
        ['CrashLoopBackOff','Inspect current/previous logs, exit code, command/args, config, secrets, probes and application dependencies.'],
        ['ImagePullBackOff','Verify image reference, registry DNS/network, credentials/imagePullSecrets, TLS and registry policy.'],
        ['Service has no endpoints','Verify selector matches Pod labels and Pods are Ready. Inspect EndpointSlices.'],
        ['Service works by IP but not name','Investigate CoreDNS, resolv.conf inside Pod and cluster DNS connectivity.'],
        ['Ingress/Gateway returns errors','Verify controller/gateway health, route match, Service, endpoints, TLS and backend protocol/port.'],
        ['PVC Pending','Check StorageClass, provisioner/CSI health, topology, capacity and access mode support.'],
        ['Node NotReady','Check node conditions, kubelet, runtime, disk/memory pressure, networking and cloud/node health.']
      ],
      interview:[
        ['What happens when you run kubectl apply?','kubectl submits desired state to the API server. The API server processes and stores it. Controllers reconcile dependent objects, scheduler assigns Pods, kubelet calls the runtime, and the runtime starts containers.'],
        ['Deployment vs StatefulSet?','Deployment is usually for interchangeable stateless replicas and rolling rollout. StatefulSet provides stable identity/order and is commonly used when applications need stable per-replica identity/storage semantics.'],
        ['Service vs Ingress?','Service provides stable access/load-balancing to Pods. Ingress defines HTTP/HTTPS routing and requires an Ingress controller; Gateway API is another traffic-routing model.'],
        ['What does etcd store?','Kubernetes control-plane cluster state. It is critical to API/control-plane recovery but it is not a backup of application data stored in external volumes/databases.'],
        ['Readiness vs liveness?','Readiness controls traffic eligibility; liveness can cause container restart.'],
        ['What is CRI/CNI/CSI?','CRI integrates container runtimes, CNI integrates networking, CSI integrates storage.'],
        ['How do you troubleshoot a Pod that is Pending?','Start with describe/events, then check scheduling resources, taints/affinity, quotas and PVC/storage constraints.'],
        ['What is reconciliation?','Controllers repeatedly compare desired state with observed state and take actions to reduce the difference.']
      ],
      quiz:[
        {q:'Who chooses a node for a newly created unscheduled Pod?',options:['kubelet','scheduler','etcd','CoreDNS'],answer:1,why:'The scheduler selects a suitable node and records the binding decision.'},
        {q:'Which probe controls whether a Pod should receive Service traffic?',options:['Readiness','Liveness','Startup only','Audit'],answer:0,why:'Readiness determines traffic eligibility.'},
        {q:'Which interface connects kubelet to a container runtime?',options:['CSI','CNI','CRI','RBAC'],answer:2,why:'CRI is the Container Runtime Interface.'},
        {q:'A Service selector matches no Ready Pods. What should you inspect?',options:['EndpointSlices','Only etcd backup','Only kubeconfig'],answer:0,why:'EndpointSlices show actual backends selected for Services.'},
        {q:'What stores Kubernetes control-plane cluster state?',options:['CoreDNS','etcd','kubelet','Ingress'],answer:1,why:'etcd stores the control-plane state used by Kubernetes.'}
      ]
    }
  };
})();
