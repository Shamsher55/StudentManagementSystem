import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="form-page">
  <div class="form-card">
    <h2>{{ editId ? 'Edit' : 'Schedule' }} Exam</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-grid">
        <div class="field full"><label>Exam Title *</label>
          <input formControlName="title" placeholder="e.g. HTML & CSS Mid-term" /></div>
        <div class="field"><label>Course Name *</label>
          <input formControlName="courseName" placeholder="Course name" /></div>
        <div class="field"><label>Date *</label>
          <input formControlName="date" type="date" /></div>
        <div class="field"><label>Start Time *</label>
          <input formControlName="startTime" type="time" /></div>
        <div class="field"><label>Duration (min) *</label>
          <input formControlName="duration" type="number" placeholder="120" /></div>
        <div class="field"><label>Total Marks *</label>
          <input formControlName="totalMarks" type="number" placeholder="100" /></div>
        <div class="field"><label>Venue *</label>
          <input formControlName="venue" placeholder="e.g. Hall A" /></div>
        <div class="field"><label>Status *</label>
          <select formControlName="status">
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
        <button type="submit" class="btn-submit">{{ editId ? 'Save' : 'Schedule' }}</button>
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
.field.full { grid-column: 1 / -1; }
label { font-size: 13px; font-weight: 600; color: #444; }
input, select { padding: 9px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; }
input:focus, select:focus { outline: none; border-color: #1a237e; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { padding: 10px 20px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }
.btn-submit { padding: 10px 24px; border: none; border-radius: 8px; background: #1a237e; color: white; cursor: pointer; font-weight: 600; }
@media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } .field.full { grid-column: 1; } }
`],
})
export class ExamForm implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(ExamService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  editId: number | null = null;

  form = this.fb.group({
    title:      ['', Validators.required],
    courseName: ['', Validators.required],
    date:       ['', Validators.required],
    startTime:  ['09:00', Validators.required],
    duration:   [120, Validators.required],
    totalMarks: [100, Validators.required],
    venue:      ['', Validators.required],
    status:     ['upcoming'],
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
      this.service.update(this.editId, v).subscribe(() => this.router.navigate(['/exams']));
    } else {
      this.service.add(v).subscribe(() => this.router.navigate(['/exams']));
    }
  }

  cancel() { this.router.navigate(['/exams']); }
}
