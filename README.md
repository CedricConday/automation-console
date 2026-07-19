# Automation Console

A small B2B workflow automation dashboard — built in **Angular** (standalone components, signals, strict TypeScript), because that was the one gap called out in a rejection I got today.

## Context

[Heljens IT Services](https://heljens.tech) passed on my application for their Fullstack Software Engineer role. The reasoning, quoted directly from their rejection:

> "Die ausgeschriebene Position ist jedoch deutlich auf die Entwicklung von B2B-Fullstack-Anwendungen mit Angular ausgerichtet. Die dafür erforderliche praktische Erfahrungstiefe ging aus den eingereichten Unterlagen nicht ausreichend hervor."

Fair point — my public work leans Python/TypeScript/AI-tooling, not Angular. So: here's Angular. B2B-facing. Shipped same day.

## What this is

A workflow-automation console for the kind of process Heljens themselves sell as a service ("KI-gestützte Prozessautomatisierung") — rule-based triggers, conditions, actions, a live run log, and enabled/disabled state management. Signals for state, standalone components, strict templates, no framework ceremony.

- Rule engine with trigger/condition/action modeling (schedule, webhook, event, threshold)
- Live run simulation with per-rule latency and execution log
- Toggle rules on/off, KPI rollups (active rules, total executions, avg latency)

## Stack

Angular 18, standalone components, `@angular/signals`, TypeScript strict mode. No CLI scaffolding cruft — every file here is intentional.

## Run it

```bash
npm install
npm start
```

---

*Built by [Cedric Conday](https://github.com/CedricConday), Conday Digital.*
