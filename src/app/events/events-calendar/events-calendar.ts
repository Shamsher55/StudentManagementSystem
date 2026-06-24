import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../event';
import { SchoolEvent } from '../event.model';
import { Auth } from '../../login/auth';

interface CalendarDay { date: number | null; events: SchoolEvent[]; isToday: boolean; }

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

@Component({
  selector: 'app-events-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-calendar.html',
  styleUrl: './events-calendar.css',
})
export class EventsCalendar implements OnInit {
  year  = 2026;
  month = 5;
  calendarDays: CalendarDay[] = [];
  upcomingEvents: SchoolEvent[] = [];
  allEvents: SchoolEvent[] = [];

  get monthName() { return MONTH_NAMES[this.month]; }
  get isAdmin()   { return this.auth.isAdmin(); }

  constructor(private service: EventService, private auth: Auth) {}

  ngOnInit() {
    const now = new Date();
    this.year  = now.getFullYear();
    this.month = now.getMonth();
    this.build();
  }

  build() {
    this.service.getAll().subscribe(all => {
      this.allEvents = all;
      const todayStr  = new Date().toISOString().slice(0, 10);
      const monthStr  = `${this.year}-${String(this.month + 1).padStart(2, '0')}`;
      const monthEvents = all.filter(e => e.date.startsWith(monthStr));
      const firstDay    = new Date(this.year, this.month, 1).getDay();
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

      this.calendarDays = [];
      for (let i = 0; i < firstDay; i++) this.calendarDays.push({ date: null, events: [], isToday: false });
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        this.calendarDays.push({
          date: d,
          events: monthEvents.filter(e => e.date === dateStr),
          isToday: dateStr === todayStr,
        });
      }

      this.upcomingEvents = all
        .filter(e => e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);
    });
  }

  prevMonth() { this.month--; if (this.month < 0) { this.month = 11; this.year--; } this.build(); }
  nextMonth() { this.month++; if (this.month > 11) { this.month = 0;  this.year++; } this.build(); }

  delete(id: number) {
    if (confirm('Delete event?')) {
      this.service.delete(id).subscribe(() => this.build());
    }
  }

  typeColor(type: SchoolEvent['type']): string {
    return { holiday:'#e53935', exam:'#1e88e5', event:'#43a047', meeting:'#fb8c00', sports:'#8e24aa' }[type] || '#555';
  }

  typeIcon(type: SchoolEvent['type']): string {
    return { holiday:'🏖️', exam:'📄', event:'🎉', meeting:'🤝', sports:'⚽' }[type] || '📅';
  }
}
