# DevOps Learning Platform — Course Quality Standard V2

A tool is **not complete** just because a page exists. A tool is complete only when a new learner can study it from zero, practice it, troubleshoot it and explain it in an interview.

## Required learning order

1. What is this tool?
2. Why does it exist?
3. Where does it fit in DevOps?
4. Prerequisites / what to learn before it
5. 60-second revision / mental model
6. Beginner concepts in dependency order
7. Core components
8. Real architecture and request/control/data flow
9. Internal working — what happens behind a real action/command
10. Installation/setup where relevant
11. Commands and syntax with **why**, not command dumps
12. Configuration with field-by-field explanation where relevant
13. Hands-on labs: beginner → intermediate → advanced → production
14. Verification after every meaningful action
15. Troubleshooting: symptom → evidence → layer → cause → fix → verify
16. Security
17. Production best practices
18. Common mistakes / anti-patterns
19. Tool connections: before, after, alternatives and integrations
20. Real production project
21. Interview questions **with answers and reasoning**
22. Quiz with explanations
23. Quick notes / cheat sheet
24. Official documentation

## Lesson rule

Every important concept should answer:

- **What is it?**
- **Why do we need it?**
- **Simple example**
- **How does it work?**
- **What happens internally?**
- **Command/config example** (when applicable)
- **How do I verify it?**
- **What can go wrong?**
- **Where is it used in production?**
- **How does it connect to other DevOps tools?**

## Architecture rule

Never show a generic diagram like:

`User → Configuration → Tool → Connected System → Production`

unless those are the real components.

Architecture must use the actual components of the tool and show the real flow. Example for Kubernetes:

`kubectl / GitOps → API Server → etcd/controllers → Scheduler → Kubelet → CRI/containerd → Pod`

## Practical rule

A lab is incomplete unless it includes:

1. Goal
2. Why we are doing it
3. Prerequisites
4. Commands/config
5. Explanation of every important command
6. What is happening internally
7. Expected result
8. Verification
9. Failure exercise
10. Troubleshooting
11. Cleanup where relevant

## Project rule

Every project must include:

1. Real problem
2. Goal
3. Architecture
4. Tools used
5. Why each tool
6. Prerequisites
7. Step-by-step build
8. Commands/config explained
9. What is happening right now
10. Request/data/control flow
11. Verification
12. Failure scenarios
13. Troubleshooting
14. Security
15. Production improvements
16. Scaling/cost where relevant
17. Cleanup
18. Interview discussion
19. Summary
20. Official docs

## UI rule

The page must be easy for a first-time learner.

- One clear reading path
- No dense dashboard of unrelated cards at the top
- Beginner concepts before architecture/internals
- Architecture after the learner knows the components
- Large readable text and spacing
- Chapters shown in order
- Advanced material clearly labeled
- Practice separated from theory
- Interview answers hidden until learner tries
- Search is helpful but never replaces the learning order
- Mobile and desktop must both remain readable

## Content status

Do not label a tool **Full Course / Complete** until every required section above has tool-specific content. Generic generated filler is not accepted as tool-specific content.
