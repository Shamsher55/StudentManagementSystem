import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimetableService, DAYS } from '../timetable';
import { TimetableSlot, WeekDay } from '../timetable.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-timetable-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './timetable-view.html',
  styleUrl: './timetable-view.css',
})
export class TimetableView implements OnInit {
  days = DAYS;
  slotsByDay: Record<WeekDay, TimetableSlot[]> = {} as any;

  get isAdmin() { return this.auth.isAdmin(); }

  constructor(private service: TimetableService, private auth: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe(slots => {
      for (const day of this.days) {
        this.slotsByDay[day] = slots
          .filter(s => s.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
      }
    });
  }

  delete(id: number) {
    if (confirm('Remove this slot?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
