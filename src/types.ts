export type NavigationTab = 
  | 'dashboard'
  | 'upload'
  | 'status'
  | 'analysis'
  | 'results'
  | 'reports'
  | 'settings';

export type MachineProfile = 'metal-cutter' | 'industrial-pump';

export type ToolWearClass = 'Fresh' | 'Moderate' | 'Broken' | 'Base';

export type AnomalyStatus = 'Normal' | 'Anomalous';

export interface AudioMetadata {
  name: string;
  size: string;
  duration: string;
  sampleRate: string;
  format: string;
  channels: string;
}

export interface ProcessingStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  latency: string;
}

export interface InspectionRecord {
  id: string;
  timestamp: string;
  machineProfile: MachineProfile;
  machineId: string;
  resultStatus: string;
  isAnomaly: boolean;
  scoreOrClass: string;
  confidence: number;
  reviewStatus: 'Approved' | 'Pending Review' | 'Flagged';
  operator: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  department: string;
  email: string;
  apiEndpoint: string;
}
