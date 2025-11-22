
export enum OracleMode {
  NAMING = 'NAMING',
  PARTNERS = 'PARTNERS',
  TIMING = 'TIMING',
  FENGSHUI = 'FENGSHUI',
  DIVINATION = 'DIVINATION',
  HOME = 'HOME'
}

export interface UserProfile {
  name: string;
  phone: string;
  gender: 'male' | 'female' | '';
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string; // New field for True Solar Time
}

export interface OracleResponse {
  markdown: string;
  fortuneScore?: number; // 0-100
  luckyColor?: string;
  luckyDirection?: string;
}

export interface DailyFortune {
  date: string;
  auspicious: string[]; // 宜
  inauspicious: string[]; // 忌
  quote: string;
  level: string; // e.g., "Code Red", "Green Light"
}

export interface NamingRequest {
  industry: string;
  targetAudience: string;
}

export interface PartnerRequest {
  partnerBirthDate: string;
  partnerBirthTime?: string; // Optional for partner if unknown
  myRole: string;
  partnerRole: string;
}

export interface TimingRequest {
  eventType: string; // Funding, Launch, Layoff, etc.
}

export interface DivinationRequest {
  question: string;
}
