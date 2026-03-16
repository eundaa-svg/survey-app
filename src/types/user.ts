export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  completedSurveys: number;
  totalPoints: number;
  joinedDate: Date;
}
