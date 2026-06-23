export type FeeStatus = 'paid' | 'pending' | 'overdue';
export type FeeType   = 'tuition' | 'exam' | 'library' | 'transport' | 'activity';

export interface Fee {
  id: number;
  schoolId: number;
  studentId: number;
  studentName: string;
  type: FeeType;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: FeeStatus;
  receiptNo?: string;
}
