export interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  principalName: string;
  establishedYear: number;
  status: 'active' | 'inactive';
}
