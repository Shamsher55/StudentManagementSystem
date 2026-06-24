import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FeeService } from '../fee';

@Component({
  selector: 'app-fee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="form-page">
  <div class="form-card">
    <h2>{{ editId ? 'Edit' : 'Add' }} Fee Record</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-grid">
        <div class="field"><label>Student Name *</label>
          <input formControlName="studentName" placeholder="Student name" /></div>
        <div class="field"><label>Student ID *</label>
          <input formControlName="studentId" type="number" placeholder="Student ID" /></div>
        <div class="field"><label>Fee Type *</label>
          <select formControlName="type">
            <option value="tuition">Tuition</option><option value="exam">Exam</option>
            <option value="library">Library</option><option value="transport">Transport</option>
            <option value="activity">Activity</option>
          </select></div>
        <div class="field"><label>Description *</label>
          <input formControlName="description" placeholder="Description" /></div>
        <div class="field"><label>Amount (SAR) *</label>
          <input formControlName="amount" type="number" placeholder="0" /></div>
        <div class="field"><label>Due Date *</label>
          <input formControlName="dueDate" type="date" /></div>
        <div class="field"><label>Status *</label>
          <select formControlName="status">
            <option value="pending">Pending</option><option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select></div>
        <div class="field"><label>Paid Date</label>
          <input formControlName="paidDate" type="date" /></div>
        <div class="field"><label>Receipt No.</label>
          <input formControlName="receiptNo" placeholder="RCP-XXX" /></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
        <button type="submit" class="btn-submit">{{ editId ? 'Save' : 'Add Fee' }}</button>
      </div>
    </form>
  </div>
</div>`,
  styles: [`
.form-page { padding: 24px; }
.form-card { background: white; border-radius: 12px; padding: 28px; max-width: 700px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
h2 { margin: 0 0 20px; color: #1a237e; font-size: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 13px; font-weight: 600; color: #444; }
input, select { padding: 9px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; }
input:focus, select:focus { outline: none; border-color: #1a237e; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { padding: 10px 20px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }
.btn-submit { padding: 10px 24px; border: none; border-radius: 8px; background: #1a237e; color: white; cursor: pointer; font-weight: 600; }
@media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } }
`],
})
export class FeeForm implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(FeeService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  editId: number | null = null;

  form = this.fb.group({
    studentName: ['', Validators.required],
    studentId:   [0,  Validators.required],
    type:        ['tuition', Validators.required],
    description: ['', Validators.required],
    amount:      [0,  Validators.required],
    dueDate:     ['', Validators.required],
    status:      ['pending'],
    paidDate:    [''],
    receiptNo:   [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.service.getById(+id).subscribe(e => {
        if (e) this.form.patchValue(e as any);
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value as any;
    if (this.editId) {
      this.service.update(this.editId, v).subscribe(() => this.router.navigate(['/fees']));
    } else {
      this.service.add(v).subscribe(() => this.router.navigate(['/fees']));
    }
  }

  cancel() { this.router.navigate(['/fees']); }
}
