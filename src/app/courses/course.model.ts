export interface Course {
  id: number;
  schoolId: number;
  title: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  enrolled: number;
  status: 'Active' | 'Inactive';
}
