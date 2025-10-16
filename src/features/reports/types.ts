// src/features/reports/types.ts
export interface DocumentStats {
  total: number;
  active: number;
  inactive: number;
  validated: number;
  pending: number;
  byPeriod: Array<{ month: string; count: number }>;
}

export interface ValidationStats {
  total: number;
  approved: number;
  rejected: number;
  returned: number;
  approvalRate: number;
  avgTime: string;
  topValidators: Array<{ name: string; count: number }>;
}

// ... demais interfaces do useReports.ts