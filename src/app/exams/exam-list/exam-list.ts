import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamService } from '../exam';
import { Exam } from '../exam.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.css',
})
export class ExamList implements OnInit {
  exams: Exam[] = [];
  filtered: Exam[] = [];
  activeTab: 'all' | Exam['status'] = 'all';
  stats = { total: 0, upcoming: 0, completed: 0 };

  get isAdmin() { return this.auth.isAdmin(); }

  constructor(private service: ExamService, private auth: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.exams  = this.service.getAll();
    this.stats  = this.service.getStats();
    this.applyFilter();
  }

  setTab(tab: 'all' | Exam['status']) { this.activeTab = tab; this.applyFilter(); }

  applyFilter() {
    this.filtered = this.activeTab === 'all'
      ? [...this.exams]
      : this.exams.filter(e => e.status === this.activeTab);
  }

  delete(id: number) {
    if (confirm('Delete this exam?')) { this.service.delete(id); this.load(); }
  }
}
