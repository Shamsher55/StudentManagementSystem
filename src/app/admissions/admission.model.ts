export interface Admission {
  id: number;
  schoolId: number;
  applicantName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  program: string;
  previousSchool: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}
