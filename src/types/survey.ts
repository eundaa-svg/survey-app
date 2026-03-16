export interface Question {
  id: string;
  type: 'text' | 'multiple' | 'checkbox' | 'scale' | 'matrix';
  title: string;
  description?: string;
  options?: string[];
  required: boolean;
  order: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'closed' | 'draft';
  creatorId: string;
  questions: Question[];
  responseCount: number;
  rewardPoints: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyStats {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
}
