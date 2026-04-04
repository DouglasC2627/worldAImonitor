import { Panel } from './Panel';
import { t } from '@/services/i18n';

/**
 * AIInsightsPanel — AI domain synthesis layer.
 * Synthesises signals across research, releases, funding, safety, and policy
 * into a curated brief for the AI variant.
 * Phase 2 stub: renders a placeholder brief structure.
 * Phase 3 will wire the synthesis API (server-side AI insights for ai.worldmonitor.app).
 */
export class AIInsightsPanel extends Panel {
  constructor() {
    super({
      id: 'ai-insights',
      title: t('panels.aiInsights'),
      showCount: false,
      premium: 'locked',
      infoTooltip: 'AI-synthesised intelligence brief across model releases, research, funding, safety, and policy.',
    });

    this.showLocked([
      'Daily AI intelligence brief synthesised from 100+ sources',
      'Cross-domain signal detection: research → release → funding cycles',
      'Safety & policy alert summaries with risk scoring',
    ]);
  }

  refresh(): void {
    // Phase 3: fetch AI synthesis brief from server and render it
  }
}
