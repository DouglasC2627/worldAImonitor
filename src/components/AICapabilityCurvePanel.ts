import { Panel } from './Panel';
import { t } from '@/services/i18n';

/**
 * AICapabilityCurvePanel — AI benchmark capability curve.
 * Tracks model performance across key benchmarks (MMLU, HumanEval, MATH,
 * GPQA, SWE-bench) over time to visualise the capability frontier.
 * Phase 2 stub: locked premium placeholder.
 * Phase 3 will integrate benchmark data from the API.
 */
export class AICapabilityCurvePanel extends Panel {
  constructor() {
    super({
      id: 'capability-curve',
      title: t('panels.capabilityCurve'),
      showCount: false,
      premium: 'locked',
      infoTooltip: 'Live benchmark capability curve tracking AI model performance across MMLU, HumanEval, MATH, GPQA, and SWE-bench.',
    });

    this.showLocked([
      'Capability frontier chart across leading AI benchmarks',
      'Model-by-model benchmark comparison with historical trend',
      'Rate-of-improvement analytics and extrapolation',
    ]);
  }

  refresh(): void {
    // Phase 3: fetch benchmark time-series data from API and render chart
  }
}
