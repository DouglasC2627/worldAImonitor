import { Panel } from './Panel';
import { t } from '@/services/i18n';
import { escapeHtml } from '@/utils/sanitize';

/**
 * AILabActivityPanel — tracks real-time activity from leading AI labs.
 * Phase 2 stub: renders a placeholder skeleton.
 * Phase 3 will wire in the lab-activity API (GitHub commits, blog posts, job postings).
 */
export class AILabActivityPanel extends Panel {
  constructor() {
    super({
      id: 'lab-activity',
      title: t('panels.labActivity'),
      showCount: false,
      infoTooltip: 'Live activity signals from leading AI labs — commits, publications, hiring, model deployments.',
    });

    this.setContent(this.renderSkeleton());
  }

  private renderSkeleton(): string {
    const labs = [
      { name: 'OpenAI',      status: 'active',  signal: 'Model update' },
      { name: 'Anthropic',   status: 'active',  signal: 'Research paper' },
      { name: 'Google DeepMind', status: 'active', signal: 'Blog post' },
      { name: 'Meta AI',     status: 'active',  signal: 'Open source release' },
      { name: 'Mistral',     status: 'active',  signal: 'Model release' },
      { name: 'xAI',         status: 'active',  signal: 'Grok update' },
    ];

    const rows = labs.map(l => `
      <div class="lab-row">
        <span class="lab-dot lab-dot--${escapeHtml(l.status)}"></span>
        <span class="lab-name">${escapeHtml(l.name)}</span>
        <span class="lab-signal">${escapeHtml(l.signal)}</span>
        <span class="lab-time lab-skeleton"></span>
      </div>`).join('');

    return `
      <div class="ai-lab-activity">
        <div class="lab-list">
          ${rows}
        </div>
        <div class="lab-coming-soon">
          <p>Live lab activity signals coming in Phase 3 — API integration in progress.</p>
        </div>
      </div>`;
  }

  refresh(): void {
    // Phase 3: fetch lab activity from API and re-render
  }
}
