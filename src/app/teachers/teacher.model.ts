export interface Teacher {
  id: number;
  schoolId: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  courses: string[];
}
