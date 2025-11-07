import { taskPriority } from '../../enum/taskPriority';

export interface DocumentStats {
  totalDocuments: number,
  activeDocuments: number,
  inactiveDocuments: number,
  approvedDocuments: number,
  pendingDocuments: number,
  rejectedDocuments: number

}

export interface DocumentMonthStatus {
  numeroMes: number,
  nomeMes: string,
  ano: number,
  totalDocumentos: number
}

export interface ValidationStats {
  totalValidations: number,
  totalApproved: number,
  totalRejected: number,
  totalInRevision: number
}

export interface ValidatorsStats {
  name: string,
  totalValidations: number,
  percentage:number
}


export interface TaskStats {
  totalTasks: number;
  completionRate: number,
  totalLate: number,
  totalCompleted: number
}

export interface TaskPriorityStats {
  priority: string,
  total: number

}
export interface GroupStats {
  total: number;
  members: number;
  avgMembersPerGroup: number;
  topGroups: Array<{ name: string; members: number }>;
}

export interface AIStats {
  totalRequests: number,
  totalTokens: number,
  requestAverageTokens: number,
  estimatedCost: number
}

export interface AIUsersStats {
  name: string;
  totalRequests: number,
  totalTokens: number,
  tokenAverage: number,
  usePercentage: number
}



export interface ReportsData {
  documents: DocumentStats;
  documentMonths: DocumentMonthStatus[];
  aiUsers: AIUsersStats[];
  userActivity: [];

  validations: ValidationStats;
  validators: ValidatorsStats[];
  tasks: TaskStats;
  taskPrioritys: TaskPriorityStats[];

  ai: AIStats;
}

// ... demais interfaces do useReports.ts