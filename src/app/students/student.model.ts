export interface Student {
  id: number;
  schoolId: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  status: 'Active' | 'Inactive';
}
