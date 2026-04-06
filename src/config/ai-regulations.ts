import type { AIRegulation, RegulatoryAction, CountryRegulationProfile, RegulationPosture } from '@/types';

// Major AI Regulations & Laws Worldwide
export const AI_REGULATIONS: AIRegulation[] = [
  // European Union
  {
    id: 'eu-ai-act',
    name: 'EU Artificial Intelligence Act',
    shortName: 'EU AI Act',
    country: 'European Union',
    region: 'Europe',
    type: 'comprehensive',
    status: 'active',
    announcedDate: '2021-04-21',
    effectiveDate: '2024-08-01',
    complianceDeadline: '2026-08-01',
    scope: ['General Purpose AI', 'High-Risk AI Systems', 'Prohibited AI Practices', 'Foundation Models'],
    keyProvisions: [
      'Risk-based classification system (Unacceptable, High, Limited, Minimal)',
      'Ban on social scoring, real-time biometric surveillance (with exceptions)',
      'Transparency requirements for foundation models (>10^25 FLOPs)',
      'Mandatory conformity assessments for high-risk AI',
      'AI literacy and human oversight requirements',
    ],
    penalties: '€35M or 7% of global annual turnover (whichever is higher)',
    link: 'https://artificialintelligenceact.eu/',
    description: 'World\'s first comprehensive AI regulation framework. Establishes harmonized rules for development and use of AI in the EU.',
  },
  {
    id: 'eu-gdpr',
    name: 'General Data Protection Regulation (AI provisions)',
    shortName: 'GDPR (AI)',
    country: 'European Union',
    region: 'Europe',
    type: 'sectoral',
    status: 'active',
    announcedDate: '2016-04-27',
    effectiveDate: '2018-05-25',
    scope: ['Automated Decision-Making', 'Profiling', 'Data Processing'],
    keyProvisions: [
      'Right to explanation for automated decisions',
      'Right to object to automated processing',
      'Data minimization for AI training',
      'Privacy by design requirements',
    ],
    penalties: '€20M or 4% of global annual turnover',
    link: 'https://gdpr.eu/',
    description: 'Includes provisions on automated decision-making and profiling relevant to AI systems.',
  },

  // United States
  {
    id: 'us-eo-14110',
    name: 'Executive Order on Safe, Secure, and Trustworthy AI',
    shortName: 'Biden AI EO',
    country: 'United States',
    region: 'North America',
    type: 'comprehensive',
    status: 'active',
    announcedDate: '2023-10-30',
    effectiveDate: '2023-10-30',
    scope: ['Foundation Models', 'AI Safety', 'National Security', 'Civil Rights'],
    keyProvisions: [
      'Safety testing for dual-use foundation models (>10^26 FLOPs)',
      'Red-teaming requirements before public release',
      'Watermarking of AI-generated content',
      'AI Bill of Rights implementation',
      'NIST AI Risk Management Framework adoption',
    ],
    link: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',
    description: 'Comprehensive executive order establishing US government approach to AI safety and governance.',
  },
  {
    id: 'us-blueprint-ai-bill-rights',
    name: 'Blueprint for an AI Bill of Rights',
    shortName: 'AI Bill of Rights',
    country: 'United States',
    region: 'North America',
    type: 'voluntary',
    status: 'active',
    announcedDate: '2022-10-04',
    effectiveDate: '2022-10-04',
    scope: ['Civil Rights', 'Algorithmic Discrimination', 'Data Privacy'],
    keyProvisions: [
      'Safe and effective systems',
      'Algorithmic discrimination protections',
      'Data privacy safeguards',
      'Notice and explanation requirements',
      'Human alternatives and opt-out',
    ],
    link: 'https://www.whitehouse.gov/ostp/ai-bill-of-rights/',
    description: 'Non-binding framework for protecting civil rights in the age of AI.',
  },

  // United Kingdom
  {
    id: 'uk-pro-innovation',
    name: 'UK Pro-Innovation Approach to AI Regulation',
    shortName: 'UK AI Framework',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'voluntary',
    status: 'active',
    announcedDate: '2023-03-29',
    effectiveDate: '2023-03-29',
    scope: ['Cross-Sectoral AI Governance', 'Innovation'],
    keyProvisions: [
      '5 cross-sectoral principles: Safety, Transparency, Fairness, Accountability, Contestability',
      'Sector-specific regulators (not centralized)',
      'Focus on innovation-friendly regulation',
      'No immediate new laws',
    ],
    link: 'https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach',
    description: 'Light-touch, principles-based approach favoring innovation over strict regulation.',
  },

  // China
  {
    id: 'cn-algorithm-regulations',
    name: 'Regulations on Algorithm Recommendations',
    shortName: 'China Algorithm Rules',
    country: 'China',
    region: 'Asia',
    type: 'sectoral',
    status: 'active',
    announcedDate: '2021-08-27',
    effectiveDate: '2022-03-01',
    scope: ['Recommendation Algorithms', 'Content Moderation', 'User Profiling'],
    keyProvisions: [
      'Algorithm filing requirements with CAC',
      'User opt-out from algorithmic recommendations',
      'Prohibition on price discrimination',
      'Content aligned with socialist values',
    ],
    link: 'http://www.cac.gov.cn/',
    description: 'Regulations governing algorithmic recommendation services and content.',
  },
  {
    id: 'cn-generative-ai',
    name: 'Measures for Generative AI Services',
    shortName: 'China GenAI Rules',
    country: 'China',
    region: 'Asia',
    type: 'sectoral',
    status: 'active',
    announcedDate: '2023-07-10',
    effectiveDate: '2023-08-15',
    scope: ['Generative AI', 'Large Language Models', 'Content Generation'],
    keyProvisions: [
      'Content must reflect socialist core values',
      'Training data security reviews',
      'Real-name verification for users',
      'Labeling of AI-generated content',
      'Registration with authorities before public release',
    ],
    link: 'http://www.cac.gov.cn/',
    description: 'First national regulation specifically targeting generative AI services.',
  },

  // Canada
  {
    id: 'ca-aida',
    name: 'Artificial Intelligence and Data Act (AIDA)',
    shortName: 'AIDA',
    country: 'Canada',
    region: 'North America',
    type: 'comprehensive',
    status: 'proposed',
    announcedDate: '2022-06-16',
    scope: ['High-Impact AI Systems', 'Algorithmic Harm', 'Data Governance'],
    keyProvisions: [
      'Risk-based approach for high-impact systems',
      'Mandatory impact assessments',
      'Algorithmic transparency requirements',
      'Biased output mitigation',
    ],
    link: 'https://www.parl.ca/DocumentViewer/en/44-1/bill/C-27/first-reading',
    description: 'Proposed comprehensive AI regulation (part of Bill C-27). Still in parliamentary process.',
  },

  // Singapore
  {
    id: 'sg-model-framework',
    name: 'Model AI Governance Framework',
    shortName: 'Singapore Framework',
    country: 'Singapore',
    region: 'Asia',
    type: 'voluntary',
    status: 'active',
    announcedDate: '2020-01-21',
    effectiveDate: '2020-01-21',
    scope: ['AI Governance', 'Ethical AI', 'Risk Management'],
    keyProvisions: [
      'Risk-based governance approach',
      'Internal governance structures',
      'Human oversight in decision-making',
      'Transparency and explainability',
    ],
    link: 'https://www.pdpc.gov.sg/help-and-resources/2020/01/model-ai-governance-framework',
    description: 'Voluntary framework providing guidance on responsible AI deployment.',
  },

  // Brazil
  {
    id: 'br-ai-bill',
    name: 'Brazilian AI Regulatory Framework',
    shortName: 'Brazil AI Law',
    country: 'Brazil',
    region: 'South America',
    type: 'comprehensive',
    status: 'proposed',
    announcedDate: '2023-05-03',
    scope: ['AI Systems', 'Algorithmic Rights', 'Data Protection'],
    keyProvisions: [
      'Risk-based classification',
      'Rights of affected individuals',
      'Mandatory impact assessments for high-risk AI',
      'Transparency requirements',
    ],
    description: 'Proposed comprehensive AI law (Bill 2338/2023). Under legislative review.',
  },

  // Japan
  {
    id: 'jp-ai-guidelines',
    name: 'AI Governance Guidelines',
    shortName: 'Japan AI Guidelines',
    country: 'Japan',
    region: 'Asia',
    type: 'voluntary',
    status: 'active',
    announcedDate: '2024-04-19',
    effectiveDate: '2024-04-19',
    scope: ['AI Governance', 'Business Use', 'Risk Management'],
    keyProvisions: [
      'Guidelines for AI developers and users',
      'Risk management frameworks',
      'International cooperation focus',
      'Emphasis on innovation',
    ],
    description: 'Non-binding guidelines focusing on fostering AI innovation while managing risks.',
  },

  // South Korea
  {
    id: 'kr-ai-framework',
    name: 'AI Ethics Standards and Trust Framework',
    shortName: 'Korea AI Framework',
    country: 'South Korea',
    region: 'Asia',
    type: 'voluntary',
    status: 'active',
    announcedDate: '2023-09-01',
    effectiveDate: '2023-09-01',
    scope: ['AI Ethics', 'Trust', 'Governance'],
    keyProvisions: [
      '3 core principles: Human dignity, Social benefit, Technical robustness',
      'Self-regulation encouraged',
      'Sectoral guidelines',
    ],
    description: 'Voluntary framework emphasizing ethical AI development and deployment.',
  },

  // United Kingdom — AI Safety Institute
  {
    id: 'uk-aisi',
    name: 'UK AI Safety Institute',
    shortName: 'UK AISI',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'voluntary',
    status: 'active',
    announcedDate: '2023-11-01',
    effectiveDate: '2023-11-01',
    scope: ['Frontier AI Safety', 'Model Evaluation', 'International Coordination'],
    keyProvisions: [
      'Pre-deployment safety testing of frontier AI models',
      'Evaluations for dangerous capabilities (CBRN, cyber, autonomy)',
      'International AI Safety Report coordination',
      'Information sharing with labs (Anthropic, OpenAI, Google DeepMind)',
      'Publishes safety evaluation methodology and findings',
    ],
    link: 'https://www.gov.uk/government/organisations/ai-safety-institute',
    description: 'World\'s first national AI safety institute, created at Bletchley AI Safety Summit. Conducts frontier model evaluations and coordinates international AI safety research.',
  },

  // United States — Trump AI EO (2025 rescission)
  {
    id: 'us-eo-14179',
    name: 'Removing Barriers to American Leadership in AI',
    shortName: 'Trump AI EO (2025)',
    country: 'United States',
    region: 'North America',
    type: 'comprehensive',
    status: 'active',
    announcedDate: '2025-01-23',
    effectiveDate: '2025-01-23',
    scope: ['AI Deregulation', 'Innovation', 'Federal AI Strategy'],
    keyProvisions: [
      'Revoked Biden EO 14110 on AI safety',
      'Directed agencies to remove burdensome AI regulations',
      'Established AI Action Plan within 180 days',
      'Prioritized US AI dominance over safety guardrails',
    ],
    link: 'https://www.whitehouse.gov/presidential-actions/2025/01/removing-barriers-to-american-leadership-in-artificial-intelligence/',
    description: 'Trump administration\'s AI executive order reversing Biden-era AI safety requirements; pivots to deregulatory, innovation-first approach.',
  },
];

// Recent Regulatory Actions & Timeline
export const REGULATORY_ACTIONS: RegulatoryAction[] = [
  {
    id: 'action-001',
    date: '2024-08-01',
    country: 'European Union',
    title: 'EU AI Act Enters into Force',
    type: 'law-passed',
    regulationId: 'eu-ai-act',
    description: 'The EU AI Act officially entered into force, starting the 24-month implementation period.',
    impact: 'high',
    source: 'European Commission',
  },
  {
    id: 'action-002',
    date: '2024-07-01',
    country: 'United States',
    title: 'NIST AI Risk Management Framework v1.1 Released',
    type: 'guideline',
    description: 'NIST published updated AI Risk Management Framework with enhanced guidance.',
    impact: 'medium',
    source: 'NIST',
  },
  {
    id: 'action-003',
    date: '2024-01-31',
    country: 'United States',
    title: 'White House AI Datacenter Infrastructure EO',
    type: 'executive-order',
    description: 'Executive order to streamline permitting for AI datacenter construction.',
    impact: 'high',
    source: 'White House',
  },
  {
    id: 'action-004',
    date: '2023-11-01',
    country: 'United Kingdom',
    title: 'UK AI Safety Summit - Bletchley Declaration',
    type: 'guideline',
    description: '28 countries signed declaration on AI safety cooperation and frontier AI risks.',
    impact: 'high',
    source: 'UK Government',
  },
  {
    id: 'action-005',
    date: '2023-10-30',
    country: 'United States',
    title: 'Biden Signs AI Executive Order',
    type: 'executive-order',
    regulationId: 'us-eo-14110',
    description: 'President Biden signed comprehensive executive order on AI safety and security.',
    impact: 'high',
    source: 'White House',
  },
  {
    id: 'action-006',
    date: '2023-08-15',
    country: 'China',
    title: 'Generative AI Rules Take Effect',
    type: 'law-passed',
    regulationId: 'cn-generative-ai',
    description: 'China\'s measures for managing generative AI services became enforceable.',
    impact: 'high',
    source: 'CAC',
  },
  {
    id: 'action-007',
    date: '2024-05-15',
    country: 'European Union',
    title: 'First EU AI Act Penalties Expected',
    type: 'enforcement',
    regulationId: 'eu-ai-act',
    description: 'EU expected to begin enforcement actions for non-compliant AI systems.',
    impact: 'high',
    source: 'European Commission',
  },
];

// Country Regulatory Profiles
// postureScore: 0=fully permissive/no rules, 100=most restrictive/banned
export const COUNTRY_REGULATION_PROFILES: CountryRegulationProfile[] = [
  {
    country: 'United States',
    countryCode: 'US',
    stance: 'moderate',
    posture: 'active' as RegulationPosture,
    postureScore: 40,
    activeRegulations: ['us-eo-14179', 'us-blueprint-ai-bill-rights'],
    proposedRegulations: [],
    lastUpdated: '2025-01-23',
    summary: 'Post-2025: deregulatory pivot. EO 14110 revoked; innovation-first executive order. Some state-level rules emerging (CA SB 1047 vetoed).',
  },
  {
    country: 'European Union',
    countryCode: 'EU',
    stance: 'strict',
    posture: 'restrictive' as RegulationPosture,
    postureScore: 85,
    activeRegulations: ['eu-ai-act', 'eu-gdpr'],
    proposedRegulations: [],
    lastUpdated: '2024-08-01',
    summary: 'Comprehensive risk-based regulation. World\'s strictest AI governance framework.',
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    stance: 'permissive',
    posture: 'active' as RegulationPosture,
    postureScore: 35,
    activeRegulations: ['uk-pro-innovation', 'uk-aisi'],
    proposedRegulations: [],
    lastUpdated: '2024-06-01',
    summary: 'Pro-innovation principles-based approach with dedicated AI Safety Institute for frontier model evals.',
  },
  {
    country: 'China',
    countryCode: 'CN',
    stance: 'strict',
    posture: 'restrictive' as RegulationPosture,
    postureScore: 80,
    activeRegulations: ['cn-algorithm-regulations', 'cn-generative-ai'],
    proposedRegulations: [],
    lastUpdated: '2023-08-15',
    summary: 'State-aligned content rules, registration requirements for GenAI services. Aggressive domestic AI development alongside strict governance.',
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    stance: 'moderate',
    posture: 'active' as RegulationPosture,
    postureScore: 55,
    activeRegulations: [],
    proposedRegulations: ['ca-aida'],
    lastUpdated: '2023-06-01',
    summary: 'Comprehensive AIDA law in development. Risk-based approach similar to EU.',
  },
  {
    country: 'Singapore',
    countryCode: 'SG',
    stance: 'permissive',
    posture: 'permissive' as RegulationPosture,
    postureScore: 20,
    activeRegulations: ['sg-model-framework'],
    proposedRegulations: [],
    lastUpdated: '2020-01-21',
    summary: 'Voluntary governance framework. Pro-business, innovation-friendly. AI governance testing environment.',
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    stance: 'permissive',
    posture: 'permissive' as RegulationPosture,
    postureScore: 18,
    activeRegulations: ['jp-ai-guidelines'],
    proposedRegulations: [],
    lastUpdated: '2024-04-19',
    summary: 'Non-binding guidelines. Focus on international cooperation and innovation. "AI-friendly" regulatory posture.',
  },
  {
    country: 'South Korea',
    countryCode: 'KR',
    stance: 'permissive',
    posture: 'permissive' as RegulationPosture,
    postureScore: 25,
    activeRegulations: ['kr-ai-framework'],
    proposedRegulations: [],
    lastUpdated: '2023-09-01',
    summary: 'Voluntary ethical framework. Self-regulation approach. AI Basic Act under debate.',
  },
  {
    country: 'Brazil',
    countryCode: 'BR',
    stance: 'moderate',
    posture: 'active' as RegulationPosture,
    postureScore: 50,
    activeRegulations: [],
    proposedRegulations: ['br-ai-bill'],
    lastUpdated: '2023-05-03',
    summary: 'Comprehensive AI law proposed (Bill 2338/2023). Risk-based approach; under legislative review.',
  },
  {
    country: 'India',
    countryCode: 'IN',
    stance: 'undefined',
    posture: 'permissive' as RegulationPosture,
    postureScore: 12,
    activeRegulations: [],
    proposedRegulations: [],
    lastUpdated: '2024-01-01',
    summary: 'No comprehensive AI regulation. Advisory approach; Digital India AI mission active.',
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    stance: 'moderate',
    posture: 'active' as RegulationPosture,
    postureScore: 42,
    activeRegulations: [],
    proposedRegulations: [],
    lastUpdated: '2024-09-01',
    summary: 'Voluntary AI Ethics Framework. Mandatory guardrails for high-risk AI under consultation.',
  },
  {
    country: 'France',
    countryCode: 'FR',
    stance: 'moderate',
    posture: 'active' as RegulationPosture,
    postureScore: 60,
    activeRegulations: ['eu-ai-act', 'eu-gdpr'],
    proposedRegulations: [],
    lastUpdated: '2024-08-01',
    summary: 'EU AI Act applies. Home of Mistral AI; government actively supports national AI champions.',
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    stance: 'strict',
    posture: 'restrictive' as RegulationPosture,
    postureScore: 72,
    activeRegulations: ['eu-ai-act', 'eu-gdpr'],
    proposedRegulations: [],
    lastUpdated: '2024-08-01',
    summary: 'EU AI Act applies with strict national implementation. Strong data protection culture.',
  },
  {
    country: 'United Arab Emirates',
    countryCode: 'AE',
    stance: 'permissive',
    posture: 'active' as RegulationPosture,
    postureScore: 30,
    activeRegulations: [],
    proposedRegulations: [],
    lastUpdated: '2024-06-01',
    summary: 'UAE AI Strategy 2031; Minister of AI appointed. Light-touch regulation to attract AI investment (G42, TII, Falcon).',
  },
  {
    country: 'Saudi Arabia',
    countryCode: 'SA',
    stance: 'permissive',
    posture: 'active' as RegulationPosture,
    postureScore: 28,
    activeRegulations: [],
    proposedRegulations: [],
    lastUpdated: '2024-06-01',
    summary: 'Saudi AI Authority (SDAIA) established. Vision 2030 drives AI adoption. Light regulatory touch.',
  },
  {
    country: 'Russia',
    countryCode: 'RU',
    stance: 'strict',
    posture: 'restrictive' as RegulationPosture,
    postureScore: 75,
    activeRegulations: [],
    proposedRegulations: [],
    lastUpdated: '2024-01-01',
    summary: 'National AI Strategy 2030. Restrictive on foreign AI services; state-controlled approach.',
  },
];

// Helper function to get regulation by ID
export function getRegulationById(id: string): AIRegulation | undefined {
  return AI_REGULATIONS.find(reg => reg.id === id);
}

// Helper function to get country profile
export function getCountryProfile(countryCode: string): CountryRegulationProfile | undefined {
  return COUNTRY_REGULATION_PROFILES.find(profile => profile.countryCode === countryCode);
}

// Helper function to get regulations by country
export function getRegulationsByCountry(country: string): AIRegulation[] {
  return AI_REGULATIONS.filter(reg => reg.country === country);
}

// Helper function to get upcoming compliance deadlines (next 12 months)
export function getUpcomingDeadlines(): AIRegulation[] {
  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  return AI_REGULATIONS
    .filter(reg => {
      if (!reg.complianceDeadline) return false;
      const deadline = new Date(reg.complianceDeadline);
      return deadline >= now && deadline <= oneYearFromNow;
    })
    .sort((a, b) => {
      return new Date(a.complianceDeadline!).getTime() - new Date(b.complianceDeadline!).getTime();
    });
}

// Helper function to get recent regulatory actions (last N months)
export function getRecentActions(months: number = 6): RegulatoryAction[] {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  return REGULATORY_ACTIONS
    .filter(action => new Date(action.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Choropleth data for deck.gl globe map
// Returns array suitable for a GeoJsonLayer or ScatterplotLayer fill color lookup
export interface AIRegulationChoroplethEntry {
  isoCode: string;
  country: string;
  postureScore: number; // 0-100
  posture: string;
  summary: string;
  /** RGBA fill color derived from postureScore */
  color: [number, number, number, number];
}

function postureToColor(score: number): [number, number, number, number] {
  // Green (permissive) → Yellow (active) → Orange → Red (restrictive/banned)
  if (score <= 25) return [34, 197, 94, 180];   // green-500
  if (score <= 50) return [234, 179, 8, 180];    // yellow-500
  if (score <= 70) return [249, 115, 22, 180];   // orange-500
  return [239, 68, 68, 180];                      // red-500
}

export function getAIRegulationChoroplethData(): AIRegulationChoroplethEntry[] {
  return COUNTRY_REGULATION_PROFILES.map(profile => ({
    isoCode: profile.countryCode,
    country: profile.country,
    postureScore: profile.postureScore,
    posture: profile.posture,
    summary: profile.summary,
    color: postureToColor(profile.postureScore),
  }));
}
