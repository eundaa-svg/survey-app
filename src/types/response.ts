export interface Response {
  id: string;
  surveyId: string;
  userId: string;
  answers: { [questionId: string]: any };
  completedAt: Date;
  timeSpent: number;
}
