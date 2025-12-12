export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  simpleName: string; // Added to track the match key
}

export interface ProcessStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface FileMapping {
  id: string;
  uploadName: string;   // e.g. "测试1"
  downloadName: string; // e.g. "报告1.pdf"
  downloadUrl: string;  // e.g. "https://..."
}