export interface User {
    UserId: number;
    Name: string;
    Email: string;
    Profile: number;
    Phone?: string;
    Password?:string;
    PreferredLanguage?: string;
    PreferredTheme?: string;
    CompanyId?: number;
    CreatedAt?: string;
    UpdatedAt?: string;
    IsActive?: boolean;
  }
