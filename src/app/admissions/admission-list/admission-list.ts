import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdmissionService } from '../admission';
import { Admission } from '../admission.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admission-list.html',
  styleUrl: './admission-list.css',
})
export class AdmissionList implements OnInit {
  admissions: Admission[] = [];
  filtered: Admission[] = [];
  activeTab: 'all' | Admission['status'] = 'all';
  stats = { total: 0, pending: 0, approved: 0, rejected: 0 };

  get isAdmin() { return this.auth.isAdminOrAbove(); }

  constructor(private service: AdmissionService, private auth: Auth) {}

  ngOnInit() { this.load(); }

  errorMsg = '';

  load() {
    this.service.getAll().subscribe({
      next: admissions => {
        this.admissions = admissions;
        this.stats = {
          total:    admissions.length,
          pending:  admissions.filter(a => a.status === 'pending').length,
          approved: admissions.filter(a => a.status === 'approved').length,
          rejected: admissions.filter(a => a.status === 'rejected').length,
        };
        this.applyFilter();
      },
      error: err => {
        this.errorMsg = `Error loading admissions: ${err?.status} ${err?.message}`;
      }
    });
  }

  setTab(tab: 'all' | Admission['status']) {
    this.activeTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    this.filtered = this.activeTab === 'all'
      ? [...this.admissions]
      : this.admissions.filter(a => a.status === this.activeTab);
  }

  approve(id: number) {
    const a = this.admissions.find(x => x.id === id);
    if (a) this.service.update(id, { ...a, status: 'approved' }).subscribe(() => this.load());
  }

  reject(id: number) {
    const a = this.admissions.find(x => x.id === id);
    if (a) this.service.update(id, { ...a, status: 'rejected' }).subscribe(() => this.load());
  }

  delete(id: number) {
    if (confirm('Delete this application?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
