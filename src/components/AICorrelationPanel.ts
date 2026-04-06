import { Panel } from './Panel';
import { t } from '@/services/i18n';
import type { CorrelationSignal } from '@/services/correlation';

type AISignalType =
  | 'ai_cycle_amplification'
  | 'ai_paper_to_product'
  | 'ai_funding_scale_up'
  | 'ai_incident_regulation'
  | 'ai_capability_race'
  | 'ai_ecosystem_birth';

const AI_SIGNAL_LABELS: Record<AISignalType, string> = {
  ai_cycle_amplification:  'Story Cycle',
  ai_paper_to_product:     'Paper → Product',
  ai_funding_scale_up:     'Funding Scale-Up',
  ai_incident_regulation:  'Incident → Regulation',
  ai_capability_race:      'Capability Race',
  ai_ecosystem_birth:      'Ecosystem Birth',
};

const AI_SIGNAL_ICONS: Record<AISignalType, string> = {
  ai_cycle_amplification:  '🔄',
  ai_paper_to_product:     '📄→🚀',
  ai_funding_scale_up:     '💰→📈',
  ai_incident_regulation:  '⚠️→📋',
  ai_capability_race:      '🏆',
  ai_ecosystem_birth:      '🌱',
};

const AI_SIGNAL_TYPES = new Set<string>([
  'ai_cycle_amplification',
  'ai_paper_to_product',
  'ai_funding_scale_up',
  'ai_incident_regulation',
  'ai_capability_race',
  'ai_ecosystem_birth',
]);

/**
 * AICorrelationPanel — surfaces live AI cross-domain correlation signals.
 * Receives CorrelationSignal[] from the analysis engine and renders the
 * top AI-specific signals with confidence bars.
 */
export class AICorrelationPanel extends Panel {
  private signals: CorrelationSignal[] = [];

  constructor() {
    super({
      id: 'ai-correlation',
      title: t('panels.aiCorrelation'),
      showCount: false,
      infoTooltip: 'Cross-category AI signal correlation — detects co-movement between research, funding, policy, and safety events.',
    });

    this.setContent(this.renderEmpty());
  }

  /** Called by the app with the latest correlation signals from analyzeCorrelations(). */
  update(data: unknown): void {
    if (!Array.isArray(data)) return;
    const allSignals = data as CorrelationSignal[];
    this.signals = allSignals
      .filter(s => AI_SIGNAL_TYPES.has(s.type))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);

    this.setContent(this.signals.length > 0 ? this.renderSignals() : this.renderEmpty());
  }

  private renderEmpty(): string {
    return `<div class="ai-correlation-panel ai-correlation-empty">
      <span class="corr-idle-icon">🔍</span>
      <p class="corr-idle-msg">Monitoring for AI cross-domain signals…</p>
      <p class="corr-idle-sub">Signals appear when research, funding, policy, and safety events correlate.</p>
    </div>`;
  }

  private renderSignals(): string {
    const rows = this.signals.map(sig => {
      const type = sig.type as AISignalType;
      const label = AI_SIGNAL_LABELS[type] ?? sig.type;
      const icon = AI_SIGNAL_ICONS[type] ?? '📡';
      const pct = Math.round(sig.confidence * 100);
      const barClass = pct >= 80 ? 'corr-bar-high' : pct >= 65 ? 'corr-bar-med' : 'corr-bar-low';
      const timeAgo = formatTimeAgo(sig.timestamp);

      return `<div class="corr-signal-row">
        <div class="corr-signal-header">
          <span class="corr-signal-icon">${icon}</span>
          <span class="corr-signal-label">${label}</span>
          <span class="corr-signal-time">${timeAgo}</span>
        </div>
        <p class="corr-signal-desc">${escHtml(sig.description)}</p>
        <div class="corr-confidence-track">
          <div class="corr-confidence-bar ${barClass}" style="width:${pct}%"></div>
          <span class="corr-confidence-pct">${pct}%</span>
        </div>
      </div>`;
    }).join('');

    return `<div class="ai-correlation-panel">
      <div class="corr-signals-list">${rows}</div>
    </div>`;
  }
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatTimeAgo(ts: Date): string {
  const diffMs = Date.now() - ts.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? '1h ago' : `${hrs}h ago`;
}
