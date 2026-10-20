export interface BlogPostMetadata {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags?: string[];
  featured: boolean;
}

export interface BlogPost extends BlogPostMetadata {
  slug: string;
  content: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags?: string[];
  featured: boolean;
}

// ZKVM Tracker Types
export interface SupportedClient {
  name: string;
  color: string;
  status: 'Not Started' | 'Planning' | 'In Development' | 'Testing' | 'Production Ready' | 'Deprecated';
}

export interface ZKEVMLinks {
  github: string;
  docs: string;
  website?: string;
  license?: string;
}

export interface TestResults {
  passed: number;
  total: number;
  percentage: number;
}

export type ZKVMStatus = 'Not Started' | 'Planning' | 'In Development' | 'Testing' | 'Production Ready' | 'Deprecated';

export interface ZKEVMData {
  name: string;
  description: string;
  architecture: string; // e.g., "rv32im", "rv64ima"
  testResults: TestResults;
  status: ZKVMStatus;
  securityTests: boolean;
  openSource: boolean;
  supportedClients: SupportedClient[];
  links: ZKEVMLinks;
}

// Readiness criteria for the ZKVM Readiness table
export interface ReadinessCriteria {
  openSource: boolean;
  isaCompliance: 'pass' | 'fail' | 'partial'; // RV64IM minimum
  realTimeProving: boolean;
  soundcalcIntegration: boolean;
}

// Simplified client info for the Track page
export interface ClientInfo {
  name: string;
  type: 'execution' | 'consensus';
  description: string;
  language: string;
  links: {
    github: string;
    website?: string;
  };
  specCompliance?: 'compliant' | 'in-progress' | 'not-started';
}

// Test results for one ACT4 suite, from the zkVM test monitor
export interface TestSuiteResult {
  passed: number;
  failed: number;
  total: number;
  passRate: string;
}

// Shape of src/data/test-monitor-summary.json (written by scripts/transform-test-data.js)
export interface TestMonitorSummary {
  lastUpdated: string;
  zkvms: Record<string, {
    isa: string;
    commit: string | null;
    lastRun: string | null;
    isRV64: boolean;
    full: TestSuiteResult | null;
    standard: TestSuiteResult | null;
  }>;
}

// Media item for the Media page
export interface MediaItem {
  title: string;
  type: 'talk' | 'video' | 'podcast' | 'blog-external';
  url: string;
  date: string;
  speaker?: string;
  event?: string;
  thumbnail?: string;
  description?: string;
}
