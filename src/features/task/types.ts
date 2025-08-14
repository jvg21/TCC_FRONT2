export interface Task {
    TaskId: string;
    Title: string;
    Description: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DueDate?: string;
    Priority?: string;
    Status?: string;
    AssigneeId?: string;
    UserId?: string;
    ParentTaskId?: string;
    IsActive?: string;
  }