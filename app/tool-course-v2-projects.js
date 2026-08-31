(function(){
  'use strict';
  window.DEVOPS_DEEP_PROJECTS = {
    containerd: {
      title:'Troubleshoot a Kubernetes Node Runtime with containerd',
      problem:'A Kubernetes application is healthy on most nodes, but Pods scheduled to one worker stay in ContainerCreating or fail to start. You must prove which runtime layer is failing and recover safely.',
      architecture:[['kubectl','Observe cluster symptoms'],['API Server','Returns Pod/node state'],['Kubelet','Manages assigned Pods'],['CRI','Runtime API boundary'],['containerd','Images/snapshots/tasks'],['runc','Creates Linux process'],['CNI','Configures Pod networking']],
      why:[
        ['kubectl','Shows the cluster-level symptom and events before you log into the node.'],
        ['kubelet','Owns the node-side Pod lifecycle and reports runtime errors.'],
        ['crictl','Lets you inspect the same CRI boundary kubelet uses.'],
        ['containerd','Lets you isolate image, snapshot, task and runtime failures.'],
        ['Node logs/disk','Runtime failures often come from service health, filesystem or resource pressure rather than YAML.']
      ],
      internal:'Start at the Kubernetes symptom, identify the node, follow kubelet into CRI/containerd, then separate image, snapshot, runtime and CNI layers. Fix only the failing layer, verify the Pod reaches Ready, and document why the recovery was safe.'
    },
    docker: {
      title:'Build and Run a Production-Ready Web Application Image',
      problem:'A team has a web application that works on one laptop but must build consistently in CI and run with predictable networking, storage, health checks and security settings.',
      architecture:[['Git repository','Application source'],['Dockerfile + .dockerignore','Build definition/context'],['BuildKit','Builds cached layers'],['OCI image','Immutable artifact'],['Registry','Stores versioned image'],['Docker Engine','Runs container'],['Volume / Network','Persistent data and connectivity']],
      why:[
        ['Multi-stage Dockerfile','Keeps build tooling out of the final runtime image.'],
        ['Registry','Lets CI and deployment systems use the exact same artifact.'],
        ['Healthcheck','Provides a machine-readable application health signal when appropriate.'],
        ['Volume','Separates durable state from the disposable container layer.'],
        ['Non-root runtime','Reduces unnecessary privileges inside the container.']
      ],
      internal:'Source enters the build context, BuildKit executes Dockerfile stages and creates content-addressed image layers. The image is pushed to a registry, pulled by the target engine and started as Linux processes with namespaces, cgroups, mounts and networking.'
    },
    kubernetes: {
      title:'Deploy, Expose, Scale and Troubleshoot a Production-Style Kubernetes Application',
      problem:'A stateless API must run with multiple replicas, safe rollout, configuration, health checks, stable service discovery, external routing, resource controls and a repeatable troubleshooting path.',
      architecture:[['Git / Manifest','Desired state'],['API Server','Accepts Kubernetes objects'],['Controllers','Create/maintain replicas'],['Scheduler','Selects nodes'],['Kubelet + CRI','Starts containers'],['Service','Stable backend discovery'],['Ingress/Gateway','External HTTP routing'],['Prometheus/Logs','Observe health']],
      why:[
        ['Deployment','Provides declarative replica management and rollout history.'],
        ['Service','Decouples clients from changing Pod IPs.'],
        ['Readiness probe','Keeps unhealthy/unready replicas out of Service traffic.'],
        ['Requests/limits','Give scheduler capacity information and runtime resource boundaries.'],
        ['ConfigMap/Secret','Separate runtime configuration from the image.'],
        ['Ingress/Gateway','Provides controlled external HTTP routing through a controller/gateway implementation.'],
        ['Observability','Lets you prove the rollout is healthy and investigate failures with evidence.']
      ],
      internal:'A reviewed manifest is submitted to the API server. Controllers create the required Pods, scheduler assigns nodes, kubelets call the runtime, networking/storage are prepared, readiness controls endpoints, Service provides stable discovery and external routing sends requests to ready backends. During failure, trace the same path in reverse.'
    }
  };
})();
