export interface Task {
    TaskId: string;
    Title: string;
    Description: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DueDate?: string;
    Priority?: number;
    Status?: number;
    AssigneeId?: number;
    UserId?: number;
    ParentTaskId?: number;
    IsActive?: boolean;
  }