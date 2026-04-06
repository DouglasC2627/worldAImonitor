// AI Geography — research labs, GPU clusters, chip fabs, robotics HQs, policy hubs, accelerators
// Each entry follows: { id, name, lat, lon, type, tier?, founded?, funding?, note? }

export type AIGeoType =
  | 'lab'         // AI research lab HQ
  | 'datacenter'  // GPU cluster / AI supercomputer
  | 'chip_fab'    // Semiconductor fabrication facility
  | 'robotics'    // Robotics company HQ / primary deployment site
  | 'policy_hub'  // AI governance / regulatory body
  | 'accelerator' // AI-focused accelerator or incubator

export interface AIGeoEntry {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: AIGeoType;
  /** 1=frontier/tier-1, 2=leading, 3=emerging */
  tier?: 1 | 2 | 3;
  country: string;
  city: string;
  founded?: number;
  /** Total funding raised, USD billions */
  funding?: number;
  note?: string;
}

// ─── AI Research Lab Headquarters ────────────────────────────────────────────

export const AI_LAB_HQS: AIGeoEntry[] = [
  // Tier 1 — Frontier labs
  { id: 'openai', name: 'OpenAI', city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194, type: 'lab', tier: 1, founded: 2015, funding: 17.9, note: 'GPT-4o, o3, Sora' },
  { id: 'anthropic', name: 'Anthropic', city: 'San Francisco', country: 'USA', lat: 37.7880, lon: -122.4007, type: 'lab', tier: 1, founded: 2021, funding: 12.4, note: 'Claude series, Constitutional AI' },
  { id: 'google-deepmind', name: 'Google DeepMind', city: 'London', country: 'UK', lat: 51.5252, lon: -0.1340, type: 'lab', tier: 1, founded: 2010, funding: 0, note: 'Gemini, AlphaFold, AlphaCode' },
  { id: 'google-deepmind-mtv', name: 'Google DeepMind (Mountain View)', city: 'Mountain View', country: 'USA', lat: 37.4220, lon: -122.0841, type: 'lab', tier: 1, founded: 2010 },
  { id: 'meta-ai', name: 'Meta AI', city: 'Menlo Park', country: 'USA', lat: 37.4848, lon: -122.1484, type: 'lab', tier: 1, founded: 2013, note: 'Llama series, FAIR' },
  { id: 'xai', name: 'xAI', city: 'Memphis', country: 'USA', lat: 35.1495, lon: -90.0490, type: 'lab', tier: 1, founded: 2023, funding: 6.0, note: 'Grok, Colossus supercluster' },
  { id: 'microsoft-ai', name: 'Microsoft AI', city: 'Redmond', country: 'USA', lat: 47.6740, lon: -122.1215, type: 'lab', tier: 1, founded: 1991, note: 'Copilot, Azure AI, OpenAI partnership' },

  // Tier 2 — Leading labs
  { id: 'mistral', name: 'Mistral AI', city: 'Paris', country: 'France', lat: 48.8721, lon: 2.3438, type: 'lab', tier: 2, founded: 2023, funding: 1.1, note: 'Mistral-7B, Mixtral MoE' },
  { id: 'cohere', name: 'Cohere', city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, type: 'lab', tier: 2, founded: 2019, funding: 0.97, note: 'Command, Embed, enterprise NLP' },
  { id: 'ai21', name: 'AI21 Labs', city: 'Tel Aviv', country: 'Israel', lat: 32.0879, lon: 34.7796, type: 'lab', tier: 2, founded: 2017, funding: 0.34, note: 'Jamba MoE, Jurassic series' },
  { id: 'inflection', name: 'Inflection AI', city: 'Palo Alto', country: 'USA', lat: 37.4419, lon: -122.1430, type: 'lab', tier: 2, founded: 2022, funding: 1.5, note: 'Pi assistant; core team moved to Microsoft' },
  { id: 'stability-ai', name: 'Stability AI', city: 'London', country: 'UK', lat: 51.5139, lon: -0.1421, type: 'lab', tier: 2, founded: 2020, funding: 0.15, note: 'Stable Diffusion open-source image models' },
  { id: 'aleph-alpha', name: 'Aleph Alpha', city: 'Heidelberg', country: 'Germany', lat: 49.3988, lon: 8.6724, type: 'lab', tier: 2, founded: 2019, funding: 0.5, note: 'Luminous, European sovereign AI' },
  { id: 'adept', name: 'Adept AI', city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194, type: 'lab', tier: 2, founded: 2022, funding: 0.415, note: 'Action-oriented agents, ACT-1' },
  { id: 'writer', name: 'Writer', city: 'San Francisco', country: 'USA', lat: 37.7858, lon: -122.4008, type: 'lab', tier: 2, founded: 2020, funding: 0.326, note: 'Palmyra enterprise LLMs' },
  { id: 'together-ai', name: 'Together AI', city: 'San Francisco', country: 'USA', lat: 37.7762, lon: -122.4132, type: 'lab', tier: 2, founded: 2022, funding: 0.228, note: 'Open-source model cloud, RedPajama' },

  // Tier 3 — Emerging labs
  { id: 'sakana', name: 'Sakana AI', city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, type: 'lab', tier: 3, founded: 2023, funding: 0.03, note: 'Nature-inspired AI; David Ha co-founder' },
  { id: 'moonshot', name: 'Moonshot AI', city: 'Beijing', country: 'China', lat: 39.9696, lon: 116.3307, type: 'lab', tier: 3, founded: 2023, funding: 1.0, note: 'Kimi chat; long-context focus' },
  { id: 'zhipu', name: 'Zhipu AI', city: 'Beijing', country: 'China', lat: 39.9927, lon: 116.3271, type: 'lab', tier: 3, founded: 2019, funding: 0.4, note: 'ChatGLM, GLM-4 series' },
  { id: 'baidu-ai', name: 'Baidu AI', city: 'Beijing', country: 'China', lat: 40.0500, lon: 116.2985, type: 'lab', tier: 2, founded: 2000, note: 'ERNIE Bot, Wenxin models' },
  { id: '01ai', name: '01.AI', city: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, type: 'lab', tier: 3, founded: 2023, funding: 0.2, note: 'Yi model family; Kai-Fu Lee' },
  { id: 'lightspeed-tencent', name: 'Tencent AI Lab', city: 'Shenzhen', country: 'China', lat: 22.5431, lon: 114.0579, type: 'lab', tier: 2, founded: 2016, note: 'HunYuan, Tencent AI research' },
  { id: 'minimax', name: 'MiniMax', city: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, type: 'lab', tier: 3, founded: 2021, funding: 0.6, note: 'ABAB models, multimodal AI' },
  { id: 'tii', name: 'Technology Innovation Institute', city: 'Abu Dhabi', country: 'UAE', lat: 24.4847, lon: 54.3680, type: 'lab', tier: 3, founded: 2020, note: 'Falcon open-source LLMs' },
  { id: 'ai2', name: 'Allen Institute for AI', city: 'Seattle', country: 'USA', lat: 47.6205, lon: -122.3493, type: 'lab', tier: 2, founded: 2014, note: 'OLMo, Dolma, open research models' },
  { id: 'nvidia-research', name: 'NVIDIA Research', city: 'Santa Clara', country: 'USA', lat: 37.3708, lon: -121.9675, type: 'lab', tier: 1, founded: 1993, note: 'Nemotron, CUDA ecosystem, AI hardware' },
  { id: 'apple-ml', name: 'Apple Machine Learning', city: 'Cupertino', country: 'USA', lat: 37.3382, lon: -122.0091, type: 'lab', tier: 1, founded: 2018, note: 'On-device LLMs, Apple Intelligence, MLX' },
  { id: 'amazon-alexa-ai', name: 'Amazon AGI', city: 'Seattle', country: 'USA', lat: 47.6062, lon: -122.3321, type: 'lab', tier: 1, founded: 2015, note: 'Titan, Nova, Bedrock; $4B Anthropic partner' },
];

// ─── GPU Datacenters & AI Supercomputers ─────────────────────────────────────

export const AI_DATACENTERS: AIGeoEntry[] = [
  // xAI / Tesla
  { id: 'colossus-memphis', name: 'Colossus (xAI)', city: 'Memphis', country: 'USA', lat: 35.1495, lon: -90.0490, type: 'datacenter', tier: 1, note: '200k+ H100/H200 GPUs; world\'s largest single GPU cluster (2024)' },

  // Microsoft / OpenAI
  { id: 'stargate-abilene', name: 'Project Stargate — Abilene TX', city: 'Abilene', country: 'USA', lat: 32.4487, lon: -99.7331, type: 'datacenter', tier: 1, note: '$100B Stargate initiative; first major site' },
  { id: 'stargate-wyoming', name: 'Project Stargate — Wyoming', city: 'Cheyenne', country: 'USA', lat: 41.1400, lon: -104.8202, type: 'datacenter', tier: 1, note: 'Planned Stargate expansion site' },
  { id: 'microsoft-eagle', name: 'Eagle (Microsoft)', city: 'Quincy', country: 'USA', lat: 47.2343, lon: -119.8526, type: 'datacenter', tier: 1, note: 'Microsoft Azure AI supercluster; powers OpenAI training' },
  { id: 'microsoft-iowa', name: 'Microsoft AI — Iowa', city: 'Boone', country: 'USA', lat: 42.0597, lon: -93.8800, type: 'datacenter', tier: 1, note: 'Azure AI training cluster' },

  // Meta
  { id: 'meta-rsc-iowa', name: 'Meta RSC', city: 'Altoona', country: 'USA', lat: 41.6471, lon: -92.9089, type: 'datacenter', tier: 1, note: 'Meta\'s AI Research SuperCluster — 2 × 24k H100 pods' },
  { id: 'meta-dc-new-albany', name: 'Meta AI — Ohio', city: 'New Albany', country: 'USA', lat: 40.0814, lon: -82.8077, type: 'datacenter', tier: 1, note: 'Meta 500MW AI campus' },

  // CoreWeave
  { id: 'coreweave-nj', name: 'CoreWeave — New Jersey', city: 'Secaucus', country: 'USA', lat: 40.7896, lon: -74.0565, type: 'datacenter', tier: 2, note: 'CoreWeave primary GPU cloud cluster' },
  { id: 'coreweave-chicago', name: 'CoreWeave — Chicago', city: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298, type: 'datacenter', tier: 2, note: 'CoreWeave H100 cluster' },
  { id: 'coreweave-uk', name: 'CoreWeave — UK', city: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, type: 'datacenter', tier: 2, note: 'CoreWeave European expansion' },

  // Google
  { id: 'google-tpu-iowa', name: 'Google TPU Pod — Iowa', city: 'Council Bluffs', country: 'USA', lat: 41.2619, lon: -95.8608, type: 'datacenter', tier: 1, note: 'Google TPU v5 training cluster' },
  { id: 'google-tpu-finland', name: 'Google TPU — Hamina', city: 'Hamina', country: 'Finland', lat: 60.5673, lon: 27.1977, type: 'datacenter', tier: 1, note: 'Google European AI training hub' },

  // Amazon
  { id: 'aws-trainium-ohio', name: 'AWS Trainium — Ohio', city: 'Columbus', country: 'USA', lat: 39.9612, lon: -82.9988, type: 'datacenter', tier: 1, note: 'AWS Trainium2 AI accelerator cluster' },

  // Sovereign / Government
  { id: 'isambard-ai', name: 'Isambard-AI (UK)', city: 'Bristol', country: 'UK', lat: 51.4545, lon: -2.5879, type: 'datacenter', tier: 2, note: 'UK\'s National AI Research Resource; 5k GH200 GPUs' },
  { id: 'jean-zay', name: 'Jean Zay — IDRIS', city: 'Paris', country: 'France', lat: 48.7066, lon: 2.1749, type: 'datacenter', tier: 2, note: 'French national AI supercomputer; V100/A100 nodes' },
  { id: 'leonardo-eu', name: 'CINECA Leonardo', city: 'Bologna', country: 'Italy', lat: 44.4949, lon: 11.3426, type: 'datacenter', tier: 2, note: 'EuroHPC flagship supercomputer; AI research' },
  { id: 'fugaku-riken', name: 'Fugaku (RIKEN)', city: 'Kobe', country: 'Japan', lat: 34.6901, lon: 135.1956, type: 'datacenter', tier: 2, note: 'Japan\'s flagship AI/HPC system' },
  { id: 'alibaba-cloud-hq', name: 'Alibaba Cloud AI', city: 'Hangzhou', country: 'China', lat: 30.2741, lon: 120.1551, type: 'datacenter', tier: 2, note: 'Alibaba AI training hub; Qwen model training' },
  { id: 'dubai-ai-campus', name: 'UAE AI Campus', city: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, type: 'datacenter', tier: 3, note: 'G42 / TII AI compute hub; Falcon model training' },
];

// ─── Chip Fabrication Facilities ─────────────────────────────────────────────

export const AI_CHIP_FABS: AIGeoEntry[] = [
  // TSMC
  { id: 'tsmc-hsinchu', name: 'TSMC — Hsinchu (N2/N3)', city: 'Hsinchu', country: 'Taiwan', lat: 24.8138, lon: 120.9675, type: 'chip_fab', tier: 1, founded: 1987, note: 'World\'s most advanced node fab; produces H100, A100, Apple M-series' },
  { id: 'tsmc-tainan', name: 'TSMC — Tainan Science Park', city: 'Tainan', country: 'Taiwan', lat: 23.0121, lon: 120.2269, type: 'chip_fab', tier: 1, note: 'TSMC Fab 18 — 5nm/3nm flagship; N3E production' },
  { id: 'tsmc-arizona', name: 'TSMC — Arizona (N4P)', city: 'Phoenix', country: 'USA', lat: 33.4484, lon: -112.0740, type: 'chip_fab', tier: 1, founded: 2024, note: 'First TSMC US fab; N4P initially, N2 planned' },
  { id: 'tsmc-kumamoto', name: 'TSMC — Kumamoto (JASM)', city: 'Kumamoto', country: 'Japan', lat: 32.8031, lon: 130.7079, type: 'chip_fab', tier: 2, founded: 2024, note: 'Joint fab with Sony & Denso; 28nm/16nm' },

  // Samsung
  { id: 'samsung-hwaseong', name: 'Samsung — Hwaseong', city: 'Hwaseong', country: 'South Korea', lat: 37.2010, lon: 127.0685, type: 'chip_fab', tier: 1, note: 'Samsung foundry flagship; 3nm GAA node production' },
  { id: 'samsung-pyeongtaek', name: 'Samsung — Pyeongtaek', city: 'Pyeongtaek', country: 'South Korea', lat: 37.0040, lon: 127.0980, type: 'chip_fab', tier: 1, note: 'Samsung P3/P4 — DRAM & logic, largest fab complex' },
  { id: 'samsung-taylor', name: 'Samsung — Taylor, TX', city: 'Taylor', country: 'USA', lat: 30.5710, lon: -97.4097, type: 'chip_fab', tier: 2, founded: 2024, note: 'Samsung US fab; 4nm/2nm CHIPS Act recipient' },

  // Intel
  { id: 'intel-ohio', name: 'Intel — Ohio (Intel 18A)', city: 'New Albany', country: 'USA', lat: 40.0814, lon: -82.8077, type: 'chip_fab', tier: 1, founded: 2027, note: 'Intel Fab 52/62; 18A node; CHIPS Act $20B investment' },
  { id: 'intel-hillsboro', name: 'Intel — Hillsboro', city: 'Hillsboro', country: 'USA', lat: 45.5229, lon: -122.9898, type: 'chip_fab', tier: 1, founded: 1974, note: 'Intel R&D and leading-edge process dev (D1X)' },
  { id: 'intel-ireland', name: 'Intel — Leixlip', city: 'Leixlip', country: 'Ireland', lat: 53.3633, lon: -6.4975, type: 'chip_fab', tier: 2, note: 'Intel Fab 34 — first EUV fab in Europe; Meteor Lake' },
  { id: 'intel-israel', name: 'Intel — Kiryat Gat', city: 'Kiryat Gat', country: 'Israel', lat: 31.6098, lon: 34.7644, type: 'chip_fab', tier: 2, note: 'Fab 28/38; one of Intel\'s largest fabs globally' },

  // ASML (EUV equipment — critical chokepoint)
  { id: 'asml-veldhoven', name: 'ASML — Veldhoven', city: 'Veldhoven', country: 'Netherlands', lat: 51.3910, lon: 5.3981, type: 'chip_fab', tier: 1, founded: 1984, note: 'Sole producer of EUV lithography machines; critical AI chip chokepoint' },

  // SK Hynix (HBM for AI)
  { id: 'hynix-icheon', name: 'SK Hynix — Icheon', city: 'Icheon', country: 'South Korea', lat: 37.2790, lon: 127.4421, type: 'chip_fab', tier: 1, note: 'HBM3E production — AI GPU memory for NVIDIA H100/H200' },

  // Micron
  { id: 'micron-idaho', name: 'Micron — Boise', city: 'Boise', country: 'USA', lat: 43.6150, lon: -116.2023, type: 'chip_fab', tier: 2, note: 'Micron HBM and DRAM; CHIPS Act $13B expansion' },
];

// ─── Robotics Company HQs & Primary Deployment Sites ─────────────────────────

export const AI_ROBOTICS_HQS: AIGeoEntry[] = [
  // Humanoid robots
  { id: 'figure-ai', name: 'Figure AI', city: 'Sunnyvale', country: 'USA', lat: 37.3688, lon: -122.0363, type: 'robotics', tier: 1, founded: 2022, funding: 0.754, note: 'Figure 02 humanoid; partnership with BMW' },
  { id: '1x-technologies', name: '1X Technologies', city: 'Moss', country: 'Norway', lat: 59.4333, lon: 10.6667, type: 'robotics', tier: 2, founded: 2014, funding: 0.125, note: 'EVE wheeled + NEO bipedal humanoids' },
  { id: 'agility-robotics', name: 'Agility Robotics', city: 'Corvallis', country: 'USA', lat: 44.5646, lon: -123.2620, type: 'robotics', tier: 2, founded: 2015, funding: 0.178, note: 'Digit humanoid; Amazon warehouse partnership' },
  { id: 'apptronik', name: 'Apptronik', city: 'Austin', country: 'USA', lat: 30.2672, lon: -97.7431, type: 'robotics', tier: 2, founded: 2016, funding: 0.16, note: 'Apollo humanoid; NASA spinout' },
  { id: 'physical-intelligence', name: 'Physical Intelligence (π)', city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194, type: 'robotics', tier: 1, founded: 2023, funding: 0.4, note: 'π0 generalist robot policy; Chelsea Finn, Sergey Levine' },
  { id: 'unitree', name: 'Unitree Robotics', city: 'Hangzhou', country: 'China', lat: 30.2741, lon: 120.1551, type: 'robotics', tier: 2, founded: 2016, note: 'G1, H1 humanoids + Go series quadrupeds; low-cost' },
  { id: 'agibot', name: 'AgíBot (Zhiyuan Robotics)', city: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, type: 'robotics', tier: 2, founded: 2023, funding: 0.2, note: 'Humanoid manufacturing robots; Huawei backed' },

  // Quadruped / mobile robots
  { id: 'boston-dynamics', name: 'Boston Dynamics', city: 'Waltham', country: 'USA', lat: 42.3765, lon: -71.2356, type: 'robotics', tier: 1, founded: 1992, note: 'Spot quadruped, Atlas humanoid; Hyundai-owned' },
  { id: 'ghost-robotics', name: 'Ghost Robotics', city: 'Philadelphia', country: 'USA', lat: 39.9526, lon: -75.1652, type: 'robotics', tier: 2, founded: 2015, note: 'Spirit quadrupeds; US military contracts' },
  { id: 'anybotics', name: 'ANYbotics', city: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417, type: 'robotics', tier: 3, founded: 2016, note: 'ANYmal inspection robot; industrial autonomy' },

  // Autonomous vehicles / manipulation
  { id: 'waymo', name: 'Waymo', city: 'Mountain View', country: 'USA', lat: 37.4070, lon: -122.0424, type: 'robotics', tier: 1, founded: 2009, note: 'L4 autonomous robotaxi; Alphabet subsidiary' },
  { id: 'tesla-autopilot', name: 'Tesla AI / Optimus', city: 'Palo Alto', country: 'USA', lat: 37.3948, lon: -122.1500, type: 'robotics', tier: 1, founded: 2003, note: 'FSD, Optimus humanoid; Dojo supercomputer' },
  { id: 'covariant', name: 'Covariant', city: 'Emeryville', country: 'USA', lat: 37.8313, lon: -122.2916, type: 'robotics', tier: 2, founded: 2017, funding: 0.222, note: 'RFM robot foundation model; warehouse AI' },
];

// ─── AI Policy Hubs ───────────────────────────────────────────────────────────

export const AI_POLICY_HUBS: AIGeoEntry[] = [
  // International
  { id: 'ai-safety-inst-uk', name: 'UK AI Safety Institute', city: 'London', country: 'UK', lat: 51.5007, lon: -0.1246, type: 'policy_hub', founded: 2023, note: 'First national AI safety institute; Bletchley legacy' },
  { id: 'us-aisi', name: 'US AI Safety Institute (NIST)', city: 'Gaithersburg', country: 'USA', lat: 39.1329, lon: -77.2197, type: 'policy_hub', founded: 2023, note: 'NIST AISI — US AI safety evaluations and standards' },
  { id: 'eu-ai-office', name: 'EU AI Office', city: 'Brussels', country: 'Belgium', lat: 50.8503, lon: 4.3517, type: 'policy_hub', founded: 2024, note: 'Enforces EU AI Act for general-purpose AI models' },
  { id: 'un-ai-advisory', name: 'UN AI Advisory Body', city: 'Geneva', country: 'Switzerland', lat: 46.2044, lon: 6.1432, type: 'policy_hub', founded: 2023, note: 'UN Secretary-General AI Advisory Body; global governance' },
  { id: 'oecd-ai', name: 'OECD AI Policy Observatory', city: 'Paris', country: 'France', lat: 48.8584, lon: 2.2945, type: 'policy_hub', founded: 2019, note: 'OECD AI Principles; global policy monitoring' },
  { id: 'gpai', name: 'Global Partnership on AI (GPAI)', city: 'Paris', country: 'France', lat: 48.8755, lon: 2.3200, type: 'policy_hub', founded: 2020, note: 'Multi-stakeholder AI governance forum; 29 member states' },
  { id: 'bletchley-park', name: 'Bletchley Park AI Summit', city: 'Milton Keynes', country: 'UK', lat: 51.9979, lon: -0.7411, type: 'policy_hub', founded: 2023, note: 'Site of first global AI Safety Summit; Bletchley Declaration' },

  // National agencies
  { id: 'white-house-ostp', name: 'White House OSTP', city: 'Washington DC', country: 'USA', lat: 38.8977, lon: -77.0365, type: 'policy_hub', note: 'US AI policy — National AI Initiative, EO 14110' },
  { id: 'ftc-ai', name: 'US FTC — AI Enforcement', city: 'Washington DC', country: 'USA', lat: 38.9041, lon: -77.0491, type: 'policy_hub', note: 'AI consumer protection enforcement in the US' },
  { id: 'cac-china', name: 'Cyberspace Administration of China', city: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, type: 'policy_hub', note: 'Regulates generative AI, algorithm recommendations in China' },
  { id: 'dsit-uk', name: 'UK DSIT', city: 'London', country: 'UK', lat: 51.4995, lon: -0.1248, type: 'policy_hub', founded: 2023, note: 'UK Department for Science, Innovation & Technology — AI policy' },
  { id: 'bmi-germany', name: 'German Federal AI Strategy Office', city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, type: 'policy_hub', note: 'Germany AI strategy coordination; EU AI Act implementation' },
  { id: 'meti-japan', name: 'Japan METI AI Policy', city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, type: 'policy_hub', note: 'AI governance guidelines, AI Innovation Plan' },
];

// ─── AI-Focused Accelerators & Incubators ─────────────────────────────────────

export const AI_ACCELERATORS_GEO: AIGeoEntry[] = [
  // USA
  { id: 'yc-ai', name: 'Y Combinator', city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194, type: 'accelerator', founded: 2005, note: '>40% of recent batches are AI companies' },
  { id: 'a16z-speedrun', name: 'a16z Speedrun', city: 'Menlo Park', country: 'USA', lat: 37.4530, lon: -122.1817, type: 'accelerator', founded: 2024, note: 'Andreessen Horowitz AI-first accelerator' },
  { id: 'nvidia-inception-ai', name: 'NVIDIA Inception AI', city: 'Santa Clara', country: 'USA', lat: 37.3708, lon: -121.9675, type: 'accelerator', note: 'NVIDIA\'s startup program; GPU credits + go-to-market' },
  { id: 'aws-generative-ai', name: 'AWS Generative AI Accelerator', city: 'Seattle', country: 'USA', lat: 47.6205, lon: -122.3493, type: 'accelerator', founded: 2023, note: 'AWS program for generative AI startups' },
  { id: 'microsoft-for-startups', name: 'Microsoft for Startups Founders Hub', city: 'Redmond', country: 'USA', lat: 47.6740, lon: -122.1215, type: 'accelerator', note: 'Azure credits and OpenAI access for AI startups' },
  { id: 'neo-sf', name: 'NEO', city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194, type: 'accelerator', founded: 2020, note: 'AI-native community fund; Ali Partovi' },

  // UK / Europe
  { id: 'ef-london-ai', name: 'Entrepreneur First — London', city: 'London', country: 'UK', lat: 51.5174, lon: -0.0878, type: 'accelerator', founded: 2011, note: 'Talent-first program; strong AI cohorts (Wayve, Magic Pony)' },
  { id: 'ef-paris', name: 'Entrepreneur First — Paris', city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, type: 'accelerator', note: 'EF expansion into French AI ecosystem' },
  { id: 'balderton-ai', name: 'Balderton Capital AI Fund', city: 'London', country: 'UK', lat: 51.5154, lon: -0.1410, type: 'accelerator', note: 'European AI VC; early Mistral, Wayve investor' },

  // Asia / Pacific
  { id: 'ef-singapore-ai', name: 'Entrepreneur First — Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, type: 'accelerator', founded: 2016, note: 'EF APAC hub; AI startup formation' },
  { id: 'antler-ai', name: 'Antler', city: 'Singapore', country: 'Singapore', lat: 1.2897, lon: 103.8501, type: 'accelerator', founded: 2017, note: 'Global AI-focus accelerator; 25+ cities' },
  { id: 'sequoia-surge', name: 'Sequoia Surge', city: 'Singapore', country: 'Singapore', lat: 1.3100, lon: 103.8800, type: 'accelerator', founded: 2019, note: 'Sequoia\'s Asia accelerator; AI-heavy portfolio' },
  { id: 'zero-to-one', name: 'ZeroOneAI (Kai-Fu Lee)', city: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, type: 'accelerator', founded: 2020, note: 'AI-focused venture builder; 01.AI parent' },
];

// ─── Convenience aggregator ───────────────────────────────────────────────────

export const ALL_AI_GEO: AIGeoEntry[] = [
  ...AI_LAB_HQS,
  ...AI_DATACENTERS,
  ...AI_CHIP_FABS,
  ...AI_ROBOTICS_HQS,
  ...AI_POLICY_HUBS,
  ...AI_ACCELERATORS_GEO,
];

export function getAIGeoByType(type: AIGeoType): AIGeoEntry[] {
  return ALL_AI_GEO.filter(e => e.type === type);
}

export function getAIGeoByTier(tier: 1 | 2 | 3): AIGeoEntry[] {
  return ALL_AI_GEO.filter(e => e.tier === tier);
}
