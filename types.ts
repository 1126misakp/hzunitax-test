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

export interface DownloadConfig {
  name: string;
  url: string;
}

export interface FileMapping {
  id: string;
  uploadName: string;   // e.g. "测试1"
  downloads: DownloadConfig[]; // Array of up to 3 files
}
