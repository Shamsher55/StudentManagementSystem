export type EventType = 'holiday' | 'exam' | 'event' | 'meeting' | 'sports';

export interface SchoolEvent {
  id: number;
  schoolId: number;
  title: string;
  type: EventType;
  date: string;
  endDate?: string;
  description: string;
}
