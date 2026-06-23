import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdmissionService } from '../admission';
import { Admission } from '../admission.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-admission-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admission-detail.html',
  styleUrl: './admission-detail.css',
})
export class AdmissionDetail implements OnInit {
  admission: Admission | undefined;
  get isAdmin() { return this.auth.isAdmin(); }

  constructor(
    private service: AdmissionService,
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.admission = this.service.getById(+id);
  }

  approve() {
    if (this.admission) { this.service.updateStatus(this.admission.id, 'approved'); this.admission.status = 'approved'; }
  }

  reject() {
    if (this.admission) { this.service.updateStatus(this.admission.id, 'rejected'); this.admission.status = 'rejected'; }
  }

  back() { this.router.navigate(['/admissions']); }
}
