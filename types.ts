
export enum Perspective {
  Psychological = '心理学视角',
  Cultural = '文化象征视角',
  Creative = '创意灵感视角'
}

export interface DreamTag {
  id: string;
  type: 'emotion' | 'object' | 'person' | 'location';
  label: string;
}

export interface DreamRecord {
  id: string;
  content: string;
  timestamp: number;
  tags: DreamTag[];
  perspectives: Perspective[];
}

export interface AnalysisSection {
  title: string;
  content: string;
  icon?: string;
}

export interface GeminiAnalysisResponse {
  mainAnalysis: string; // 核心解析
  sections: AnalysisSection[]; // 视角解析（心理/文化/创意）
  lifeWorkAdvice: string; // 生活与工作建议
  adjustmentTips: string; // 自我调适建议
  isNightmare: boolean;
  healingMessage?: string; // 如果是噩梦，提供的治愈寄语
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
