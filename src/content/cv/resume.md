---
title: Jordan Simonovski
role: Staff Software Engineer
location: Blue Mountains, Australia
email: jordan.simonovski@gmail.com
website: https://jordansimonov.ski
github: https://github.com/jordan-simonovski
linkedin: https://www.linkedin.com/in/jsimonovski/
openToWork: true
availability: Open to Staff/Principal platform and observability roles
timezone: AEST (UTC+10)
workMode: Remote-first (APAC-friendly, global collaboration)
responseSla: Replies within 24 hours
updatedAt: "2026-03-15"
experienceSpans:
  - id: "atlassian-staff-engineer"
    service: "Atlassian - Observability Team"
    role: "Staff Software Engineer"
    start: "2020-05"
    end: "Present"
    status: "ok"
    summary: "Owned and ran high-scale observability systems, ingesting hundreds of terabytes of telemetry per day. Advocated for and evangelised great observability using wide-events with a focus on MTTR reduction, great DX, high cardinality use-cases, and improving AI observability."
    pdfSummary: "Led observability platform strategy and delivery for traces, metrics, and logs at Atlassian scale."
    highlights:
      - "Evangelised the shift to wide events. Implemented ClickHouse, scaling to 100TB/day ingestion while focusing on sub-second query times and AI Observability."
      - "Built and singlehandedly ran observability tracing infrastructure with Grafana Tempo, scaling to 180TB/day ingestion."
      - "Introduced and implemented Grafana Scenes internally, implementing a centralised app for debugging core Atlassian experiences using various data sources, promoting good UX, explorability, leading to MTTR reductions for both novel and well understood incidents."
      - "Scaled Grafana Mimir to match existing metric usage with other products internally; Ran complex usage-accurate load tests to validate 200k alert evaluations."
      - "Standardised Kubernetes deployments by implementing helm charts built with my own OSS tools to better vendor, test, and control common requirements and constraints."
      - "Implemented a Grafana Scenes application to replace our existing explore workflows integrating with our internal AI gateway, using an AI assistant to generate accurate queries for: PromQL, TraceQL, SQL (ClickHouse), SPL (Splunk), explain data panels, and generate on-the-fly dashboards for debugging core Atlassian Experiences."
      - "Designed and implemented Atlassian's first accurate service map by covered experience, critical for reducing MTTR during high stress incident scenarios."
      - "Improved Tempo query performance 30%+ with minimal impacts on cost."
      - "Built out a local development observability solution for Atlassian engineers in my free time, with a strong focus on DX and flexibility."
      - "Designed and built multi-region (regional failover) infrastructure for Grafana and Grafana Mimir with a strong focus on low RTO/RPO, while keeping costs under control."
    pdfHighlights:
      - "Scaled telemetry platforms to 100TB/day+ on ClickHouse and 180TB/day on Tempo with strong reliability guardrails."
      - "Improved Tempo query performance by 30%+, reducing time-to-diagnosis and supporting faster incident response."
      - "Built and shipped operator UX for observability workflows that improved MTTR and made diagnostics easier for product teams."
    stack:
      - "Kubernetes"
      - "OpenTelemetry"
      - "Grafana"
      - "Prometheus/Mimir"
      - "Tempo"
      - "ClickHouse"
      - "Golang"
      - "Typescript"
    children:
      - id: "wide-events-clickhouse"
        name: "Wide events + ClickHouse scale-up"
        status: "ok"
        startOffset: 8
        endOffset: 42
        detail: "Led the shift to wide events and scaled ClickHouse ingestion to 100TB/day while maintaining fast query performance for operators."
      - id: "tempo-tracing-platform"
        name: "Tempo tracing platform ownership"
        status: "ok"
        startOffset: 45
        endOffset: 78
        detail: "Built and ran observability tracing infrastructure on Grafana Tempo, scaling ingestion to 180TB/day with reliability guardrails."
      - id: "scenes-debugging-ux"
        name: "Grafana Scenes debugging UX"
        status: "ok"
        startOffset: 78
        endOffset: 100
        detail: "Introduced and implemented Grafana Scenes as a centralized debugging surface across data sources, improving explorability and reducing MTTR."
  - id: "lendi-cloud-engineering-lead"
    service: "Lendi"
    role: "Cloud Engineering Lead"
    start: "2018-01"
    end: "2020-05"
    status: "ok"
    summary: "Led cloud-native migration strategy and platform implementation, introducing SRE practices and developer-focused internal platform tooling."
    pdfSummary: "Owned architecture and delivery for cloud-native migration, SRE adoption, and internal platform capabilities."
    highlights:
      - "Drove direction, architecture, implementation, and strategy for cloud-native migration."
      - "Implemented SRE principles such as SLOs and error budgets across the organisation."
      - "Built developer-centric tooling and internal PaaS capabilities to reduce deployment friction."
      - "Implemented Docker infrastructure on ECS and EKS."
      - "Implemented Envoy sidecar patterns for Auth0-based authn/authz flows."
      - "Led from-scratch AWS setup, including multi-account foundations."
      - "Introduced production resilience practices including controlled chaos testing."
    pdfHighlights:
      - "Scaled platform maturity through SRE adoption, cloud migration, and internal DX-focused tooling."
      - "Implemented AWS multi-account and container platform patterns for safer delivery."
    stack:
      - "AWS"
      - "ECS"
      - "EKS"
      - "Docker"
      - "Envoy"
      - "Auth0"
      - "SRE"
      - "Internal PaaS"
    children:
      - id: "cloud-native-migration"
        name: "Cloud-native migration"
        status: "ok"
        startOffset: 10
        endOffset: 60
        detail: "Led migration planning and implementation for cloud-native workloads."
      - id: "sre-adoption"
        name: "SRE adoption"
        status: "ok"
        startOffset: 60
        endOffset: 100
        detail: "Rolled out SLO/error-budget practices and reliability guardrails."
  - id: "healthengine-senior-backend-engineer"
    service: "HealthEngine"
    role: "Senior Backend Engineer"
    start: "2017-01"
    end: "2018-01"
    status: "warn"
    summary: "Built serverless backend workflows and improved observability and logging foundations for backend services."
    pdfSummary: "Implemented resilient serverless messaging and observability foundations for backend systems."
    highlights:
      - "Built resilient serverless messaging workflows using SQS, DynamoDB, and scaling Lambda functions."
      - "Implemented Docker infrastructure in Rancher."
      - "Implemented monitoring infrastructure with Prometheus and Grafana."
      - "Implemented logging infrastructure with Elasticsearch and CloudWatch."
      - "Worked on Node.js backend applications."
    pdfHighlights:
      - "Delivered event-driven serverless workflows with stronger reliability characteristics."
      - "Improved service visibility through Prometheus/Grafana metrics and Elastic/CloudWatch logging."
    stack:
      - "AWS Lambda"
      - "SQS"
      - "DynamoDB"
      - "Rancher"
      - "Prometheus"
      - "Grafana"
      - "Elasticsearch"
      - "CloudWatch"
      - "Node.js"
    children:
      - id: "serverless-messaging-healthengine"
        name: "Serverless messaging"
        status: "ok"
        startOffset: 10
        endOffset: 60
        detail: "Implemented reliable event-driven backend workflows using AWS serverless services."
      - id: "observability-foundations-healthengine"
        name: "Observability foundations"
        status: "warn"
        startOffset: 60
        endOffset: 100
        detail: "Built monitoring and logging baselines for backend application operations."
  - id: "domain-devops-engineer"
    service: "Domain"
    role: "DevOps Engineer"
    start: "2017-01"
    end: "2017-12"
    status: "ok"
    summary: "Maintained ECS and Elasticsearch infrastructure, delivered deployment tooling, and helped platform teams scale containerized frontend rendering."
    pdfSummary: "Improved AWS/Docker platform reliability and delivery workflows with scheduler and CI/CD improvements."
    highlights:
      - "Maintained and improved ECS infrastructure."
      - "Implemented HashiCorp Nomad as a new Docker scheduler."
      - "Maintained and improved Elasticsearch cluster infrastructure."
      - "Implemented deployment tooling in Jenkins with Groovy."
      - "Set up a serverless deployment bot to enable ChatOps."
      - "Worked with frontend platform teams to scale React rendering workloads."
      - "Worked closely with developers on deployment tooling."
    pdfHighlights:
      - "Implemented Nomad and Jenkins deployment workflows to improve release consistency."
      - "Enabled ChatOps and scaled containerized frontend rendering workloads."
    stack:
      - "AWS ECS"
      - "Docker"
      - "Nomad"
      - "Elasticsearch"
      - "Jenkins"
      - "Groovy"
    children:
      - id: "scheduler-migration"
        name: "Scheduler migration"
        status: "ok"
        startOffset: 10
        endOffset: 55
        detail: "Introduced Nomad scheduling to modernize Docker workload orchestration."
      - id: "chatops-deployments"
        name: "ChatOps deployments"
        status: "ok"
        startOffset: 55
        endOffset: 100
        detail: "Implemented deployment automation and CI workflows for faster releases."
---

# Summary {#summary}

Staff engineer owning global-scale observability infrastructure across Mimir, Tempo, and ClickHouse, operating largely independently across the full stack. A vocal advocate for moving beyond the three-pillar observability model toward wide events, with hands-on experience designing and driving that migration at scale. Builds Grafana Scenes applications that measurably reduce MTTR and unify visibility across heterogeneous technology stacks and data sources. Technical reviewer for Observability Engineering, 2nd Edition and an active contributor to the broader SRE and observability community.

# Recruiter Snapshot

- Availability: Open to Staff/Principal platform and observability roles
- Timezone: AEST (UTC+10), overlapping US and EU collaboration windows
- Work mode: Remote-first, open to distributed global teams
- Response SLA: Typically within 24 hours

# Core Skills {#skills}

- Kubernetes platform engineering (EKS, Helm, GitOps, ArgoCD, custom operators)
- AWS (10+ years, full platform scale up, compute, serverless)
- Docker platforms (Kubernetes, EKS, GKE)
- OpenTelemetry ecosystem (Weaver, Collector, SDK)
- Observability (Prometheus/Mimir, Grafana, Tempo/ClickHouse)
- Site Reliability Engineering (SLOs, War games, chaos testing/tooling)
- IaC with Terraform/Crossplane and CI/CD with GitHub Actions/Bitbucket Pipelines
- Golang, Typescript, and Rust development
- Platform engineering i.e. building, validating and running internal products.
- Avid speaker and mentor (especially junior engineers)

# Experience {#experience}

## Staff Software Engineer - Atlassian (2020-05 to Present)

- Drove platform-level observability strategy and execution across traces, metrics, and logs at very high ingestion scale.
- Improved query performance and incident response outcomes through better UX, faster diagnostics, and stronger telemetry defaults.

<details>
  <summary>Expand full impact</summary>

- Evangelised the shift to wide events and implemented ClickHouse observability infra at `100TB/day`+ ingestion.
- Built and operated Grafana Tempo tracing infrastructure at `180TB/day` ingestion.
- Consistent and continual improvements in CI with reviewdog + Bitbucket pipes to ease developer workflows and feedback.
- Consistent and continual improvements in CD with ArgoCD/Spinnaker work, focusing on ephemeral build environments.
- Raised the bar on SLOs both within the observability department and other teams by introducing better practices, and running sessions with teams on good SLOs.
- Introduced Grafana Scenes internally and shipped a centralised debugging workflow across core Atlassian experiences.
- Was considered an SME for Mimir/Tempo: scaled Grafana Mimir and ran usage-accurate load validation for ~200k alert evaluations.
- Introduced span metrics and TraceQL Metrics (metrics derived from traces) to address gaps in traditional monitoring setups.
- Standardised Kubernetes deployments with reusable Helm charts built using internal OSS tooling.
- Integrated an AI-assisted query experience across PromQL, TraceQL, SQL (ClickHouse), and SPL (Splunk).
- Designed and implemented Atlassian's first covered-experience service map for faster incident triage.
- Improved Tempo query performance by `30%+` with minimal cost impact.
- Built a local development observability stack for developers in spare time to improve day-to-day debugging DX.
- Designed multi-region failover foundations for Grafana and Mimir with low RTO/RPO and controlled cost.
- Implemented serverless Splunk scaling automation using Lambda Step Functions.
- Modernised Splunk infrastructure, with a focus on cloud-native platform management. Scaled to 600TB/day ingestion.
- Implemented K6 for load testing infrastructure at scale, hitting 6M metric samples per second.
- Led work for, designed, and implemented internal PaaS abstractions for alert management.


</details>

## Senior Site Reliability Engineer - Independent Consulting (2019-06 to 2021-12, part-time concurrent)

- Cut paging noise and improved escalation quality through alerting/routing refinements and stronger on-call practices.
- Automated recurring incident recovery paths with practical runbook workflows.

<details>
  <summary>Expand full impact</summary>

- Replaced threshold-only paging with burn-rate based alerting patterns to reduce noise.
- Improved incident response consistency through documented and automated runbook workflows.

</details>

## Cloud Engineering Lead - Lendi (2018-01 to 2020-05)

- Led cloud-native migration direction and implementation, including container platform evolution on AWS.
- Introduced SRE practices (SLOs/error budgets) and built internal platform capabilities to improve DX and delivery reliability.

<details>
  <summary>Expand full impact</summary>

- Drove architecture, implementation, and strategy for cloud-native migration.
- Implemented SRE principles (SLOs and error budgets) across teams.
- Built developer-centric tooling and internal platform capabilities to remove deployment friction.
- Implemented container infrastructure on ECS and EKS.
- Implemented Envoy sidecar patterns for Auth0-based authn/authz flows.
- Led from-scratch AWS setup including multi-account foundations.
- Introduced production resilience practices including controlled chaos testing.

</details>

## Senior Backend Engineer - HealthEngine (2017-01 to 2018-01)

- Built resilient serverless messaging workflows using SQS, DynamoDB, and Lambda.
- Implemented monitoring/logging foundations with Prometheus, Grafana, Elasticsearch, and CloudWatch.

<details>
  <summary>Expand full impact</summary>

- Built resilient serverless messaging workflows using SQS, DynamoDB, and scaling Lambda functions.
- Implemented Docker infrastructure in Rancher.
- Implemented monitoring infrastructure with Prometheus and Grafana.
- Implemented logging infrastructure with Elasticsearch and CloudWatch.
- Contributed to Node.js backend application development.

</details>

## DevOps Engineer - Domain (2017)

- Maintained and improved ECS/Elasticsearch infrastructure and delivery workflows.
- Implemented Nomad scheduling and Jenkins/Groovy deployment tooling, including ChatOps automation.

<details>
  <summary>Expand full impact</summary>

- Maintained and improved ECS infrastructure.
- Implemented HashiCorp Nomad as a new Docker scheduler.
- Maintained and improved Elasticsearch cluster infrastructure.
- Implemented Jenkins/Groovy deployment tooling.
- Built a serverless deployment bot to enable ChatOps.
- Worked with frontend platform teams to scale React rendering workloads on container infrastructure.
- Partnered closely with developers on deployment tooling and release ergonomics.

</details>


# Leadership & Scope {#leadership-scope}

- Drove the shift to new observability practices and tooling when implementing Grafana Scenes as a replacement for traditional dashboards, ClickHouse for modern observability based on the wide-event model, and AI observability kick-offs internally.
- Owned observability architecture and operations for critical Atlassian workflows, including platforms running at `100TB/day`+ (ClickHouse) and `180TB/day` (Tempo).
- Designed and shipped operator tooling used across teams, including internal Grafana Scenes workflows, AI-assisted query generation, and Atlassian's first service map by covered experience.
- Drove reliability practice adoption across organisations by implementing SLO/error-budget patterns, burn-rate alerting, and incident/runbook automation.


# Selected Impact {#selected-impact}

- Scaled observability pipelines to `100TB/day`+ (ClickHouse) and `180TB/day` (Tempo) while preserving fast operator workflows.
- Improved Tempo query performance by `30%+` with minimal cost impact.
- Standardized Kubernetes delivery patterns with reusable Helm tooling and stronger deployment guardrails.


# Side Quests {#projects}

## K8s Cost and Reliability Control Plane

- Added progressive delivery and rollback automation based on error budget burn rates, reducing failed rollout blast radius.

## Incident Triage Copilot for Observability Workflows

- Built an assistant-driven query workflow that generated PromQL, TraceQL, and SQL from incident prompts.
- Reduced time-to-first-useful-query during incident debugging by improving discovery and query authoring ergonomics.

## Local Developer Observability Stack

- Built a local-first observability stack for faster debugging in day-to-day engineering loops.
- Improved developer feedback loops by making traces, logs, and metrics available without production dependencies.

## Extracurriculars

- Technical reviewer for [Observability Engineering, 2nd Edition](https://www.oreilly.com/library/view/observability-engineering-2nd/9781098179915/).
- DevOpsDays Wollongong organiser, 2025.
- SRECon22 Asia/Pacific organiser.
- [Monitoring.Sydney](https://monitoring.sydney/) organiser.
- DevOpsDays Sydney 2019 organiser.
- Currently building out an [open source Grafana Scenes app]() on a ClickHouse data source to vastly improve developer experience when debugging applications


# Contact {#contact}

- Phone: +61 451 309 913
- Email: [jordan.simonovski@gmail.com](mailto:jordan.simonovski@gmail.com)
- Website: [blog.jordansimonov.ski](https://blog.jordansimonov.ski)
- GitHub: [github.com/jordan-simonovski](https://github.com/jordan-simonovski)
- LinkedIn: [linkedin.com/in/jsimonovski](https://www.linkedin.com/in/jsimonovski/)

# References {#references}

Available upon request.