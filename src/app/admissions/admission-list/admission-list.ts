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

  get isAdmin() { return this.auth.isAdmin(); }

  constructor(private service: AdmissionService, private auth: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.admissions = this.service.getAll();
    this.stats = this.service.getStats();
    this.applyFilter();
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
    this.service.updateStatus(id, 'approved');
    this.load();
  }

  reject(id: number) {
    this.service.updateStatus(id, 'rejected');
    this.load();
  }

  delete(id: number) {
    if (confirm('Delete this application?')) {
      this.service.delete(id);
      this.load();
    }
  }
}
