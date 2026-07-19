import { Injectable, signal, computed } from '@angular/core';

export type TriggerKind = 'schedule' | 'webhook' | 'event' | 'threshold';
export type ActionKind = 'notify' | 'sync-record' | 'call-api' | 'generate-report';

export interface AutomationRule {
  id: string;
  name: string;
  trigger: TriggerKind;
  condition: string;
  action: ActionKind;
  enabled: boolean;
  runsCount: number;
  lastRunAt: Date | null;
  avgLatencyMs: number;
}

export interface RunLogEntry {
  id: string;
  ruleId: string;
  ruleName: string;
  timestamp: Date;
  status: 'success' | 'skipped' | 'failed';
  detail: string;
}

const SEED_RULES: AutomationRule[] = [
  {
    id: 'r-1',
    name: 'Invoice mismatch → finance alert',
    trigger: 'threshold',
    condition: 'delta(invoice.total, po.total) > 2%',
    action: 'notify',
    enabled: true,
    runsCount: 482,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 14),
    avgLatencyMs: 118,
  },
  {
    id: 'r-2',
    name: 'New CRM lead → enrich + sync to ERP',
    trigger: 'event',
    condition: 'crm.lead.created',
    action: 'sync-record',
    enabled: true,
    runsCount: 1291,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 3),
    avgLatencyMs: 342,
  },
  {
    id: 'r-3',
    name: 'Weekly ops report',
    trigger: 'schedule',
    condition: 'every Monday 06:00',
    action: 'generate-report',
    enabled: true,
    runsCount: 37,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    avgLatencyMs: 2110,
  },
  {
    id: 'r-4',
    name: 'Vendor webhook → validate + call downstream API',
    trigger: 'webhook',
    condition: 'POST /vendors/{id}/status',
    action: 'call-api',
    enabled: false,
    runsCount: 96,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    avgLatencyMs: 205,
  },
];

@Injectable({ providedIn: 'root' })
export class AutomationEngineService {
  private readonly _rules = signal<AutomationRule[]>(SEED_RULES);
  private readonly _log = signal<RunLogEntry[]>([]);

  readonly rules = this._rules.asReadonly();
  readonly log = this._log.asReadonly();

  readonly activeCount = computed(() => this._rules().filter((r) => r.enabled).length);
  readonly totalRuns = computed(() => this._rules().reduce((sum, r) => sum + r.runsCount, 0));
  readonly avgLatency = computed(() => {
    const rules = this._rules();
    if (!rules.length) return 0;
    return Math.round(rules.reduce((sum, r) => sum + r.avgLatencyMs, 0) / rules.length);
  });

  toggleRule(id: string): void {
    this._rules.update((rules) =>
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }

  runAll(): void {
    const entries: RunLogEntry[] = [];
    this._rules().forEach((rule) => {
      if (!rule.enabled) {
        entries.push({
          id: crypto.randomUUID(),
          ruleId: rule.id,
          ruleName: rule.name,
          timestamp: new Date(),
          status: 'skipped',
          detail: 'Rule disabled — no action taken.',
        });
        return;
      }
      entries.push({
        id: crypto.randomUUID(),
        ruleId: rule.id,
        ruleName: rule.name,
        timestamp: new Date(),
        status: 'success',
        detail: `Trigger matched (${rule.trigger}) → executed "${rule.action}" in ~${rule.avgLatencyMs}ms.`,
      });
    });

    this._log.update((log) => [...entries, ...log].slice(0, 50));
    this._rules.update((rules) =>
      rules.map((r) =>
        r.enabled ? { ...r, runsCount: r.runsCount + 1, lastRunAt: new Date() } : r
      )
    );
  }
}
