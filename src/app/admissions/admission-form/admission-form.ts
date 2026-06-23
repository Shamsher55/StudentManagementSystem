import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdmissionService } from '../admission';

const PROGRAMS = ['Computer Science', 'Web Development', 'Data Science', 'Networking', 'Cybersecurity'];

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admission-form.html',
  styleUrl: './admission-form.css',
})
export class AdmissionForm implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(AdmissionService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  form = this.fb.group({
    applicantName: ['', [Validators.required, Validators.minLength(3)]],
    email:         ['', [Validators.required, Validators.email]],
    phone:         ['', Validators.required],
    dateOfBirth:   ['', Validators.required],
    gender:        ['male', Validators.required],
    address:       ['', Validators.required],
    program:       ['Computer Science', Validators.required],
    previousSchool:['', Validators.required],
    appliedDate:   [new Date().toISOString().slice(0,10), Validators.required],
    status:        ['pending'],
    notes:         [''],
  });

  programs = PROGRAMS;
  editId: number | null = null;
  get isEdit() { return this.editId !== null; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      const entry = this.service.getById(this.editId);
      if (entry) this.form.patchValue(entry as any);
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value as any;
    if (this.isEdit) {
      this.service.update(this.editId!, v);
    } else {
      this.service.add(v);
    }
    this.router.navigate(['/admissions']);
  }

  cancel() { this.router.navigate(['/admissions']); }

  field(name: string) { return this.form.get(name); }
  invalid(name: string) { const f = this.field(name); return f?.invalid && f?.touched; }
}
