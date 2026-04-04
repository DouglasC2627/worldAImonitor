import type { Feed } from '@/types';
import { SITE_VARIANT } from './variant';
import { rssProxyUrl } from '@/utils';

const rss = rssProxyUrl;
const railwayRss = rssProxyUrl;

// Source tier system for prioritization (lower = more authoritative)
// Tier 1: Wire services - fastest, most reliable breaking news
// Tier 2: Major outlets - high-quality journalism
// Tier 3: Specialty sources - domain expertise
// Tier 4: Aggregators & blogs - useful but less authoritative
export const SOURCE_TIERS: Record<string, number> = {
  // Tier 1 - Wire Services
  'Reuters': 1,
  'AP News': 1,
  'AFP': 1,
  'Bloomberg': 1,

  // Tier 2 - Major Outlets
  'BBC World': 2,
  'BBC Middle East': 2,
  'Guardian World': 2,
  'Guardian ME': 2,
  'NPR News': 2,
  'CNN World': 2,
  'CNBC': 2,
  'MarketWatch': 2,
  'Al Jazeera': 2,
  'Financial Times': 2,
  'Politico': 2,
  'Axios': 2,
  'EuroNews': 2,
  'France 24': 2,
  'Le Monde': 2,
  // Spanish
  'El País': 2,
  'El Mundo': 2,
  'BBC Mundo': 2,
  // German
  'Tagesschau': 1,
  'Der Spiegel': 2,
  'Die Zeit': 2,
  'DW News': 2,
  // Italian
  'ANSA': 1,
  'Corriere della Sera': 2,
  'Repubblica': 2,
  // Dutch
  'NOS Nieuws': 1,
  'NRC': 2,
  'De Telegraaf': 2,
  // Swedish
  'SVT Nyheter': 1,
  'Dagens Nyheter': 2,
  'Svenska Dagbladet': 2,
  'Reuters World': 1,
  'Reuters Business': 1,
  'Reuters US': 1,
  'Fox News': 2,
  'NBC News': 2,
  'CBS News': 2,
  'ABC News': 2,
  'PBS NewsHour': 2,
  'Wall Street Journal': 1,
  'The Hill': 3,
  'The National': 2,
  'Yonhap News': 2,
  'Chosun Ilbo': 2,
  'OpenAI News': 3,
  // Portuguese
  'Brasil Paralelo': 2,

  // Tier 1 - Official Government & International Orgs
  'White House': 1,
  'State Dept': 1,
  'Pentagon': 1,
  'UN News': 1,
  'CISA': 1,
  'Treasury': 2,
  'DOJ': 2,
  'DHS': 2,
  'CDC': 2,
  'FEMA': 2,

  // Tier 3 - Specialty
  'Defense One': 3,
  'Breaking Defense': 3,
  'The War Zone': 3,
  'Defense News': 3,
  'Janes': 3,
  'Military Times': 2,
  'Task & Purpose': 3,
  'USNI News': 2,
  'gCaptain': 3,
  'Oryx OSINT': 2,
  'UK MOD': 1,
  'Foreign Policy': 3,
  'The Diplomat': 3,
  'Bellingcat': 3,
  'Krebs Security': 3,
  'Ransomware.live': 3,
  'Federal Reserve': 3,
  'SEC': 3,
  'MIT Tech Review': 3,
  'Ars Technica': 3,
  'Atlantic Council': 3,
  'Foreign Affairs': 3,
  'CrisisWatch': 3,
  'CSIS': 3,
  'RAND': 3,
  'Brookings': 3,
  'Carnegie': 3,
  'IAEA': 1,
  'WHO': 1,
  'UNHCR': 1,
  'Xinhua': 3,
  'TASS': 3,
  'RT': 3,
  'RT Russia': 3,
  'Layoffs.fyi': 3,
  'BBC Persian': 2,
  'Iran International': 3,
  'Fars News': 3,
  'MIIT (China)': 1,
  'MOFCOM (China)': 1,
  // Turkish
  'BBC Turkce': 2,
  'DW Turkish': 2,
  'Hurriyet': 2,
  // Polish
  'TVN24': 2,
  'Polsat News': 2,
  'Rzeczpospolita': 2,
  // Russian (independent)
  'BBC Russian': 2,
  'Meduza': 2,
  'Novaya Gazeta Europe': 2,
  // Thai
  'Bangkok Post': 2,
  'Thai PBS': 2,
  // Australian
  'ABC News Australia': 2,
  'Guardian Australia': 2,
  // Vietnamese
  'VnExpress': 2,
  'Tuoi Tre News': 2,

  // Tier 2 - Premium Startup/VC Sources
  'Y Combinator Blog': 2,
  'a16z Blog': 2,
  'Sequoia Blog': 2,
  'Crunchbase News': 2,
  'CB Insights': 2,
  'PitchBook News': 2,
  'The Information': 2,

  // Tier 3 - Regional/Specialty Startup Sources
  'EU Startups': 3,
  'Tech.eu': 3,
  'Sifted (Europe)': 3,
  'The Next Web': 3,
  'Tech in Asia': 3,
  'TechCabal (Africa)': 3,
  'Inc42 (India)': 3,
  'YourStory': 3,
  'Paul Graham Essays': 2,
  'Stratechery': 2,
  // Asia - Regional
  'e27 (SEA)': 3,
  'DealStreetAsia': 3,
  'Pandaily (China)': 3,
  '36Kr English': 3,
  'TechNode (China)': 3,
  'China Tech News': 3,
  'The Bridge (Japan)': 3,
  'Japan Tech News': 3,
  'Nikkei Tech': 2,
  'NHK World': 2,
  'Nikkei Asia': 2,
  'Korea Tech News': 3,
  'KED Global': 3,
  'Entrackr (India)': 3,
  'India Tech News': 3,
  'Taiwan Tech News': 3,
  'GloNewswire (Taiwan)': 4,
  // LATAM
  'La Silla Vacía': 3,
  'LATAM Tech News': 3,
  'Startups.co (LATAM)': 3,
  'Contxto (LATAM)': 3,
  'Brazil Tech News': 3,
  'Mexico Tech News': 3,
  'LATAM Fintech': 3,
  // Africa & MENA
  'Wamda (MENA)': 3,
  'Magnitt': 3,
  // Nigeria
  'Premium Times': 2,
  'Vanguard Nigeria': 2,
  'Channels TV': 2,
  'Daily Trust': 3,
  'ThisDay': 2,
  // Greek
  'Kathimerini': 2,
  'Naftemporiki': 2,
  'in.gr': 3,
  'iefimerida': 3,
  'Proto Thema': 3,

  // Tier 3 - Think Tanks
  'Brookings Tech': 3,
  'CSIS Tech': 3,
  'MIT Tech Policy': 3,
  'Stanford HAI': 2,
  'AI Now Institute': 3,
  'OECD Digital': 2,
  'Bruegel (EU)': 3,
  'Chatham House Tech': 3,
  'ISEAS (Singapore)': 3,
  'ORF Tech (India)': 3,
  'RIETI (Japan)': 3,
  'Lowy Institute': 3,
  'China Tech Analysis': 3,
  'DigiChina': 2,
  // Security/Defense Think Tanks
  'RUSI': 2,
  'Wilson Center': 3,
  'GMF': 3,
  'Stimson Center': 3,
  'CNAS': 2,
  // Nuclear & Arms Control
  'Arms Control Assn': 2,
  'Bulletin of Atomic Scientists': 2,
  // Food Security
  'FAO GIEWS': 2,
  'EU ISS': 3,
  // New verified think tanks
  'War on the Rocks': 2,
  'AEI': 3,
  'Responsible Statecraft': 3,
  'FPRI': 3,
  'Jamestown': 3,

  // Tier 3 - Policy Sources
  'Politico Tech': 2,
  'AI Regulation': 3,
  'Tech Antitrust': 3,
  'EFF News': 3,
  'EU Digital Policy': 3,
  'Euractiv Digital': 3,
  'EU Commission Digital': 2,
  'China Tech Policy': 3,
  'UK Tech Policy': 3,
  'India Tech Policy': 3,

  // Tier 2-3 - Podcasts & Newsletters
  'Acquired Podcast': 2,
  'All-In Podcast': 2,
  'a16z Podcast': 2,
  'This Week in Startups': 3,
  'The Twenty Minute VC': 2,
  'Lex Fridman Tech': 3,
  'The Vergecast': 3,
  'Decoder (Verge)': 3,
  'Hard Fork (NYT)': 2,
  'Pivot (Vox)': 2,
  'Benedict Evans': 2,
  'The Pragmatic Engineer': 2,
  'Lenny Newsletter': 2,
  'AI Podcast (NVIDIA)': 3,
  'Gradient Dissent': 3,
  'Eye on AI': 3,
  'How I Built This': 2,
  'Masters of Scale': 2,
  'The Pitch': 3,

  // Tier 4 - Aggregators
  'Hacker News': 4,
  'The Verge': 4,
  'The Verge AI': 4,
  'VentureBeat AI': 4,
  'Yahoo Finance': 4,
  'TechCrunch Layoffs': 4,
  'ArXiv AI': 4,
  'AI News': 4,
  'Layoffs News': 4,

  // ── AI Variant Sources ──────────────────────────────────────────────────
  // Tier 1 - Primary AI Labs (most authoritative for AI news)
  'Google DeepMind Blog': 1,
  'OpenAI Research': 1,
  'Anthropic Research': 1,
  'Meta AI Research': 1,
  'Google AI Blog': 1,
  // Tier 1 - Primary AI Research
  'ArXiv ML': 1,
  'ArXiv CL': 1,
  'ArXiv CV': 1,
  'ArXiv Robotics': 1,
  'ArXiv Stat ML': 1,
  'ArXiv Architectures': 1,
  'ArXiv Robotics Feed': 1,
  // Tier 1 - Primary Model/Infrastructure News
  'AI Model News': 1,
  'Ars Technica AI': 2,
  'LMSYS Chatbot Arena': 1,
  'Anthropic News': 1,
  'Google AI News': 1,
  'Physical AI News': 2,
  'Agentic AI News': 2,
  'World Model News': 2,
  'AI Funding News': 2,
  // Tier 1 - Semiconductor & Infrastructure
  'NVIDIA AI Chips': 1,
  'AMD & Custom ASICs': 2,
  'Cloud AI Infrastructure': 1,
  'Semiconductor Fabs': 1,
  'AI Datacenter Projects': 1,
  'AI Policy News': 1,
  'US AI Policy': 1,
  'EU AI Act Updates': 1,
  'UK AI Safety Institute': 1,
  'China AI Regulation': 1,
  'AI Export Controls': 1,
  'AI Safety News': 1,
  'Safety Orgs Research': 1,
  'AI Incidents Database': 2,
  'Anthropic Safety': 1,
  'DeepMind Safety': 1,
  'Alignment Forum': 2,
  // Tier 2 - Secondary AI Sources
  'MIT Tech Review AI': 2,
  'Hugging Face Blog': 2,
  'Papers With Code': 2,
  'Microsoft Research AI': 2,
  'Allen AI (AI2)': 2,
  'MIT Research AI': 2,
  'Distill.pub': 2,
  'The Gradient': 2,
  'NeurIPS Papers': 2,
  'ICLR Blog': 3,
  'Mistral AI': 2,
  'xAI Grok': 3,
  'Cohere Blog': 3,
  'AI21 Labs': 3,
  'Together AI': 3,
  'Weights & Biases': 3,
  'LangChain Blog': 3,
  'SWE-bench': 2,
  'OpenAI Agents': 1,
  'Anthropic Agents': 1,
  'Google Agents': 1,
  'Agent Benchmarks': 2,
  'AutoGPT / CrewAI': 3,
  'MCP Protocol': 2,
  'AI Coding Agents': 3,
  'OpenAI Sora': 1,
  'Runway ML': 2,
  'Stability AI': 3,
  'DeepMind Genie': 1,
  'Video AI Models': 3,
  'Pika Labs': 3,
  'World Model Research': 2,
  'Figure AI': 2,
  'Physical Intelligence': 2,
  'Boston Dynamics': 2,
  'Tesla Optimus': 2,
  'NVIDIA Isaac/Cosmos': 1,
  'IEEE Spectrum Robotics': 2,
  'Agility & 1X Robots': 3,
  'Humanoid Robot Race': 3,
  'TechCrunch Venture': 2,
  'a16z AI': 2,
  'Sequoia AI': 2,
  'Khosla Ventures AI': 3,
  'AI Mega Rounds': 2,
  'AI Unicorn Watch': 3,
  'YC AI Startups': 3,
  'Founders Fund AI': 3,
  'GV / Google Ventures': 3,
  'SemiAnalysis': 2,
  'GPU Cloud & Rental': 3,
  "Tom's Hardware AI": 3,
  'AI Power & Energy': 3,
  'Future of Life Institute': 3,
  'Center for AI Safety': 3,
  'OECD AI Observatory': 3,
  'Partnership on AI': 3,
  'LessWrong AI': 3,
  'AI Safety Newsletter': 3,
  'MIRI Research': 3,
  'Open Weight Models': 2,
  'Ollama / LM Studio': 3,
  'EleutherAI': 3,
  'PyTorch Blog': 2,
  'Meta Open Source AI': 1,
  'GitHub AI Trending': 3,
  'Open Source AI Models': 3,
  'JAX / Flax / TF': 3,
  'Enterprise AI News': 2,
  'Databricks AI': 2,
  'Snowflake AI': 3,
  'Salesforce AI': 3,
  'IBM watsonx': 3,
  'Palantir AI': 3,
  'Microsoft Copilot': 2,
  'Google Workspace AI': 2,
  'ServiceNow & SAP AI': 3,
  'Architecture Breakthroughs': 3,
  'Ahead of AI (Raschka)': 3,
  'Jay Alammar Blog': 3,
  'Crunchbase AI': 2,

  // Tier 2 - Positive News Sources (Happy variant)
  'Good News Network': 2,
  'Positive.News': 2,
  'Reasons to be Cheerful': 2,
  'Optimist Daily': 2,
  'Yes! Magazine': 2,
  'My Modern Met': 2,
  'Upworthy': 3,
  'DailyGood': 3,
  'Good Good Good': 3,
  'GOOD Magazine': 3,
  'Sunny Skyz': 3,
  'The Better India': 3,
  'Mongabay': 3,
  'Conservation Optimism': 3,
  'Shareable': 3,
  'GNN Heroes Spotlight': 3,
  'GNN Science': 3,
  'GNN Animals': 3,
  'GNN Health': 3,
  'GNN Heroes': 3,
  'GNN Earth': 3,
};

export function getSourceTier(sourceName: string): number {
  return SOURCE_TIERS[sourceName] ?? 4; // Default to tier 4 if unknown
}

export type SourceType = 'wire' | 'gov' | 'intel' | 'mainstream' | 'market' | 'tech' | 'other';

export const SOURCE_TYPES: Record<string, SourceType> = {
  // Wire services - fastest, most authoritative
  'Reuters': 'wire', 'Reuters World': 'wire', 'Reuters Business': 'wire',
  'AP News': 'wire', 'AFP': 'wire', 'Bloomberg': 'wire',

  // Government & International Org sources
  'White House': 'gov', 'State Dept': 'gov', 'Pentagon': 'gov',
  'Treasury': 'gov', 'DOJ': 'gov', 'DHS': 'gov', 'CDC': 'gov',
  'FEMA': 'gov', 'Federal Reserve': 'gov', 'SEC': 'gov',
  'UN News': 'gov', 'CISA': 'gov',

  // Intel/Defense specialty
  'Defense One': 'intel', 'Breaking Defense': 'intel', 'The War Zone': 'intel',
  'Defense News': 'intel', 'Janes': 'intel', 'Military Times': 'intel', 'Task & Purpose': 'intel',
  'USNI News': 'intel', 'gCaptain': 'intel', 'Oryx OSINT': 'intel', 'UK MOD': 'gov',
  'Bellingcat': 'intel', 'Krebs Security': 'intel',
  'Foreign Policy': 'intel', 'The Diplomat': 'intel',
  'Atlantic Council': 'intel', 'Foreign Affairs': 'intel',
  'CrisisWatch': 'intel',
  'CSIS': 'intel', 'RAND': 'intel', 'Brookings': 'intel', 'Carnegie': 'intel',
  'IAEA': 'gov', 'WHO': 'gov', 'UNHCR': 'gov',
  'Xinhua': 'wire', 'TASS': 'wire', 'RT': 'wire', 'RT Russia': 'wire',
  'NHK World': 'mainstream', 'Nikkei Asia': 'market',

  // Mainstream outlets
  'BBC World': 'mainstream', 'BBC Middle East': 'mainstream',
  'Guardian World': 'mainstream', 'Guardian ME': 'mainstream',
  'NPR News': 'mainstream', 'Al Jazeera': 'mainstream',
  'CNN World': 'mainstream', 'Politico': 'mainstream', 'Axios': 'mainstream',
  'EuroNews': 'mainstream', 'France 24': 'mainstream', 'Le Monde': 'mainstream',
  // European Addition
  'El País': 'mainstream', 'El Mundo': 'mainstream', 'BBC Mundo': 'mainstream',
  'Tagesschau': 'mainstream', 'Der Spiegel': 'mainstream', 'Die Zeit': 'mainstream', 'DW News': 'mainstream',
  'ANSA': 'wire', 'Corriere della Sera': 'mainstream', 'Repubblica': 'mainstream',
  'NOS Nieuws': 'mainstream', 'NRC': 'mainstream', 'De Telegraaf': 'mainstream',
  'SVT Nyheter': 'mainstream', 'Dagens Nyheter': 'mainstream', 'Svenska Dagbladet': 'mainstream',
  // Brazilian Addition
  'Brasil Paralelo': 'mainstream',

  // Market/Finance
  'CNBC': 'market', 'MarketWatch': 'market', 'Yahoo Finance': 'market',
  'Financial Times': 'market',

  // Tech
  'Hacker News': 'tech', 'Ars Technica': 'tech', 'The Verge': 'tech',
  'The Verge AI': 'tech', 'MIT Tech Review': 'tech', 'TechCrunch Layoffs': 'tech',
  'AI News': 'tech', 'ArXiv AI': 'tech', 'VentureBeat AI': 'tech',
  'Layoffs.fyi': 'tech', 'Layoffs News': 'tech',

  // Regional Tech Startups
  'EU Startups': 'tech', 'Tech.eu': 'tech', 'Sifted (Europe)': 'tech',
  'The Next Web': 'tech', 'Tech in Asia': 'tech', 'e27 (SEA)': 'tech',
  'DealStreetAsia': 'tech', 'Pandaily (China)': 'tech', '36Kr English': 'tech',
  'TechNode (China)': 'tech', 'The Bridge (Japan)': 'tech', 'Nikkei Tech': 'tech',
  'Inc42 (India)': 'tech', 'YourStory': 'tech', 'TechCabal (Africa)': 'tech',
  'Wamda (MENA)': 'tech', 'Magnitt': 'tech',

  // Think Tanks & Policy
  'Brookings Tech': 'intel', 'CSIS Tech': 'intel', 'Stanford HAI': 'intel',
  'AI Now Institute': 'intel', 'OECD Digital': 'intel', 'Bruegel (EU)': 'intel',
  'Chatham House Tech': 'intel', 'DigiChina': 'intel', 'Lowy Institute': 'intel',
  'EFF News': 'intel', 'Politico Tech': 'intel',
  // Security/Defense Think Tanks
  'RUSI': 'intel', 'Wilson Center': 'intel', 'GMF': 'intel',
  'Stimson Center': 'intel', 'CNAS': 'intel',
  // Nuclear & Arms Control
  'Arms Control Assn': 'intel', 'Bulletin of Atomic Scientists': 'intel',
  // Food Security & Regional
  'FAO GIEWS': 'gov', 'EU ISS': 'intel',
  // New verified think tanks
  'War on the Rocks': 'intel', 'AEI': 'intel', 'Responsible Statecraft': 'intel',
  'FPRI': 'intel', 'Jamestown': 'intel',

  // Podcasts & Newsletters
  'Acquired Podcast': 'tech', 'All-In Podcast': 'tech', 'a16z Podcast': 'tech',
  'This Week in Startups': 'tech', 'The Twenty Minute VC': 'tech',
  'Hard Fork (NYT)': 'tech', 'Pivot (Vox)': 'tech', 'Stratechery': 'tech',
  'Benedict Evans': 'tech', 'How I Built This': 'tech', 'Masters of Scale': 'tech',
};

export function getSourceType(sourceName: string): SourceType {
  return SOURCE_TYPES[sourceName] ?? 'other';
}

// Propaganda risk assessment for sources (Quick Win #5)
// 'high' = State-controlled media, known to push government narratives
// 'medium' = State-affiliated or known editorial bias toward specific governments
// 'low' = Independent journalism with editorial standards
export type PropagandaRisk = 'low' | 'medium' | 'high';

export interface SourceRiskProfile {
  risk: PropagandaRisk;
  stateAffiliated?: string;
  knownBiases?: string[];
  note?: string;
}

export const SOURCE_PROPAGANDA_RISK: Record<string, SourceRiskProfile> = {
  // High risk - State-controlled media
  'Xinhua': { risk: 'high', stateAffiliated: 'China', note: 'Official CCP news agency' },
  'TASS': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state news agency' },
  'RT': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media, banned in EU' },
  'RT Russia': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media, Russia desk' },
  'Sputnik': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media' },
  'CGTN': { risk: 'high', stateAffiliated: 'China', note: 'Chinese state broadcaster' },
  'Press TV': { risk: 'high', stateAffiliated: 'Iran', note: 'Iranian state media' },
  'KCNA': { risk: 'high', stateAffiliated: 'North Korea', note: 'North Korean state media' },

  // Medium risk - State-affiliated or known bias
  'Al Jazeera': { risk: 'medium', stateAffiliated: 'Qatar', note: 'Qatari state-funded, independent editorial' },
  'Al Arabiya': { risk: 'medium', stateAffiliated: 'Saudi Arabia', note: 'Saudi-owned, reflects Gulf perspective' },
  'TRT World': { risk: 'medium', stateAffiliated: 'Turkey', note: 'Turkish state broadcaster' },
  'France 24': { risk: 'medium', stateAffiliated: 'France', note: 'French state-funded, editorially independent' },
  'EuroNews': { risk: 'low', note: 'European public broadcaster consortium', knownBiases: ['Pro-EU'] },
  'Le Monde': { risk: 'low', note: 'French newspaper of record' },
  'DW News': { risk: 'medium', stateAffiliated: 'Germany', note: 'German state-funded, editorially independent' },
  'Voice of America': { risk: 'medium', stateAffiliated: 'USA', note: 'US government-funded' },
  'Kyiv Independent': { risk: 'medium', knownBiases: ['Pro-Ukraine'], note: 'Ukrainian perspective on Russia-Ukraine war' },
  'Moscow Times': { risk: 'medium', knownBiases: ['Anti-Kremlin'], note: 'Independent, critical of Russian government' },

  // Low risk - Independent with editorial standards (explicit)
  'Reuters': { risk: 'low', note: 'Wire service, strict editorial standards' },
  'AP News': { risk: 'low', note: 'Wire service, nonprofit cooperative' },
  'AFP': { risk: 'low', note: 'Wire service, editorially independent' },
  'BBC World': { risk: 'low', note: 'Public broadcaster, editorial independence charter' },
  'BBC Middle East': { risk: 'low', note: 'Public broadcaster, editorial independence charter' },
  'Guardian World': { risk: 'low', knownBiases: ['Center-left'], note: 'Scott Trust ownership, no shareholders' },
  'Financial Times': { risk: 'low', note: 'Business focus, Nikkei-owned' },
  'Bellingcat': { risk: 'low', note: 'Open-source investigations, methodology transparent' },
  'Brasil Paralelo': { risk: 'low', note: 'Independent media company: no political ties, no public funding, 100% subscriber-funded.' },
};

export function getSourcePropagandaRisk(sourceName: string): SourceRiskProfile {
  return SOURCE_PROPAGANDA_RISK[sourceName] ?? { risk: 'low' };
}

export function isStateAffiliatedSource(sourceName: string): boolean {
  const profile = SOURCE_PROPAGANDA_RISK[sourceName];
  return !!profile?.stateAffiliated;
}

let _sourcePanelMap: Map<string, string> | null = null;
export function getSourcePanelId(sourceName: string): string {
  if (!_sourcePanelMap) {
    _sourcePanelMap = new Map();
    for (const [category, feeds] of Object.entries(FEEDS)) {
      for (const feed of feeds) _sourcePanelMap.set(feed.name, category);
    }
    for (const feed of INTEL_SOURCES) _sourcePanelMap.set(feed.name, 'intel');
  }
  return _sourcePanelMap.get(sourceName) ?? 'politics';
}

const FULL_FEEDS: Record<string, Feed[]> = {
  politics: [
    { name: 'BBC World', url: rss('https://feeds.bbci.co.uk/news/world/rss.xml') },
    { name: 'Guardian World', url: rss('https://www.theguardian.com/world/rss') },
    { name: 'AP News', url: rss('https://news.google.com/rss/search?q=site:apnews.com&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters World', url: rss('https://news.google.com/rss/search?q=site:reuters.com+world&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CNN World', url: rss('https://news.google.com/rss/search?q=site:cnn.com+world+news+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  us: [
    { name: 'Reuters US', url: rss('https://news.google.com/rss/search?q=site:reuters.com+US&hl=en-US&gl=US&ceid=US:en') },
    { name: 'NPR News', url: rss('https://feeds.npr.org/1001/rss.xml') },
    { name: 'PBS NewsHour', url: rss('https://www.pbs.org/newshour/feeds/rss/headlines') },
    { name: 'ABC News', url: rss('https://feeds.abcnews.com/abcnews/topstories') },
    { name: 'CBS News', url: rss('https://www.cbsnews.com/latest/rss/main') },
    { name: 'NBC News', url: rss('https://feeds.nbcnews.com/nbcnews/public/news') },
    { name: 'Wall Street Journal', url: rss('https://feeds.content.dowjones.io/public/rss/RSSUSnews') },
    { name: 'Politico', url: rss('https://rss.politico.com/politics-news.xml') },
    { name: 'The Hill', url: rss('https://thehill.com/news/feed') },
    { name: 'Axios', url: rss('https://api.axios.com/feed/') },
    { name: 'Fox News', url: rss('https://moxie.foxnews.com/google-publisher/us.xml') },
  ],
  europe: [
    {
      name: 'France 24',
      url: {
        en: rss('https://www.france24.com/en/rss'),
        fr: rss('https://www.france24.com/fr/rss'),
        es: rss('https://www.france24.com/es/rss'),
        ar: rss('https://www.france24.com/ar/rss')
      }
    },
    {
      name: 'EuroNews',
      url: {
        en: rss('https://www.euronews.com/rss?format=xml'),
        fr: rss('https://fr.euronews.com/rss?format=xml'),
        de: rss('https://de.euronews.com/rss?format=xml'),
        it: rss('https://it.euronews.com/rss?format=xml'),
        es: rss('https://es.euronews.com/rss?format=xml'),
        pt: rss('https://pt.euronews.com/rss?format=xml'),
        ru: rss('https://ru.euronews.com/rss?format=xml'),
        gr: rss('https://gr.euronews.com/rss?format=xml'),
      }
    },
    {
      name: 'Le Monde',
      url: {
        en: rss('https://www.lemonde.fr/en/rss/une.xml'),
        fr: rss('https://www.lemonde.fr/rss/une.xml')
      }
    },
    { name: 'DW News', url: { en: rss('https://rss.dw.com/xml/rss-en-all'), de: rss('https://rss.dw.com/xml/rss-de-all'), es: rss('https://news.google.com/rss/search?q=site:dw.com/es&hl=es-419&gl=MX&ceid=MX:es-419') } },
    // Spanish (ES)
    { name: 'El País', url: rss('https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada'), lang: 'es' },
    { name: 'El Mundo', url: rss('https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml'), lang: 'es' },
    { name: 'BBC Mundo', url: rss('https://www.bbc.com/mundo/index.xml'), lang: 'es' },
    // German (DE)
    { name: 'Tagesschau', url: rss('https://www.tagesschau.de/xml/rss2/'), lang: 'de' },
    { name: 'Bild', url: rss('https://www.bild.de/feed/alles.xml'), lang: 'de' },
    { name: 'Der Spiegel', url: rss('https://www.spiegel.de/schlagzeilen/tops/index.rss'), lang: 'de' },
    { name: 'Die Zeit', url: rss('https://newsfeed.zeit.de/index'), lang: 'de' },
    // Italian (IT)
    { name: 'ANSA', url: rss('https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml'), lang: 'it' },
    { name: 'Corriere della Sera', url: rss('https://www.corriere.it/rss/homepage.xml'), lang: 'it' },
    { name: 'Repubblica', url: rss('https://www.repubblica.it/rss/homepage/rss2.0.xml'), lang: 'it' },
    // Dutch (NL)
    { name: 'NOS Nieuws', url: rss('https://feeds.nos.nl/nosnieuwsalgemeen'), lang: 'nl' },
    { name: 'NRC', url: rss('https://www.nrc.nl/rss/'), lang: 'nl' },
    { name: 'De Telegraaf', url: rss('https://news.google.com/rss/search?q=site:telegraaf.nl+when:1d&hl=nl&gl=NL&ceid=NL:nl'), lang: 'nl' },
    // Swedish (SV)
    { name: 'SVT Nyheter', url: rss('https://www.svt.se/nyheter/rss.xml'), lang: 'sv' },
    { name: 'Dagens Nyheter', url: rss('https://www.dn.se/rss/'), lang: 'sv' },
    { name: 'Svenska Dagbladet', url: rss('https://www.svd.se/feed/articles.rss'), lang: 'sv' },
    // Turkish (TR)
    { name: 'BBC Turkce', url: rss('https://feeds.bbci.co.uk/turkce/rss.xml'), lang: 'tr' },
    { name: 'DW Turkish', url: rss('https://rss.dw.com/xml/rss-tur-all'), lang: 'tr' },
    { name: 'Hurriyet', url: rss('https://www.hurriyet.com.tr/rss/anasayfa'), lang: 'tr' },
    // Polish (PL)
    { name: 'TVN24', url: rss('https://tvn24.pl/swiat.xml'), lang: 'pl' },
    { name: 'Polsat News', url: rss('https://www.polsatnews.pl/rss/wszystkie.xml'), lang: 'pl' },
    { name: 'Rzeczpospolita', url: rss('https://www.rp.pl/rss_main'), lang: 'pl' },
    // Greek (EL)
    { name: 'Kathimerini', url: rss('https://news.google.com/rss/search?q=site:kathimerini.gr+when:2d&hl=el&gl=GR&ceid=GR:el'), lang: 'el' },
    { name: 'Naftemporiki', url: rss('https://www.naftemporiki.gr/feed/'), lang: 'el' },
    { name: 'in.gr', url: rss('https://www.in.gr/feed/'), lang: 'el' },
    { name: 'iefimerida', url: rss('https://www.iefimerida.gr/rss.xml'), lang: 'el' },
    { name: 'Proto Thema', url: rss('https://news.google.com/rss/search?q=site:protothema.gr+when:2d&hl=el&gl=GR&ceid=GR:el'), lang: 'el' },
    // Russia & Ukraine (independent sources)
    { name: 'BBC Russian', url: rss('https://feeds.bbci.co.uk/russian/rss.xml'), lang: 'ru' },
    { name: 'Meduza', url: rss('https://meduza.io/rss/all'), lang: 'ru' },
    { name: 'Novaya Gazeta Europe', url: rss('https://novayagazeta.eu/feed/rss'), lang: 'ru' },
    { name: 'TASS', url: rss('https://news.google.com/rss/search?q=site:tass.com+OR+TASS+Russia+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'RT', url: rss('https://www.rt.com/rss/') },
    { name: 'RT Russia', url: rss('https://www.rt.com/rss/russia/') },
    { name: 'Kyiv Independent', url: rss('https://news.google.com/rss/search?q=site:kyivindependent.com+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Moscow Times', url: rss('https://www.themoscowtimes.com/rss/news') },
  ],
  middleeast: [
    { name: 'BBC Middle East', url: rss('https://feeds.bbci.co.uk/news/world/middle_east/rss.xml') },
    { name: 'Al Jazeera', url: { en: rss('https://www.aljazeera.com/xml/rss/all.xml'), ar: rss('https://www.aljazeera.net/aljazeerarss/a7c186be-1adb-4b11-a982-4783e765316e/4e17ecdc-8fb9-40de-a5d6-d00f72384a51') } },
    // AlArabiya EN blocks cloud IPs — Google News fallback; AR RSS is direct
    { name: 'Al Arabiya', url: { en: rss('https://news.google.com/rss/search?q=site:english.alarabiya.net+when:2d&hl=en-US&gl=US&ceid=US:en'), ar: rss('https://www.alarabiya.net/tools/mrss/?cat=main') } },
    // Arab News and Times of Israel removed — 403 from cloud IPs
    { name: 'Guardian ME', url: rss('https://www.theguardian.com/world/middleeast/rss') },
    { name: 'BBC Persian', url: rss('http://feeds.bbci.co.uk/persian/tv-and-radio-37434376/rss.xml') },
    { name: 'Iran International', url: rss('https://news.google.com/rss/search?q=site:iranintl.com+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Fars News', url: rss('https://news.google.com/rss/search?q=site:farsnews.ir+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Haaretz', url: rss('https://news.google.com/rss/search?q=site:haaretz.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Arab News', url: rss('https://news.google.com/rss/search?q=site:arabnews.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'The National', url: rss('https://news.google.com/rss/search?q=site:thenationalnews.com+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Oman Observer', url: rss('https://www.omanobserver.om/rssFeed/1') },
    { name: 'Asharq Business', url: rss('https://asharqbusiness.com/rss.xml') },
    { name: 'Asharq News', url: rss('https://asharq.com/snapchat/rss.xml'), lang: 'ar' },
    { name: 'Rudaw', url: rss('https://news.google.com/rss/search?q=site:rudaw.net+when:7d&hl=en&gl=US&ceid=US:en') },
  ],
  tech: [
    { name: 'Hacker News', url: rss('https://hnrss.org/frontpage') },
    { name: 'Ars Technica', url: rss('https://feeds.arstechnica.com/arstechnica/technology-lab') },
    { name: 'The Verge', url: rss('https://www.theverge.com/rss/index.xml') },
    { name: 'MIT Tech Review', url: rss('https://www.technologyreview.com/feed/') },
  ],
  ai: [
    { name: 'AI News', url: rss('https://news.google.com/rss/search?q=(OpenAI+OR+Anthropic+OR+Google+AI+OR+"large+language+model"+OR+ChatGPT)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VentureBeat AI', url: rss('https://venturebeat.com/category/ai/feed/') },
    { name: 'The Verge AI', url: rss('https://www.theverge.com/rss/ai-artificial-intelligence/index.xml') },
    { name: 'MIT Tech Review', url: rss('https://www.technologyreview.com/topic/artificial-intelligence/feed') },
    { name: 'ArXiv AI', url: rss('https://export.arxiv.org/rss/cs.AI') },
  ],
  finance: [
    { name: 'CNBC', url: rss('https://www.cnbc.com/id/100003114/device/rss/rss.html') },
    { name: 'MarketWatch', url: rss('https://news.google.com/rss/search?q=site:marketwatch.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Yahoo Finance', url: rss('https://finance.yahoo.com/news/rssindex') },
    { name: 'Financial Times', url: rss('https://www.ft.com/rss/home') },
    { name: 'Reuters Business', url: rss('https://news.google.com/rss/search?q=site:reuters.com+business+markets&hl=en-US&gl=US&ceid=US:en') },
  ],
  gov: [
    { name: 'White House', url: rss('https://news.google.com/rss/search?q=site:whitehouse.gov&hl=en-US&gl=US&ceid=US:en') },
    { name: 'State Dept', url: rss('https://news.google.com/rss/search?q=site:state.gov+OR+"State+Department"&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Pentagon', url: rss('https://news.google.com/rss/search?q=site:defense.gov+OR+Pentagon&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Treasury', url: rss('https://news.google.com/rss/search?q=site:treasury.gov+OR+"Treasury+Department"&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DOJ', url: rss('https://news.google.com/rss/search?q=site:justice.gov+OR+"Justice+Department"+DOJ&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Federal Reserve', url: rss('https://www.federalreserve.gov/feeds/press_all.xml') },
    { name: 'SEC', url: rss('https://www.sec.gov/news/pressreleases.rss') },
    { name: 'CDC', url: rss('https://news.google.com/rss/search?q=site:cdc.gov+OR+CDC+health&hl=en-US&gl=US&ceid=US:en') },
    { name: 'FEMA', url: rss('https://news.google.com/rss/search?q=site:fema.gov+OR+FEMA+emergency&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DHS', url: rss('https://news.google.com/rss/search?q=site:dhs.gov+OR+"Homeland+Security"&hl=en-US&gl=US&ceid=US:en') },
    { name: 'UN News', url: railwayRss('https://news.un.org/feed/subscribe/en/news/all/rss.xml') },
    { name: 'CISA', url: railwayRss('https://www.cisa.gov/cybersecurity-advisories/all.xml') },
  ],
  layoffs: [
    { name: 'Layoffs.fyi', url: rss('https://news.google.com/rss/search?q=tech+company+layoffs+announced&hl=en&gl=US&ceid=US:en') },
    { name: 'TechCrunch Layoffs', url: rss('https://techcrunch.com/tag/layoffs/feed/') },
    { name: 'Layoffs News', url: rss('https://news.google.com/rss/search?q=(layoffs+OR+"job+cuts"+OR+"workforce+reduction")+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  thinktanks: [
    { name: 'Foreign Policy', url: rss('https://foreignpolicy.com/feed/') },
    { name: 'Atlantic Council', url: railwayRss('https://www.atlanticcouncil.org/feed/') },
    { name: 'Foreign Affairs', url: rss('https://www.foreignaffairs.com/rss.xml') },
    { name: 'CSIS', url: rss('https://news.google.com/rss/search?q=site:csis.org+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'RAND', url: rss('https://www.rand.org/pubs/articles.xml') },
    { name: 'Brookings', url: rss('https://news.google.com/rss/search?q=site:brookings.edu+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Carnegie', url: rss('https://news.google.com/rss/search?q=site:carnegieendowment.org+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // New verified think tank feeds
    // War on the Rocks - Defense and national security analysis
    { name: 'War on the Rocks', url: rss('https://warontherocks.com/feed') },
    // Responsible Statecraft - Foreign policy analysis (Quincy Institute)
    { name: 'Responsible Statecraft', url: rss('https://responsiblestatecraft.org/feed/') },
    // RUSI - Royal United Services Institute (UK defense & security)
    { name: 'RUSI', url: rss('https://news.google.com/rss/search?q=site:rusi.org+when:3d&hl=en-US&gl=US&ceid=US:en') },
    // FPRI - Foreign Policy Research Institute (US foreign policy)
    { name: 'FPRI', url: rss('https://www.fpri.org/feed/') },
    // Jamestown Foundation - Eurasia/China/Terrorism analysis
    { name: 'Jamestown', url: rss('https://jamestown.org/feed/') },
  ],
  crisis: [
    { name: 'CrisisWatch', url: rss('https://www.crisisgroup.org/rss') },
    { name: 'IAEA', url: rss('https://www.iaea.org/feeds/topnews') },
    { name: 'WHO', url: rss('https://www.who.int/rss-feeds/news-english.xml') },
    { name: 'UNHCR', url: rss('https://news.google.com/rss/search?q=site:unhcr.org+OR+UNHCR+refugees+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  africa: [
    { name: 'Africa News', url: rss('https://news.google.com/rss/search?q=(Africa+OR+Nigeria+OR+Kenya+OR+"South+Africa"+OR+Ethiopia)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Sahel Crisis', url: rss('https://news.google.com/rss/search?q=(Sahel+OR+Mali+OR+Niger+OR+"Burkina+Faso"+OR+Wagner)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'News24', url: rss('https://feeds.news24.com/articles/news24/TopStories/rss') },
    { name: 'BBC Africa', url: rss('https://feeds.bbci.co.uk/news/world/africa/rss.xml') },
    { name: 'Jeune Afrique', url: rss('https://www.jeuneafrique.com/feed/'), lang: 'fr' },
    { name: 'Africanews', url: { en: rss('https://www.africanews.com/feed/rss'), fr: rss('https://fr.africanews.com/feed/rss') } },
    { name: 'BBC Afrique', url: rss('https://www.bbc.com/afrique/index.xml'), lang: 'fr' },
    // Nigeria
    { name: 'Premium Times', url: rss('https://www.premiumtimesng.com/feed') },
    { name: 'Vanguard Nigeria', url: rss('https://www.vanguardngr.com/feed/') },
    { name: 'Channels TV', url: rss('https://www.channelstv.com/feed/') },
    { name: 'Daily Trust', url: rss('https://dailytrust.com/feed/') },
    { name: 'ThisDay', url: rss('https://www.thisdaylive.com/feed') },
  ],
  latam: [
    { name: 'Latin America', url: rss('https://news.google.com/rss/search?q=(Brazil+OR+Mexico+OR+Argentina+OR+Venezuela+OR+Colombia)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BBC Latin America', url: rss('https://feeds.bbci.co.uk/news/world/latin_america/rss.xml') },
    { name: 'Reuters LatAm', url: rss('https://news.google.com/rss/search?q=site:reuters.com+(Brazil+OR+Mexico+OR+Argentina)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Guardian Americas', url: rss('https://www.theguardian.com/world/americas/rss') },
    // Localized Feeds
    { name: 'Clarín', url: rss('https://www.clarin.com/rss/lo-ultimo/'), lang: 'es' },
    { name: 'O Globo', url: rss('https://news.google.com/rss/search?q=site:oglobo.globo.com+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419'), lang: 'pt' },
    { name: 'Folha de S.Paulo', url: rss('https://feeds.folha.uol.com.br/emcimadahora/rss091.xml'), lang: 'pt' },
    { name: 'Brasil Paralelo', url: rss('https://www.brasilparalelo.com.br/noticias/rss.xml'), lang: 'pt' },
    { name: 'El Tiempo', url: rss('https://www.eltiempo.com/rss/mundo_latinoamerica.xml'), lang: 'es' },
    { name: 'La Silla Vacía', url: rss('https://www.lasillavacia.com/rss') },
    { name: 'Primicias', url: rss('https://www.primicias.ec/feed/'), lang: 'es' },
    { name: 'Infobae Americas', url: rss('https://www.infobae.com/arc/outboundfeeds/rss/'), lang: 'es' },
    { name: 'El Universo', url: rss('https://www.eluniverso.com/arc/outboundfeeds/rss/category/noticias/?outputType=xml'), lang: 'es' },
    // Mexico
    { name: 'Mexico News Daily', url: rss('https://mexiconewsdaily.com/feed/') },
    { name: 'Mexico Security', url: rss('https://news.google.com/rss/search?q=(Mexico+cartel+OR+Mexico+violence+OR+Mexico+troops+OR+narco+Mexico)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AP Mexico', url: rss('https://news.google.com/rss/search?q=site:apnews.com+Mexico+when:3d&hl=en-US&gl=US&ceid=US:en') },
    // LatAm Security
    { name: 'InSight Crime', url: rss('https://insightcrime.org/feed/') },
    { name: 'France 24 LatAm', url: rss('https://www.france24.com/en/americas/rss') },
  ],
  asia: [
    { name: 'Asia News', url: rss('https://news.google.com/rss/search?q=(China+OR+Japan+OR+Korea+OR+India+OR+ASEAN)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BBC Asia', url: rss('https://feeds.bbci.co.uk/news/world/asia/rss.xml') },
    { name: 'The Diplomat', url: rss('https://thediplomat.com/feed/') },
    { name: 'South China Morning Post', url: railwayRss('https://www.scmp.com/rss/91/feed/') },
    { name: 'Reuters Asia', url: rss('https://news.google.com/rss/search?q=site:reuters.com+(China+OR+Japan+OR+Taiwan+OR+Korea)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Xinhua', url: rss('https://news.google.com/rss/search?q=site:xinhuanet.com+OR+Xinhua+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Today', url: rss('https://japantoday.com/feed/atom') },
    { name: 'Nikkei Asia', url: rss('https://news.google.com/rss/search?q=site:asia.nikkei.com+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Asahi Shimbun', url: rss('https://www.asahi.com/rss/asahi/newsheadlines.rdf'), lang: 'ja' },
    { name: 'The Hindu', url: rss('https://www.thehindu.com/news/national/feeder/default.rss'), lang: 'en' },
    { name: 'Indian Express', url: rss('https://indianexpress.com/section/india/feed/') },
    { name: 'NDTV', url: rss('https://feeds.feedburner.com/ndtvnews-top-stories') },
    { name: 'India News Network', url: rss('https://news.google.com/rss/search?q=India+diplomacy+foreign+policy+news&hl=en&gl=US&ceid=US:en') },
    { name: 'CNA', url: rss('https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml') },
    { name: 'MIIT (China)', url: rss('https://news.google.com/rss/search?q=site:miit.gov.cn+when:7d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans'), lang: 'zh' },
    { name: 'MOFCOM (China)', url: rss('https://news.google.com/rss/search?q=site:mofcom.gov.cn+when:7d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans'), lang: 'zh' },
    // Thailand
    { name: 'Bangkok Post', url: rss('https://news.google.com/rss/search?q=site:bangkokpost.com+when:1d&hl=en-US&gl=US&ceid=US:en'), lang: 'th' },
    { name: 'Thai PBS', url: rss('https://news.google.com/rss/search?q=Thai+PBS+World+news&hl=en&gl=US&ceid=US:en'), lang: 'th' },
    // Vietnam
    { name: 'VnExpress', url: rss('https://vnexpress.net/rss/tin-moi-nhat.rss'), lang: 'vi' },
    { name: 'Tuoi Tre News', url: rss('https://tuoitrenews.vn/rss'), lang: 'vi' },
    // Korea
    { name: 'Yonhap News', url: rss('https://www.yonhapnewstv.co.kr/browse/feed/'), lang: 'ko' },
    { name: 'Chosun Ilbo', url: rss('https://www.chosun.com/arc/outboundfeeds/rss/?outputType=xml'), lang: 'ko' },
    // Australia
    { name: 'ABC News Australia', url: rss('https://www.abc.net.au/news/feed/2942460/rss.xml') },
    { name: 'Guardian Australia', url: rss('https://www.theguardian.com/australia-news/rss') },
    // Pacific Islands
    { name: 'Island Times (Palau)', url: rss('https://islandtimes.org/feed/') },
  ],
  energy: [
    { name: 'Oil & Gas', url: rss('https://news.google.com/rss/search?q=(oil+price+OR+OPEC+OR+"natural+gas"+OR+pipeline+OR+LNG)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nuclear Energy', url: rss('https://news.google.com/rss/search?q=("nuclear+energy"+OR+"nuclear+power"+OR+uranium+OR+IAEA)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters Energy', url: rss('https://news.google.com/rss/search?q=site:reuters.com+(oil+OR+gas+OR+energy+OR+OPEC)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Mining & Resources', url: rss('https://news.google.com/rss/search?q=(lithium+OR+"rare+earth"+OR+cobalt+OR+mining)+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// Tech/AI variant feeds
const TECH_FEEDS: Record<string, Feed[]> = {
  tech: [
    { name: 'TechCrunch', url: rss('https://techcrunch.com/feed/') },
    { name: 'The Verge', url: rss('https://www.theverge.com/rss/index.xml') },
    { name: 'Ars Technica', url: rss('https://feeds.arstechnica.com/arstechnica/technology-lab') },
    { name: 'Hacker News', url: rss('https://hnrss.org/frontpage') },
    { name: 'MIT Tech Review', url: rss('https://www.technologyreview.com/feed/') },
    { name: 'ZDNet', url: rss('https://www.zdnet.com/news/rss.xml') },
    { name: 'TechMeme', url: rss('https://www.techmeme.com/feed.xml') },
    { name: 'Engadget', url: rss('https://www.engadget.com/rss.xml') },
    { name: 'Fast Company', url: rss('https://feeds.feedburner.com/fastcompany/headlines') },
  ],
  ai: [
    { name: 'AI News', url: rss('https://news.google.com/rss/search?q=(OpenAI+OR+Anthropic+OR+Google+AI+OR+"large+language+model"+OR+ChatGPT+OR+Claude+OR+"AI+model")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VentureBeat AI', url: rss('https://venturebeat.com/category/ai/feed/') },
    { name: 'The Verge AI', url: rss('https://www.theverge.com/rss/ai-artificial-intelligence/index.xml') },
    { name: 'MIT Tech Review AI', url: rss('https://www.technologyreview.com/topic/artificial-intelligence/feed') },
    { name: 'MIT Research', url: rss('https://news.mit.edu/rss/research') },
    { name: 'ArXiv AI', url: rss('https://export.arxiv.org/rss/cs.AI') },
    { name: 'ArXiv ML', url: rss('https://export.arxiv.org/rss/cs.LG') },
    { name: 'AI Weekly', url: rss('https://news.google.com/rss/search?q="artificial+intelligence"+OR+"machine+learning"+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Anthropic News', url: rss('https://news.google.com/rss/search?q=Anthropic+Claude+AI+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'OpenAI News', url: rss('https://news.google.com/rss/search?q=OpenAI+ChatGPT+GPT-4+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  startups: [
    { name: 'TechCrunch Startups', url: rss('https://techcrunch.com/category/startups/feed/') },
    { name: 'VentureBeat', url: rss('https://venturebeat.com/feed/') },
    { name: 'Crunchbase News', url: rss('https://news.crunchbase.com/feed/') },
    { name: 'SaaStr', url: rss('https://www.saastr.com/feed/') },
    { name: 'AngelList News', url: rss('https://news.google.com/rss/search?q=site:angellist.com+OR+"AngelList"+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TechCrunch Venture', url: rss('https://techcrunch.com/category/venture/feed/') },
    { name: 'The Information', url: rss('https://news.google.com/rss/search?q=site:theinformation.com+startup+OR+funding+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Fortune Term Sheet', url: rss('https://news.google.com/rss/search?q="Term+Sheet"+venture+capital+OR+startup+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'PitchBook News', url: rss('https://news.google.com/rss/search?q=site:pitchbook.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CB Insights', url: rss('https://www.cbinsights.com/research/feed/') },
  ],
  vcblogs: [
    { name: 'Y Combinator Blog', url: rss('https://www.ycombinator.com/blog/rss/') },
    { name: 'a16z Blog', url: rss('https://news.google.com/rss/search?q=site:a16z.com+OR+"Andreessen+Horowitz"+blog+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Sequoia Blog', url: rss('https://news.google.com/rss/search?q=site:sequoiacap.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Paul Graham Essays', url: rss('https://news.google.com/rss/search?q="Paul+Graham"+essay+OR+blog+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VC Insights', url: rss('https://news.google.com/rss/search?q=("venture+capital"+insights+OR+"VC+trends"+OR+"startup+advice")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Lenny\'s Newsletter', url: rss('https://www.lennysnewsletter.com/feed') },
    { name: 'Stratechery', url: rss('https://stratechery.com/feed/') },
    { name: 'FwdStart Newsletter', url: '/api/fwdstart' },
  ],
  regionalStartups: [
    // Europe
    { name: 'EU Startups', url: rss('https://news.google.com/rss/search?q=site:eu-startups.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tech.eu', url: rss('https://tech.eu/feed/') },
    { name: 'Sifted (Europe)', url: rss('https://sifted.eu/feed') },
    { name: 'The Next Web', url: rss('https://news.google.com/rss/search?q=site:thenextweb.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Asia - General
    { name: 'Tech in Asia', url: rss('https://news.google.com/rss/search?q=site:techinasia.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'KrASIA', url: rss('https://news.google.com/rss/search?q=site:kr-asia.com+OR+KrASIA+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'SEA Startups', url: rss('https://news.google.com/rss/search?q=(Singapore+OR+Indonesia+OR+Vietnam+OR+Thailand+OR+Malaysia)+startup+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Asia VC News', url: rss('https://news.google.com/rss/search?q=("Southeast+Asia"+OR+ASEAN)+venture+capital+OR+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // China
    { name: 'China Startups', url: rss('https://news.google.com/rss/search?q=China+startup+funding+OR+"Chinese+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: '36Kr English', url: rss('https://news.google.com/rss/search?q=site:36kr.com+OR+"36Kr"+startup+china+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'China Tech Giants', url: rss('https://news.google.com/rss/search?q=(Alibaba+OR+Tencent+OR+ByteDance+OR+Baidu+OR+JD.com+OR+Xiaomi+OR+Huawei)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    // Japan
    { name: 'Japan Startups', url: rss('https://news.google.com/rss/search?q=Japan+startup+funding+OR+"Japanese+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Tech News', url: rss('https://news.google.com/rss/search?q=(Japan+startup+OR+Japan+tech+OR+SoftBank+OR+Rakuten+OR+Sony)+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nikkei Tech', url: rss('https://news.google.com/rss/search?q=site:asia.nikkei.com+technology+when:3d&hl=en-US&gl=US&ceid=US:en') },
    // Korea
    { name: 'Korea Tech News', url: rss('https://news.google.com/rss/search?q=(Korea+startup+OR+Korean+tech+OR+Samsung+OR+Kakao+OR+Naver+OR+Coupang)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Korea Startups', url: rss('https://news.google.com/rss/search?q=Korea+startup+funding+OR+"Korean+unicorn"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // India
    { name: 'Inc42 (India)', url: rss('https://inc42.com/feed/') },
    { name: 'YourStory', url: rss('https://yourstory.com/feed') },
    { name: 'India Startups', url: rss('https://news.google.com/rss/search?q=India+startup+funding+OR+"Indian+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'India Tech News', url: rss('https://news.google.com/rss/search?q=(Flipkart+OR+Razorpay+OR+Zerodha+OR+Zomato+OR+Paytm+OR+PhonePe)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Southeast Asia
    { name: 'SEA Tech News', url: rss('https://news.google.com/rss/search?q=(Grab+OR+GoTo+OR+Sea+Limited+OR+Shopee+OR+Tokopedia)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Vietnam Tech', url: rss('https://news.google.com/rss/search?q=Vietnam+startup+OR+Vietnam+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Indonesia Tech', url: rss('https://news.google.com/rss/search?q=Indonesia+startup+OR+Indonesia+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Taiwan
    { name: 'Taiwan Tech', url: rss('https://news.google.com/rss/search?q=(Taiwan+startup+OR+TSMC+OR+MediaTek+OR+Foxconn)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Latin America
    { name: 'LAVCA (LATAM)', url: rss('https://news.google.com/rss/search?q=site:lavca.org+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'LATAM Startups', url: rss('https://news.google.com/rss/search?q=("Latin+America"+startup+OR+LATAM+funding)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startups LATAM', url: rss('https://news.google.com/rss/search?q=(startup+Brazil+OR+startup+Mexico+OR+startup+Argentina+OR+startup+Colombia+OR+startup+Chile)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Brazil Tech', url: rss('https://news.google.com/rss/search?q=(Nubank+OR+iFood+OR+Mercado+Libre+OR+Rappi+OR+VTEX)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'FinTech LATAM', url: rss('https://news.google.com/rss/search?q=fintech+(Brazil+OR+Mexico+OR+Argentina+OR+"Latin+America")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Africa
    { name: 'TechCabal (Africa)', url: rss('https://techcabal.com/feed/') },
    { name: 'Africa Startups', url: rss('https://news.google.com/rss/search?q=Africa+startup+funding+OR+"African+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Africa Tech News', url: rss('https://news.google.com/rss/search?q=(Flutterwave+OR+Paystack+OR+Jumia+OR+Andela+OR+"Africa+startup")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Middle East
    { name: 'MENA Startups', url: rss('https://news.google.com/rss/search?q=(MENA+startup+OR+"Middle+East"+funding+OR+Gulf+startup)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MENA Tech News', url: rss('https://news.google.com/rss/search?q=(UAE+startup+OR+Saudi+tech+OR+Dubai+startup+OR+NEOM+tech)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  github: [
    { name: 'GitHub Blog', url: rss('https://github.blog/feed/') },
    { name: 'GitHub Trending', url: rss('https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml') },
    { name: 'Show HN', url: rss('https://hnrss.org/show') },
    { name: 'YC Launches', url: rss('https://news.google.com/rss/search?q=("Y+Combinator"+OR+"YC+launch"+OR+"YC+W25"+OR+"YC+S25")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Dev Events', url: rss('https://news.google.com/rss/search?q=("developer+conference"+OR+"tech+summit"+OR+"devcon"+OR+"developer+event")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Open Source News', url: rss('https://news.google.com/rss/search?q="open+source"+project+release+OR+launch+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  ipo: [
    { name: 'IPO News', url: rss('https://news.google.com/rss/search?q=(IPO+OR+"initial+public+offering"+OR+SPAC)+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Renaissance IPO', url: rss('https://news.google.com/rss/search?q=site:renaissancecapital.com+IPO+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tech IPO News', url: rss('https://news.google.com/rss/search?q=tech+IPO+OR+"tech+company"+IPO+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  funding: [
    { name: 'SEC Filings', url: rss('https://news.google.com/rss/search?q=(S-1+OR+"IPO+filing"+OR+"SEC+filing")+startup+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VC News', url: rss('https://news.google.com/rss/search?q=("Series+A"+OR+"Series+B"+OR+"Series+C"+OR+"funding+round"+OR+"venture+capital")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Seed & Pre-Seed', url: rss('https://news.google.com/rss/search?q=("seed+round"+OR+"pre-seed"+OR+"angel+round"+OR+"seed+funding")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startup Funding', url: rss('https://news.google.com/rss/search?q=("startup+funding"+OR+"raised+funding"+OR+"raised+$"+OR+"funding+announced")+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  producthunt: [
    { name: 'Product Hunt', url: rss('https://www.producthunt.com/feed') },
  ],
  outages: [
    { name: 'AWS Status', url: rss('https://news.google.com/rss/search?q=AWS+outage+OR+"Amazon+Web+Services"+down+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Cloud Outages', url: rss('https://news.google.com/rss/search?q=(Azure+OR+GCP+OR+Cloudflare+OR+Slack+OR+GitHub)+outage+OR+down+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  security: [
    { name: 'Krebs Security', url: rss('https://krebsonsecurity.com/feed/') },
    { name: 'The Hacker News', url: rss('https://feeds.feedburner.com/TheHackersNews') },
    { name: 'Dark Reading', url: rss('https://www.darkreading.com/rss.xml') },
    { name: 'Schneier', url: rss('https://www.schneier.com/feed/') },
  ],
  policy: [
    // US Policy
    { name: 'Politico Tech', url: rss('https://rss.politico.com/technology.xml') },
    { name: 'AI Regulation', url: rss('https://news.google.com/rss/search?q=AI+regulation+OR+"artificial+intelligence"+law+OR+policy+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tech Antitrust', url: rss('https://news.google.com/rss/search?q=tech+antitrust+OR+FTC+Google+OR+FTC+Apple+OR+FTC+Amazon+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EFF News', url: rss('https://news.google.com/rss/search?q=site:eff.org+OR+"Electronic+Frontier+Foundation"+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // EU Digital Policy
    { name: 'EU Digital Policy', url: rss('https://news.google.com/rss/search?q=("Digital+Services+Act"+OR+"Digital+Markets+Act"+OR+"EU+AI+Act"+OR+"GDPR")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Euractiv Digital', url: rss('https://news.google.com/rss/search?q=site:euractiv.com+digital+OR+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EU Commission Digital', url: rss('https://news.google.com/rss/search?q=site:ec.europa.eu+digital+OR+technology+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // China Tech Policy
    { name: 'China Tech Policy', url: rss('https://news.google.com/rss/search?q=(China+tech+regulation+OR+China+AI+policy+OR+MIIT+technology)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // UK Policy
    { name: 'UK Tech Policy', url: rss('https://news.google.com/rss/search?q=(UK+AI+safety+OR+"Online+Safety+Bill"+OR+UK+tech+regulation)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // India Policy
    { name: 'India Tech Policy', url: rss('https://news.google.com/rss/search?q=(India+tech+regulation+OR+India+data+protection+OR+India+AI+policy)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  thinktanks: [
    // US Think Tanks
    { name: 'Brookings Tech', url: rss('https://news.google.com/rss/search?q=site:brookings.edu+technology+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CSIS Tech', url: rss('https://news.google.com/rss/search?q=site:csis.org+technology+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MIT Tech Policy', url: rss('https://news.google.com/rss/search?q=%22Tech+Policy+Press%22&hl=en&gl=US&ceid=US:en') },
    { name: 'Stanford HAI', url: rss('https://news.google.com/rss/search?q=site:hai.stanford.edu+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Now Institute', url: rss('https://news.google.com/rss/search?q=%22AI+Now+Institute%22&hl=en&gl=US&ceid=US:en') },
    // Europe Think Tanks
    { name: 'OECD Digital', url: rss('https://news.google.com/rss/search?q=site:oecd.org+digital+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EU Tech Policy', url: rss('https://news.google.com/rss/search?q=("EU+tech+policy"+OR+"European+digital"+OR+Bruegel+tech)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Chatham House Tech', url: rss('https://news.google.com/rss/search?q=site:chathamhouse.org+technology+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // Asia Think Tanks
    { name: 'ISEAS (Singapore)', url: rss('https://news.google.com/rss/search?q=site:iseas.edu.sg+technology+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'ORF Tech (India)', url: rss('https://news.google.com/rss/search?q=(India+tech+policy+OR+ORF+technology+OR+"Observer+Research+Foundation"+tech)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'RIETI (Japan)', url: rss('https://news.google.com/rss/search?q=site:rieti.go.jp+technology+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Asia Pacific Tech', url: rss('https://news.google.com/rss/search?q=("Asia+Pacific"+tech+policy+OR+"Lowy+Institute"+technology)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // China Research (External Views)
    { name: 'China Tech Analysis', url: rss('https://news.google.com/rss/search?q=("China+tech+strategy"+OR+"Chinese+AI"+OR+"China+semiconductor")+analysis+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DigiChina', url: rss('https://news.google.com/rss/search?q=DigiChina+Stanford+China+technology&hl=en&gl=US&ceid=US:en') },
  ],
  finance: [
    { name: 'CNBC Tech', url: rss('https://www.cnbc.com/id/19854910/device/rss/rss.html') },
    { name: 'MarketWatch Tech', url: rss('https://news.google.com/rss/search?q=site:marketwatch.com+technology+markets+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Yahoo Finance', url: rss('https://finance.yahoo.com/rss/topstories') },
    { name: 'Seeking Alpha Tech', url: rss('https://seekingalpha.com/market_currents.xml') },
  ],
  hardware: [
    { name: "Tom's Hardware", url: rss('https://www.tomshardware.com/feeds/all') },
    { name: 'SemiAnalysis', url: rss('https://news.google.com/rss/search?q=site:semianalysis.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Semiconductor News', url: rss('https://news.google.com/rss/search?q=semiconductor+OR+chip+OR+TSMC+OR+NVIDIA+OR+Intel+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  cloud: [
    { name: 'InfoQ', url: rss('https://feed.infoq.com/') },
    { name: 'The New Stack', url: rss('https://thenewstack.io/feed/') },
    { name: 'DevOps.com', url: rss('https://devops.com/feed/') },
  ],
  dev: [
    { name: 'Dev.to', url: rss('https://dev.to/feed') },
    { name: 'Lobsters', url: rss('https://lobste.rs/rss') },
    { name: 'Changelog', url: rss('https://changelog.com/feed') },
  ],
  layoffs: [
    { name: 'Layoffs.fyi', url: rss('https://news.google.com/rss/search?q=tech+layoffs+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TechCrunch Layoffs', url: rss('https://techcrunch.com/tag/layoffs/feed/') },
  ],
  unicorns: [
    { name: 'Unicorn News', url: rss('https://news.google.com/rss/search?q=("unicorn+startup"+OR+"unicorn+valuation"+OR+"$1+billion+valuation")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CB Insights Unicorn', url: rss('https://news.google.com/rss/search?q=site:cbinsights.com+unicorn+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Decacorn News', url: rss('https://news.google.com/rss/search?q=("decacorn"+OR+"$10+billion+valuation"+OR+"$10B+valuation")+startup+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'New Unicorns', url: rss('https://news.google.com/rss/search?q=("becomes+unicorn"+OR+"joins+unicorn"+OR+"reaches+unicorn"+OR+"achieved+unicorn")+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
  accelerators: [
    { name: 'Techstars News', url: rss('https://news.google.com/rss/search?q=Techstars+accelerator+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: '500 Global News', url: rss('https://news.google.com/rss/search?q="500+Global"+OR+"500+Startups"+accelerator+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Demo Day News', url: rss('https://news.google.com/rss/search?q=("demo+day"+OR+"YC+batch"+OR+"accelerator+batch")+startup+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startup School', url: rss('https://news.google.com/rss/search?q="Startup+School"+OR+"YC+Startup+School"+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
  podcasts: [
    // Tech Podcast Episodes (via Google News - podcast hosts block RSS proxies)
    { name: 'Acquired Episodes', url: rss('https://news.google.com/rss/search?q="Acquired+podcast"+episode+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'All-In Podcast', url: rss('https://news.google.com/rss/search?q="All-In+podcast"+(Chamath+OR+Sacks+OR+Friedberg)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'a16z Insights', url: rss('https://news.google.com/rss/search?q=("a16z"+OR+"Andreessen+Horowitz")+podcast+OR+interview+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TWIST Episodes', url: rss('https://news.google.com/rss/search?q="This+Week+in+Startups"+Jason+Calacanis+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: '20VC Episodes', url: rss('https://rss.libsyn.com/shows/61840/destinations/240976.xml') },
    { name: 'Lex Fridman Tech', url: rss('https://news.google.com/rss/search?q=("Lex+Fridman"+interview)+(AI+OR+tech+OR+startup+OR+CEO)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Tech Media Shows
    { name: 'Verge Shows', url: rss('https://news.google.com/rss/search?q=("Vergecast"+OR+"Decoder+podcast"+Verge)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Hard Fork (NYT)', url: rss('https://news.google.com/rss/search?q="Hard+Fork"+podcast+NYT+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Pivot Podcast', url: rss('https://feeds.megaphone.fm/pivot') },
    // Newsletters
    { name: 'Tech Newsletters', url: rss('https://news.google.com/rss/search?q=("Benedict+Evans"+OR+"Pragmatic+Engineer"+OR+Stratechery)+tech+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // AI Podcasts & Shows
    { name: 'AI Podcasts', url: rss('https://news.google.com/rss/search?q=("AI+podcast"+OR+"artificial+intelligence+podcast")+episode+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Interviews', url: rss('https://news.google.com/rss/search?q=(NVIDIA+OR+OpenAI+OR+Anthropic+OR+DeepMind)+interview+OR+podcast+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // Startup Shows
    { name: 'How I Built This', url: rss('https://news.google.com/rss/search?q="How+I+Built+This"+Guy+Raz+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Masters of Scale', url: rss('https://rss.art19.com/masters-of-scale') },
  ],
};

// Finance/Trading variant feeds (all free RSS / Google News proxies)
const FINANCE_FEEDS: Record<string, Feed[]> = {
  markets: [
    { name: 'CNBC', url: rss('https://www.cnbc.com/id/100003114/device/rss/rss.html') },
    // Direct MarketWatch RSS returns frequent 403s from cloud IPs; use Google News fallback.
    { name: 'MarketWatch', url: rss('https://news.google.com/rss/search?q=site:marketwatch.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Yahoo Finance', url: rss('https://finance.yahoo.com/rss/topstories') },
    { name: 'Seeking Alpha', url: rss('https://seekingalpha.com/market_currents.xml') },
    { name: 'Reuters Markets', url: rss('https://news.google.com/rss/search?q=site:reuters.com+markets+stocks+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Bloomberg Markets', url: rss('https://news.google.com/rss/search?q=site:bloomberg.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Investing.com News', url: rss('https://news.google.com/rss/search?q=site:investing.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  forex: [
    { name: 'Forex News', url: rss('https://news.google.com/rss/search?q=("forex"+OR+"currency"+OR+"FX+market")+trading+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Dollar Watch', url: rss('https://news.google.com/rss/search?q=("dollar+index"+OR+DXY+OR+"US+dollar"+OR+"euro+dollar")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Central Bank Rates', url: rss('https://news.google.com/rss/search?q=("central+bank"+OR+"interest+rate"+OR+"rate+decision"+OR+"monetary+policy")+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  bonds: [
    { name: 'Bond Market', url: rss('https://news.google.com/rss/search?q=("bond+market"+OR+"treasury+yields"+OR+"bond+yields"+OR+"fixed+income")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Treasury Watch', url: rss('https://news.google.com/rss/search?q=("US+Treasury"+OR+"Treasury+auction"+OR+"10-year+yield"+OR+"2-year+yield")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Corporate Bonds', url: rss('https://news.google.com/rss/search?q=("corporate+bond"+OR+"high+yield"+OR+"investment+grade"+OR+"credit+spread")+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  commodities: [
    { name: 'Oil & Gas', url: rss('https://news.google.com/rss/search?q=(oil+price+OR+OPEC+OR+"natural+gas"+OR+"crude+oil"+OR+WTI+OR+Brent)+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gold & Metals', url: rss('https://news.google.com/rss/search?q=(gold+price+OR+silver+price+OR+copper+OR+platinum+OR+"precious+metals")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Agriculture', url: rss('https://news.google.com/rss/search?q=(wheat+OR+corn+OR+soybeans+OR+coffee+OR+sugar)+price+OR+commodity+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Commodity Trading', url: rss('https://news.google.com/rss/search?q=("commodity+trading"+OR+"futures+market"+OR+CME+OR+NYMEX+OR+COMEX)+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  crypto: [
    { name: 'CoinDesk', url: rss('https://www.coindesk.com/arc/outboundfeeds/rss/') },
    { name: 'Cointelegraph', url: rss('https://cointelegraph.com/rss') },
    { name: 'The Block', url: rss('https://news.google.com/rss/search?q=site:theblock.co+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Crypto News', url: rss('https://news.google.com/rss/search?q=(bitcoin+OR+ethereum+OR+crypto+OR+"digital+assets")+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DeFi News', url: rss('https://news.google.com/rss/search?q=(DeFi+OR+"decentralized+finance"+OR+DEX+OR+"yield+farming")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Decrypt', url: rss('https://decrypt.co/feed') },
    { name: 'Blockworks', url: rss('https://blockworks.co/feed') },
    { name: 'The Defiant', url: rss('https://thedefiant.io/feed') },
    { name: 'Bitcoin Magazine', url: rss('https://bitcoinmagazine.com/feed') },
    { name: 'DL News', url: rss('https://www.dlnews.com/feed/') },
    { name: 'CryptoSlate', url: rss('https://cryptoslate.com/feed/') },
    { name: 'Unchained', url: rss('https://unchainedcrypto.com/feed/') },
    { name: 'Wu Blockchain', url: rss('https://news.google.com/rss/search?q=site:wublockchain.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Messari', url: rss('https://news.google.com/rss/search?q=site:messari.io+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Bloomberg Crypto', url: rss('https://news.google.com/rss/search?q=bloomberg+crypto+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters Crypto', url: rss('https://news.google.com/rss/search?q=reuters+crypto+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'NFT News', url: rss('https://news.google.com/rss/search?q=(NFT+OR+"non-fungible")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Stablecoin Policy', url: rss('https://news.google.com/rss/search?q=(stablecoin+regulation+OR+"stablecoin+bill")+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  centralbanks: [
    { name: 'Federal Reserve', url: rss('https://www.federalreserve.gov/feeds/press_all.xml') },
    { name: 'ECB Watch', url: rss('https://news.google.com/rss/search?q=("European+Central+Bank"+OR+ECB+OR+Lagarde)+monetary+policy+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BoJ Watch', url: rss('https://news.google.com/rss/search?q=("Bank+of+Japan"+OR+BoJ)+monetary+policy+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BoE Watch', url: rss('https://news.google.com/rss/search?q=("Bank+of+England"+OR+BoE)+monetary+policy+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'PBoC Watch', url: rss('https://news.google.com/rss/search?q=("People%27s+Bank+of+China"+OR+PBoC+OR+PBOC)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Global Central Banks', url: rss('https://news.google.com/rss/search?q=("rate+hike"+OR+"rate+cut"+OR+"interest+rate+decision")+central+bank+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  economic: [
    { name: 'Economic Data', url: rss('https://news.google.com/rss/search?q=(CPI+OR+inflation+OR+GDP+OR+"jobs+report"+OR+"nonfarm+payrolls"+OR+PMI)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Trade & Tariffs', url: rss('https://news.google.com/rss/search?q=(tariff+OR+"trade+war"+OR+"trade+deficit"+OR+sanctions)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Housing Market', url: rss('https://news.google.com/rss/search?q=("housing+market"+OR+"home+prices"+OR+"mortgage+rates"+OR+REIT)+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  ipo: [
    { name: 'IPO News', url: rss('https://news.google.com/rss/search?q=(IPO+OR+"initial+public+offering"+OR+SPAC+OR+"direct+listing")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Earnings Reports', url: rss('https://news.google.com/rss/search?q=("earnings+report"+OR+"quarterly+earnings"+OR+"revenue+beat"+OR+"earnings+miss")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'M&A News', url: rss('https://news.google.com/rss/search?q=("merger"+OR+"acquisition"+OR+"takeover+bid"+OR+"buyout")+billion+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  derivatives: [
    { name: 'Options Market', url: rss('https://news.google.com/rss/search?q=("options+market"+OR+"options+trading"+OR+"put+call+ratio"+OR+VIX)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Futures Trading', url: rss('https://news.google.com/rss/search?q=("futures+trading"+OR+"S%26P+500+futures"+OR+"Nasdaq+futures")+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  fintech: [
    { name: 'Fintech News', url: rss('https://news.google.com/rss/search?q=(fintech+OR+"payment+technology"+OR+"neobank"+OR+"digital+banking")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Trading Tech', url: rss('https://news.google.com/rss/search?q=("algorithmic+trading"+OR+"trading+platform"+OR+"quantitative+finance")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Blockchain Finance', url: rss('https://news.google.com/rss/search?q=("blockchain+finance"+OR+"tokenization"+OR+"digital+securities"+OR+CBDC)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  regulation: [
    { name: 'SEC', url: rss('https://www.sec.gov/news/pressreleases.rss') },
    { name: 'Financial Regulation', url: rss('https://news.google.com/rss/search?q=(SEC+OR+CFTC+OR+FINRA+OR+FCA)+regulation+OR+enforcement+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Banking Rules', url: rss('https://news.google.com/rss/search?q=(Basel+OR+"capital+requirements"+OR+"banking+regulation")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Crypto Regulation', url: rss('https://news.google.com/rss/search?q=(crypto+regulation+OR+"digital+asset"+regulation+OR+"stablecoin"+regulation)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  institutional: [
    { name: 'Hedge Fund News', url: rss('https://news.google.com/rss/search?q=("hedge+fund"+OR+"Bridgewater"+OR+"Citadel"+OR+"Renaissance")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Private Equity', url: rss('https://news.google.com/rss/search?q=("private+equity"+OR+Blackstone+OR+KKR+OR+Apollo+OR+Carlyle)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Sovereign Wealth', url: rss('https://news.google.com/rss/search?q=("sovereign+wealth+fund"+OR+"pension+fund"+OR+"institutional+investor")+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  analysis: [
    { name: 'Market Outlook', url: rss('https://news.google.com/rss/search?q=("market+outlook"+OR+"stock+market+forecast"+OR+"bull+market"+OR+"bear+market")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Risk & Volatility', url: rss('https://news.google.com/rss/search?q=(VIX+OR+"market+volatility"+OR+"risk+off"+OR+"market+correction")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Bank Research', url: rss('https://news.google.com/rss/search?q=("Goldman+Sachs"+OR+"JPMorgan"+OR+"Morgan+Stanley")+forecast+OR+outlook+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  gccNews: [
    { name: 'Arabian Business', url: rss('https://news.google.com/rss/search?q=site:arabianbusiness.com+(Saudi+Arabia+OR+UAE+OR+GCC)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'The National', url: rss('https://news.google.com/rss/search?q=site:thenationalnews.com+(Abu+Dhabi+OR+UAE+OR+Saudi)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Arab News', url: rss('https://news.google.com/rss/search?q=site:arabnews.com+(Saudi+Arabia+OR+investment+OR+infrastructure)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gulf FDI', url: rss('https://news.google.com/rss/search?q=(PIF+OR+"DP+World"+OR+Mubadala+OR+ADNOC+OR+Masdar+OR+"ACWA+Power")+infrastructure+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gulf Investments', url: rss('https://news.google.com/rss/search?q=("Saudi+Arabia"+OR+"UAE"+OR+"Abu+Dhabi")+investment+infrastructure+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Vision 2030', url: rss('https://news.google.com/rss/search?q="Vision+2030"+(project+OR+investment+OR+announced)+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

const HAPPY_FEEDS: Record<string, Feed[]> = {
  positive: [
    { name: 'Good News Network', url: rss('https://www.goodnewsnetwork.org/feed/') },
    { name: 'Positive.News', url: rss('https://www.positive.news/feed/') },
    { name: 'Reasons to be Cheerful', url: rss('https://reasonstobecheerful.world/feed/') },
    { name: 'Optimist Daily', url: rss('https://www.optimistdaily.com/feed/') },
    { name: 'Upworthy', url: rss('https://www.upworthy.com/feed/') },
    { name: 'DailyGood', url: rss('https://www.dailygood.org/feed') },
    { name: 'Good Good Good', url: rss('https://www.goodgoodgood.co/articles/rss.xml') },
    { name: 'GOOD Magazine', url: rss('https://www.good.is/feed/') },
    { name: 'Sunny Skyz', url: rss('https://www.sunnyskyz.com/rss_tebow.php') },
    { name: 'The Better India', url: rss('https://thebetterindia.com/feed/') },
  ],
  science: [
    { name: 'GNN Science', url: rss('https://www.goodnewsnetwork.org/category/news/science/feed/') },
    { name: 'ScienceDaily', url: rss('https://www.sciencedaily.com/rss/all.xml') },
    { name: 'Nature News', url: rss('https://feeds.nature.com/nature/rss/current') },
    { name: 'Live Science', url: rss('https://www.livescience.com/feeds.xml') },
    { name: 'New Scientist', url: rss('https://www.newscientist.com/feed/home/') },
    { name: 'Singularity Hub', url: rss('https://singularityhub.com/feed/') },
    { name: 'Human Progress', url: rss('https://humanprogress.org/feed/') },
    { name: 'Greater Good (Berkeley)', url: rss('https://greatergood.berkeley.edu/site/rss/articles') },
  ],
  nature: [
    { name: 'GNN Animals', url: rss('https://www.goodnewsnetwork.org/category/news/animals/feed/') },
    { name: 'GNN Earth', url: rss('https://www.goodnewsnetwork.org/category/news/earth/feed/') },
    { name: 'Mongabay', url: rss('https://news.mongabay.com/feed/') },
    { name: 'Conservation Optimism', url: rss('https://conservationoptimism.org/feed/') },
  ],
  health: [
    { name: 'GNN Health', url: rss('https://www.goodnewsnetwork.org/category/news/health/feed/') },
  ],
  inspiring: [
    { name: 'GNN Heroes', url: rss('https://www.goodnewsnetwork.org/category/news/inspiring/feed/') },
    { name: 'GNN Heroes Spotlight', url: rss('https://www.goodnewsnetwork.org/category/news/heroes/feed/') },
  ],
  community: [
    { name: 'Shareable', url: rss('https://www.shareable.net/feed/') },
    { name: 'Yes! Magazine', url: rss('https://www.yesmagazine.org/feed') },
  ],
};

// Commodity variant feeds (from commodity.ts)
const COMMODITY_FEEDS: Record<string, Feed[]> = {
  'commodity-news': [
    { name: 'Kitco News', url: rss('https://www.kitco.com/rss/KitcoNews.xml') },
    { name: 'Mining.com', url: rss('https://www.mining.com/feed/') },
    { name: 'Bloomberg Commodities', url: rss('https://news.google.com/rss/search?q=site:bloomberg.com+commodities+OR+metals+OR+mining+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters Commodities', url: rss('https://news.google.com/rss/search?q=site:reuters.com+commodities+OR+metals+OR+mining+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'S&P Global Commodity', url: rss('https://news.google.com/rss/search?q=site:spglobal.com+commodities+metals+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Commodity Trade Mantra', url: rss('https://www.commoditytrademantra.com/feed/') },
    { name: 'CNBC Commodities', url: rss('https://news.google.com/rss/search?q=site:cnbc.com+(commodities+OR+metals+OR+gold+OR+copper)+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'gold-silver': [
    { name: 'Kitco Gold', url: rss('https://www.kitco.com/rss/KitcoGold.xml') },
    { name: 'Gold Price News', url: rss('https://news.google.com/rss/search?q=(gold+price+OR+"gold+market"+OR+bullion+OR+LBMA)+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Silver Price News', url: rss('https://news.google.com/rss/search?q=(silver+price+OR+"silver+market"+OR+"silver+futures")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Precious Metals', url: rss('https://news.google.com/rss/search?q=("precious+metals"+OR+platinum+OR+palladium+OR+"gold+ETF"+OR+GLD+OR+SLV)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'World Gold Council', url: rss('https://news.google.com/rss/search?q="World+Gold+Council"+OR+"central+bank+gold"+OR+"gold+reserves"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'GoldSeek', url: rss('https://news.goldseek.com/GoldSeek/rss.xml') },
    { name: 'SilverSeek', url: rss('https://news.silverseek.com/SilverSeek/rss.xml') },
  ],
  energy: [
    { name: 'OilPrice.com', url: rss('https://oilprice.com/rss/main') },
    { name: 'Rigzone', url: rss('https://www.rigzone.com/news/rss/rigzone_latest.aspx') },
    { name: 'EIA Reports', url: rss('https://www.eia.gov/rss/press_room.xml') },
    { name: 'OPEC News', url: rss('https://news.google.com/rss/search?q=(OPEC+OR+"oil+price"+OR+"crude+oil"+OR+WTI+OR+Brent+OR+"oil+production")+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Natural Gas News', url: rss('https://news.google.com/rss/search?q=("natural+gas"+OR+LNG+OR+"gas+price"+OR+"Henry+Hub")+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Energy Intel', url: rss('https://news.google.com/rss/search?q=(energy+commodities+OR+"energy+market"+OR+"energy+prices")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters Energy', url: rss('https://news.google.com/rss/search?q=site:reuters.com+(oil+OR+gas+OR+energy)+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'mining-news': [
    { name: 'Mining Journal', url: rss('https://www.mining-journal.com/feed/') },
    { name: 'Northern Miner', url: rss('https://www.northernminer.com/feed/') },
    { name: 'Mining Weekly', url: rss('https://www.miningweekly.com/rss/') },
    { name: 'Mining Technology', url: rss('https://www.mining-technology.com/feed/') },
    { name: 'Australian Mining', url: rss('https://www.australianmining.com.au/feed/') },
    { name: 'Mine Web (SNL)', url: rss('https://news.google.com/rss/search?q=("mining+company"+OR+"mine+production"+OR+"mining+operations")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Resource World', url: rss('https://news.google.com/rss/search?q=("mining+project"+OR+"mineral+exploration"+OR+"mine+development")+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'critical-minerals': [
    { name: 'Benchmark Mineral', url: rss('https://news.google.com/rss/search?q=("critical+minerals"+OR+"battery+metals"+OR+lithium+OR+cobalt+OR+"rare+earths")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Lithium Market', url: rss('https://news.google.com/rss/search?q=(lithium+price+OR+"lithium+market"+OR+"lithium+supply"+OR+spodumene+OR+LCE)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Cobalt Market', url: rss('https://news.google.com/rss/search?q=(cobalt+price+OR+"cobalt+market"+OR+"DRC+cobalt"+OR+"battery+cobalt")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Rare Earths News', url: rss('https://news.google.com/rss/search?q=("rare+earth"+OR+"rare+earths"+OR+"REE"+OR+neodymium+OR+praseodymium)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EV Battery Supply', url: rss('https://news.google.com/rss/search?q=("EV+battery"+OR+"battery+supply+chain"+OR+"battery+materials")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'IEA Critical Minerals', url: rss('https://news.google.com/rss/search?q=site:iea.org+(minerals+OR+critical+OR+battery)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Uranium Market', url: rss('https://news.google.com/rss/search?q=(uranium+price+OR+"uranium+market"+OR+U3O8+OR+nuclear+fuel)+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'base-metals': [
    { name: 'LME Metals', url: rss('https://news.google.com/rss/search?q=(LME+OR+"London+Metal+Exchange")+copper+OR+aluminum+OR+zinc+OR+nickel+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Copper Market', url: rss('https://news.google.com/rss/search?q=(copper+price+OR+"copper+market"+OR+"copper+supply"+OR+COMEX+copper)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nickel News', url: rss('https://news.google.com/rss/search?q=(nickel+price+OR+"nickel+market"+OR+"nickel+supply"+OR+Indonesia+nickel)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Aluminum & Zinc', url: rss('https://news.google.com/rss/search?q=(aluminum+price+OR+aluminium+OR+zinc+price+OR+"base+metals")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Iron Ore Market', url: rss('https://news.google.com/rss/search?q=("iron+ore"+price+OR+"iron+ore+market"+OR+"steel+raw+materials")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Metals Bulletin', url: rss('https://news.google.com/rss/search?q=("metals+market"+OR+"base+metals"+OR+SHFE+OR+"Shanghai+Futures")+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'mining-companies': [
    { name: 'BHP News', url: rss('https://news.google.com/rss/search?q=BHP+(mining+OR+production+OR+results+OR+copper+OR+"iron+ore")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Rio Tinto News', url: rss('https://news.google.com/rss/search?q="Rio+Tinto"+(mining+OR+production+OR+results+OR+Pilbara)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Glencore & Vale', url: rss('https://news.google.com/rss/search?q=(Glencore+OR+Vale)+(mining+OR+production+OR+cobalt+OR+"iron+ore")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Gold Majors', url: rss('https://news.google.com/rss/search?q=(Newmont+OR+Barrick+OR+AngloGold+OR+Agnico)+(gold+mine+OR+production+OR+results)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Freeport & Copper Miners', url: rss('https://news.google.com/rss/search?q=(Freeport+McMoRan+OR+Southern+Copper+OR+Teck+OR+Antofagasta)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Critical Mineral Companies', url: rss('https://news.google.com/rss/search?q=(Albemarle+OR+SQM+OR+"MP+Materials"+OR+Lynas+OR+Cameco)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'supply-chain': [
    { name: 'Shipping & Freight', url: rss('https://news.google.com/rss/search?q=("bulk+carrier"+OR+"dry+bulk"+OR+"commodity+shipping"+OR+"Port+Hedland"+OR+"Strait+of+Hormuz")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Trade Routes', url: rss('https://news.google.com/rss/search?q=("trade+route"+OR+"supply+chain"+OR+"commodity+export"+OR+"mineral+export")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'China Commodity Imports', url: rss('https://news.google.com/rss/search?q=(China+imports+copper+OR+iron+ore+OR+lithium+OR+cobalt+OR+"rare+earth")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Port & Logistics', url: rss('https://news.google.com/rss/search?q=("iron+ore+port"+OR+"copper+port"+OR+"commodity+port"+OR+"mineral+logistics")+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  'commodity-regulation': [
    { name: 'Mining Regulation', url: rss('https://news.google.com/rss/search?q=("mining+regulation"+OR+"mining+policy"+OR+"mining+permit"+OR+"mining+ban")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'ESG in Mining', url: rss('https://news.google.com/rss/search?q=("mining+ESG"+OR+"responsible+mining"+OR+"mine+closure"+OR+"tailings")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Trade & Tariffs', url: rss('https://news.google.com/rss/search?q=("mineral+tariff"+OR+"metals+tariff"+OR+"critical+mineral+policy"+OR+"mining+export+ban")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Indonesia Nickel Policy', url: rss('https://news.google.com/rss/search?q=(Indonesia+nickel+OR+"nickel+export"+OR+"nickel+ban"+OR+"nickel+processing")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'China Mineral Policy', url: rss('https://news.google.com/rss/search?q=(China+"rare+earth"+OR+"mineral+export"+OR+"critical+mineral")+policy+OR+restriction+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  markets: [
    { name: 'Yahoo Finance Commodities', url: rss('https://finance.yahoo.com/rss/topstories') },
    { name: 'CNBC Markets', url: rss('https://www.cnbc.com/id/100003114/device/rss/rss.html') },
    { name: 'Seeking Alpha Metals', url: rss('https://news.google.com/rss/search?q=site:seekingalpha.com+(gold+OR+silver+OR+copper+OR+mining)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Commodity Futures', url: rss('https://news.google.com/rss/search?q=(COMEX+OR+NYMEX+OR+"commodity+futures"+OR+CME+commodities)+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  finance: [
    { name: 'CNBC', url: rss('https://www.cnbc.com/id/100003114/device/rss/rss.html') },
    { name: 'MarketWatch', url: rss('https://news.google.com/rss/search?q=site:marketwatch.com+markets+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Yahoo Finance', url: rss('https://finance.yahoo.com/news/rssindex') },
    { name: 'Financial Times', url: rss('https://www.ft.com/rss/home') },
    { name: 'Reuters Business', url: rss('https://news.google.com/rss/search?q=site:reuters.com+business+markets&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// ============================================
// AI VARIANT FEEDS (World AI Monitor)
// ============================================
const AI_FEEDS: Record<string, Feed[]> = {

  // ── Research: Academic Papers & Preprints ──────────────────────────────────
  research: [
    { name: 'ArXiv AI',              tier: 'primary',   keywords: ['neural network', 'deep learning', 'artificial intelligence', 'reinforcement learning'], url: rss('https://export.arxiv.org/rss/cs.AI') },
    { name: 'ArXiv ML',              tier: 'primary',   keywords: ['machine learning', 'deep learning', 'training', 'optimization', 'generalization'], url: rss('https://export.arxiv.org/rss/cs.LG') },
    { name: 'ArXiv CL',              tier: 'primary',   keywords: ['language model', 'NLP', 'text generation', 'tokenization', 'RLHF', 'instruction tuning'], url: rss('https://export.arxiv.org/rss/cs.CL') },
    { name: 'ArXiv CV',              tier: 'primary',   keywords: ['vision', 'image generation', 'diffusion', 'multimodal', 'object detection', 'segmentation'], url: rss('https://export.arxiv.org/rss/cs.CV') },
    { name: 'ArXiv Robotics',        tier: 'primary',   keywords: ['robotics', 'manipulation', 'locomotion', 'embodied', 'sim-to-real', 'control'], url: rss('https://export.arxiv.org/rss/cs.RO') },
    { name: 'ArXiv Stat ML',         tier: 'primary',   keywords: ['probabilistic', 'Bayesian', 'generative model', 'variational', 'statistical learning'], url: rss('https://export.arxiv.org/rss/stat.ML') },
    { name: 'Google DeepMind Blog',  tier: 'primary',   keywords: ['Gemini', 'AlphaFold', 'research', 'breakthrough', 'safety'], url: rss('https://deepmind.google/blog/rss.xml') },
    { name: 'OpenAI Research',       tier: 'primary',   keywords: ['GPT', 'model', 'research', 'safety', 'alignment'], url: rss('https://news.google.com/rss/search?q=site:openai.com+research+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Anthropic Research',    tier: 'primary',   keywords: ['Claude', 'alignment', 'interpretability', 'safety', 'research'], url: rss('https://news.google.com/rss/search?q=site:anthropic.com+research+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Meta AI Research',      tier: 'primary',   keywords: ['Llama', 'research', 'open source', 'FAIR', 'model'], url: rss('https://news.google.com/rss/search?q=site:ai.meta.com+research+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Hugging Face Blog',     tier: 'primary',   keywords: ['model release', 'open source', 'transformer', 'fine-tuning', 'dataset'], url: rss('https://huggingface.co/blog/feed.xml') },
    { name: 'Papers With Code',      tier: 'secondary', keywords: ['state of the art', 'benchmark', 'leaderboard', 'SOTA', 'evaluation'], url: rss('https://paperswithcode.com/newsletter/rss/') },
    { name: 'Microsoft Research AI', tier: 'secondary', keywords: ['research', 'model', 'language', 'vision', 'reasoning'], url: rss('https://news.google.com/rss/search?q=site:microsoft.com+research+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Allen AI (AI2)',        tier: 'secondary', keywords: ['OLMo', 'research', 'NLP', 'open', 'scientific AI'], url: rss('https://news.google.com/rss/search?q=site:allenai.org+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Google AI Blog',        tier: 'primary',   keywords: ['research', 'model', 'Google', 'breakthrough', 'multimodal'], url: rss('https://news.google.com/rss/search?q=site:blog.google+AI+research+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MIT Research AI',       tier: 'secondary', keywords: ['MIT', 'research', 'AI', 'robotics', 'language'], url: rss('https://news.mit.edu/rss/research') },
  ],

  // ── Architectures: Model Architecture Papers ──────────────────────────────
  architectures: [
    { name: 'ArXiv Architectures',   tier: 'primary',   keywords: ['transformer', 'attention', 'SSM', 'Mamba', 'MoE', 'mixture of experts', 'diffusion', 'RLHF', 'RLAIF', 'multimodal'], url: rss('https://news.google.com/rss/search?q=arxiv+(transformer+OR+Mamba+OR+SSM+OR+"mixture+of+experts"+OR+MoE+OR+diffusion+model+OR+RLHF)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Distill.pub',           tier: 'primary',   keywords: ['architecture', 'attention', 'neural network', 'visualization', 'explainer'], url: rss('https://distill.pub/rss.xml') },
    { name: 'The Gradient',          tier: 'secondary', keywords: ['architecture', 'research', 'deep learning', 'analysis', 'survey'], url: rss('https://thegradient.pub/rss/') },
    { name: 'NeurIPS Papers',        tier: 'primary',   keywords: ['NeurIPS', 'ICML', 'ICLR', 'accepted', 'conference', 'paper'], url: rss('https://news.google.com/rss/search?q=(NeurIPS+OR+ICML+OR+ICLR+OR+EMNLP+OR+ACL)+accepted+papers+OR+proceedings+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Architecture Breakthroughs', tier: 'secondary', keywords: ['transformer', 'SSM', 'Mamba', 'attention', 'MoE'], url: rss('https://news.google.com/rss/search?q=("new+architecture"+OR+"model+architecture"+OR+transformer+OR+Mamba+OR+"state+space+model")+AI+paper+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'ICLR Blog',             tier: 'secondary', keywords: ['ICLR', 'deep learning', 'research', 'architecture'], url: rss('https://news.google.com/rss/search?q=ICLR+blog+OR+ICLR+2025+paper+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Ahead of AI (Raschka)', tier: 'secondary', keywords: ['LLM', 'architecture', 'training', 'fine-tuning', 'analysis'], url: rss('https://magazine.sebastianraschka.com/feed') },
    { name: 'Jay Alammar Blog',      tier: 'secondary', keywords: ['transformer', 'attention', 'BERT', 'visualization', 'explainer'], url: rss('https://jalammar.github.io/feed.xml') },
  ],

  // ── Model Releases: Launches & Benchmarks ─────────────────────────────────
  modelReleases: [
    { name: 'AI Model News',         tier: 'primary',   keywords: ['model release', 'launch', 'GPT', 'Claude', 'Gemini', 'Llama', 'benchmark', 'context window'], url: rss('https://news.google.com/rss/search?q=(OpenAI+OR+Anthropic+OR+Google+AI+OR+"large+language+model"+OR+ChatGPT+OR+Claude+OR+"AI+model")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VentureBeat AI',        tier: 'primary',   keywords: ['model', 'release', 'AI', 'benchmark', 'performance'], url: rss('https://venturebeat.com/category/ai/feed/') },
    { name: 'The Verge AI',          tier: 'primary',   keywords: ['model', 'AI', 'release', 'OpenAI', 'Google', 'Anthropic'], url: rss('https://www.theverge.com/rss/ai-artificial-intelligence/index.xml') },
    { name: 'MIT Tech Review AI',    tier: 'primary',   keywords: ['AI', 'model', 'breakthrough', 'research', 'technology'], url: rss('https://www.technologyreview.com/topic/artificial-intelligence/feed') },
    { name: 'Ars Technica AI',       tier: 'primary',   keywords: ['model', 'AI', 'release', 'benchmark', 'capabilities'], url: rss('https://feeds.arstechnica.com/arstechnica/technology-lab') },
    { name: 'LMSYS Chatbot Arena',   tier: 'primary',   keywords: ['leaderboard', 'benchmark', 'model ranking', 'ELO', 'chatbot'], url: rss('https://news.google.com/rss/search?q=LMSYS+"Chatbot+Arena"+leaderboard+OR+benchmark+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'OpenAI News',           tier: 'primary',   keywords: ['GPT', 'o1', 'o3', 'Sora', 'release', 'API'], url: rss('https://news.google.com/rss/search?q=OpenAI+(GPT+OR+o1+OR+o3+OR+release+OR+model)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Anthropic News',        tier: 'primary',   keywords: ['Claude', 'release', 'model', 'Sonnet', 'Haiku', 'Opus'], url: rss('https://news.google.com/rss/search?q=Anthropic+Claude+(release+OR+model+OR+update)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Google AI News',        tier: 'primary',   keywords: ['Gemini', 'Veo', 'Imagen', 'release', 'model'], url: rss('https://news.google.com/rss/search?q=Google+(Gemini+OR+Veo+OR+Imagen+OR+"AI+release")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Mistral AI',            tier: 'primary',   keywords: ['Mistral', 'model', 'release', 'open', 'weights'], url: rss('https://news.google.com/rss/search?q=Mistral+AI+(model+OR+release+OR+launch)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'xAI Grok',             tier: 'secondary', keywords: ['Grok', 'xAI', 'Elon Musk', 'model', 'release'], url: rss('https://news.google.com/rss/search?q=xAI+Grok+(model+OR+release+OR+update)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Cohere Blog',           tier: 'secondary', keywords: ['Command', 'Embed', 'enterprise', 'model', 'RAG'], url: rss('https://news.google.com/rss/search?q=Cohere+(model+OR+release+OR+Command)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI21 Labs',             tier: 'secondary', keywords: ['Jamba', 'model', 'release', 'AI21', 'SSM'], url: rss('https://news.google.com/rss/search?q="AI21+Labs"+OR+Jamba+model+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Together AI',           tier: 'secondary', keywords: ['open model', 'inference', 'fine-tuning', 'API', 'Together'], url: rss('https://news.google.com/rss/search?q="Together+AI"+(model+OR+release+OR+open)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Weights & Biases',      tier: 'secondary', keywords: ['training', 'evaluation', 'MLOps', 'model', 'tracking'], url: rss('https://news.google.com/rss/search?q=site:wandb.ai+blog+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── Agentic AI: Agents & Frameworks ───────────────────────────────────────
  agenticAI: [
    { name: 'Agentic AI News',       tier: 'primary',   keywords: ['AI agent', 'agentic', 'multi-agent', 'autonomous', 'tool use', 'planning'], url: rss('https://news.google.com/rss/search?q=("AI+agent"+OR+"agentic+AI"+OR+"multi-agent"+OR+"autonomous+AI")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'LangChain Blog',        tier: 'secondary', keywords: ['LangChain', 'agent', 'tool', 'RAG', 'chain', 'LangGraph'], url: rss('https://news.google.com/rss/search?q=LangChain+OR+LangGraph+(blog+OR+release+OR+update)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'SWE-bench',             tier: 'primary',   keywords: ['SWE-bench', 'coding agent', 'software engineering', 'benchmark', 'code generation'], url: rss('https://news.google.com/rss/search?q=SWE-bench+(result+OR+score+OR+agent+OR+benchmark)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'OpenAI Agents',         tier: 'primary',   keywords: ['Operator', 'agent', 'computer use', 'task', 'autonomous'], url: rss('https://news.google.com/rss/search?q=OpenAI+(agent+OR+Operator+OR+"computer+use")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Anthropic Agents',      tier: 'primary',   keywords: ['Claude', 'computer use', 'agent', 'tool use', 'MCP'], url: rss('https://news.google.com/rss/search?q=Anthropic+(agent+OR+"computer+use"+OR+MCP+OR+"tool+use")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Google Agents',         tier: 'primary',   keywords: ['Project Mariner', 'Gemini agent', 'Jules', 'agentic', 'Google AI'], url: rss('https://news.google.com/rss/search?q=Google+("Project+Mariner"+OR+"Gemini+agent"+OR+Jules+OR+AI+agent)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Agent Benchmarks',      tier: 'primary',   keywords: ['GAIA', 'AgentBench', 'OSWorld', 'WebArena', 'evaluation', 'benchmark'], url: rss('https://news.google.com/rss/search?q=(GAIA+benchmark+OR+AgentBench+OR+OSWorld+OR+WebArena)+AI+agent+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AutoGPT / CrewAI',      tier: 'secondary', keywords: ['AutoGPT', 'CrewAI', 'AutoGen', 'agent framework', 'multi-agent'], url: rss('https://news.google.com/rss/search?q=(AutoGPT+OR+CrewAI+OR+AutoGen+OR+"LlamaIndex")+agent+(release+OR+update)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MCP Protocol',          tier: 'secondary', keywords: ['MCP', 'Model Context Protocol', 'tool', 'plugin', 'extension'], url: rss('https://news.google.com/rss/search?q="Model+Context+Protocol"+OR+MCP+Anthropic+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Coding Agents',      tier: 'secondary', keywords: ['Devin', 'SWE-agent', 'Cursor', 'Copilot', 'code agent'], url: rss('https://news.google.com/rss/search?q=(Devin+AI+OR+"Cursor+AI"+OR+Copilot+OR+SWE-agent)+coding+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── World Models: Video Generation & World Simulators ─────────────────────
  worldModels: [
    { name: 'World Model News',      tier: 'primary',   keywords: ['world model', 'video generation', 'simulation', 'physics', 'environment model'], url: rss('https://news.google.com/rss/search?q=("world+model"+OR+"video+generation"+OR+"video+AI")+when:5d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'OpenAI Sora',           tier: 'primary',   keywords: ['Sora', 'video', 'generation', 'OpenAI', 'temporal'], url: rss('https://news.google.com/rss/search?q=OpenAI+Sora+(release+OR+update+OR+video)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Runway ML',             tier: 'primary',   keywords: ['Runway', 'video', 'generation', 'Gen-3', 'creative AI'], url: rss('https://news.google.com/rss/search?q="Runway+ML"+OR+RunwayML+(release+OR+video+OR+Gen-3)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Stability AI',          tier: 'secondary', keywords: ['Stable Diffusion', 'video', 'generation', 'image', 'Stability'], url: rss('https://news.google.com/rss/search?q="Stability+AI"+(release+OR+video+OR+model)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DeepMind Genie',        tier: 'primary',   keywords: ['Genie', 'world model', 'DeepMind', 'interactive', 'game world'], url: rss('https://news.google.com/rss/search?q=DeepMind+(Genie+OR+Veo+OR+"world+model")+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Video AI Models',       tier: 'secondary', keywords: ['Kling', 'Wan', 'HeyGen', 'Pika', 'video generation', 'text-to-video'], url: rss('https://news.google.com/rss/search?q=(Kling+OR+Wan+video+OR+Pika+Labs+OR+HeyGen+OR+"text-to-video")+AI+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Pika Labs',             tier: 'secondary', keywords: ['Pika', 'video', 'generation', 'animation', 'AI video'], url: rss('https://news.google.com/rss/search?q="Pika+Labs"+video+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'World Model Research',  tier: 'primary',   keywords: ['world model', 'environment model', 'robot simulation', 'physics model'], url: rss('https://news.google.com/rss/search?q=("world+model"+paper+OR+arxiv+"world+model"+AI)+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── Physical AI: Robotics & Embodied Intelligence ─────────────────────────
  physicalAI: [
    { name: 'Physical AI News',      tier: 'primary',   keywords: ['physical AI', 'humanoid robot', 'embodied AI', 'manipulation', 'locomotion'], url: rss('https://news.google.com/rss/search?q=("physical+AI"+OR+humanoid+robot+OR+"embodied+AI"+OR+robotics+AI)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Figure AI',             tier: 'primary',   keywords: ['Figure', 'humanoid', 'dexterous', 'manipulation', 'OpenAI'], url: rss('https://news.google.com/rss/search?q="Figure+AI"+(robot+OR+humanoid+OR+demo)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Physical Intelligence', tier: 'primary',   keywords: ['pi.ai', 'physical intelligence', 'dexterous', 'manipulation', 'π0'], url: rss('https://news.google.com/rss/search?q=("Physical+Intelligence"+OR+"pi.ai"+OR+π0)+robotics+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Boston Dynamics',       tier: 'primary',   keywords: ['Atlas', 'Spot', 'Boston Dynamics', 'bipedal', 'locomotion'], url: rss('https://news.google.com/rss/search?q="Boston+Dynamics"+(Atlas+OR+robot+OR+demo)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tesla Optimus',         tier: 'primary',   keywords: ['Optimus', 'Tesla bot', 'humanoid', 'factory', 'Tesla AI'], url: rss('https://news.google.com/rss/search?q=Tesla+(Optimus+OR+"Tesla+Bot")+robot+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'NVIDIA Isaac/Cosmos',   tier: 'primary',   keywords: ['Isaac', 'Cosmos', 'NVIDIA', 'sim-to-real', 'robot learning'], url: rss('https://news.google.com/rss/search?q=NVIDIA+(Isaac+OR+Cosmos+OR+robotics+OR+GR00T)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'IEEE Spectrum Robotics', tier: 'primary',  keywords: ['robotics', 'manipulation', 'autonomous', 'AI', 'IEEE'], url: rss('https://spectrum.ieee.org/feeds/topic/robotics.rss') },
    { name: 'Agility & 1X Robots',   tier: 'secondary', keywords: ['Digit', 'NEO', '1X', 'Agility', 'bipedal'], url: rss('https://news.google.com/rss/search?q=("1X+Technologies"+OR+"Agility+Robotics"+OR+Apptronik+OR+Unitree)+robot+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Humanoid Robot Race',   tier: 'secondary', keywords: ['humanoid', 'bipedal', 'dexterous hands', 'robot learning', 'competition'], url: rss('https://news.google.com/rss/search?q=(humanoid+robot+OR+"robot+learning"+OR+"dexterous+manipulation")+AI+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'ArXiv Robotics Feed',   tier: 'primary',   keywords: ['manipulation', 'grasping', 'sim2real', 'policy learning', 'legged'], url: rss('https://export.arxiv.org/rss/cs.RO') },
  ],

  // ── Venture Funding: AI VC & Deals ────────────────────────────────────────
  ventureFunding: [
    { name: 'AI Funding News',       tier: 'primary',   keywords: ['AI funding', 'Series A', 'Series B', 'venture', 'investment', 'raises'], url: rss('https://news.google.com/rss/search?q=(AI+startup+funding+OR+"artificial+intelligence"+raises+OR+AI+investment)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TechCrunch Venture',    tier: 'primary',   keywords: ['funding', 'Series', 'seed', 'raises', 'valuation'], url: rss('https://techcrunch.com/category/venture/feed/') },
    { name: 'Crunchbase News',       tier: 'primary',   keywords: ['funding round', 'startup', 'AI', 'investment', 'unicorn'], url: rss('https://news.crunchbase.com/feed/') },
    { name: 'a16z AI',               tier: 'primary',   keywords: ['a16z', 'Andreessen Horowitz', 'AI', 'investment', 'portfolio'], url: rss('https://news.google.com/rss/search?q=site:a16z.com+(AI+OR+investment)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Sequoia AI',            tier: 'primary',   keywords: ['Sequoia', 'AI', 'portfolio', 'investment', 'startup'], url: rss('https://news.google.com/rss/search?q=Sequoia+(AI+OR+investment+OR+startup)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Khosla Ventures AI',    tier: 'secondary', keywords: ['Khosla', 'AI', 'investment', 'deep tech', 'startup'], url: rss('https://news.google.com/rss/search?q="Khosla+Ventures"+AI+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Mega Rounds',        tier: 'primary',   keywords: ['$100M', '$1B', 'mega round', 'growth round', 'AI valuation'], url: rss('https://news.google.com/rss/search?q=(AI+startup+("$100+million"+OR+"$500+million"+OR+"$1+billion"))+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Unicorn Watch',      tier: 'secondary', keywords: ['unicorn', 'AI valuation', 'billion dollar', 'decacorn', 'IPO'], url: rss('https://news.google.com/rss/search?q=(AI+unicorn+OR+"AI+company"+valuation+OR+AI+IPO)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'YC AI Startups',        tier: 'secondary', keywords: ['YC', 'Y Combinator', 'batch', 'AI startup', 'demo day'], url: rss('https://news.google.com/rss/search?q=("Y+Combinator"+OR+"YC+W25"+OR+"YC+S25")+AI+startup+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Founders Fund AI',      tier: 'secondary', keywords: ['Founders Fund', 'Peter Thiel', 'AI', 'deep tech', 'investment'], url: rss('https://news.google.com/rss/search?q="Founders+Fund"+AI+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'GV / Google Ventures',  tier: 'secondary', keywords: ['GV', 'Google Ventures', 'AI', 'M12', 'investment'], url: rss('https://news.google.com/rss/search?q=(GV+AI+OR+"Google+Ventures"+AI+OR+M12+Microsoft+AI)+investment+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── AI Infrastructure: Compute, Chips & Datacenters ───────────────────────
  aiInfrastructure: [
    { name: 'SemiAnalysis',          tier: 'primary',   keywords: ['semiconductor', 'GPU', 'chip', 'datacenter', 'NVIDIA', 'TSMC', 'supply chain'], url: rss('https://news.google.com/rss/search?q=site:semianalysis.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'NVIDIA AI Chips',       tier: 'primary',   keywords: ['H100', 'H200', 'B200', 'Blackwell', 'NVLink', 'GPU', 'CUDA'], url: rss('https://news.google.com/rss/search?q=NVIDIA+(H100+OR+H200+OR+B200+OR+Blackwell+OR+AI+chip+OR+NVLink)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AMD & Custom ASICs',    tier: 'primary',   keywords: ['AMD MI300', 'Gaudi', 'Groq', 'Cerebras', 'Tenstorrent', 'ASIC', 'TPU'], url: rss('https://news.google.com/rss/search?q=(AMD+MI300+OR+"Intel+Gaudi"+OR+Groq+OR+Cerebras+OR+Tenstorrent+OR+Trainium)+AI+chip+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Cloud AI Infrastructure', tier: 'primary', keywords: ['TPU', 'AWS Trainium', 'Azure AI', 'GCP AI', 'cloud GPU', 'AI cloud'], url: rss('https://news.google.com/rss/search?q=(AWS+Trainium+OR+Google+TPU+OR+Azure+AI+infrastructure+OR+"Google+Cloud"+AI)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'GPU Cloud & Rental',    tier: 'secondary', keywords: ['CoreWeave', 'Lambda Labs', 'Vast.ai', 'RunPod', 'GPU rental', 'H100 pricing'], url: rss('https://news.google.com/rss/search?q=(CoreWeave+OR+"Lambda+Labs"+OR+Vast.ai+OR+RunPod)+GPU+cloud+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Datacenter Projects', tier: 'primary',  keywords: ['Stargate', 'datacenter', 'supercomputer', 'GPU cluster', 'AI campus'], url: rss('https://news.google.com/rss/search?q=(Stargate+AI+OR+"AI+datacenter"+OR+"GPU+cluster"+OR+"AI+supercomputer")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Semiconductor Fabs',    tier: 'primary',   keywords: ['TSMC', 'Samsung foundry', 'Intel Foundry', 'fab', '3nm', '2nm', 'wafer'], url: rss('https://news.google.com/rss/search?q=(TSMC+OR+"Samsung+foundry"+OR+"Intel+Foundry")+(AI+chip+OR+advanced+node+OR+3nm+OR+2nm)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: "Tom's Hardware AI",     tier: 'secondary', keywords: ['GPU', 'benchmark', 'AI accelerator', 'chip', 'hardware'], url: rss('https://www.tomshardware.com/feeds/all') },
    { name: 'AI Power & Energy',     tier: 'secondary', keywords: ['power', 'energy', 'electricity', 'datacenter energy', 'nuclear AI'], url: rss('https://news.google.com/rss/search?q=(AI+datacenter+power+OR+AI+energy+consumption+OR+nuclear+AI+power)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── AI Policy: Governance & Regulation ────────────────────────────────────
  aiPolicy: [
    { name: 'AI Policy News',        tier: 'primary',   keywords: ['AI regulation', 'AI policy', 'AI governance', 'AI law', 'AI legislation'], url: rss('https://news.google.com/rss/search?q=(AI+regulation+OR+"AI+policy"+OR+"AI+governance"+OR+"AI+law")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EU AI Act Updates',     tier: 'primary',   keywords: ['EU AI Act', 'European AI', 'GDPR AI', 'Brussels', 'compliance'], url: rss('https://news.google.com/rss/search?q=("EU+AI+Act"+OR+"European+AI+regulation")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'US AI Policy',          tier: 'primary',   keywords: ['executive order', 'NIST', 'OSTP', 'AI safety', 'US Congress AI'], url: rss('https://news.google.com/rss/search?q=(US+"AI+policy"+OR+"AI+executive+order"+OR+NIST+AI+OR+Congress+AI)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'UK AI Safety Institute', tier: 'primary',  keywords: ['UK AISI', 'DSIT', 'Bletchley', 'AI safety', 'frontier AI'], url: rss('https://news.google.com/rss/search?q=("UK+AI+Safety+Institute"+OR+DSIT+AI+OR+Bletchley+OR+"AI+Seoul+Summit")+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'China AI Regulation',   tier: 'primary',   keywords: ['China AI', 'CAC', 'MIIT', 'DeepSeek', 'AI regulation China'], url: rss('https://news.google.com/rss/search?q=(China+AI+regulation+OR+China+AI+policy+OR+CAC+AI)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Stanford HAI',          tier: 'primary',   keywords: ['Stanford HAI', 'AI policy', 'research', 'governance', 'ethics'], url: rss('https://news.google.com/rss/search?q=site:hai.stanford.edu+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Now Institute',      tier: 'secondary', keywords: ['AI accountability', 'algorithmic', 'bias', 'labor', 'power'], url: rss('https://news.google.com/rss/search?q="AI+Now+Institute"+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'OECD AI Observatory',   tier: 'secondary', keywords: ['OECD', 'AI policy', 'international', 'governance', 'principles'], url: rss('https://news.google.com/rss/search?q=OECD+(AI+policy+OR+"AI+principles")+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Future of Life Institute', tier: 'secondary', keywords: ['existential risk', 'AI safety', 'pause', 'open letter', 'governance'], url: rss('https://news.google.com/rss/search?q=site:futureoflife.org+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Center for AI Safety',  tier: 'secondary', keywords: ['AI safety', 'catastrophic risk', 'biosecurity', 'AI risk', 'CAIS'], url: rss('https://news.google.com/rss/search?q="Center+for+AI+Safety"+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Export Controls',    tier: 'primary',   keywords: ['export control', 'chip ban', 'NVIDIA China', 'BIS', 'Entity List'], url: rss('https://news.google.com/rss/search?q=(AI+"export+control"+OR+chip+ban+OR+NVIDIA+China+ban+OR+BIS+AI)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Partnership on AI',     tier: 'secondary', keywords: ['PAI', 'responsible AI', 'governance', 'best practices', 'industry'], url: rss('https://news.google.com/rss/search?q="Partnership+on+AI"+when:30d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── AI Safety: Alignment & Incident Research ──────────────────────────────
  aiSafety: [
    { name: 'AI Safety News',        tier: 'primary',   keywords: ['AI safety', 'alignment', 'AI risk', 'dangerous capability', 'red team'], url: rss('https://news.google.com/rss/search?q=("AI+safety"+OR+"AI+alignment"+OR+"AI+risk")+research+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Alignment Forum',       tier: 'primary',   keywords: ['alignment', 'inner alignment', 'mesa-optimization', 'corrigibility', 'RLHF'], url: rss('https://www.alignmentforum.org/feed.xml') },
    { name: 'LessWrong AI',          tier: 'secondary', keywords: ['AI risk', 'AGI', 'alignment', 'Yudkowsky', 'cognitive science'], url: rss('https://news.google.com/rss/search?q=site:lesswrong.com+AI+alignment+OR+AI+safety+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Safety Orgs Research',  tier: 'primary',   keywords: ['METR', 'Apollo Research', 'Redwood Research', 'ARC Evals', 'dangerous capabilities'], url: rss('https://news.google.com/rss/search?q=(METR+OR+"Apollo+Research"+OR+"Redwood+Research"+OR+"ARC+Evals")+AI+safety+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Incidents Database', tier: 'primary',   keywords: ['AI incident', 'AI failure', 'misuse', 'harm', 'AI error'], url: rss('https://news.google.com/rss/search?q=("AI+incident"+OR+"AI+harm"+OR+AI+misuse+OR+"AI+safety+incident")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Anthropic Safety',      tier: 'primary',   keywords: ['Constitutional AI', 'interpretability', 'circuits', 'safety', 'Claude alignment'], url: rss('https://news.google.com/rss/search?q=Anthropic+(safety+OR+alignment+OR+interpretability+OR+research)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DeepMind Safety',       tier: 'primary',   keywords: ['safety', 'specification', 'corrigibility', 'scalable oversight', 'debate'], url: rss('https://news.google.com/rss/search?q=DeepMind+(safety+OR+alignment+OR+"responsible+AI")+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MIRI Research',         tier: 'secondary', keywords: ['MIRI', 'decision theory', 'agent foundations', 'logical uncertainty', 'AI risk'], url: rss('https://news.google.com/rss/search?q="Machine+Intelligence+Research+Institute"+OR+MIRI+AI+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Safety Newsletter',  tier: 'secondary', keywords: ['AI safety', 'weekly', 'digest', 'alignment', 'research'], url: rss('https://news.google.com/rss/search?q=("AI+safety"+newsletter+OR+digest+OR+weekly)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── Open Source AI: Ecosystem & Releases ──────────────────────────────────
  openSource: [
    { name: 'Hugging Face Blog',     tier: 'primary',   keywords: ['open source', 'model release', 'fine-tuning', 'dataset', 'PEFT', 'LoRA'], url: rss('https://huggingface.co/blog/feed.xml') },
    { name: 'Open Weight Models',    tier: 'primary',   keywords: ['open weights', 'open source LLM', 'Llama', 'Mistral', 'Qwen', 'Falcon'], url: rss('https://news.google.com/rss/search?q=("open+source"+AI+model+OR+"open+weights"+OR+"open-source+LLM")+release+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Ollama / LM Studio',    tier: 'secondary', keywords: ['Ollama', 'LM Studio', 'local LLM', 'GGUF', 'llama.cpp', 'vLLM'], url: rss('https://news.google.com/rss/search?q=(Ollama+OR+LMStudio+OR+vLLM+OR+llama.cpp+OR+GGUF)+(release+OR+update)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EleutherAI',            tier: 'secondary', keywords: ['EleutherAI', 'GPT-NeoX', 'Pile', 'open research', 'evaluation harness'], url: rss('https://news.google.com/rss/search?q=EleutherAI+(release+OR+research+OR+model)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'PyTorch Blog',          tier: 'primary',   keywords: ['PyTorch', 'release', 'training', 'distributed', 'torch compile'], url: rss('https://pytorch.org/blog/feed.xml') },
    { name: 'Meta Open Source AI',   tier: 'primary',   keywords: ['Llama', 'Meta AI', 'open source', 'release', 'model weights'], url: rss('https://news.google.com/rss/search?q=(Meta+Llama+OR+"Llama+3"+OR+"Llama+4")+open+source+release+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'GitHub AI Trending',    tier: 'secondary', keywords: ['trending', 'repository', 'stars', 'open source', 'AI project'], url: rss('https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml') },
    { name: 'Open Source AI Models', tier: 'secondary', keywords: ['Mistral', 'Qwen', 'Gemma', 'Falcon', 'DeepSeek', 'Phi'], url: rss('https://news.google.com/rss/search?q=(Mistral+OR+Qwen+OR+Gemma+OR+DeepSeek+OR+Phi+Microsoft)+open+source+release+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'JAX / Flax / TF',       tier: 'secondary', keywords: ['JAX', 'Flax', 'TensorFlow', 'TPU', 'XLA', 'ML framework'], url: rss('https://news.google.com/rss/search?q=(JAX+Google+OR+Flax+OR+TensorFlow+2)+release+OR+update+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],

  // ── Enterprise AI: Adoption & Tools ───────────────────────────────────────
  enterpriseAI: [
    { name: 'Enterprise AI News',    tier: 'primary',   keywords: ['enterprise AI', 'AI adoption', 'AI deployment', 'ROI', 'enterprise model'], url: rss('https://news.google.com/rss/search?q=("enterprise+AI"+OR+"AI+adoption"+OR+"AI+deployment")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Databricks AI',         tier: 'primary',   keywords: ['DBRX', 'Databricks', 'data lakehouse', 'MosaicML', 'MLflow'], url: rss('https://news.google.com/rss/search?q=Databricks+(AI+OR+DBRX+OR+release)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Snowflake AI',          tier: 'secondary', keywords: ['Snowflake', 'Arctic', 'Cortex', 'data cloud', 'AI'], url: rss('https://news.google.com/rss/search?q=Snowflake+(AI+OR+Arctic+OR+Cortex)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Salesforce AI',         tier: 'secondary', keywords: ['Salesforce', 'Einstein', 'Agentforce', 'CRM AI', 'Slack AI'], url: rss('https://news.google.com/rss/search?q=Salesforce+(AI+OR+Einstein+OR+Agentforce)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'IBM watsonx',           tier: 'secondary', keywords: ['watsonx', 'IBM', 'Granite', 'enterprise AI', 'foundation model'], url: rss('https://news.google.com/rss/search?q=IBM+(watsonx+OR+Granite+AI)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Palantir AI',           tier: 'secondary', keywords: ['Palantir', 'AIP', 'AI platform', 'defense AI', 'government AI'], url: rss('https://news.google.com/rss/search?q=Palantir+(AI+OR+AIP)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Microsoft Copilot',     tier: 'primary',   keywords: ['Copilot', 'Microsoft 365', 'Azure OpenAI', 'enterprise', 'productivity'], url: rss('https://news.google.com/rss/search?q=Microsoft+(Copilot+OR+"Azure+OpenAI"+OR+AI+enterprise)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Google Workspace AI',   tier: 'primary',   keywords: ['Google Workspace', 'Duet AI', 'Gemini for Work', 'enterprise', 'productivity'], url: rss('https://news.google.com/rss/search?q=Google+("Workspace+AI"+OR+"Gemini+for+Work"+OR+"Duet+AI")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'ServiceNow & SAP AI',   tier: 'secondary', keywords: ['ServiceNow AI', 'SAP AI', 'workflow', 'enterprise automation', 'ERP AI'], url: rss('https://news.google.com/rss/search?q=(ServiceNow+AI+OR+SAP+AI+OR+Workday+AI+OR+Oracle+AI)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// Variant-aware exports
export const FEEDS = SITE_VARIANT === 'ai'
  ? AI_FEEDS
  : SITE_VARIANT === 'tech'
  ? TECH_FEEDS
  : SITE_VARIANT === 'finance'
    ? FINANCE_FEEDS
    : SITE_VARIANT === 'happy'
      ? HAPPY_FEEDS
      : SITE_VARIANT === 'commodity'
        ? COMMODITY_FEEDS
        : FULL_FEEDS;

export const SOURCE_REGION_MAP: Record<string, { labelKey: string; feedKeys: string[] }> = {
  // Full (geopolitical) variant regions
  worldwide: { labelKey: 'header.sourceRegionWorldwide', feedKeys: ['politics', 'crisis'] },
  us: { labelKey: 'header.sourceRegionUS', feedKeys: ['us', 'gov'] },
  europe: { labelKey: 'header.sourceRegionEurope', feedKeys: ['europe'] },
  middleeast: { labelKey: 'header.sourceRegionMiddleEast', feedKeys: ['middleeast'] },
  africa: { labelKey: 'header.sourceRegionAfrica', feedKeys: ['africa'] },
  latam: { labelKey: 'header.sourceRegionLatAm', feedKeys: ['latam'] },
  asia: { labelKey: 'header.sourceRegionAsiaPacific', feedKeys: ['asia'] },
  topical: { labelKey: 'header.sourceRegionTopical', feedKeys: ['energy', 'tech', 'ai', 'finance', 'layoffs', 'thinktanks'] },
  intel: { labelKey: 'header.sourceRegionIntel', feedKeys: [] },

  // Tech variant regions
  techNews: { labelKey: 'header.sourceRegionTechNews', feedKeys: ['tech', 'hardware'] },
  aiMl: { labelKey: 'header.sourceRegionAiMl', feedKeys: ['ai'] },
  startupsVc: { labelKey: 'header.sourceRegionStartupsVc', feedKeys: ['startups', 'vcblogs', 'funding', 'unicorns', 'accelerators', 'ipo'] },
  regionalTech: { labelKey: 'header.sourceRegionRegionalTech', feedKeys: ['regionalStartups'] },
  developer: { labelKey: 'header.sourceRegionDeveloper', feedKeys: ['github', 'cloud', 'dev', 'producthunt', 'outages'] },
  cybersecurity: { labelKey: 'header.sourceRegionCybersecurity', feedKeys: ['security'] },
  techPolicy: { labelKey: 'header.sourceRegionTechPolicy', feedKeys: ['policy', 'thinktanks'] },
  techMedia: { labelKey: 'header.sourceRegionTechMedia', feedKeys: ['podcasts', 'layoffs', 'finance'] },

  // AI variant regions
  aiResearch:       { labelKey: 'header.sourceRegionAiResearch',       feedKeys: ['research', 'architectures'] },
  aiModels:         { labelKey: 'header.sourceRegionAiModels',          feedKeys: ['modelReleases'] },
  aiAgents:         { labelKey: 'header.sourceRegionAiAgents',          feedKeys: ['agenticAI', 'worldModels'] },
  aiPhysical:       { labelKey: 'header.sourceRegionAiPhysical',        feedKeys: ['physicalAI'] },
  aiMarket:         { labelKey: 'header.sourceRegionAiMarket',          feedKeys: ['ventureFunding', 'enterpriseAI'] },
  aiInfra:          { labelKey: 'header.sourceRegionAiInfra',           feedKeys: ['aiInfrastructure'] },
  aiGovernance:     { labelKey: 'header.sourceRegionAiGovernance',      feedKeys: ['aiPolicy', 'aiSafety'] },
  aiOpenSource:     { labelKey: 'header.sourceRegionAiOpenSource',      feedKeys: ['openSource'] },

  // Finance variant regions
  marketsAnalysis: { labelKey: 'header.sourceRegionMarkets', feedKeys: ['markets', 'analysis', 'ipo'] },
  fixedIncomeFx: { labelKey: 'header.sourceRegionFixedIncomeFx', feedKeys: ['forex', 'bonds'] },
  commoditiesRegion: { labelKey: 'header.sourceRegionCommodities', feedKeys: ['commodities'] },
  cryptoDigital: { labelKey: 'header.sourceRegionCryptoDigital', feedKeys: ['crypto', 'fintech'] },
  centralBanksEcon: { labelKey: 'header.sourceRegionCentralBanks', feedKeys: ['centralbanks', 'economic'] },
  dealsCorpFin: { labelKey: 'header.sourceRegionDeals', feedKeys: ['institutional', 'derivatives'] },
  finRegulation: { labelKey: 'header.sourceRegionFinRegulation', feedKeys: ['regulation'] },
  gulfMena: { labelKey: 'header.sourceRegionGulfMena', feedKeys: ['gccNews'] },
};

export const INTEL_SOURCES: Feed[] = [
  // Defense & Security (Tier 1)
  { name: 'Defense One', url: rss('https://www.defenseone.com/rss/all/'), type: 'defense' },
  { name: 'The War Zone', url: rss('https://www.twz.com/feed'), type: 'defense' },
  { name: 'Defense News', url: rss('https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml'), type: 'defense' },
  { name: 'Janes', url: rss('https://news.google.com/rss/search?q=site:janes.com+when:3d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'Military Times', url: rss('https://www.militarytimes.com/arc/outboundfeeds/rss/?outputType=xml'), type: 'defense' },
  { name: 'Task & Purpose', url: rss('https://taskandpurpose.com/feed/'), type: 'defense' },
  { name: 'USNI News', url: rss('https://news.usni.org/feed'), type: 'defense' },
  { name: 'gCaptain', url: rss('https://gcaptain.com/feed/'), type: 'defense' },
  { name: 'Oryx OSINT', url: rss('https://www.oryxspioenkop.com/feeds/posts/default?alt=rss'), type: 'defense' },
  { name: 'UK MOD', url: rss('https://www.gov.uk/government/organisations/ministry-of-defence.atom'), type: 'defense' },
  { name: 'CSIS', url: rss('https://news.google.com/rss/search?q=site:csis.org&hl=en&gl=US&ceid=US:en'), type: 'defense' },

  // International Relations (Tier 2)
  { name: 'Chatham House', url: rss('https://news.google.com/rss/search?q=site:chathamhouse.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'ECFR', url: rss('https://news.google.com/rss/search?q=site:ecfr.eu+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'Foreign Policy', url: rss('https://foreignpolicy.com/feed/'), type: 'intl' },
  { name: 'Foreign Affairs', url: rss('https://www.foreignaffairs.com/rss.xml'), type: 'intl' },
  { name: 'Atlantic Council', url: railwayRss('https://www.atlanticcouncil.org/feed/'), type: 'intl' },
  { name: 'Middle East Institute', url: rss('https://news.google.com/rss/search?q=site:mei.edu+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },

  // Think Tanks & Research (Tier 3)
  { name: 'RAND', url: rss('https://www.rand.org/pubs/articles.xml'), type: 'research' },
  { name: 'Brookings', url: rss('https://news.google.com/rss/search?q=site:brookings.edu&hl=en&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Carnegie', url: rss('https://news.google.com/rss/search?q=site:carnegieendowment.org&hl=en&gl=US&ceid=US:en'), type: 'research' },
  { name: 'FAS', url: rss('https://news.google.com/rss/search?q=site:fas.org+nuclear+weapons+security&hl=en&gl=US&ceid=US:en'), type: 'research' },
  { name: 'NTI', url: rss('https://news.google.com/rss/search?q=site:nti.org+when:30d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'RUSI', url: rss('https://news.google.com/rss/search?q=site:rusi.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Wilson Center', url: rss('https://news.google.com/rss/search?q=site:wilsoncenter.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'GMF', url: rss('https://news.google.com/rss/search?q=site:gmfus.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Stimson Center', url: rss('https://www.stimson.org/feed/'), type: 'research' },
  { name: 'CNAS', url: rss('https://news.google.com/rss/search?q=site:cnas.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Lowy Institute', url: rss('https://news.google.com/rss/search?q=site:lowyinstitute.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },

  // Nuclear & Arms Control (Tier 2)
  { name: 'Arms Control Assn', url: rss('https://news.google.com/rss/search?q=site:armscontrol.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'nuclear' },
  { name: 'Bulletin of Atomic Scientists', url: rss('https://news.google.com/rss/search?q=site:thebulletin.org+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'nuclear' },

  // OSINT & Monitoring (Tier 2)
  { name: 'Bellingcat', url: rss('https://news.google.com/rss/search?q=site:bellingcat.com+when:30d&hl=en-US&gl=US&ceid=US:en'), type: 'osint' },
  { name: 'Krebs Security', url: rss('https://krebsonsecurity.com/feed/'), type: 'cyber' },
  { name: 'Ransomware.live', url: rss('https://www.ransomware.live/rss.xml'), type: 'cyber' },

  // Economic & Food Security (Tier 2)
  { name: 'FAO News', url: rss('https://www.fao.org/feeds/fao-newsroom-rss'), type: 'economic' },
  { name: 'FAO GIEWS', url: rss('https://news.google.com/rss/search?q=site:fao.org+GIEWS+food+security+when:30d&hl=en-US&gl=US&ceid=US:en'), type: 'economic' },
  { name: 'EU ISS', url: rss('https://news.google.com/rss/search?q=site:iss.europa.eu+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
];

// ============================================
// AI VARIANT — KEYWORD FILTERS PER CATEGORY
// Used by threat-classifier.ts to score relevance of items in each feed category.
// ============================================
export const AI_KEYWORD_FILTERS: Record<string, string[]> = {
  research:         ['paper', 'arxiv', 'preprint', 'research', 'study', 'model', 'training', 'neural', 'deep learning', 'language model', 'benchmark', 'evaluation', 'dataset'],
  architectures:    ['transformer', 'attention', 'SSM', 'Mamba', 'MoE', 'mixture of experts', 'diffusion', 'RLHF', 'RLAIF', 'multimodal', 'architecture', 'layer', 'parameter', 'context window'],
  modelReleases:    ['release', 'launch', 'announce', 'model', 'GPT', 'Claude', 'Gemini', 'Llama', 'benchmark', 'score', 'leaderboard', 'API', 'preview', 'update', 'version'],
  agenticAI:        ['agent', 'agentic', 'autonomous', 'tool use', 'multi-agent', 'planning', 'reasoning', 'SWE-bench', 'computer use', 'workflow', 'automation', 'task', 'LangChain', 'AutoGPT'],
  worldModels:      ['world model', 'video generation', 'text-to-video', 'simulation', 'physics', 'Sora', 'Runway', 'Veo', 'Kling', 'diffusion video', 'image generation', 'generative video'],
  physicalAI:       ['robot', 'robotics', 'humanoid', 'manipulation', 'locomotion', 'dexterous', 'embodied', 'sim-to-real', 'motor', 'actuator', 'bipedal', 'physical AI', 'deployment'],
  ventureFunding:   ['funding', 'raises', 'Series A', 'Series B', 'Series C', 'seed round', 'investment', 'valuation', 'unicorn', 'venture capital', 'IPO', '$', 'million', 'billion'],
  aiInfrastructure: ['GPU', 'H100', 'H200', 'B200', 'Blackwell', 'chip', 'semiconductor', 'NVIDIA', 'AMD', 'TPU', 'datacenter', 'compute', 'FLOP', 'training cluster', 'inference', 'TSMC'],
  aiPolicy:         ['regulation', 'policy', 'governance', 'law', 'legislation', 'executive order', 'EU AI Act', 'NIST', 'compliance', 'safety standard', 'ban', 'restriction', 'congress', 'parliament'],
  aiSafety:         ['safety', 'alignment', 'risk', 'dangerous capability', 'red team', 'misuse', 'incident', 'failure', 'bias', 'hallucination', 'corrigibility', 'interpretability', 'oversight'],
  openSource:       ['open source', 'open weight', 'open model', 'MIT license', 'Apache', 'release', 'GitHub', 'download', 'weights', 'fine-tuning', 'LoRA', 'GGUF', 'Hugging Face'],
  enterpriseAI:     ['enterprise', 'deployment', 'adoption', 'ROI', 'productivity', 'copilot', 'workspace', 'B2B', 'SaaS', 'integration', 'platform', 'customer', 'workflow', 'automation'],
};

// Default-enabled sources per panel (Tier 1+2 priority, ≥8 per panel)
export const DEFAULT_ENABLED_SOURCES: Record<string, string[]> = {
  politics: ['BBC World', 'Guardian World', 'AP News', 'Reuters World', 'CNN World'],
  us: ['Reuters US', 'NPR News', 'PBS NewsHour', 'ABC News', 'CBS News', 'NBC News', 'Wall Street Journal', 'Politico', 'The Hill'],
  europe: ['France 24', 'EuroNews', 'Le Monde', 'DW News', 'Tagesschau', 'ANSA', 'NOS Nieuws', 'SVT Nyheter'],
  middleeast: ['BBC Middle East', 'Al Jazeera', 'Al Arabiya', 'Guardian ME', 'BBC Persian', 'Iran International', 'Haaretz', 'Asharq News', 'The National'],
  africa: ['BBC Africa', 'News24', 'Africanews', 'Jeune Afrique', 'Africa News', 'Premium Times', 'Channels TV', 'Sahel Crisis'],
  latam: ['BBC Latin America', 'Reuters LatAm', 'InSight Crime', 'Mexico News Daily', 'Clarín', 'Primicias', 'Infobae Americas', 'El Universo'],
  asia: ['BBC Asia', 'The Diplomat', 'South China Morning Post', 'Reuters Asia', 'Nikkei Asia', 'CNA', 'Asia News', 'The Hindu'],
  tech: ['Hacker News', 'Ars Technica', 'The Verge', 'MIT Tech Review'],
  ai: ['AI News', 'VentureBeat AI', 'The Verge AI', 'MIT Tech Review', 'ArXiv AI'],
  finance: ['CNBC', 'MarketWatch', 'Yahoo Finance', 'Financial Times', 'Reuters Business'],
  gov: ['White House', 'State Dept', 'Pentagon', 'UN News', 'CISA', 'Treasury', 'DOJ', 'CDC'],
  layoffs: ['Layoffs.fyi', 'TechCrunch Layoffs', 'Layoffs News'],
  thinktanks: ['Foreign Policy', 'Atlantic Council', 'Foreign Affairs', 'CSIS', 'RAND', 'Brookings', 'Carnegie', 'War on the Rocks'],
  crisis: ['CrisisWatch', 'IAEA', 'WHO', 'UNHCR'],
  energy: ['Oil & Gas', 'Nuclear Energy', 'Reuters Energy', 'Mining & Resources'],
  // AI variant panel defaults (primary tier sources only)
  research:         ['ArXiv AI', 'ArXiv ML', 'ArXiv CL', 'ArXiv CV', 'ArXiv Robotics', 'Google DeepMind Blog', 'OpenAI Research', 'Anthropic Research', 'Hugging Face Blog'],
  architectures:    ['ArXiv ML', 'Distill.pub', 'NeurIPS Papers', 'The Gradient', 'Architecture Breakthroughs'],
  modelReleases:    ['AI Model News', 'VentureBeat AI', 'The Verge AI', 'MIT Tech Review AI', 'LMSYS Chatbot Arena', 'OpenAI News', 'Anthropic News', 'Google AI News'],
  agenticAI:        ['Agentic AI News', 'SWE-bench', 'OpenAI Agents', 'Anthropic Agents', 'Google Agents', 'Agent Benchmarks'],
  worldModels:      ['World Model News', 'OpenAI Sora', 'Runway ML', 'DeepMind Genie', 'World Model Research'],
  physicalAI:       ['Physical AI News', 'Figure AI', 'Physical Intelligence', 'Boston Dynamics', 'NVIDIA Isaac/Cosmos', 'IEEE Spectrum Robotics'],
  ventureFunding:   ['AI Funding News', 'TechCrunch Venture', 'Crunchbase AI', 'a16z AI', 'Sequoia AI', 'AI Mega Rounds'],
  aiInfrastructure: ['SemiAnalysis', 'NVIDIA AI Chips', 'AMD & Custom ASICs', 'Cloud AI Infrastructure', 'AI Datacenter Projects', 'Semiconductor Fabs'],
  aiPolicy:         ['AI Policy News', 'EU AI Act Updates', 'US AI Policy', 'UK AI Safety Institute', 'China AI Regulation', 'AI Export Controls', 'Stanford HAI'],
  aiSafety:         ['AI Safety News', 'Alignment Forum', 'Safety Orgs Research', 'Anthropic Safety', 'DeepMind Safety', 'AI Incidents Database'],
  openSource:       ['Hugging Face Blog', 'Open Weight Models', 'PyTorch Blog', 'Meta Open Source AI', 'GitHub AI Trending'],
  enterpriseAI:     ['Enterprise AI News', 'Databricks AI', 'Microsoft Copilot', 'Google Workspace AI'],
};

export const DEFAULT_ENABLED_INTEL: string[] = [
  'Defense One', 'Breaking Defense', 'The War Zone', 'Defense News',
  'Military Times', 'USNI News', 'Bellingcat', 'Krebs Security',
];

export function getAllDefaultEnabledSources(): Set<string> {
  const s = new Set<string>();
  for (const names of Object.values(DEFAULT_ENABLED_SOURCES)) names.forEach(n => s.add(n));
  DEFAULT_ENABLED_INTEL.forEach(n => s.add(n));
  return s;
}

/** Sources boosted by locale (feeds tagged with matching `lang` or multi-URL key). */
export function getLocaleBoostedSources(locale: string): Set<string> {
  const lang = (locale.split('-')[0] ?? 'en').toLowerCase();
  const boosted = new Set<string>();
  if (lang === 'en') return boosted;
  const allFeeds = [...Object.values(FULL_FEEDS).flat(), ...INTEL_SOURCES];
  for (const f of allFeeds) {
    if (f.lang === lang) boosted.add(f.name);
    if (typeof f.url === 'object' && lang in f.url) boosted.add(f.name);
  }
  return boosted;
}

export function computeDefaultDisabledSources(locale?: string): string[] {
  const enabled = getAllDefaultEnabledSources();
  if (locale) {
    for (const name of getLocaleBoostedSources(locale)) enabled.add(name);
  }
  const all = new Set<string>();
  for (const feeds of Object.values(FULL_FEEDS)) for (const f of feeds) all.add(f.name);
  for (const f of INTEL_SOURCES) all.add(f.name);
  return [...all].filter(name => !enabled.has(name));
}

export function getTotalFeedCount(): number {
  const all = new Set<string>();
  for (const feeds of Object.values(FULL_FEEDS)) for (const f of feeds) all.add(f.name);
  for (const f of INTEL_SOURCES) all.add(f.name);
  return all.size;
}

if (import.meta.env.DEV) {
  const allFeedNames = new Set<string>();
  for (const feeds of Object.values(FULL_FEEDS)) for (const f of feeds) allFeedNames.add(f.name);
  for (const f of INTEL_SOURCES) allFeedNames.add(f.name);
  const defaultEnabled = getAllDefaultEnabledSources();
  for (const name of defaultEnabled) {
    if (!allFeedNames.has(name)) console.error(`[feeds] DEFAULT_ENABLED name "${name}" not found in FULL_FEEDS!`);
  }
  console.log(`[feeds] ${defaultEnabled.size} unique default-enabled sources / ${allFeedNames.size} total`);
}

// Keywords that trigger alert status - must be specific to avoid false positives
export const ALERT_KEYWORDS = [
  'war', 'invasion', 'military', 'nuclear', 'sanctions', 'missile',
  'airstrike', 'drone strike', 'troops deployed', 'armed conflict', 'bombing', 'casualties',
  'ceasefire', 'peace treaty', 'nato', 'coup', 'martial law',
  'assassination', 'terrorist', 'terror attack', 'cyber attack', 'hostage', 'evacuation order',
];

// Patterns that indicate non-alert content (lifestyle, entertainment, etc.)
export const ALERT_EXCLUSIONS = [
  'protein', 'couples', 'relationship', 'dating', 'diet', 'fitness',
  'recipe', 'cooking', 'shopping', 'fashion', 'celebrity', 'movie',
  'tv show', 'sports', 'game', 'concert', 'festival', 'wedding',
  'vacation', 'travel tips', 'life hack', 'self-care', 'wellness',
];
