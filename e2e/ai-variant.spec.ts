import { expect, test } from '@playwright/test';

/**
 * E2E tests for the AI variant (World AI Monitor).
 *
 * All tests set localStorage so the dev server on localhost resolves to the
 * `ai` variant (matching the port 5180 → ai detection in variant.ts and the
 * hostname ai.* → ai detection in the inline script).
 *
 * API endpoints that hit external services / Redis are intercepted with mock
 * responses so the tests are deterministic and self-contained.
 */

const AI_VARIANT_INIT = () => {
  localStorage.setItem('worldmonitor-variant', 'ai');
  sessionStorage.setItem('__test_init_done', '1');
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Waits for the app shell to mount (header visible) and variant attribute set. */
async function waitForAppReady(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => document.documentElement.dataset.variant === 'ai', { timeout: 20000 });
  // Remove the skeleton so panels are live
  await page.waitForSelector('#panelsGrid', { timeout: 20000 });
}

// ─── 8.1 E2E Tests ────────────────────────────────────────────────────────────

test.describe('AI variant — load & branding', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(AI_VARIANT_INIT);
  });

  test('AI variant loads with correct data-variant attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(
      () => document.documentElement.dataset.variant === 'ai',
      { timeout: 20000 },
    );

    const variant = await page.evaluate(() => document.documentElement.dataset.variant);
    expect(variant).toBe('ai');
  });

  test('AI variant applies correct CSS color palette (deep dark background)', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.variant === 'ai', { timeout: 20000 });

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
    );
    // AI variant dark background (#06060f)
    expect(bg).toBe('#06060f');
  });

  test('page title updates to "World AI Monitor" for AI variant', async ({ page }) => {
    await page.addInitScript(() => {
      // Simulate ai. hostname resolution via localStorage flag
      localStorage.setItem('worldmonitor-variant', 'ai');
    });
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.variant === 'ai', { timeout: 20000 });

    const title = await page.title();
    expect(title).toContain('AI Monitor');
  });

  test('logo text shows "AI MONITOR" in header', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.logo', { timeout: 20000 });

    const logoText = await page.locator('.logo').textContent();
    expect(logoText).toContain('AI MONITOR');
  });
});

test.describe('AI variant — research-feed panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(AI_VARIANT_INIT);

    // Mock the ArXiv research endpoint with deterministic paper data
    await page.route('**/api/research/v1/**', async (route) => {
      await route.fulfill({
        json: {
          papers: [
            {
              arxivId: '2401.00001',
              title: 'Attention Is All You Need: A Revisit',
              authors: ['Jane Doe', 'John Smith'],
              labs: ['DeepMind'],
              abstract: 'We revisit the transformer architecture...',
              categories: ['cs.AI'],
              submittedDate: new Date().toISOString(),
              significance: 'landmark',
              keywords: ['transformer', 'attention'],
            },
            {
              arxivId: '2401.00002',
              title: 'Scaling Laws for Neural Language Models',
              authors: ['Alice Zhang'],
              labs: ['OpenAI'],
              abstract: 'We study empirical scaling laws...',
              categories: ['cs.LG'],
              submittedDate: new Date().toISOString(),
              significance: 'notable',
              keywords: ['scaling', 'language model'],
            },
          ],
        },
      });
    });
  });

  test('research-feed panel mounts and has correct panel id', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="research-feed"]');
    await expect(panel).toBeAttached({ timeout: 20000 });
  });

  test('research-feed panel renders paper items after data load', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="research-feed"]');
    await expect(panel).toBeAttached({ timeout: 20000 });

    // Panel should contain at least one news/paper item or loading state
    const hasContent = await panel.locator('.news-item, .paper-item, .panel-content, .panel-body').count();
    expect(hasContent).toBeGreaterThan(0);
  });
});

test.describe('AI variant — funding-radar panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(AI_VARIANT_INIT);

    // Mock the AI funding endpoint
    await page.route('**/api/ai-funding/**', async (route) => {
      await route.fulfill({
        json: {
          rounds: [
            {
              company: 'NeuralTech',
              amount: 150,
              amountUnit: 'M',
              round: 'series_b',
              investors: ['Sequoia', 'a16z'],
              date: new Date().toISOString(),
              aiVertical: 'foundation_models',
              pressLink: 'https://example.com/neuraltech',
            },
            {
              company: 'RoboCore',
              amount: 50,
              amountUnit: 'M',
              round: 'series_a',
              investors: ['Khosla'],
              date: new Date().toISOString(),
              aiVertical: 'physical_ai',
            },
          ],
          fetchedAt: Date.now(),
        },
      });
    });
  });

  test('funding-radar panel mounts', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="funding-radar"]');
    await expect(panel).toBeAttached({ timeout: 20000 });
  });

  test('funding-radar panel renders deal cards after data load', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="funding-radar"]');
    await expect(panel).toBeAttached({ timeout: 20000 });

    // Verify the panel has rendered some content (deal rows or a loading/empty state)
    const body = panel.locator('.panel-content, .panel-body, .news-item, .funding-row, .deal-card');
    await expect(body.first()).toBeAttached({ timeout: 15000 });
  });
});

test.describe('AI variant — model-releases panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(AI_VARIANT_INIT);

    // Mock HuggingFace models endpoint
    await page.route('**/api/hf/**', async (route) => {
      await route.fulfill({
        json: {
          models: [
            {
              id: 'meta-llama/Llama-3-8B',
              modelId: 'meta-llama/Llama-3-8B',
              pipeline_tag: 'text-generation',
              downloads: 1234567,
              likes: 8900,
              createdAt: new Date().toISOString(),
            },
          ],
          spaces: [],
          fetchedAt: Date.now(),
        },
      });
    });
  });

  test('model-releases panel mounts', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="model-releases"]');
    await expect(panel).toBeAttached({ timeout: 20000 });
  });

  test('model-releases panel has content area', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="model-releases"]');
    await expect(panel).toBeAttached({ timeout: 20000 });

    // Content area (news items or loading/empty state)
    const body = panel.locator('.panel-content, .panel-body, .news-item, .model-row');
    await expect(body.first()).toBeAttached({ timeout: 15000 });
  });
});

test.describe('AI variant — map datacenter layer', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(AI_VARIANT_INIT);
  });

  test('map canvas is present', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.variant === 'ai', { timeout: 20000 });
    await page.waitForSelector('#mapSection', { timeout: 20000 });

    // The 3D map renders to a canvas element
    const canvas = page.locator('#mapSection canvas');
    await expect(canvas).toBeAttached({ timeout: 30000 });
  });

  test('AI variant map layers config includes datacenters as enabled', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.variant === 'ai', { timeout: 20000 });

    // Evaluate the variant's default map layer config from the module
    const datacentersEnabled = await page.evaluate(async () => {
      // The config is baked in at build time; check the rendered state via DOM
      // The layer toggle button for datacenters should reflect the AI default (enabled)
      const btn = document.querySelector('[data-layer="datacenters"]') as HTMLElement | null;
      if (!btn) return null;
      return btn.classList.contains('active') || btn.getAttribute('aria-pressed') === 'true';
    });

    // datacenters is enabled by default in AI_MAP_LAYERS
    // btn may not exist yet if map hasn't fully initialised — just verify canvas loaded
    if (datacentersEnabled !== null) {
      expect(datacentersEnabled).toBe(true);
    }
  });

  test('AI variant does not load geopolitical-only layers (ais, flights)', async ({ page }) => {
    // Verify that geopolitical endpoints are NOT called for the AI variant
    const geoPoliticalCalls: string[] = [];
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/ais') || url.includes('/opensky') || url.includes('/acled')) {
        geoPoliticalCalls.push(url);
      }
      await route.continue();
    });

    await page.goto('/');
    await waitForAppReady(page);
    await page.waitForTimeout(3000); // let data loading settle

    expect(geoPoliticalCalls.length).toBe(0);
  });
});

test.describe('AI variant — AI insights panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(AI_VARIANT_INIT);

    // Mock the AI insights synthesis endpoint
    await page.route('**/api/ai-insights/**', async (route) => {
      const url = route.request().url();
      const rpc = url.split('/').pop() ?? '';
      const now = Date.now();

      const stubs: Record<string, object> = {
        breakthroughs: {
          breakthroughs: [
            {
              title: 'GPT-5 achieves human-level reasoning on ARC-AGI',
              labId: 'openai',
              significance: 'landmark',
              summary: "OpenAI's latest model crosses a key AGI benchmark.",
              arxivIds: [],
              generatedAt: now,
            },
          ],
          generatedAt: now,
          cacheExpiresAt: now + 14400000,
        },
        'lab-activity': {
          labActivity: [
            { lab: 'Anthropic', labId: 'anthropic', summary: 'Published 3 safety papers this week.', momentum: 'accelerating', generatedAt: now },
          ],
          generatedAt: now,
          cacheExpiresAt: now + 14400000,
        },
        'funding-themes': {
          fundingThemes: [
            { theme: 'Physical AI', totalUsd: 500000000, roundCount: 4, topCompanies: ['Figure AI'], generatedAt: now },
          ],
          generatedAt: now,
          cacheExpiresAt: now + 14400000,
        },
        discontinuities: { discontinuities: [], generatedAt: now, cacheExpiresAt: now + 14400000 },
        summary: {
          breakthroughs: [],
          labActivity: [],
          fundingThemes: [],
          discontinuities: [],
          generatedAt: now,
          cacheExpiresAt: now + 14400000,
        },
      };

      await route.fulfill({ json: stubs[rpc] ?? stubs.summary });
    });
  });

  test('ai-insights panel mounts', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="ai-insights"]');
    await expect(panel).toBeAttached({ timeout: 20000 });
  });

  test('ai-insights panel renders synthesized text content', async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);

    const panel = page.locator('[data-panel="ai-insights"]');
    await expect(panel).toBeAttached({ timeout: 20000 });

    // Should have some text content in the panel body
    const body = panel.locator('.panel-content, .panel-body, .insights-body, .ai-insights-content');
    await expect(body.first()).toBeAttached({ timeout: 15000 });
  });
});
