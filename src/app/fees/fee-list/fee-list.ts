import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeeService } from '../fee';
import { Fee, FeeStatus } from '../fee.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-fee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fee-list.html',
  styleUrl: './fee-list.css',
})
export class FeeList implements OnInit {
  fees: Fee[] = [];
  filtered: Fee[] = [];
  activeTab: 'all' | FeeStatus = 'all';
  stats = { total: 0, collected: 0, pending: 0, overdue: 0, paidCount: 0, pendingCount: 0, overdueCount: 0 };

  get isAdmin() { return this.auth.isAdmin(); }

  constructor(private service: FeeService, private auth: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.fees  = this.service.getAll();
    this.stats = this.service.getStats();
    this.applyFilter();
  }

  setTab(tab: 'all' | FeeStatus) { this.activeTab = tab; this.applyFilter(); }

  applyFilter() {
    this.filtered = this.activeTab === 'all'
      ? [...this.fees]
      : this.fees.filter(f => f.status === this.activeTab);
  }

  markPaid(id: number) { this.service.markPaid(id); this.load(); }

  delete(id: number) {
    if (confirm('Delete this fee record?')) { this.service.delete(id); this.load(); }
  }

  fmtSAR(n: number) { return 'SAR ' + n.toLocaleString(); }
}
